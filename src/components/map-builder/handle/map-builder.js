import { defineStore } from 'pinia';

export const useMapBuilderStore = defineStore('mapBuilderStore', () => {
    const layers = ref([]);


    // Lấy về danh sách các lớp dữ liệu có thể thêm vào bản đồ
    const getAllLayers = async () => {
        try {
            const { data } = await apiRequest.getAll();
            listFolders.value = data;
        } catch (error) {
            console.log(error)
        }
    }
})


// Viết 1 hàm để handle các sự thay đổi của map: Thông tin opacity của layer/styles/ vị trí bản đồ 