<script>
export default {
  props: {
    zIndex: {
      type: Number,
      default: 1,
    },
  },
};
</script>

<template>
  <div
    class="position-fixed overflow-hidden nav-pc-mobie"
    :style="{ 'z-index': zIndex }"
  >
    <div class="main-card">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.nav-pc-mobie {
  right: 0px;
  top: calc(50% - 24px);
  transform: translateY(-50%);
  background: #fff;
  border-radius: 10px;
  margin-right: 8px;
}

.nav-pc-mobie .main-card {
  height: calc(100vh - 175px);
  width: 392px;
}

@media only screen and (max-width: 575px) {
  .nav-pc-mobie {
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    transform: translateY(0);
  }
  .nav-pc-mobie .main-card {
    height: 100%;
    width: 100%;
  }
}
</style>
