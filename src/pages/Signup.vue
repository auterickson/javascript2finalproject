<script>
import {createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup,} from "firebase/auth";
import { auth, authProvider } from "@/firebase/index.js";
import UserCollection from "@/firebase/UserCollection.js";
import SignInWithGoogleButton from "@/components/SignInWithGoogleButton.vue";
import User from "@/models/User.js";
import Signup from "@/pages/Signup.vue";
import router from "@/router/index.js";


export default {
  name: "Signup",
  computed: {
    Signup() {
      return Signup
    }
  },
  components: { SignInWithGoogleButton },
  data() {
    return {
      email: "",
      password: "",
      name: "",
    };
  },
  methods: {
    router() {
      return router
    },

    async signUpWithGoogle() {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth,provider);
        const user = result.user;

        const newUser = new User(user.uid, user.email, user.displayName, user.photoURL);
        await UserCollection.setUser(newUser);
       console.log("Google signup successful");
        this.$router.push({ name: "home" });
      } catch (error) {
        console.error("Error during Google signup: ", error);
      }
    },


    async signUpWithEmail() {
      try {
        if (!this.email || !this.password || !this.name) {
          throw new Error("Name, email, or password is missing");
        }

        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;

        const newUser = new User(user.uid, this.email, this.name);
        await UserCollection.setUser(newUser);

        console.log("Email signup successful");
        this.$router.push({ name: "home" });
      } catch (error) {
        console.error("Error during email signup: ", error);
      }
    },
  },
};
</script>

<template>
  <q-page class="q-pa-lg flex justify-center content-center">
    <div class="signup-container">
      <h3 class="section-header">Create a New Account</h3>
      <!-- Signup Form -->
      <q-form @submit.prevent="signUpWithEmail">
        <q-input
            filled
            v-model="name"
            label="Name"
            type="text"
            :rules="['required']"
        />
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
            :rules="['required', 'minLength:6']"
        />
        <q-btn label="Sign Up" type="submit" color="primary" class="full-width q-mt-md" />
      </q-form>

      <!-- Google Sign-up Button -->
      <SignInWithGoogleButton @click="signUpWithGoogle" />

      <div class="q-mt-md text-center">
        <span>Already have an account?</span>
        <q-btn
            class="q-pa-sm"
            label="Login"
            color="secondary"
            flat
            @click="router().push({ name: 'login' })"
        />
      </div>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.section-header {
  margin-bottom: 20px;
  font-size: 1.5rem;
  text-align: center;
  color: #162114FF;
}

</style>