<script>
export default {
  name: "LoginForm",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    submit() {
      // Emit event to parent component with login credentials
      this.$emit("submit", {
        email: this.email,
        password: this.password,
      });
    },
  },
};
</script>

<template>
  <div>
    <q-form @submit.prevent="submit">
      <q-input filled v-model="email" label="Email" type="email" required />
      <q-input filled v-model="password" label="Password" type="password" required />

      <q-btn label="Login" type="submit" color="primary" />
    </q-form>
  </div>
</template>

<style scoped>

</style>