<template>
    <input type="text" class="form-control" id="search-folder"
        placeholder="Tìm kiếm" @keyup="handleSearch($event, props.apiUrl)">
</template>

<script setup>
    import { debounce } from 'lodash';
    import { defineProps, defineEmits } from 'vue';
    import { useCommonStore } from '../state/common';
    import apiRequest from '../helpers/api/common'
    const common = useCommonStore();
    const props = defineProps({
        apiUrl: {
            type: String,
            required: true,
        }
    });

    const emits = defineEmits(['get-search-data', 'get-input-value'])
    const handleSearch = debounce(async function(event, url) {
        const { data } = await apiRequest.searchWithText(url+ `q=${event.target.value}`)
        emits('get-search-data', data);
    },1000);
</script>