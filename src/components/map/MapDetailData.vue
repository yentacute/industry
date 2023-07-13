<template>
    <div id="draw-map-detail" class="mt-3" style="width:100%;height:300px;"></div>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { methods_map } from '../../state/map_control/data_map';
    import { useMapStore } from '../../state/map'
    import { debounce } from 'lodash' 
    const store = useMapStore();
    // remove old draw object
    const initMap = () => {
        let options = {
            center: {lat: 10.774179875865471, lng: 106.69912239687733},
            zoom: 18,
            tilt: 50,
            bearing: 250,
            controls: false,
            mapType: '2d'
        }
        // call the store's initMap method here
        store.initDataMap('#draw-map-detail', options);
    };
    debounce(initMap, 100)();
</script>