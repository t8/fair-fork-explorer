const replace = require('replace-in-file');

const options = {
  files: './node_modules/json-tree-view-vue3/src/components/JsonTreeViewItem.vue',
  from: "function onClick(data: Data): void {",
  to: "function onClick(data: Data | ItemData): void {"
}

async function fixBuild() {
  try {
    const results = await replace(options);
    console.log(results);
  } catch (err) {
    throw new Error(err);
  }
}

fixBuild();