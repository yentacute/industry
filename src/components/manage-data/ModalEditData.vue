<template>
    <b-modal v-model="map.modalEditForm" hide-footer title="Chỉnh sửa" class="v-modal-custom" size="xl"> 
        <Form @submit="submitForm" id="formEditData">
            <div class="row">
                <div class="col-6">
                    <div v-for="(item, key) in store.tableData" :key="key" class="form-group">
                        <Field v-if="store.getFieldType(item.data_type) === 'textarea'"
                            :name="item.name" as="textarea" :placeholder="item.name" class="form-control mb-3 form__edit-data"
                            id="input-geom" :data-name="item.name"/>
                        <Field v-else :name="item.name" :type="store.getFieldType(item.name)" class="form-control  mb-3 form__edit-data"
                            :placeholder="item.name" 
                            :data-name="item.name"/>
                        <ErrorMessage :name="item.name" />
                    </div>
                </div>
                <div class="col-6">
                    <b-card no-body>
                        <b-card-body>
                            <ul class="nav nav-tabs nav-tabs-custom nav-primary nav-justified mb-3" role="tablist">
                                <li class="nav-item">
                                    <b-link class="nav-link active" data-bs-toggle="tab" href="#object2d" role="tab">
                                        Đối tượng 2D
                                    </b-link>
                                </li>
                                <li class="nav-item">
                                    <b-link class="nav-link" data-bs-toggle="tab" href="#profile1" role="tab">
                                        Đối tượng 3D
                                    </b-link>
                                </li>
                            </ul>


                            <div class="tab-content text-muted">
                                <div class="tab-pane active" id="object2d" role="tabpanel">
                                    <div class="d-flex">
                                        <div class="flex-grow-1 ms-2">
                                            <SearchMap api-url="https://api.map4d.vn/sdk/place/text-search"/>
                                            <div class="sync-group">
                                                <button type="button" class="btn btn-danger w-sm border-top-0 search-btn"
                                                    @click="map.resetMap(map.mapEditInit)">Đặt lại</button>
                                                <button type="button" class="btn btn-warning w-sm border-top-0 search-btn"
                                                    @click="map.createNewMap()">Tạo mới</button>
                                                <button type="button" class="btn btn-primary w-sm border-top-0 search-btn"
                                                    @click="map.syncGeom">
                                                    Đồng bộ
                                                </button>
                                            </div>
                                            <MapEditForm />
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane" id="profile1" role="tabpanel">
                                    <div class="d-flex">
                                        <div class="flex-grow-1 ms-2">
                                            <div class="mb-3 ms-3">
                                                <p>Vui lòng tải lên đối tượng mới</p>
                                                <div class="my-3">
                                                    <label for="formFile-img" class="form-label">Dữ liệu đối tượng file
                                                        img
                                                        <span class="text-danger">*</span>
                                                    </label>
                                                    <input type="file" id="formFile-img" accept=".jpg, .png"
                                                        class="form-control">
                                                </div> <!---->
                                                <div class="my-3">
                                                    <label for="formFile-geojson" class="form-label">Dữ liệu đối tượng
                                                        file
                                                        Object
                                                        <span class="text-danger">*</span>
                                                    </label>
                                                    <input type="file" id="formFile-geojson" class="form-control">
                                                </div> <!---->
                                                <div class="btn btn-primary mt-3">Xem trước
                                                </div>
                                            </div>
                                            <div class="my-3 ms-0 row">
                                                <div class="col-6">
                                                    <label for="formFile-geojson" class="form-label">Vĩ độ</label>
                                                    <div class="w-100 position-relative">
                                                        <input type="number" step="0.000001" required="required" class="form-control"/> 
                                                    </div>
                                                </div>
                                                <div class="col-6">
                                                    <label for="formFile-geojson" class="form-label">Kinh độ</label>
                                                    <div class="w-100 position-relative">
                                                        <input type="number" step="0.000001" required="required" class="form-control" /> 
                                                    </div>
                                                </div>
                                                <div class="col-6 mt-3"><label for="formFile-geojson"
                                                        class="form-label">Nghiêng</label>
                                                    <div class="w-100 position-relative">
                                                        <input type="number" min="0" step="0.01" id="" class="form-control" /> 
                                                    </div>
                                                </div>
                                                <div class="col-6 mt-3"><label for="formFile-geojson"
                                                        class="form-label">Scale</label>
                                                    <div class="w-100 position-relative">
                                                        <input type="number" min="0" step="0.001" id="" class="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="my-3 ms-0 row">
                                                <Map3dOject />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-card-body>
                    </b-card>

                </div>
                <div class="btn-save d-flex">
                    <button type="button" class="btn btn-danger btn-md mt-5 mx-2" data-bs-dismiss="modal">Huỷ</button>
                    <button type="submit" class="btn btn-success btn-md mt-5">Lưu</button>
                </div>
            </div>
        </Form>
    </b-modal>
</template>
<script setup>
import { inject } from 'vue'
import { useFolderStore } from '../../state/folder';
import ModalCommon from '../ModalCommon.vue';
import { Field, ErrorMessage, Form } from 'vee-validate';
import * as yup from 'yup';
import SearchMap from '../SearchMap.vue'
import { useMapStore } from '../../state/map';
import { reactive, ref, onMounted } from 'vue';
import Map3dOject from '../map/Map3dOject.vue';
import { useCommonStore } from '../../state/common';
import { useObjectStore } from '../../state/object3d';
import MapEditForm from '../map/MapEditForm.vue';
import $ from "jquery";
import apiRequest from '../../helpers/api/modelApi'
import { errorToast, successToast } from '../../helpers/api/toastStyle';
const store = useFolderStore();
const map = useMapStore();
const common = useCommonStore();
const { getAllObject, allObject } = useObjectStore();
const geomEl = ref(null);
const dataEdit = reactive({});

const submitForm = async () => {
    const dataForm = $('#formEditData').serializeArray().reduce(function(obj, item) {
        obj[item.name.toLowerCase()] = item.value;
        return obj;
    }, {});
    try {
        const response = await apiRequest.update(store.searchModelUrl + store.layerDataId + '/', dataForm);
        if (response.status === 200) {
            successToast('Cập nhật thành công');

            setTimeout(function() {
                store.closeModel();
            },250)
        } else {
            errorToast('Cập nhật thất bại')
        }
    } catch (error) {
        console.log(error);
        if(error.response.status === 403) {
          errorToast('Bạn không có quyền');
        }
        console.log(error);
    }

}

onMounted(() => {

})

</script>