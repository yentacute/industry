<template>
    <input type="text" class="form-control" id="search-folder"
        placeholder="Tìm kiếm" @keyup="handleSearch($event, props.apiUrl)">
</template>

<script setup>
    import { debounce } from 'lodash';
    import { defineProps, defineEmits } from 'vue';
    import apiRequest from '../../helpers/api/common'
    const props = defineProps({
        apiUrl: {
            type: String,
            required: true,
        }
    });

    const emits = defineEmits(['get-search-data'])
    const handleSearch = debounce(async function(event, url) {
        const { data } = await apiRequest.searchWithText(url+ `search=${event.target.value}`)
        emits('get-search-data', data);
    },1000);
</script>