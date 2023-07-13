<template>
    <ModalCommon title="Thêm mới hoạt động" size="modal-xl" id-name="AddNewActivities">
        <Form id="activities-form" @submit="submit($event)" :validation-schema="schema">
            <div class="mb-3">
                <Field name="activity_type_id"  as="select" class="form-select" @change="formData.activity_type_id = $event.target.value">
                    <option value="" disabled>Mời chọn hành động</option>
                    <option v-for="(item, index) in store.activitiesType" :key="index" :value="item.id">
                        {{ item.name }}
                    </option>
                </Field>
                <ErrorMessage name="activity_type_id" as="div" class="error-message"/>
            </div>
            <div class="mb-3">
                <label for="">Tải ảnh lên</label>
                <input type="file" class="form-control" name="title" @change="$event => formData.image = $event.target.files[0]"/>
            </div>
            <div class="mb-3">
                <label for="">Tải file đính kèm</label>
                <input type="file" class="form-control" name="title" @change="$event => formData.file = $event.target.files[0]"/>
            </div>

            <div class="mb-3">
                <Field type="text" placeholder="Tiêu đề" class="form-control" name="title" v-model="formData.title"/>
                <ErrorMessage name="title" as="div" class="error-message"/>
            </div>
            <div class="mb-3">
                <Field as="textarea" placeholder="Mô tả" class="form-control" name="description" rows="5" v-model="formData.description"/>
            </div>
            <div class="btn-save d-flex">
                <button type="button" class="btn btn-danger btn-md mt-5 mx-2" data-bs-dismiss="modal">Huỷ</button>
                <button type="submit" class="btn btn-success btn-md mt-5">Lưu</button>
            </div>
        </Form>
    </ModalCommon>
</template>

<script setup>
    import ModalCommon from '../ModalCommon.vue';
    import { Field, Form, ErrorMessage } from 'vee-validate';
    import * as yup from 'yup';
    import { useActivitiesStore } from '../../state/activities'
    import { onMounted, reactive } from 'vue';
    import apiRequest from '../../helpers/api/activitiesApi'
    import { useFolderStore } from '../../state/folder';
    import { errorToast, successToast } from '../../helpers/api/toastStyle';
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

    const schema = yup.object({
        activity_type_id: yup.string().required('Mời chọn loại hành động'),
        title: yup.string().required('Mời nhập tiêu đề'),
    });

    const changeImage = (event) => {
        console.log(event.target.files[0]);
        formData.image = event.target.files[0];
    }

    const submit = async() => {
        formData.model = store.modelName;
        formData.id_record = String(store.recordId);
        const formDataObj = new FormData();
        formDataObj.append('title', formData.title);
        formDataObj.append('description', formData.description);
        formDataObj.append('activity_type_id', formData.activity_type_id);
        formDataObj.append('model', formData.model);
        formDataObj.append('id_record', formData.id_record);
        formDataObj.append('image', formData.image); // append the image file
        formDataObj.append('file', formData.file); // append the file attachment
        try {
            const response = await apiRequest.post(folderStore.slug, formDataObj);
            if(response.status === 201) {
                successToast('Thêm hoạt động thành công');
                setTimeout(() => {
                    folderStore.closeModel();
                }, 250);
            } else {
                errorToast('Lỗi mời xem lại')
            }
        } catch (error) {
            console.log(error);
        }
       
    }
    onMounted(() => {
        store.getActivitiesType();
    })
</script>