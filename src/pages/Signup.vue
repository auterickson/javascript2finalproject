<script>
import {createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup,} from "firebase/auth";
import { auth, authProvider } from "@/firebase/index.js";
import UserCollection from "@/firebase/UserCollection.js";
import SignInWithGoogleButton from "@/components/SignInWithGoogleButton.vue";
import User from "@/models/User.js";
import router from "@/router/index.js";


export default {
  components: { SignInWithGoogleButton },
  data() {
    return {
      email: "",
      password: "",
      name: "",
      passwordConfirm: "",
    };
  },
  methods: {
    // router() {
    //   return router
    // },

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

    async submitForm() {
      try {
        if (!this.email || !this.password || !this.name) {
          throw new Error("Name, email, or password is missing");
        }
        if (this.password !== this.passwordConfirm) {
          throw new Error("Passwords don't match");
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
  <q-page padding>
    <div class="signup-container">
     <q-card class="signup-card">
       <q-card-section>
         <div class="text-h5 text-center" > Create an Account</div>
       </q-card-section>
      <!-- Signup Form -->

       <q-card-section>

        <q-input filled v-model="name" label="Full Name" type="text" class="q-mb-md" :rules="['required']"/>
        <q-input filled v-model="email" label="Email" type="email" class="q-mb-md" :rules="['required', 'email']"/>
        <q-input filled v-model="password" label="Password" type="password" class="q-mb-md" :rules="['required', 'minLength:6']"/>
         <q-input filled v-model="confirmPassword" label="Confirm Password" type="password" class="q-mb-md"/>

        <q-btn  @click="submitForm" label="Sign Up" type="submit" color="orange-5" class="full-width q-mt-md" />
       </q-card-section>

      <!-- Google Sign-up Button -->

     <q-card-actions align="center">
       <SignInWithGoogleButton @click="signUpWithGoogle" />
       <q-btn flat @click="router().push({ name: 'login' })"> Already have an Account? Log in!</q-btn>
       </q-card-actions>
     </q-card>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #ff9746, #fbd7a1);
  padding: 16px;
}
.signup-card {
  width: 100%;
  max-width: 400px;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
}
.full-width {
  width: 100%;
}
.text-h5{
  font-weight: 700;
  color: #162114;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.q-btn{
  border-radius: 8px;
  font-weight: 600;
  color: #162114;
  margin-top: 10px;
}
.q-btn.flat{
  color: #162114;
}
.q-input{
  border-radius: 8px;
}
.q-input input{
  padding: 10px;
}
.q-card-actions{
  margin-top: 16px;
}


</style>