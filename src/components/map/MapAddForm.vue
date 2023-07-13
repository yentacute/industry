<template>
  <div id="map-add-form" class="mt-3" style="width: 100%; height: 300px"></div>
</template>

<script setup>
import { useMapStore } from "../../state/map";
import { debounce } from "lodash";
const store = useMapStore();
const initMap = () => {
  let options = {
    center: { lat: 21.513778, lng: 105.836475 },
    zoom: 12,
    tilt: 0,
    bearing: 0,
    controls: false,
    mapType: "2d",
  };
  // call the store's initMap method here
  store.initMap("#map-add-form", options);
};
debounce(initMap, 100)();
</script>
