<script>
export default {};
</script>

<template>
  <div class="position-fixed nav-pc-mobie hover-overflow-none p-1">
    <div class="main-card">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.nav-pc-mobie {
  right: 0px;
  top: 80px;
  background: transparent;
  margin-right: 8px;
}

.nav-pc-mobie .main-card {
  height: 525px;
  width: 210px;
  /* max-height: calc(100vh - 175px); */
  max-height: 52vh;
}

@media only screen and (max-width: 575px) {
  .nav-pc-mobie {
    display: none;
  }
  .nav-pc-mobie .main-card {
    display: none;
  }
}
</style>
