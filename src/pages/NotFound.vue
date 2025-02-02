<script>
export default {
  name: "NotFound",
}
</script>

<template>
  <q-page class="q-pa-lg flex justify-center content-center">
    <div class="banner q-pa-lg">
      <h1>Page Not Found</h1>
      <img src="" alt="" />
      <p class="q-pt-lg">Looks like you might have stumbled upon an undiscovered land.</p>
    </div>

  </q-page>
</template>

<style scoped lang="scss">
@import '@/scss/quasar-variables';

.banner {
  width: 100%;
  //background-color: $primary;
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    font-size: 2em;
    font-weight: bold;
    margin-bottom: 0;
  }

  @media screen and (min-width: $breakpoint-sm){
    h1 {
      font-size: 3em;
    }
  }


  img {
    max-width: 300px;
  }
}


</style>