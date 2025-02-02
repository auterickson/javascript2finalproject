<script>
import {GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup} from "firebase/auth";
import UserCollection from "@/firebase/UserCollection.js";
import SignInWithGoogleButton from "@/components/SignInWithGoogleButton.vue";
import {auth, authProvider} from "@/firebase/index.js";
import User from "@/models/User.js";

import router from "@/router/index.js";

export default {
  name: "Login",
  components: { SignInWithGoogleButton },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  setup() {
  },
  methods: {
    router() {
      return router
    },

    // New createUser function
    async createUser(user) {
      try {
        // Assuming UserCollection.setUser saves the user data to Firestore
        await UserCollection.setUser(user);
        console.log("User created in Firestore.");
      } catch (error) {
        console.error("Error creating user in Firestore:", error);
      }
    },
    async loginWithGoogle() {
      try {
        const result = await signInWithPopup(auth, authProvider);
        console.log("Google Login Successful", result.user);
        this.$router.push({ name: "home" });
      } catch (error) {
        console.error("Google Login Failed", error.message);
      }
    },

    async loginWithCredentials() {
      try {
        if (!this.email || !this.password) {
          throw new Error("Email or password is missing");
        }

        console.log(`Logging in with: ${this.email}`);

        // Sign in with email and password
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        console.log("Email login successful");

        const user = userCredential.user;
        const newUser = new User(user.uid, user.email);
        await this.createUser(newUser);  // Now using createUser method

        // Navigate to the home page after successful login
        this.$router.push({ name: "home" });
      } catch (error) {
        console.error("Error during email login: ", error);

        if (error.code === "auth/invalid-credential") {
          console.error("The provided credentials are invalid.");
        } else {
          console.error("General error: ", error);
        }
      }
    },
  },
};
</script>

<template>
  <q-page class="q-pa-lg flex justify-center content-center">
    <div>
      <h3 class="section-header">Please login to continue.</h3>

      <!-- Username and Password Form -->
      <q-form @submit.prevent="loginWithCredentials">
        <q-input
            filled
            v-model="email"
            label="Email"
            type="email"
            :rules="['required', 'email']"
        />
        <q-input
            filled
            v-model="password"
            label="Password"
            type="password"
            :rules="['required']"
        />
        <q-btn label="Login" type="submit" color="primary" />
      </q-form>
      <!-- Google Sign-in Button -->
      <SignInWithGoogleButton @click="loginWithGoogle" />
    </div>
    <div class="q-mt-md text-center">
      <span>Don't have an account?</span>
      <q-btn
          label="Sign Up"
          color="secondary"
          flat
          @click="router().push({ name: 'signup' })"
      />
    </div>
  </q-page>
</template>

<style scoped lang="scss">

</style>