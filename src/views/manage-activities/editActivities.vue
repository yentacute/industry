<template>
    <Layout :address="address" :items="address.details" chooseMenu="hoat-dong" :slug="props.slug">
        <div class="manage-database">
          <!-- <FolderHeaderBar>
          </FolderHeaderBar> -->
          
          <div class="page-main__content" ref="containerContent">
            <div class="row w-100">
                <Form @submit="submit()" id="editFormActivities" enctype="multipart/form-data">
                    <div class="mb-3">
                        <div class="row">
                            <img :src="newImage || formData.image" class="avatar-xl img-thumbnail user-profile-image" id="img--file__output"
                                alt="user-profile-image" />
                            <div class="col-10">
                                <label for="">Tải ảnh lên</label>
                                <input accept="image/*" type="file" @change="previewFiles($event)" class="form-control"/>
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <Field name="activity_type_id"  as="select" class="form-select" v-model="formData.activity_type_id" >
                            <option value="" disabled>Mời chọn hành động</option>
                            <option v-for="(item, index) in store.activitiesType" :key="index" :value="item.id"  class="activities__options">
                                {{ item.name }}
                            </option>
                        </Field>
                        <ErrorMessage name="activity_type_id" as="div" class="error-message"/>
                    </div>
            
                    <div class="mb-3">
                        <div class="row">
                            <div>
                                <label for="">Tải file đính kèm</label>
                                <input type="file" class="form-control" name="title" @change="changeFile($event)"/>
                            </div>
                            <div class="col-6" v-if="activitiesData.file !== null">
                                <span>{{activitiesData.file}}</span>
                            </div>
                        </div>
    
                    </div>
                    <div class="mb-3">
                        <label for="title">Tiêu đề</label>
                        <input type="text" placeholder="Tiêu đề" v-model="formData.title" class="form-control" id="title"/>
                    </div>
                    <div class="mb-3">
                        <label for="desc">Mô tả</label>
                        <textarea placeholder="Mô tả" v-model="formData.description" class="form-control" id="desc" rows="5"></textarea>
                    </div>
                    <div class="btn-save d-flex">
                        <button type="button" class="btn btn-danger btn-md mt-5 mx-2" @click="cancelEdit">Huỷ</button>
                        <button type="submit" class="btn btn-success btn-md mt-5">Lưu</button>
                    </div>
                </Form>
            </div>
    </div>
  </div>
</Layout>
</template>
<script setup>
  import { ref, reactive, onMounted, nextTick, defineProps, provide } from "vue";
    import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
    import { Form, Field, ErrorMessage } from 'vee-validate';
    import apiRequest from '../../helpers/api/activitiesApi'
    import { useActivitiesStore } from '../../state/activities';
    import { useFolderStore } from '../../state/folder';
    import Layout from "../../layouts/main.vue";
    import TreeItem from "../../components/accordion/FolderTreeComponent.vue";
    import { errorToast, successToast } from "../../helpers/api/toastStyle";


    const route = useRoute();
    const router = useRouter();
    const activitiesData = ref({});
    const store = useActivitiesStore();
    const folderStore = useFolderStore();
    const formData = reactive({
        title: '',
        description: '',
        model:'',
        activity_type_id:'',
        id_record:'',
        image: null,
        file: null
    });
    const props = defineProps({
        slug: {
        type: String,
        default: "sipm-base",
        },
        nameKCN: {
        type: String,
        default: "KHU CÔNG NGHIỆP",
        },
    });
    

    const newImage = ref('')
    const emptyImage = ref()
    const oldImage = ref('')
    const address = ref({
        title: props.nameKCN,
        details: [{ name: "Quản lý hoạt động", to: `${props.slug}ManageActivities` }],
    });
    const getApiData = async() => {
        const { data } =  await apiRequest.getDataWithId(folderStore.slug, route.params.id)
        activitiesData.value = data;
        formData.activity_type_id = activitiesData.value.activity_type.id;
        formData.image = activitiesData.value.image;
        formData.title = activitiesData.value.title;
        formData.description = activitiesData.value.description;
        formData.file = activitiesData.value.file;
    }

    const cancelEdit = () => {
        router.push({name: `${folderStore.slug}ManageActivities`});
    }

    const previewFiles = (event) =>{
      formData.image = event.target.files[0];

      const theReader = new FileReader();
      // Nhớ sử dụng async/await để chờ khi đã convert thành công image sang base64 thì mới bắt đầu gán cho biến newImage
      // đây là 1 kinh nghiệm của mình khi upload multiple ảnh
      theReader.onloadend = async () => {
        newImage.value = await theReader.result;
      };
      theReader.readAsDataURL(formData.image);
    }
    
    const changeFile = (event) => {
        formData.file = event.target.files[0];
        console.log(formData.file);
    }

    const submit = async() => {
        formData.model = activitiesData.value.target.model;
        formData.id_record = String(activitiesData.value.target.id_record);
        const formDataObj = new FormData();
        formDataObj.append('title', formData.title);
        formDataObj.append('description', formData.description);
        formDataObj.append('activity_type_id', formData.activity_type_id);
        formDataObj.append('model', formData.model);
        formDataObj.append('id_record', formData.id_record);
        formDataObj.append('image', formData.image); // append the image file
        formDataObj.append('file', formData.file); // append the file attachment
        try {
            const response = await apiRequest.editData(folderStore.slug, route.params.id, formDataObj);
            if(response.status === 200) {
                successToast('Chỉnh sửa thành công');
                router.push({name: `${folderStore.slug}ManageActivities`});
            } else {
                errorToast('Lỗi mời xem lại')
            }
        } catch (error) {
            console.log(error);
        }

    }

    onMounted(() => {
        folderStore.getSlug();
        getApiData();
        store.getActivitiesType();
        folderStore.getAllFolder();
    })


</script>

<style>
    .modal-backdrop.show{
        display: none !important;
    }
</style>