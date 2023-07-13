<template>
  <div class="tab-pane" id="data" role="tabpanel">
    <table class="table align-middle table-striped table-bordered">
      <thead class="table-light text-dark text-center text-uppercase">
        <tr>
          <th>STT</th>
          <th v-for="(data, key) in store.tableData" class="table__data-name" data-sort="currency_name" scope="col"
            :key="key" :data-type="data.data_type" :data-name="data.name" ref="fieldName"
            :class="{ hide: data.name === 'id' }">
            {{ data.name }}
          </th>

          <!-- <th scope="col">ption 3D</th> -->
          <th scope="col">Hành động</th>
        </tr>
      </thead>
      <tbody class="list form-check-all">
        <tr v-if="store.addNewBtn">
          <td></td>
          <td v-for="(data, key) in store.tableData" :key="key" :class="{ hide: data.name === 'id' }">
            <div v-if="data.name !== 'id'">
              <div v-if="data.name !== 'geom'">
                <input type="text" v-model="newData[data.name.toLowerCase()]" :placeholder="data.name.toLowerCase()" />
              </div>
              <div class="d-flex align-items-center gap-2" v-if="data.name == 'geom'">
                <select v-model="geomAddType">
                  <option value="text">text</option>
                  <option value="file">file</option>
                </select>
                <input v-if="geomAddType == 'text'" type="text" v-model="newData[data.name.toLowerCase()]"
                  :placeholder="data.name.toLowerCase()" />
                <input v-if="geomAddType == 'file'" type="file" accept=".json" style="max-width: 156px;"
                  @change="event => changeQuickAddGeomFile(event, data.name.toLowerCase())" />
                <input type="text" v-model="newData[data.name.toLowerCase()]" :placeholder="data.name.toLowerCase()"
                  hidden />
              </div>
            </div>
          </td>
          <td>
            <b-button variant="success" data-bs-toggle="modal" data-bs-target="#modalFastObject3D" class="btn-sm mx-2">
              <!-- @click="store.addNewField(store.apiDatabase, newData)" -->
              <span>3D</span>
            </b-button>
            <b-button variant="danger" class="btn-sm" @click="
              store.addNewField(store.apiDatabase, {
                ...newData,
                id: dataIdProps,
              })
            ">
              <span>Lưu</span>
            </b-button>
            <b-button variant="secondary" class="btn-sm mx-2" @click="cancelAdd($event)">
              <span>Huỷ</span>
            </b-button>
          </td>
        </tr>
        <tr v-for="(item, index) in store.databaseArr" :key="index" class="table__data-view" id="my-table"
          v-if="store && store.databaseArr && store.databaseArr.length">
          <td>
            {{ index + 1 }}
          </td>
          <td v-for="(value, key) of item" :key="key" class="table__data-info">
            <input type="text" v-if="key !== 'id'" :id="key" :value="value"
              @input="editDataInput[key] = $event.target.value" />
            <span v-if="key !== 'id'" class="table__data-field-name">
              <span v-if="key !== 'geom'">{{ value }}</span>
              <span v-if="key == 'geom'">{{ value?.type }}</span>
            </span>
          </td>
          <td>
            <div class="d-flex justify-content-center gap-3" v-if="!props.isMining">
              <b-button variant="light" size="sm" class="waves-effect" @click="viewDetailData(Object.values(item)[0])"
                data-bs-toggle="modal" data-bs-target="#modalDetailData">
                <span class="text-muted fw-semibold">2D</span></b-button>
              <b-button v-if="store.isHasOjbect3D" variant="light" size="sm" class="waves-effect"
                @click="viewDetailData3D(Object.values(item)[0])" data-bs-toggle="modal"
                data-bs-target="#modalDetailData3D">
                <span class="text-muted fw-semibold">3D</span>
              </b-button>
            </div>
            <div class="dropdown table__data-action-group text-center" v-else>
              <button class="btn btn-soft-secondary btn-sm dropdown" type="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                <i class="mdi mdi-dots-vertical"></i>
              </button>
              <ul class="dropdown-menu mb-0">
                <li>
                  <b-link class="dropdown-item" @click="viewDetailData(Object.values(item)[0])" data-bs-toggle="modal"
                    data-bs-target="#modalDetailData">
                    <i class="ri-eye-line"></i>
                    Xem 2D
                  </b-link>
                </li>
                <li v-if="store.isHasOjbect3D">
                  <b-link class="dropdown-item" @click="viewDetailData3D(Object.values(item)[0])" data-bs-toggle="modal"
                    data-bs-target="#modalDetailData3D">
                    <i class="mdi mdi-cube-scan"></i>
                    Xem 3D
                  </b-link>
                </li>
                <li>
                  <b-link class="dropdown-item" @click="editData(Object.values(item)[0], $event)">
                    <i class="ri-edit-2-line"></i>
                    Chỉnh sửa nhanh
                  </b-link>
                </li>
                <li>
                  <b-link class="dropdown-item" @click="editFormData(Object.values(item)[0])">
                    <i class="ri-edit-2-line"></i>
                    Chỉnh sửa theo form
                  </b-link>
                </li>
                <li>
                  <b-link class="dropdown-item" @click="deleteData(Object.values(item)[0])">
                    <i class="ri-delete-bin-line align-bottom me-2 text-muted"></i>
                    Xóa
                  </b-link>
                </li>
              </ul>
            </div>
            <ul class="table__data-save-btn">
              <li>
                <button class="btn btn-sm btn-success fs-15" @click="saveEditData($event, Object.values(item)[0])">
                  Lưu
                </button>
              </li>
              <li>
                <button class="btn btn-sm btn-danger fs-15 mx-2" @click="cancelEdit($event)">
                  Huỷ
                </button>
              </li>
            </ul>
          </td>
        </tr>
        <tr v-else>
          <span>Không có dữ liệu</span>
        </tr>
      </tbody>
    </table>

    <div class="d-flex justify-content-end mt-3" v-if="store.totalObject > 10">
      <div class="pagination-wrap hstack gap-2">
        <Pagination :page-size="store.pageSize" :total="store.totalObject" :callback="pageChanged"></Pagination>
      </div>
    </div>
    <ModalCommon title="Add object3D" size="modal-xl" id-name="FastObject3D">
      <!-- :class="{ active: isActive }" -->
      <div class="row">
        <AddNewPositionFast @dataPosition="dataPosition" />
      </div>
    </ModalCommon>
    <ModalCommon title="Chi tiết" size="modal-xl" id-name="DetailData">
      <div class="row">
        <div class="table-card col-6">
          <table class="table mb-0" v-if="dataDetails">
            <tbody>
              <tr v-for="(item, key) in dataDetails" :key="key" :class="{ hide: key === 'geom' || key === 'id' }">
                <td class="fw-medium">{{ key }}</td>
                <td class="text-right">{{ item }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-6">
          <MapDetailData />
        </div>
      </div>
    </ModalCommon>
    <ModalCommon title="Chi tiết" size="modal-xl" id-name="DetailData3D">
      <div class="row">
        <div class="table-card col-6">
          <table class="table mb-0" v-if="dataDetails">
            <tbody>
              <tr v-for="(item, key) in dataDetails" :key="key" :class="{ hide: key === 'geom' || key === 'id' }">
                <td class="fw-medium">{{ key }}</td>
                <td class="text-right">{{ item }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-6">
          <Map3DPopup />
        </div>
      </div>
    </ModalCommon>
    <ModalEditData />
  </div>
</template>

<script setup>
import {
  defineProps,
  onMounted,
  ref,
  reactive,
  computed,
  watch,
  inject,
} from "vue";
import { useFolderStore } from "../../state/folder";
import apiRequest from "../../helpers/api/folderApi";
import apiRequestObject3D from "../../helpers/api/object3dApi";
import Swal from "sweetalert2";
import { successToast, errorToast } from "../../helpers/api/toastStyle";
import Pagination from "../../components/Pagination.vue";
import ModalCommon from "../ModalCommon.vue";
import { useCommonStore } from "../../state/common";
import { useMapStore } from "../../state/map";
import Map3DPopup from "../../components/map/Map3DPopup.vue";
import MapDetailData from "../map/MapDetailData.vue";
import ModalEditData from "./ModalEditData.vue";
import AddNewPositionFast from "./AddNewPositionFast.vue";
import API from '../../helpers/api/useAxios';

const store = useFolderStore();
const map = useMapStore();
const dataDetails = ref(null);
const newData = reactive({});
const editDataInput = reactive({});
const handleDraw = ref(null);
const editDrawMap = ref(null);

const geomAddType = ref("text")
// const isActive = ref(false);
const dataIdProps = ref();
const props = defineProps({
  isMining: {
    type: Boolean,
    default: false,
  },
});

const changeQuickAddGeomFile = (event, field) => {
  let geomType = null
  console.log(store.tableData)
  store.tableData.forEach(tbField => {
    if (tbField.name == 'geom') {
      geomType = tbField.data_type
    }
  })
  const currentFile = event.target.files[0]
  if (currentFile) {
    const formData = new FormData()
    formData.append('file', currentFile)
    formData.append('name', '')
    API().post(`/upload-2d-object`, formData)
      .then((res) => {
        const firstFeatureGeometry = res.json
        if (firstFeatureGeometry.type.toLowerCase() == geomType) {
          newData[field] = JSON.stringify(firstFeatureGeometry)
        }
        else {
          errorToast('Vui lòng tải lên file có feature là: ' + geomType)
        }
      })
  }

}

const dataPosition = (data) => {
  dataIdProps.value = data;
  // isActive.value = true;
};

const editFormData = async (id) => {
  map.modalEditForm = true;
  store.layerDataId = id;
  const { data } = await apiRequest.get(store.apiDatabase + id);
  store.formDataInput = data;
  const getEditInputData = getAllEls(".form__edit-data");
  getEditInputData.forEach((el) => {
    const dataType = el.getAttribute("data-name");
    for (const [key, value] of Object.entries(store.formDataInput)) {
      if (key.toLowerCase() === dataType.toLowerCase()) {
        if (dataType.toLowerCase() === "geom") {
          el.value = JSON.stringify(value);
        } else if (dataType.toLowerCase() === "date") {
          const date = new Date(value);
          el.value = date.toISOString().substring(0, 10);
        } else {
          el.value = value;
        }
      }
    }
  });

  map.drawMap(
    data.geom.type,
    data.geom.coordinates,
    editDrawMap.value,
    map.editFormMap
  );
};

async function pageChanged(page) {
  try {
    const { data } = await apiRequest.get(store.apiDatabase + `?page=${page}`);
    store.databaseArr = data.results;
  } catch (error) {
    console.log(error);
  }
}

const getAllEls = (el) => {
  return document.querySelectorAll(el);
};
const findAllEl = (parentEl, el) => {
  return parentEl.querySelectorAll(el);
};
const findEl = (parentEl, el) => {
  return parentEl.querySelector(el);
};

function showInput(currentTarget) {
  const trTag = currentTarget.closest("tr");
  const btnAction = findEl(trTag, ".table__data-action-group");
  const saveBtnAction = findEl(trTag, ".table__data-save-btn");
  const tdViewName = findAllEl(trTag, ".table__data-info span");
  const tdInputField = findAllEl(trTag, ".table__data-info input");
  btnAction.style.display = "none";
  saveBtnAction.style.display = "flex";
  tdViewName.forEach((item) => (item.style.display = "none"));
  tdInputField.forEach((item) => (item.style.display = "block"));
}

function hideInput(currentTarget) {
  const trTag = currentTarget.closest("tr");
  const btnAction = findEl(trTag, ".table__data-action-group");
  const saveBtnAction = findEl(trTag, ".table__data-save-btn");
  const tdViewName = findAllEl(trTag, ".table__data-info span");
  const tdInputField = findAllEl(trTag, ".table__data-info input");
  btnAction.style.display = "block";
  saveBtnAction.style.display = "none";
  tdViewName.forEach((item) => (item.style.display = "block"));
  tdInputField.forEach((item) => (item.style.display = "none"));
}

const fieldName = ref();
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
        const response = await apiRequest.remove(store.apiDatabase + id);
        if (response.status === 200) {
          Swal.fire({
            title: "Đã xoá!",
            icon: "success",
          });
          store.getDatabase(store.apiDatabase);
        }
      } catch (error) {
        if (error.response.status === 403) {
          errorToast('Bạn không có quyền');
        }
        console.log(error);
      }

    }
  });
};
const editData = async (id, event) => {
  const currentEl = event.currentTarget;
  showInput(currentEl);
};

const saveEditData = async (event, id) => {
  let currentTaget = event.currentTarget;
  try {
    const response = await apiRequest.update(
      store.apiDatabase + id + "/",
      editDataInput
    );
    if (response.status === 200) {
      successToast("Chỉnh sửa thành công");
      store.getDatabase(store.apiDatabase);
      hideInput(currentTaget);
    } else {
      errorToast("Lỗi mời xem lại");
    }
  } catch (error) {
    if (error.response.status === 403) {
      errorToast('Bạn không có quyền');
    }
    console.log(error);
  }
};

const cancelEdit = (event) => {
  const currentEl = event.currentTarget;
  hideInput(currentEl);
};
const cancelAdd = (event) => {
  store.addNewBtn = false;
};

const viewDetailData = async (id) => {
  if (handleDraw.value !== null) handleDraw.value.setMap(null);
  try {
    const { data } = await apiRequest.get(store.apiDatabase + id);
    dataDetails.value = data;
    map.drawMap(
      data.geom.type,
      data.geom.coordinates,
      handleDraw.value,
      map.mapDetail
    );
  } catch (error) {
    console.log(error);
  }
};

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const viewDetailData3D = async (id) => {
  try {
    const { data } = await apiRequest.get(store.apiDatabase + id);
    dataDetails.value = data;
    if (data.object3d !== undefined || data.object3d !== null) {
      const response = await apiRequestObject3D.get(data.object3d);
      map.objData = response.data.obj;
      map.objName = response.data.name;
      map.objTexture = response.data.texture;
      map.objBearing = response.data.record_layer.bearing;
      map.objScale = response.data.record_layer.scale;
      map.objPosition = response.data.record_layer.position;
    }
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => { });
</script>
