import { defineStore } from 'pinia'
import Swal from 'sweetalert2';
import { ref } from 'vue';
import apiRequest from '../helpers/api/activitiesApi';
import { BASE_URL } from '../helpers/api/axiosHttp';
import { useFolderStore } from './folder'
export const useActivitiesStore = defineStore('activities', () => {
    const folderStore = useFolderStore();
    const activitiesType = ref([]);
    const recordId = ref('');
    const modelName = ref('');
    const dataDetails = ref([])
    const isLoading = ref(false)
    const isDetails = ref(false)
    
    const getActivitiesType = async() => {
        try {
            const { data } = await apiRequest.getType(folderStore.slug);
            activitiesType.value = data.results;
        } catch (error) {
            console.log(error);
        }
    }

    const viewDetailData = async (slug, id) => {
        console.log(id);
        // remove old draw object
        isDetails.value = true;
        try {
            const { data } = await apiRequest.getData(slug, id);
            console.log(data);
            dataDetails.value = data.results;
            console.log(dataDetails.value);
        } catch (error) {
            console.log(error);
        }
       
    }

    const deleteActivity = async (id) => {
        Swal.fire({
            title: 'Bạn có muốn xoá không?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Không',
            confirmButtonText: 'Đồng ý'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiRequest.deleteActivity(folderStore.slug, id);
                 if (response.status === 204) {
                    Swal.fire(
                        {
                            title: 'Đã xoá!',
                            icon: 'success'
                        }
                    );
                    viewDetailData(id);
                }
            }
        })
    }

    const onFileChange = (e, imageContain) => {
        imageContain = e.target.files[0];
        document.getElementById("img--file__output").src = URL.createObjectURL(imageContain);
    };
  
    return { 
        getActivitiesType,
        activitiesType,
        recordId,
        modelName,
        deleteActivity,
        viewDetailData,
        dataDetails,
        isLoading,
        onFileChange,
        isDetails
    }
  })