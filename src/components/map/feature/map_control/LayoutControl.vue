<template>
  <div class="wrapper-layout">
    <div
      class="w-100 h-100 d-flex flex-column-reverse flex-md-column justify-content-end align-items-center gap-2"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.wrapper-layout {
  width: 30px;
  height: 30vh;
  position: fixed;
  bottom: 10px;
  right: 10px;
}

@media only screen and (max-width: 575px) {
  .wrapper-layout {
    bottom: auto;
    right: 5px;
    top: 70px;
  }
}
</style>
