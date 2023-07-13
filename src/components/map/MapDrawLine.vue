<template>
    <div id="draw-map" class="mt-3" style="width:100%;height:300px;"></div>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { methods_map } from '../../state/map_control/data_map';
    import { useMapStore } from '../../state/map'
    import { debounce } from 'lodash' 
    const store = useMapStore();

    onMounted(() => {
        let options = {
            center: { lat: 10.774179875865471, lng: 106.69912239687733 },
            zoom: 18,
            tilt: 50,
            bearing: 250,
            controls: false,
            mapType: '2d'
        }
        const initMap = () => {
        // call the store's initMap method here
            store.initMap('#draw-map', store.mapAddForm, null, options);
        };
        debounce(initMap, 2000)();
    })
</script>