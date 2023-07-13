<template>
    <input type="text" class="form-control" id="map-search"
        placeholder="Tìm kiếm" @keyup="handleSearch($event, props.apiUrl)">
</template>

<script setup>
    import { debounce } from 'lodash';
    import { defineProps } from 'vue';
    import { useCommonStore } from '../state/common';
    import apiSearchRequest from '../helpers/api/common'
    import { TextSearchAPIMap4D, keyMap } from '../common/map/function_map'

    const common = useCommonStore();
    const props = defineProps({
        apiUrl: {
            type: String,
            required: true,
        }
    })
    const handleSearch = debounce(async function(event, url) {
        const currentValue = event.target.value;
        const { data } = await apiSearchRequest.searchWithText(url + `?key=${keyMap}&text=${currentValue}`)
        common.searchData = data.result;
    },1000);
</script>