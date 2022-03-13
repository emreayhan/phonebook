const modules = {};

const requireModule = require.context("./", true, /.js$/);
requireModule.keys().forEach((filePath) => {
  let [, domain, fileName] = filePath.split("/");
  fileName = fileName || domain;

  if (fileName.includes("index.js")) return;

  const moduleName = fileName.replace(/(\.\/|\.js)/g, "");

  const moduleObject = {
    namespaced: true,
    ...requireModule(filePath).default,
  };

  modules[moduleName] = moduleObject;
});

export default modules;
