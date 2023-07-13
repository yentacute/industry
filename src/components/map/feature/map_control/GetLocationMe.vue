<script setup>
import { inject, defineEmits } from "vue";
const methodMap = inject("draw-map");

const emit = defineEmits(['location-me'])
const handleGetLocationMe = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        methodMap.MarkerMap(
          {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          true
        );
        emit("location-me", position.coords)
      },
      (error) => {
        console.error(error);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
};
</script>

<template>
  <div class="map-type-wrapper hover-bg">
    <div
      class="align-items-center d-flex justify-content-center h-100"
      title="Vị trí của bạn"
      @click="handleGetLocationMe"
    >
      <i
        class="ri-focus-3-line text-primary cursor-pointer fs-20 hover-text-red"
      ></i>
    </div>
  </div>
</template>

<style scoped>
.map-type-wrapper {
  width: 30px;
  height: 30px;
  box-shadow: 0px 0px 4px #666;
  background-color: #fff;
  border-radius: 4px;
}
</style>
