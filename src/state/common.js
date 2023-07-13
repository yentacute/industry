import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCommonStore = defineStore('common',() => {
    const showModal = ref(false);
    const searchData = ref([]);

    return {
        showModal,
        searchData
    }
})