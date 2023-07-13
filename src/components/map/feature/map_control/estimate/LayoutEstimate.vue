<script setup></script>

<template>
  <div class="wrapper-layout-estimate">
    <div class="row gap-2">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.wrapper-layout-estimate {
  position: absolute;
  right: 30px;
  bottom: 0;
  background: transparent;
  width: 90px;
}

@media only screen and (max-width: 575px) {
  .wrapper-layout-estimate {
    right: -15px;
    top: 40px;
  }
}
</style>
