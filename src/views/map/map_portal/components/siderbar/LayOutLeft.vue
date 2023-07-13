<script>
export default {
  data: function () {
    return {
      zIndex: 1,
    };
  },
  mounted: function () {
    document
      .querySelectorAll(".nav-pc-mobie.layout__portal")
      .forEach(function (popup) {
        popup.style.zIndex = 1;
      });
    this.zIndex = 2;
  },
};
</script>

<template>
  <div
    class="position-fixed overflow-hidden nav-pc-mobie layout__portal"
    :style="{ 'z-index': zIndex }"
  >
    <div class="main-card">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.nav-pc-mobie {
  left: 0px;
  top: calc(50% + 28px);
  transform: translateY(-50%);
  background: #fff;
  border-radius: 10px;
  margin-left: 8px;
}

.nav-pc-mobie .main-card {
  height: calc(100vh - 70px);
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
