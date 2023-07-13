<template>
  <div
    class="position-fixed align-items-center d-flex gap-5 justify-content-center justify-content-sm-between mx-2 mt-2"
    style="height: 48px; top: 0; right: 0; left: 0; z-index: 2"
  >
    <div
      class="d-flex gap-3 align-items-center h-100 flex-grow-1 justify-content-center justify-content-sm-between"
    >
      <Search></Search>
      <div
        class="d-none d-md-flex hover-overflow-none position-relative flex-grow-1"
      ></div>
    </div>
    <!-- <User></User> -->
  </div>
</template>

<script>
import Search from "./Search.vue";
export default {
  setup() {},
  components: { Search },
  methods: {},
};
</script>
