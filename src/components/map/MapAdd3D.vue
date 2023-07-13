<template>
    <div id="add-map-multi" class="mt-3" style="width:100%;height:300px;"></div>
</template>

<script setup>
    import { onMounted } from 'vue';
    // import { methods_map } from '../../state/map_control/data_map';
    import { useMapStore } from '../../state/map'
    import { debounce } from 'lodash' 
    const store = useMapStore();

    onMounted(() => {
        const initMap = () => {
        // call the store's initMap method here
            store.initMap3D("#add-map-multi");
        };
        debounce(initMap, 6000)();
    })
</script>