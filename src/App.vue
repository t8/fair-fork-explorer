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
              <JsonTreeView :data="JSON.stringify(forkTree)" :maxDepth="6" />
            </div>
          </div>
          <div class="column is-6" id="capTable">
            <h2 class="title is-4">Cap Table</h2>
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
    <iframe :src="'https://arweave.net/' + inputText" frameborder="0" width="100%" height="100%"></iframe>
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
      inputText: "HuDE37wlwN-gwdkoxaWOxXsvlJaaf8b9mA9BlHuPEqU",
      searchButtonState: "",
      searchHeroState: "is-fullheight",
      expandMenu: false,
      errorState: "",
      forkTree: []
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
      // @ts-expect-error
      this.forkTree = await this.developTree(this.inputText, [{ id: this.inputText, forks: [] }]);
      this.searchHeroState = "is-small";
      this.searchButtonState = "";
    },
    async pullForks(id: string) {
      return await all(`query($cursor: String) {
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
    },
    async developTree(id: string, tree: Array<{id: string, forks: Array<any>}>) {
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
        // Pull all of parent's children
        const res = await this.pullForks(forkOf);
        for (let i = 0; i < res.length; i++) {
          // @ts-expect-error
          tree.push({ id: res.node.id, forks: [] });
          // @ts-expect-error
          tree = await this.developTree(res.node.id, tree);
        }
      }
      // Check if fork has children
      const res = await this.pullForks(id);
      for (let i = 0; i < res.length; i++) {
        for (let x = 0; x < tree.length; x++) {
          if (tree[x].id === id) {
            // @ts-expect-error
            tree[x].forks.push({ id: res.node.id, forks: [] });
            // @ts-expect-error
            await this.developTree(res.node.id, tree);
          }
        }
      }
      return tree;
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
  background: #000;
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
