<template>
  <div class="hero is-small is-light">
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
      </div>
    </div>
  </div>
  <div class="hero is-fullheight">
    SUP BRO
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
      inputText: "mTCNPkgEmsvQmyqVu2NRhk3ZID6d37bLunTYqntd4rg",
      searchButtonState: "",
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

<style scoped>

.field.has-addons {
  justify-content: center;
}

</style>
