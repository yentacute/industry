<script setup></script>

<template>
  <div
    class="position-fixed d-flex justify-content-center align-items-center mt-search"
    style="inset: 0"
  >
    <div
      style="
        width: 800px;
        height: 780px;
        max-width: 100vw;
        max-height: 100vh;
        border-radius: 4px;
      "
      class="bg-white mt-4 mt-md-0"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
@media screen and (max-width: 768px) {
  .mt-search {
    top: 130px !important;
  }
}
</style>
