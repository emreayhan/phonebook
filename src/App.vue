<template>
  <div id="app">
    <PhoneBook />
  </div>
</template>

<script>
import PhoneBook from "./views/PhoneBook";

export default {
  name: "App",
  components: {
    PhoneBook,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
