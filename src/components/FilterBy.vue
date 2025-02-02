<script>
export default {
  name: "FilterBy",
  props: {
    genres: {
      type: Array,
      default: () => [],
    },
    authors: {
      type: Array,
      default: () => [],
    },
    filterOptions: {
      type: Object,
      required: true,
    },
  },
  emits: ["updateFilters"],
  data() {
    return {
      filters: JSON.parse(JSON.stringify(this.filterOptions)),
    };
  },
  methods: {
    applyFilters() {
      this.$emit("updateFilters", this.filters);
    },
  },
  watch: {
    // Keep local filters in sync with props
    filterOptions: {
      deep: true,
      handler(newFilters) {
        this.filters = JSON.parse(JSON.stringify(newFilters));
      },
    },
  },
};
</script>

<template>
  <q-card class="q-pa-sm q-mb-md">
    <q-card-section>
      <div class="text-h6">Filter Books</div>
    </q-card-section>
    <q-card-section>
      <!-- Genre Filter -->
      <q-select
          v-model="filters.genres"
          :options="genres"
          label="Genres"
          color="dark"
          multiple
          clearable
      />

      <!-- Author Filter -->
      <q-select
          v-model="filters.authors"
          :options="authors"
          label="Authors"
          color="dark"
          multiple
          clearable
      />

      <!-- Title Filter -->
      <q-input
          v-model="filters.title"
          label="Search by Title"
          clearable
          debounce="300"
      />

      <!-- Reading Status Filter -->
      <q-select
          v-model="filters.readingStatus"
          :options="[ { label: 'All', value: 'all' }, { label: 'Reading', value: 'reading' }, { label: 'Finished', value: 'finished' } ]"
          label="Reading Status"
          clearable
      />
    </q-card-section>
    <q-card-actions align="right">
      <q-btn label="Apply" color="primary" @click="applyFilters" />
    </q-card-actions>
  </q-card>
</template>

<style scoped>
q-select {
  color: #000000;
}
</style>