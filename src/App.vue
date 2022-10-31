<template>
  <div id="searchHero" class="hero is-light" :class="searchHeroState">
    <div class="hero-body">
      <div class="container">
        <div class="field has-addons">
          <div class="control">
            <input class="input is-info" type="text" v-model="inputText" :disabled="searchButtonState === 'is-loading'" placeholder="Find a fork">
          </div>
          <div class="control">
            <button class="button is-info" :class="searchButtonState" @click="search">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="hero is-small is-light">
    <div class="hero-body">
      <div class="container">
        <div class="columns">
          <div class="column is-6">
            <h2 class="title is-4">Fork Tree</h2>
            <div id="forkTree">
              <JsonTreeView :data="JSON.stringify(forkTree)" @selected="selectFork" :maxDepth="6" />
            </div>
          </div>
          <div class="column is-6" id="capTable">
            <h2 class="title is-4">{{ stampCount }} Stamp<span v-if="stampCount !== 1">s</span></h2>
          </div>
        </div>
        <div class="has-text-centered">
          <button id="pullTab" class="button is-info" :class="pullTabState" @click="expandMenu === false ? expandMenu = true : expandMenu = false">
            <span class="icon">
              <font-awesome-icon v-if="pullTabState === 'disabled'" icon="fa-arrow-up"></font-awesome-icon>
              <font-awesome-icon v-if="pullTabState === 'activated'" icon="fa-arrow-down"></font-awesome-icon>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="hero is-fullheight" :class="contentState">
    <iframe :src="'https://arweave.net/' + selectedFork" frameborder="0" width="100%" height="100%"></iframe>
  </div>
</template>

<script lang="ts">
import Arweave from "arweave";
import { defineComponent, reactive } from "vue";
import { all } from "ar-gql";
import { JsonTreeView } from "json-tree-view-vue3";

const client = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

export default defineComponent({
  data() {
    return {
      inputText: "m863mnARkvKQDEg6L6Ha7nlrv51NeP_3SmnUhEs7W8o",
      searchButtonState: "",
      searchHeroState: "is-fullheight",
      expandMenu: false,
      errorState: "",
      forkTree: [],
      selectedFork: "",
      stampCount: 0
    }
  },
  components: { JsonTreeView },
  setup() {
    const state = reactive({
      json: `{"string":"text","number":123,"boolean":true,"array":["A","B","C"],"object":{"prop1":"value1","nestedObject":{"prop2":"value2"}}}`
    });
    return {
      state
    };
  },
  computed: {
    contentState: function() {
      if (this.searchHeroState === "is-small" && !this.expandMenu) {
        return "is-fixed";
      } else if (this.expandMenu) {
        return "";
      } else {
        return "is-hidden";
      }
    },
    pullTabState: function() {
      // :class="expandMenu === false ? 'disabled' : 'activated'"
      if (this.searchHeroState === "is-small" && this.expandMenu === false) {
        return "disabled";
      } else if (this.searchHeroState === "is-fullheight") {
        return "is-hidden";
      } else {
        return "activated"
      }
    }
  },
  methods: {
    async search() {
      this.searchButtonState = "is-loading";      
      let res;
      try {
        res = await client.transactions.get(this.inputText);
      } catch (err) {
        this.errorState = "Unable to fetch transaction. Ensure you're providing a valid transaction."
        this.searchButtonState = "";
        return;
      }
      // Successfully pulled a tx
      this.selectedFork = this.inputText;
      // @ts-expect-error
      this.forkTree = await this.developTree(this.inputText, [{ id: this.inputText, forks: [] }]);
      // @ts-ignore
      this.searchHeroState = "is-small";
      this.searchButtonState = "";
    },
    async pullForks(id: string) {
      const res = await all(`query($cursor: String) {
          transactions(
            tags: [
              { name: "Forked", values: "${id}" }
            ]
            after: $cursor
          ) {
            pageInfo {
              hasNextPage
            }
            edges {
              cursor
              node {
                id
              }
            }
          }
        }`);
        console.log(res);
      return res;
    },
    async developTree(id: string, tree: Array<{id: string, forks: Array<any>}>, index?: number) {

      if (index) {
        for (let i = 0; i < tree[index].forks.length; i++) {
          const res = await this.pullForks(tree[index].forks[i]);
          for (let x = 0; x < res.length; x++) {
            tree[index].forks[i].push({ id: res[x].node.id, forks: [] });
          }
        }
      } else {
        // Check if fork has children
        const res = await this.pullForks(id);
        for (let i = 0; i < res.length; i++) {
          for (let x = 0; x < tree.length; x++) {
            if (tree[x].id === id) {
              tree[x].forks.push({ id: res[i].node.id, forks: [] });
              await this.developTree(res[i].node.id, tree, x);
            }
          }
        }
      }
      // Check if fork has a parent
      let tags = (await client.transactions.get(id)).get("tags");
      let forkOf = undefined;
      for (let i = 0; i < tags.length; i++) {
        //@ts-ignore
        let key = tags[i].get('name', {decode: true, string: true});
        if (key === "Forked") {
          // @ts-ignore
          forkOf = tags[i].get('value', {decode: true, string: true});
        }
      }
      if (forkOf !== undefined) {
        // Transaction has a parent
        let duplicate = false;
        for (let i = 0; i < tree.length; i++) {
          if (tree[i].id === forkOf) duplicate = true;
        }
        if (!duplicate) {
          tree = [{
            id: forkOf,
            forks: tree
          }];
          await this.developTree(forkOf, tree)
        }
        // // Pull all of parent's children
        // const res = await this.pullForks(forkOf);
        // for (let i = 0; i < res.length; i++) {
        //   tree.push({ id: res[i].node.id, forks: [] });
        //   tree = await this.developTree(res[i].node.id, tree);
        // }
      }
      console.log(tree);
      return tree;
    },
    async selectFork(event: any) {
      this.selectedFork = event.value;
      await this.pullStampCount(this.selectedFork);
    },
    async pullStampCount(id: string) {
      const res = await fetch(`https://cache.permapages.app/FMRHYgSijiUNBrFy-XqyNNXenHsCV0ThR4lGAPO4chA`);
      const contractState = await res.json();
      let count = 0;
      for (const [key, value] of Object.entries(contractState.stamps)) {
        // Pulling contract of key from format "ADDRESS:CONTRACT"
        const meaningfulPart =  key.split(":")[1];
        if (meaningfulPart === id) count++;
      }
      this.stampCount = count;
    }
  }
});

</script>

<style>

.field.has-addons {
  justify-content: center;
}

.value-key {
  overflow-x: scroll;
}

iframe {
  display: block;       /* iframes are inline by default */
  background: white;
  border: none;         /* Reset default border */
  height: 100vh;        /* Viewport-relative units */
  width: 100vw;
}

.hero.is-small {
  min-height: 0;
}

#searchHero.is-small .hero-body .container {
  flex-shrink: 0;
}

#searchHero {
  -webkit-transition: min-height 0.2s; 
  -moz-transition: min-height 0.2s; 
  -ms-transition: min-height 0.2s; 
  -o-transition: min-height 0.2s; 
  transition: min-height 0.2s;
}

#searchContainer {
  -webkit-transition: flex-shrink 0.2s; 
  -moz-transition: flex-shrink 0.2s; 
  -ms-transition: flex-shrink 0.2s; 
  -o-transition: flex-shrink 0.2s; 
  transition: flex-shrink 0.2s;
}

.is-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

#pullTab {
  z-index: 100;
}

#pullTab.disabled {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 0 0 4px 4px;
}

#pullTab.activated {
  position: relative;
  margin: 0 auto;
}

</style>
