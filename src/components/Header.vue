<script>
import { auth } from "@/firebase/index.js";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default {
  name: "Header",
  data() {
    return {
      isLoggedIn: false,
      drawerOpen: false,
    };
  },
  created() {
    onAuthStateChanged(auth, (user) => {
      this.isLoggedIn = !!user;
    });
  },
  methods: {
    async logout() {
      try {
        await signOut(auth);
        console.log("User logged out successfully.");
        this.isLoggedIn = false;
        this.$router.push({name: "login"});
      } catch (error) {
        console.error("Error during logout: ", error);
      }
    },
    goToPage(route) {
      this.$router.push(route);
    },
  },
};
</script>

<template>
  <q-header bordered>
    <q-toolbar>
      <q-toolbar-title>MossPages</q-toolbar-title>

      <!-- Desktop view buttons -->
      <div class=" accent q-hidden q-md-flex">
        <q-btn flat label="Profile" to="/profile"/>
        <q-btn
            v-if="isLoggedIn"
            flat
            label="Logout"
            @click="logout"
        />
        <q-btn
            v-else
            flat
            label="Login"
            to="/login"
        />
      </div>

    </q-toolbar>
    <q-tabs>
      <q-tab name="home" label="Home" icon="home" @click="goToPage('/')" />
        <q-tab name="favorites" label="Favorites" icon="favorite" @click="goToPage('/favorites')" />
        <q-tab name="library" label="Library" icon="auto_stories" @click="goToPage('/library')" />
        <q-tab name="statistics" label="Statistics" icon="bar_chart" @click="goToPage('/statistics')" />
    </q-tabs>
  </q-header>
</template>

<style scoped lang="scss">
.q-toolbar.row.no-wrap.items-center{
  background-color: #FF9746;
}
.q-layout__section--marginal {
  background-color: #E2E1E7;
  color: #000000;
  font-weight: bold;
  font-family: 'Advent Pro', sans-serif;
}
</style>