<script setup>
import { inject, onMounted, onUnmounted, ref } from "vue";

const data_map = inject("map");
const methods_map = inject("draw-map");
const listLocation = ref([]);
const distance = ref(0);

const handleWindow = ($e) => {
  $e.stopPropagation();
  if (!data_map.location.value) return;
  listLocation.value = [...listLocation.value, data_map.location.value];
  methods_map.MannyMakerMap(
    listLocation.value,
    require("@/assets/images/maker/dot_blue.png")
  );
  methods_map.create_polygon(listLocation.value);
  const pathF = listLocation.value.map((item) => {
    return [item.lng, item.lat];
  });
  let Measure = new map4d.Measure(pathF);
  distance.value = Math.round(100 * Measure.area) / 100;
};

onMounted(() => {
  data_map.location.value = null;
  window.addEventListener("click", handleWindow);
  window.addEventListener("touchstart", handleWindow);
});

onUnmounted(() => {
  window.removeEventListener("click", handleWindow);
  window.removeEventListener("touchstart", handleWindow);
});
</script>

<template>
  <div @click.stop class="calculation-custom">
    <span
      >Diện tích: <b>{{ `${distance} ㎡` }}</b></span
    >
  </div>
</template>

<style scoped>
.calculation-custom {
  position: fixed;
  right: 60px;
  bottom: 10px;
  border-radius: 4px;
  background-color: #ccc;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media only screen and (max-width: 575px) {
  .calculation-custom {
    bottom: auto;
    top: 125px;
  }
}
</style>
