<template>
  <div class="tab__details">
    <b-card no-body>
      <b-card-header class="align-items-center">
        <h3 class="content-heading">{{ store.dataPath }}</h3>
        <div class="flex-shrink-0 ms-2">
          <ul
              class="nav nav-tabs-custom rounded card-header-tabs border-bottom-0 nav__menu--bar-tabs justify-content-start"
              role="tablist">
            <li class="nav-item">
              <b-link class="nav-link active" data-bs-toggle="tab" href="#general" role="tab"  data-type="general"
                      @click="store.isInfoTab = true" >
                Thông tin
              </b-link>
            </li>
            <li class="nav-item">
              <b-link class="nav-link" data-bs-toggle="tab" href="#map" role="tab"  data-type="map"
                      @click="store.loadLayerOverlay(true)">
                Bản đồ
              </b-link>
            </li>
            <li class="nav-item">
              <b-link class="nav-link" data-bs-toggle="tab" href="#structure" role="tab"  data-type="structure">
                Cấu trúc
              </b-link>
            </li>
            <li class="nav-item" @click="isDataTab = true" >
              <b-link class="nav-link" data-bs-toggle="tab" href="#data" role="tab" data-type="database">
                Dữ liệu
              </b-link>
            </li>
            <li class="nav-item" v-if="!props.isMining && store.errorMessage !== 'Không có quyền truy cập.'" >
              <b-link class="nav-link" data-bs-toggle="tab" href="#role" role="tab" data-type="role">
                Phân quyền
              </b-link>
            </li>
            <li class="nav-item" v-if="!props.isMining" >
              <b-link class="nav-link" data-bs-toggle="tab" href="#share" role="tab" data-type="share">
                Chia sẻ
              </b-link>
            </li>
          </ul>
        </div>
      </b-card-header>
      <div class="menu__bar-down">
        <ul v-if="isDataTab">
          <li>
            <div class="input-group search-box">
              <select class="input-group-text filter-select" @change="selectChange($event)">
                <option value="" selected disabled>Lọc theo:</option>
                <option :value="item.name" v-for="(item, key) in store.tableData" :key="key">
                  <span v-if="item.name !== 'geom'">
                    {{ item.name.toLowerCase() }}
                  </span>
                </option>
              </select>
              <input type="text" class="form-control" placeholder="Tìm kiếm" aria-label="Tìm kiếm" v-model="searchValue"
                     @keyup="searchFunction($event)">
            </div>
          </li>
          <li v-if="!props.isMining">
            <b-dropdown id="dropdown-1" variant="add">
              <template #button-content>
                <i class="mdi mdi-file-plus fz-14"></i>
                <span>Thêm mới</span>
                <i class="mdi mdi-chevron-down"></i>
              </template>
              <b-dropdown-item @click="store.addNewBtn = !store.addNewBtn">
                <i class="ri-edit-2-line "></i>
                <span>Thêm nhanh</span>
              </b-dropdown-item>
              <b-dropdown-item>
                <div data-bs-toggle="modal" data-bs-target="#modalAddNewDataForm" class="d-flex align-items-center">
                  <i class="mdi mdi-form-select"></i>
                  <span>Thêm theo form</span>
                </div>
              </b-dropdown-item>
            </b-dropdown>
          </li>
          <li v-if="!props.isMining">
            <b-dropdown id="dropdown-2" variant="add">
              <template #button-content>
                <i class="mdi mdi-file-export"></i>
                <span>Nhập</span>
                <i class="mdi mdi-chevron-down"></i>
              </template>
              <b-dropdown-item>
                <div data-bs-toggle="modal" data-bs-target="#modalImportExcel" class="d-flex align-items-center">
                  <i class="ri-edit-2-line "></i>
                  <span>File excel</span>
                </div>
              </b-dropdown-item>
              <b-dropdown-item>
                <div class="d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#modalImportShapeFile">
                  <i class="mdi mdi-shape-plus"></i>
                  <span>Shape File</span>
                </div>
              </b-dropdown-item>
              <b-dropdown-item>
                <div data-bs-toggle="modal" data-bs-target="#modalImportGeojson" class="d-flex align-items-center">
                  <i class="mdi mdi-form-select"></i>
                  <span>Geojson</span>
                </div>
              </b-dropdown-item>
            </b-dropdown>
          </li>
          <li>
            <b-dropdown id="dropdown-2" variant="add">
              <template #button-content>
                <i class="mdi mdi-file-download"></i>
                <span>Xuất</span>
                <i class="mdi mdi-chevron-down"></i>
              </template>
              <b-dropdown-item @click="store.exportExcel(store.currentModelUrl)">
                <i class="ri-edit-2-line "></i>
                <span>File excel</span>
              </b-dropdown-item>
              <b-dropdown-item @click="store.exportShapeFile(store.searchModelUrl + 'export-shapefile/')">
                <i class="mdi mdi-shape-plus"></i>
                <span>Shape File</span>
              </b-dropdown-item>
              <b-dropdown-item @click="store.exportGeoJson(store.searchModelUrl + 'export-geojson/')">
                <i class="mdi mdi-form-select"></i>
                <span>Geojson</span>
              </b-dropdown-item>
            </b-dropdown>
          </li>
        </ul>
        <div v-if="!props.isMining">
          <ul class="px-2" v-if="store.isInfoTab">
            <li @click="store.editInfo = !store.editInfo">
              <i class="ri-edit-2-line "></i>
              <span>Chỉnh sửa</span>
            </li>
          </ul>
        </div>
      </div>
      <b-card-body>
        <div class="tab-content text-muted h-100">
          <TabInformation/>
          <div class="tab-pane h-100" id="map" role="tabpanel">
            <slot name="button_showmap"></slot>
            <div class="table-responsive h-100">
              <MapIotLinkVue @click="handleClickMap" :option-custommap="{
                textSucces: true,
                map_options: {
                  center: { lat: 21.662541681321336, lng: 105.83146041994102 },
                  zoom: 10,
                  mapType: '2d',
                  controls: false,
                  bearing: 0,
                  tilt: 0,
                },
              }"></MapIotLinkVue>
            </div>
          </div>
          <TabStructure :is-mining="isMining" :currentId="currentId"/>
          <TabPanelData v-if="store.dataStructure" :isMining="!props.isMining"/>
          <div class="tab-pane h-100" id="share" role="tabpanel">
              <label for="">Chia sẻ dữ liệu</label>
              <div class="share-input">
                <input type="text" class="form-control" :value="shareUrl" disabled ref="shareApi">
                <i class="mdi mdi-content-copy" @click="copyShare"></i>
              </div>
              <div class="form-check form-switch form-switch-danger my-3">
                <input class="form-check-input" type="checkbox" role="switch" id="public-share" :checked="store.dataStructure.public" @click="setPublic($event)">
                <label class="form-check-label" for="public-share" >Công khai</label>
              </div>
          </div>
          <div class="tab-pane h-100" id="role" role="tabpanel">
              <AddUserMangeFolder :is-inheriance="store.isInheritance"/>
          </div>
        </div>
      </b-card-body>
    </b-card>
    <ModalAddForm></ModalAddForm>
    <ModalCommon title="Nhập file excel" size="modal-sm" id-name="ImportExcel">
      <Form :validation-schema="schema">
        <div class="mb-3">
          <label for="excelImportFile" class="form-label">Tải file excel.xlsx</label>
          <Field class="form-control" type="file" id="excelImportFile" @change="changeExcelFile($event)"
                 name="file_excel"/>
          <ErrorMessage name="file_excel" class="error-message"/>
        </div>
        <button type="button" class="btn btn-sm btn-danger modal-close" data-bs-dismiss="modal">Huỷ</button>
        <button type="submit" class="btn btn-sm btn-success mx-2" @click="importExcel()">Lưu</button>
      </Form>
    </ModalCommon>

    <ModalCommon title="Nhập file.zip" size="modal-sm" id-name="ImportShapeFile">
      <Form :validation-schema="schema">
        <div class="mb-3">
          <label for="shapeFileImport" class="form-label">Tải file file.zip</label>
          <Field class="form-control" type="file" id="shapeFileImport" @change="changeShapeFile($event)"
                 name="shape_file"/>
          <ErrorMessage name="shape_file" class="error-message"/>
        </div>
        <button type="button" class="btn btn-sm btn-danger modal-close" data-bs-dismiss="modal">Huỷ</button>
        <button type="submit" class="btn btn-sm btn-success mx-2" @click="importShapfile()">Lưu</button>
      </Form>
    </ModalCommon>

    <ModalCommon title="Nhập file geojson" size="modal-lg" id-name="ImportGeojson">
      <Form :validation-schema="schema">
        <div class="mb-3">
          <select name="" id="" class="form-select" @change="uploadType($event)">
            <option selected disabled>Tải lên theo dạng:</option>
            <option value="file">File</option>
            <option value="data">Data</option>
          </select>
        </div>
        <div class="mb-3" v-if="typeUpload === 'file'">
          <label for="geojsonImportFile" class="form-label">Tải file file.geojson</label>
          <Field class="form-control" type="file" id="geojsonImportFile" @change="changeGeojsonFile($event)"
                 name="geojson_file"/>
          <ErrorMessage name="geojson_file" class="error-message"/>
        </div>
        <div class="mb-3" v-if="typeUpload === 'data'">
          <Field class="form-control" as="textarea" name="geojson_data" placeholder="Mời điền dữ liệu" rows="10"
                 v-model="geojsonData"/>
          <ErrorMessage name="geojson_data" class="error-message"/>
        </div>
        <div class="mb-3">
          <button class="btn btn-danger btn-md modal-close" data-bs-dismiss="modal">Huỷ</button>
          <button class="btn btn-success mx-2 btn-md" @click="uploadGeojson">Lưu</button>
        </div>
      </Form>
    </ModalCommon>
  </div>
</template>

<script setup>
import {defineProps, onMounted, ref, reactive, computed, watch, provide, toRefs} from 'vue';
import {Field, ErrorMessage, Form} from 'vee-validate';
import {useFolderStore} from '../../state/folder';
import apiRequest from '../../helpers/api/folderApi';
import { BASE_URL } from '../../helpers/api/axiosHttp';
import TabPanelData from './TabPanelData.vue'
import {debounce} from 'lodash';
import MapIotLinkVue from '../map/MapIotLink.vue';
import {data, methods_map} from '../../state/map_control/data_map';
import ModalAddForm from './ModalAddForm.vue';
import {useCommonStore} from '../../state/common';
import {useMapStore} from '../../state/map';
import TabInformation from './TabInformantion.vue'
import ModalCommon from '../ModalCommon.vue';
import {successToast, errorToast} from '../../helpers/api/toastStyle';
import UserRole from './UserRole.vue';
import TabStructure from './TabStructure.vue';
import AddUserMangeFolder from './AddUserMangeFolder.vue';
const store = useFolderStore();
const map = useMapStore();
const isDataTab = ref(false);
const currentId = ref(store.modelId)
const searchValue = ref('');
const searchType = ref('');
const fileExcel = ref(null);
const typeUpload = ref('');
const geojsonData = ref('');
const shapeFileData = ref('');
const geoJsonFile = ref(null);
const shareApi = ref(null);
const props = defineProps({
  isMining: {
    type: Boolean,
    default: false,
  }
});

const shareUrl = computed(() => {
  return BASE_URL + `/api/${store.slug}/layer/${currentId.value}/`;
});


provide("map", {
  ...toRefs(data),
});
provide("draw-map", {
  ...methods_map,
});

const handleClickMap = () => {
  console.log(data, methods_map);
}


const copyShare = () => {
  shareApi.value.select();
  shareApi.value.setSelectionRange(0, 99999); // For mobile devices
  navigator.clipboard.writeText(shareApi.value.value);
  alert("Đã copy: " + shareApi.value.value);
}

const setPublic = async(event) => {
  if(event.target.checked) {
    console.log(event.target.checked);
    try {
      const { data } = await apiRequest.updateFile(store.modelId, store.slug, {
        public: true
      });
    } catch (error) {
      console.log(error);
      if(error.response.status === 403) {
        errorToast('Bạn không có quyền');
      }
    }

  } else {
    try {
      const { data } = await apiRequest.updateFile(store.modelId, store.slug, {
        public: false
      });
    } catch (error) {
      console.log(error);
      if(error.response.status === 403) {
        errorToast('Bạn không có quyền');
      }
    }

  }
}

const schema = {
  file_excel(value) {
    if (value) {
      const tailfile = value.name.split('.')[1];
      if (value.name && tailfile === 'xlsx') {
        return true;
      }
      return 'Mời nhập file .xlsx';
    }
  },
  geojson_file(value) {
    if (value) {
      const tailfile = value.name.split('.')[1];
      if (value.name && tailfile === 'geojson') {
        return true;
      }
      return 'Mời nhập file .geojson';
    }
  },
  geojson_data(value) {
    if (value && value.trim()) {
      return true;
    }
    return 'Mời nhập data';
  },
  shape_file(value) {
    if (value) {
      const tailfile = value.name.split('.')[1];
      if (value.name && tailfile === 'zip') {
        return true;
      }
      return 'Mời nhập file .zip';
    }
  },
};

const addEventTidle = () => {
  if (!data?.map) {
    setTimeout(() => {
      addEventTidle()
    }, 300)
    return
  }
  data.map.addListener(
      "idle",
      (args) => {
        // reloadLayerOnMoveMap();
      },
      {}
  );
}



const selectChange = async (event) => {
  searchType.value = event.target.value.toLowerCase();
}

const searchFunction = debounce(async function (event) {
  if (searchType.value !== '' || searchType.value !== 'undefined') {
    const {data} = await apiRequest.get(store.searchModelUrl + `?${searchType.value}=${event.target.value}`);
    store.databaseArr = data.results;
  }
}, 500);

const changeExcelFile = (event) => {
  fileExcel.value = event.target.files[0];
}
const changeShapeFile = (event) => {
  shapeFileData.value = event.target.files[0];
}

const importExcel = async () => {
  const newForm = new FormData();
  newForm.append('file', fileExcel.value);
  try {
    const response = await apiRequest.post(store.searchModelUrl + 'import-data-from-excel/', newForm);
    if(response.data.field_scraps.length) {
      alert(`Bảng dữ liệu không có những trường này ${JSON.stringify(Object.assign(response.data.field_scraps))}`)
    }

    if(response.data.field_error.length) {
      alert(`Mời xem lại những trường lỗi ${JSON.stringify(Object.assign(response.data.field_error))}`)
    }
    if (response.statusText === 'OK') {
      successToast('Tải lên thành công');
      store.getDatabase(store.apiDatabase);
      store.closeModel();
    } else {
      errorToast('Lỗi mời tải lại')
    }
  } catch (error) {
    console.log(error);
    if(error.response.status === 403) {
        errorToast('Bạn không có quyền');
    }
  }

}
const importShapfile = async () => {
  const newForm = new FormData();
  newForm.append('file', shapeFileData.value);
  try {
    const response = await apiRequest.post(store.searchModelUrl + 'import-data-from-shapefile/', newForm);
    if (response.statusText === 'OK') {
      successToast('Tải lên thành công');
      store.getDatabase(store.apiDatabase);
      store.closeModel();
    } else {
      errorToast('Lỗi mời tải lại')
    }
  } catch (error) {
    console.log(error);
    if(error.response.status === 403) {
        errorToast('Bạn không có quyền');
    }
  }
 
}

const uploadType = (event) => {
  typeUpload.value = event.target.value;
}

const uploadGeojson = async () => {
  if(geojsonData.value) {
    try {
      const response = await apiRequest.post(store.searchModelUrl + 'import-data-from-geojson/', JSON.parse(geojsonData.value));
      if (response.status === 200) {
        successToast(response.data.msg);
        store.getDatabase(store.apiDatabase);
        store.closeModel();

      } else {
        errorToast('Lỗi mời tải lại')
      }
    } catch (error) {
      console.log(error);
      if(error.response.status === 403) {
          errorToast('Bạn không có quyền');
      }
    }
    
  } else {
    const formData = new FormData();
    formData.append('file', geoJsonFile.value)
    try {
      const response = await apiRequest.post(store.searchModelUrl + 'import-data-from-geojson/', formData);
      console.log(response);
      if (response.status === 200) {
        successToast(response.data.msg);
        store.getDatabase(store.apiDatabase);
        store.closeModel();

      } else {
        errorToast('Lỗi mời tải lại')
      }
    } catch (error) {
      console.log(error);
      if(error.response.status === 403) {
          errorToast('Bạn không có quyền');
      }
    }
   
  }
 
}

const changeGeojsonFile = (event) =>{
  geoJsonFile.value = event.target.files[0]
}

watch(() => store.modelId, async (newValue) => {
  currentId.value = newValue;
  await store.getDataStructure(newValue, store.slug);
  store.getDatabase(store.apiDatabase);
  addEventTidle();
});


onMounted(async () => {
  await store.getDataStructure(currentId.value, store.slug);
  store.getDatabase(store.apiDatabase);
  document.querySelectorAll('.nav__menu--bar-tabs .nav-item .nav-link').forEach(item => {
    item.addEventListener('click', function () {
      if (item.getAttribute('data-type') !== 'database') {
        isDataTab.value = false;
      }
      if (item.getAttribute('data-type') !== 'general') {
        store.isInfoTab = false;
      }
    })
  })
});


</script>