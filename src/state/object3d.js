import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiRequest from '../helpers/api/object3dApi'

export const useObjectStore = defineStore('object3d', () => {
    const objectWithPagination = ref([]);
    const allObject = ref([]);
    const getAllObjectWitPagination = async() => {
        const { data } = await apiRequest.getAll();
        objectWithPagination.value = data
    }
    const getAllObject = async() => {
        const { data } = await apiRequest.getAll();
        allObject.value = data.results;
    }

    return {
        getAllObject,
        allObject,
        getAllObjectWitPagination,
        objectWithPagination
    }
}) 