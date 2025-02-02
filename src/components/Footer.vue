<script>
export default {
  data() {
    return {
      activeTab: "home",
    };
  },
  methods: {

  },
};
</script>

<template>
  <q-footer bordered class="primary">
    <q-toolbar-title>@MossPages 2024</q-toolbar-title>
  </q-footer>
</template>

<style scoped lang="scss">
.primary {
  color: #E2E1E7
}
  .q-layout__section--marginal {
    background-color: #E2E1E7;
    color: #000000;
    font-weight: bold;
    font-family: 'Advent Pro', sans-serif;
  }

  @media (max-width: 600px) {
    .q-footer {
      padding: 10px;
    }

}
</style>