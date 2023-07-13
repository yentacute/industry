<template>
    <div id="draw-map-3d-popup" class="mt-3" style="width:100%;height:300px;"></div>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { methods_map } from '../../state/map_control/data_map';
    import { useMapStore } from '../../state/map'
    import { debounce } from 'lodash' 
    const store = useMapStore();
    const initMap = () => {
        let options = {
        center: {lat: 10.774179875865471, lng: 106.69912239687733},
        zoom: 18,
        tilt: 50,
        bearing: 250,
        controls: false,
        mapType: 'map3d'
        }
    // call the store's initMap method here
    store.initMap('#draw-map-3d-popup', store.mapEditForm, options);
  };
  debounce(initMap, 100)();
</script>