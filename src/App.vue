<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { computed, ref } from "vue";
import { RouterView } from "vue-router";
import User from "@/models/User.js";

export default {
  name: "App",
  components: {
    Header,
    Footer,
    RouterView
  },
  data() {
    return {
      authUser: new User(),
      // Define pagesReadData as a reactive variable
      pagesReadData: ref([]),
    };
  },
  provide() {
    return {
      authUser: computed(() => this.authUser),
      pagesReadData: this.pagesReadData,  // Provide pagesReadData here
    };
  }
};
</script>

<template>
  <q-layout>
    <Header />
    <q-page-container>
      <q-page padding>
      <router-view />
      </q-page>
    </q-page-container>
    <Footer />
  </q-layout>
</template>

<style scoped>
</style>