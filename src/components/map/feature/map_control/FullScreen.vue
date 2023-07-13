<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const is_full = ref(false);

const handleFullScreen = () => {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
  is_full.value = true;
};

const handleExitFullScreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
  is_full.value = false;
};

const handleKeyupESC = () => {
  if (!document.fullscreenElement) {
    // Thực hiện các hành động cần thiết khi thoát khỏi chế độ full screen
    is_full.value = false;
  }
};

onMounted(() => {
  document.addEventListener("fullscreenchange", (event) =>
    handleKeyupESC(event)
  );
});
onMounted(() => {
  document.removeEventListener("fullscreenchange", (event) =>
    handleKeyupESC(event)
  );
});
</script>

<template>
  <div class="full-screen-wrapper hover-bg">
    <div
      v-if="is_full"
      class="align-items-center d-flex justify-content-center h-100"
      title="Full màn hình"
      @click="handleExitFullScreen"
    >
      <i
        class="ri-fullscreen-exit-line text-primary cursor-pointer fs-20 hover-text-red"
      ></i>
    </div>
    <div
      v-else
      class="align-items-center d-flex justify-content-center h-100"
      title="Full màn hình"
      @click="handleFullScreen"
    >
      <i
        class="ri-fullscreen-line text-primary cursor-pointer fs-20 hover-text-red"
      ></i>
    </div>
  </div>
</template>

<style scoped>
.full-screen-wrapper {
  width: 30px;
  height: 30px;
  box-shadow: 0px 0px 4px #666;
  background-color: #fff;
  border-radius: 4px;
}
</style>
