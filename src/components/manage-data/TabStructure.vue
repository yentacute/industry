<template>
    <div class="tab-pane" id="structure" role="tabpanel">
        <div>
            <button type="button" class="btn btn-sm btn-success" @click="addForm.isAddNew = !addForm.isAddNew">+ Thêm mới
            </button>
            <p></p>
            <form id="editStructureForm">
                <table class="table align-middle table-striped table-bordered">
                    <thead class="table-light text-dark text-center text-uppercase">
                        <tr>
                            <th class="sort" data-sort="currency_name" scope="col">ID</th>
                            <th class="sort" data-sort="current_value" scope="col">
                                Tên
                            </th>
                            <th class="sort" data-sort="pairs" scope="col">Data type</th>
                            <th class="sort" data-sort="high" scope="col">Max length</th>
                            <th class="sort" data-sort="low" scope="col">verbose_name</th>
                            <th class="sort" data-sort="market_cap" scope="col" v-if="!props.isMining">
                                Null
                            </th>
                            <th class="sort" data-sort="market_cap" scope="col" v-if="!props.isMining">
                                Blank
                            </th>
                            <th class="sort" data-sort="market_cap" scope="col" v-if="!props.isMining">
                                Unique
                            </th>
                            <th scope="col" v-if="!props.isMining">Action</th>
                        </tr>
                    </thead>
                    <tbody class="list form-check-all">
                        <tr v-if="addForm.isAddNew">
                            <td class="id">
                                null
                            </td>
                            <td>
                                <input v-model="addForm.name" class="form-control" />
                            </td>
                            <td class="pairs">
                                <select class="form-select" v-model="addForm.data_type">
                                    <option value="" disabled selected>Select your option</option>
                                    <option value="character">Character</option>
                                    <option value="text">Text</option>
                                    <option value="integer">Integer</option>
                                    <option value="float">Float</option>
                                    <option value="boolean">Boolean</option>
                                    <option value="date">Date</option>
                                    <option value="point">Point</option>
                                    <option value="linestring">Line</option>
                                    <option value="polygon">Polygon</option>
                                    <option value="multipolygon">Multipolygon</option>
                                    <option value="json">Json</option>
                                    <option value="foreignkey">ForeignKey</option>
                                </select>
                            </td>
                            <td class="high">
                                <input type="text" class="form-control" v-model="addForm.max_length">
                            </td>
                            <td class="low">
                                <input type="text" class="form-control" v-model="addForm.verbose_name">
                            </td>
                            <td class="market_cap" v-if="!props.isMining">
                                <input type="checkbox" v-model="addForm.null" :checked="addForm.null">

                            </td>
                            <td class="market_cap" v-if="!props.isMining">
                                <input type="checkbox" v-model="addForm.blank" :checked="addForm.blank">
                            </td>
                            <td class="market_cap" v-if="!props.isMining">
                                <input type="checkbox" v-model="addForm.unique" :checked="addForm.unique">
                            </td>
                            <td v-if="!props.isMining">
                                <ul class="d-flex justify-content-center">
                                    <li>
                                        <button type="button" class="btn btn-sm btn-success fs-15"
                                            @click="addDataStruct()">Lưu</button>
                                    </li>
                                    <li>
                                        <button class="btn btn-sm btn-danger fs-15 mx-2 btn__cancel--edit"
                                            @click="cancelAddDataStruct()">Huỷ</button>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr v-for="(data, index) in store.tableData" :key="index" id="editStructureContent">
                            <td class="id">
                                {{ index + 1 }}
                                <input type="hidden" :value="data.id" name="structureId">
                            </td>
                            <td>
                                <input :value="data.name" name="structureName" class="form-control form__edit--field"
                                    type="text" :disabled="data.name === 'geom'"
                                    :placeholder="data.name === 'geom' ? data.name : ''" />
                                <span>{{ data?.name }}</span>
                            </td>
                            <td class="pairs">
                                <select class="form-select form__edit--field" :value="data.data_type"
                                    @change="optionChange($event)" name="structureOptions">
                                    <option value="" disabled selected>Select your option</option>
                                    <option value="character">Character</option>
                                    <option value="text">Text</option>
                                    <option value="integer">Integer</option>
                                    <option value="float">Float</option>
                                    <option value="boolean">Boolean</option>
                                    <option value="date">Date</option>
                                    <option value="point">Point</option>
                                    <option value="linestring">Line</option>
                                    <option value="polygon">Polygon</option>
                                    <option value="multipolygon">Multipolygon</option>
                                    <option value="json">Json</option>
                                    <option value="foreignkey">ForeignKey</option>
                                </select>
                                <span>{{ data?.data_type }}</span>
                            </td>
                            <td class="high">
                                <input type="text" class="form-control form__edit--field" :value="data.max_length"
                                    name="structureMaxLength">
                                <span>{{ data?.max_length }}</span>
                            </td>
                            <td class="low">
                                <input type="text" class="form-control form__edit--field" :value="data.verbose_name"
                                    name="structureVerboseName">
                                <span>{{ data?.verbose_name }}</span>
                            </td>
                            <td class="market_cap" v-if="!props.isMining">
                                <input type="checkbox" :value="data.null" name="structureNull" :checked="data.null"
                                    class="form__edit--field">
                                <span>{{ data?.null }}</span>

                            </td>
                            <td class="market_cap" v-if="!props.isMining">
                                <input type="checkbox" :value="data.blank" name="structureBlank" :checked="data.blank"
                                    class="form__edit--field">
                                <span>{{ data?.blank }}</span>
                            </td>
                            <td class="market_cap" v-if="!props.isMining">
                                <input type="checkbox" :value="data.unique" name="structureUnique" :checked="data.unique"
                                    class="form__edit--field">
                                <span>{{ data?.unique }}</span>
                            </td>
                            <td v-if="!props.isMining">
                                <ul class="list-inline hstack gap-3 mb-0 justify-content-center table__data-action-group">
                                    <li class="list-inline-item" @click="editFormData($event)">
                                        <b-link class="link-success fs-15" v-b-tooltip.hover title="Cập nhật">
                                            <i class="ri-edit-2-line"></i>
                                        </b-link>
                                    </li>

                                    <li class="list-inline-item" @click="deleteData(data.id)">
                                        <b-link class="link-danger fs-15" v-b-tooltip.hover title="Xóa">
                                            <i class="ri-delete-bin-line"></i>
                                        </b-link>
                                    </li>
                                </ul>
                                <ul class="table__data-save-btn justify-content-center">
                                    <li>
                                        <button type="submit" class="btn btn-sm btn-success fs-15"
                                            @click="editDataStructure($event)">Lưu</button>
                                    </li>
                                    <li>
                                        <button class="btn btn-sm btn-danger fs-15 mx-2 btn__cancel--edit"
                                            @click="cancelEdit($event)">Huỷ</button>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, defineProps } from 'vue'
import { useFolderStore } from '../../state/folder';
import { successToast, errorToast } from '../../helpers/api/toastStyle';
import apiRequest from '../../helpers/api/folderApi'
import $ from 'jquery'
import Swal from 'sweetalert2';
import API from '../../helpers/api/useAxios';
const props = defineProps({
    isMining: Boolean,
    currentId: ""
})

const addForm = reactive({
    isAddNew: false,
    name: '',
    data_type: '',
    max_length: 0,
    verbose_name: '',
    null: false,
    blank: false,
    unique: false,
})

const store = useFolderStore();


const editModel = reactive({
    id: '',
    name: '',
    data_type: '',
    max_length: 0,
    verbose_name: '',
    null: false,
    blank: false,
    unique: false,

})

const addDataStruct = function () {
    console.log(addForm)
    console.log(props.currentId)
    API().post(`${location.pathname.split("/")[1]}/layer/${props.currentId}/field/`, addForm)
        .then((res) => {
            if (res.msg) {
                errorToast(res.msg)
            }
            else {
                console.log(res);
                store.tableData = res.construct.fields
                addForm.isAddNew = false
            }

        })
}

const cancelAddDataStruct = function () {
    addForm.isAddNew = false
}

const getEl = (trTag, el) => {
    return trTag.querySelector(el);
}

const findAllEl = (parentEl, el) => {
    return parentEl.querySelectorAll(el);
};

const optionChange = (event) => {
    editModel.data_type = event.target.value;
}

const deleteData = async (id) => {
    Swal.fire({
        title: "Bạn có muốn xoá không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Không",
        confirmButtonText: "Đồng ý",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await apiRequest.editDataStructure(store.slug, store.modelId, {
                    id: id,
                    delete: true
                });
                if (response.status === 200) {
                    Swal.fire({
                        title: "Đã xoá!",
                        icon: "success",
                    });
                    store.getDatabase(store.apiDatabase);
                }
            } catch (error) {
                console.log(error);
                if (error.response.status === 403) {
                    errorToast('Bạn không có quyền');
                }
            }
        }
    });
};

const editFormData = (event) => {
    event.preventDefault();
    const trTag = event.target.closest('#editStructureContent');
    getEl(trTag, '.table__data-save-btn').style.display = 'flex';
    getEl(trTag, '.table__data-action-group').style.display = 'none';
    findAllEl(trTag, '.form__edit--field').forEach(item => {
        item.style.display = 'block';
        item.nextElementSibling.style.display = 'none';
    })
}

const cancelEdit = (event) => {
    event.preventDefault();
    const trTag = event.target.closest('#editStructureContent');
    getEl(trTag, '.table__data-save-btn').style.display = 'none';
    getEl(trTag, '.table__data-action-group').style.display = 'flex';
    findAllEl(trTag, '.form__edit--field').forEach(item => {
        item.style.display = 'none';
        item.nextElementSibling.style.display = 'block';
    })
}
const editDataStructure = async (event) => {
    event.preventDefault();
    const trTag = event.target.closest('#editStructureContent');
    if (getEl(trTag, 'input[name="structureUnique"]').checked) {
        editModel.unique = true
    } else {
        editModel.unique = false
    }
    if (getEl(trTag, 'input[name="structureBlank"]').checked) {
        editModel.blank = true
    } else {
        editModel.blank = false
    }
    if (getEl(trTag, 'input[name="structureNull"]').checked) {
        editModel.null = true
    } else {
        editModel.null = false
    }

    editModel.id = parseInt(getEl(trTag, 'input[name="structureId"]').value);
    editModel.name = getEl(trTag, 'input[name="structureName"]').value;
    editModel.max_length = parseInt(getEl(trTag, 'input[name="structureMaxLength"]').value);
    editModel.data_type = getEl(trTag, 'select[name="structureOptions"]').value;
    editModel.verbose_name = getEl(trTag, 'input[name="structureVerboseName"]').value;
    try {
        const response = await apiRequest.editDataStructure(store.slug, store.modelId, editModel);
        if (response.status === 200) {
            successToast('Chỉnh sửa thành công');
            store.getDataStructure(store.modelId, store.slug);
            $('.btn__cancel--edit').trigger('click');
        } else {
            errorToast('Lỗi mời xem lại')
        }
    } catch (error) {
        if (error.response.status === 403) {
            errorToast('Bạn không có quyền chỉnh sửa.');
            $('.btn__cancel--edit').trigger('click');
        }
        console.log(error);
    }
}

</script>