<template>
    <ModalCommon title="Thêm model" size="modal-md" id-name="ImportModelFile">
        <Form @submit="submit" :validation-schema="schema" :initial-values="formValues">
            <div class="form-group mb-3">
                <Field type="file" name="shape_file" class="form-control" @change="changeFile($event)" />
                <ErrorMessage name="shape_file" class="error-message"/>
            </div>

            <div class="form-group  mb-3">
                <Field name="modelname" type="text" class="form-control" placeholder="modelname" v-model="formValues.modelname"/>
                <ErrorMessage name="modelname" class="error-message"/>
            </div>
            <div class="form-group  mb-3">
                <Field name="name_display" type="text" class="form-control" placeholder="name_display" v-model="formValues.name_display"/>
                <ErrorMessage name="name_display" class="error-message"/>
            </div>
            <div class="col-auto form-check form-check-outline form-check-danger mt-2">
                <label for="public">public</label>
                <input name="public" type="checkbox" class="form-check-input mb-2" v-model="formValues.public" :value="true"
                :unchecked-value="false"/>
            </div>
            <div class="col-auto form-check form-check-outline form-check-danger mt-2">
                <label for="use_uuid">use_uuid</label>
                <input name="use_uuid" type="checkbox" class="form-check-input mb-2" v-model="formValues.use_uuid" :value="true"
                :unchecked-value="false"/>
            </div>
            <div class="col-auto form-check form-check-outline form-check-danger mt-2">
                <label for="use_object3d">use_object3d</label>
                <input name="use_object3d" type="checkbox" class="form-check-input mb-2" v-model="formValues.use_object3d" :value="true"
                :unchecked-value="false"/>
            </div>
            <div class="btn-group">
                <b-button variant="light" class="bg- waves-effect waves-light" data-bs-dismiss="modal">Huỷ</b-button>
                <b-button type="submit" variant="danger" class="mx-2">Lưu</b-button>
            </div>
        </Form>
        <Spinner :is-loading="store.isLoading"/>
    </ModalCommon>
</template>

<script setup>
    import { ref, reactive, watch  } from 'vue'
    import { useFolderStore } from '../../state/folder';
    import { Field, Form, ErrorMessage } from 'vee-validate';
    import apiRequest from '../../helpers/api/folderApi'
    import axios from "axios";
    import * as yup from 'yup';
    import Spinner from '../Spinner.vue'
    import http from '../../helpers/api/axiosHttp'
    import { successToast, errorToast} from '../../helpers/api/toastStyle'
    import ModalCommon from '../ModalCommon.vue'
    function changeFile(event) {
        formValues.shape_file = event.target.files[0];
    }

    const store = useFolderStore();
    store.getSlug();

    const formValues = reactive({
        shape_file: null,
        modelname: '',
        name_display: '',
        public: true,
        use_uuid: false,
        use_object3d: false,
        parent: ''
    })
 
    const schema = {
        shape_file(value) {
            if(value) {
                const tailfile = value.name.split('.')[1];
                if(value.name && tailfile === 'zip') {
                        return true;
                }
                return 'Mời nhập file zip';
            }
        },
        async modelname(value) {
            const { data }  = await apiRequest.checkExistData(`/${store.slug}/check-exists?q=${value}`);
            if(!data.status) {
                return 'Tên model đã tồn tại, mời nhập tên khác';
            }
            if(!/^[A-Z][a-zA-Z]*$/.test(value)) {
                return 'Tên model không bao gồm số, kỹ tự đặc biệt, Viết hoa chữ cái đầu'
            }
            return true ;
        },

        name_display(value) {
            if (value && value.trim()) {
                return true;
            }
            return 'Mời nhập tên hiển thị';
        }
    };

    async function submit() {
        store.isLoading = true;
        formValues.parent = store.currentFolder;
        const newForm = new FormData();
        newForm.append('shape_file', formValues.shape_file)
        newForm.append('modelname', formValues.modelname)
        newForm.append('name_display', formValues.name_display)
        newForm.append('public', formValues.public)
        newForm.append('use_uuid', formValues.use_uuid)
        newForm.append('parent', formValues.parent)
        newForm.append('use_object3d', formValues.use_object3d);

        try{
            const response = await apiRequest.post(`/${store.slug}/create-model-from-shapefile`, newForm);
            if(response.status === 201) {
                successToast('Thêm thành công');
                store.isLoading = false;
                store.importModel = false;
                store.getAllFolder();
            } else {
                errorToast('Đã xảy ra lỗi, mời kiểm tra lại')
            }
        } catch (error) {
            console.log(error);
            if(error.response.status === 403) {
                errorToast('Bạn không có quyền');
            }
        }
    }

</script>