<template>
  <Layout :address="address" :items="address.details" chooseMenu="khai-thac-du-lieu" :slug="props.slug">
    <div class="manage-database">
      <div class="page-main__content" ref="containerContent">
        <div class="sidebar" ref="sidebarLeft">
          <b-card no-body>
            <b-card-body>
              <ul class="left-sidebar">
                <div class="mb-3">
                  <div class="input-group search-box w-100">
                    <select class="input-group-text filter-select bg-light" style="width: 40%" v-model="searchFolderId"
                            @change="handleSearch()">
                      <option value="">Tất cả thư mục</option>
                      <option v-for="item in store.listFolders" :key="item.id" :value="item.id">{{ item.name }}</option>
                    </select>
                    <div class="search-box" style="width: calc(100% - 40%);">
                      <input type="text" class="form-control search" style="border-radius: 2px" v-model="searchVal"
                             @keyup="handleSearch()" placeholder="Tìm lớp dữ liệu..."/>
                      <i class="ri-search-line search-icon"></i>
                    </div>
                  </div>
                </div>
                <div v-if="searchVal">
                  <b-list-group v-if="allLayer.length > 0">
                    <b-list-group-item href="#" class="list-group-item-action d-flex align-items-center border mb-2"
                                       style="border-radius: 4px" v-for="item in allLayer" :key="item.id"
                                       @click="item.type==='folder' ? getDetailFolder(item) : openDataDetails(item.id)"
                                       :class="{'active' : store.modelId === item.id}">
                    <span v-if="item.type==='folder'" class="flex-grow-1 align-self-center">
                      <i class="ri-folder-2-fill text-warning align-middle me-2 fs-15"></i>{{ item.name }}
                    </span>
                      <span v-else class="flex-grow-1 align-self-center">
                      <i class="ri-table-line align-middle me-2 fs-15"
                         :class="store.modelId !== item.id ? 'text-info' : 'text-white'"></i>{{ item.name_display }}
                    </span>
                    </b-list-group-item>
                  </b-list-group>
                  <div v-else>Không có dữ liệu tìm kiếm!</div>
                </div>
                <div v-else>
                  <div v-if="isChild" class="py-2 d-flex border-bottom">
                    <b-link class="fw-semibold flex-grow-1">
                      <i class="ri-arrow-right-s-fill align-bottom"></i>
                      <span class="file-list-link">
                    {{ detailFolder.name }}</span>
                    </b-link>
                    <b-link type="button" v-b-tooltip.hover title="Đóng"
                            @click="isChild = false; store.openDataDetails = false"
                            class="flex-shrink-0 btn btn-ghost-primary btn-close flex-shrink-0"></b-link>
                  </div>
                  <b-list-group v-if="!isChild">
                    <b-list-group-item
                      class="list-group-item-action d-flex align-items-center border mb-2 cursor-pointer"
                      style="border-radius: 4px" @click="detailFolder={}"
                      :class="{'active' : !detailFolder.id}">
                    <span class="flex-grow-1 align-self-center">
                      <i class="ri-folder-2-fill text-warning align-middle me-2 fs-15"></i>Tất cả
                    </span>
                      <p class="flex-shrink-0 mb-1">{{ store.listFolders.length }}</p>
                    </b-list-group-item>
                    <b-list-group-item
                      class="list-group-item-action d-flex align-items-center border mb-2 cursor-pointer"
                      style="border-radius: 4px" v-for="item in store.listFolders" :key="item.id"
                      @click="handleGetDetail(item)" :class="{'active' : detailFolder.id === item.id}">
                    <span class="flex-grow-1 align-self-center">
                      <i class="ri-folder-2-fill text-warning align-middle me-2 fs-15"></i>{{ item.name }}
                    </span>
                      <p class="flex-shrink-0 mb-1">{{ item.children.length }}</p>
                    </b-list-group-item>
                  </b-list-group>
                  <b-list-group v-else class="mt-2">
                    <b-list-group-item href="#" class="list-group-item-action d-flex align-items-center border mb-2"
                                       style="border-radius: 4px" v-for="item in detailFolder.children" :key="item.id"
                                       @click="item.type==='folder' ? getDetailFolder(item) : openDataDetails(item.id)"
                                       :class="{'active' : store.modelId === item.id}">
                    <span v-if="item.type==='folder'" class="flex-grow-1 align-self-center">
                      <i class="ri-folder-2-fill text-warning align-middle me-2 fs-15"></i>{{ item.name }}
                    </span>
                      <span v-else class="flex-grow-1 align-self-center">
                      <i class="ri-table-line align-middle me-2 fs-15"
                         :class="store.modelId !== item.id ? 'text-info' : 'text-white'"></i>{{ item.name_display }}
                    </span>
                    </b-list-group-item>
                  </b-list-group>
                </div>
              </ul>
            </b-card-body>
          </b-card>
        </div>
        <div class="resizer" id="dragMe" @mousedown="mouseDownHandle($event)" @mouseup="mouseUpHandler($event)"></div>
        <div class="content-container" ref="rightContent">
          <TabDetailsClassData v-if="store.openDataDetails" isMining>
            <template #button_showmap>
              <div class="w-100 my-2 text-end">
                <router-link :to="{ name: `${store.slug}MapMiningPage`, params: { miningId: store.modelId } }"
                             type="button" target="_blank"
                             class="btn btn-primary ms-1">
                  <i class="ri-external-link-fill me-1 align-bottom"></i>Chi tiết
                </router-link>
              </div>
            </template>
          </TabDetailsClassData>
          <b-card no-body v-else>
            <b-card-body>
              <div v-if="detailFolder.id">
                <div class="w-100 text-center" v-if="detailFolder.children.length < 1">Không tìm thấy dữ liệu!</div>
                <b-row v-else>
                  <b-col md="3" v-for="item in detailFolder.children" :key="item.id" class="mb-3">
                    <b-card no-body class="shadow-none border">
                      <b-card-body @click="item.type==='folder' ? getDetailFolder(item) : openDataDetails(item.id)">
                        <div class="text-center cursor-pointer" v-if="item.type === `folder`">
                          <div class="mb-2">
                            <i class="ri-folder-2-fill text-warning align-bottom display-4"></i>
                          </div>
                          <h6 class="fs-13 folder-name">{{ item.name }}</h6>
                        </div>
                        <div class="text-center cursor-pointer" v-else>
                          <div class="mb-2">
                            <i class="ri-table-line text-info align-bottom display-4"></i>
                          </div>
                          <h6 class="fs-13 folder-name">{{ item.name_display }}</h6>
                        </div>
                      </b-card-body>
                      <b-card-footer class="p-2">
                        <div class="align-items-center d-flex">
                          <div class="flex-grow-1 d-flex gap-2">
                            <b-link type="button"
                                    @click="item.type==='folder' ? getDetailFolder(item) : openDataDetails(item.id)"
                                    class="btn btn-soft-info" v-b-tooltip.hover title="Thông tin">
                              <i class="ri-information-line"></i>
                            </b-link>
                          </div>
                          <div>
                            <router-link type="button" v-b-tooltip.hover title="Xem bản đồ" target="_blank"
                                         :to="{ name: `${store.slug}MapMiningPage`, params: { miningId: item.id} }"
                                         class="btn btn-soft-info"><i class=" ri-map-2-line"></i>
                            </router-link>
                          </div>
                        </div>
                      </b-card-footer>
                    </b-card>
                  </b-col>
                </b-row>
              </div>
              <div v-else>
                <b-row>
                  <b-col md="3" v-for="item in store.listFolders" :key="item.id" class="mb-3"
                         @click="handleGetDetail(item)">
                    <b-card no-body class="shadow-none border">
                      <b-card-body>
                        <div class="text-center cursor-pointer">
                          <div class="mb-2">
                            <i class="ri-folder-2-fill text-warning align-bottom display-4"></i>
                          </div>
                          <h6 class="fs-13 folder-name">{{ item.name }}</h6>
                        </div>
                      </b-card-body>
                      <b-card-footer class="p-2">
                        <div class="align-items-center d-flex">
                          <div class="flex-grow-1 d-flex gap-2">
                            <b-link type="button"
                                    @click="item.type==='folder' ? getDetailFolder(item) : openDataDetails(item.id)"
                                    class="btn btn-soft-info" v-b-tooltip.hover title="Thông tin">
                              <i class="ri-information-line"></i>
                            </b-link>
                          </div>
                          <div>
                            <router-link type="button" v-b-tooltip.hover title="Xem bản đồ" target="_blank"
                                         @click.stop="item.type==='folder' ? getDetailFolder(item) : openDataDetails(item.id)"
                                         :to="{ name: `${store.slug}MapMiningFolderPage`, params: { folderId: item.id} }"
                                         class="btn btn-soft-info"><i class=" ri-map-2-line"></i>
                            </router-link>
                          </div>
                        </div>
                      </b-card-footer>
                    </b-card>
                  </b-col>
                </b-row>
              </div>
            </b-card-body>
          </b-card>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick, defineProps, provide, defineEmits} from "vue";
import DynamicContentFolder from "../../components/accordion/DynamicContentFolder.vue";
import apiRequest from "../../helpers/api/folderApi";
import FolderRightMenu from "../../components/accordion/FolderRightMenu.vue";
import TreeItem from "../../components/accordion/FolderTreeComponent.vue";
import CreateNewFolder from "../../components/manage-data/CreateNewFolder.vue";
import ModalDataClass from "../../components/manage-data/ModalDataClass.vue";
import FolderHeaderBar from "../../components/FolderHeaderBar.vue";
import Layout from "../../layouts/main.vue";
import {useFolderStore} from "../../state/folder";
import TabDetailsClassData from "../../components/manage-data/TabDetailsClassData.vue";
import MenuBarContainSearch from "../../components/manage-data/MenuBarContainSearch.vue";
import ImportModelForm from "../../components/manage-data/ImportModelForm.vue";
import PageHeader from "../../components/page-header.vue";
import Search from "../../components/Search.vue";
import ModalDataCopy from "../../components/manage-data/ModalDataCopy.vue";
import http from "../../helpers/api/axiosHttp";
import debounce from 'lodash';

const sidebarLeft = ref();
const rightContent = ref();
let leftSidebarWidth = ref(0);
const fileImportModel = ref(null);
const x = ref(0);
const y = ref(0);
const dx = ref(0);
const dy = ref(0);
const containerContent = ref();
const searchVal = ref("");
const searchFolderId = ref("");
const allLayer = ref([]);
const isChild = ref(false);
const pinFolders = ref([]);
const detailFolder = ref({});
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

const address = ref({
  title: props.nameKCN,
  details: [{name: "Khai thác dữ liệu", to: `${props.slug}MiningPage`}],
});

const handleGetDetail = async (item) => {
  detailFolder.value = item;
  store.openDataDetails = false;
}

const handleSearch = async () => {
  const list = await http.get(`${store.slug}/layer/?folder=${searchFolderId.value}&q=${searchVal.value}`);
  allLayer.value = list.data.results;
}

const emit = defineEmits(['update-folder-data']);

function getDetailFolder(child) {
  emit('update-folder-data', child.children);
}

function openDataDetails(id) {
  store.modelId = id;
  store.openDataDetails = true;
  isChild.value = true;
}

const store = useFolderStore();
store.getSlug();

function handleGetDetailChild(value) {
  store.primaryFolder = value.children;
  store.currentFolder = value.id;
}

function updateFolderData(data) {
  store.primaryFolder = data;
}

function onFileChange(e) {
  var files = e.target.files || e.dataTransfer.files;
  if (!files.length) return;
  fileImportModel.value(files[0]);
}

function postModel() {
  const {data} = apiRequest.post();
}

function mouseMoveHandle(event) {
  dx.value = event.clientX - x.value;
  dy.value = event.clientY - y.value;

  let newWidth =
    ((leftSidebarWidth.value + dx.value) * 100) /
    containerContent.value.getBoundingClientRect().width;
  if (newWidth >= 70) {
    newWidth = 70;
  }

  if (newWidth <= 20) {
    newWidth = 20;
  }
  sidebarLeft.value.style.width = `${newWidth}%`;
  rightContent.value.style.width = `${100 - newWidth - 0.4}%`;
}

function mouseUpHandler() {
  // Remove the handlers of `mousemove` and `mouseup`
  document.removeEventListener("mousemove", mouseMoveHandle);
  document.removeEventListener("mouseup", mouseUpHandler);
}

async function getAllPinFolder() {
  const {data} = await apiRequest.getAllPin();
  pinFolders.value = data.results;
}

const mouseDownHandle = function (e) {
  // Get the current mouse position
  x.value = e.clientX;
  y.value = e.clientY;
  leftSidebarWidth.value = sidebarLeft.value.getBoundingClientRect().width;

  // Attach the listeners to `document`
  document.addEventListener("mousemove", mouseMoveHandle);
  document.addEventListener("mouseup", mouseUpHandler);
};

onMounted(() => {
  document.addEventListener("mousedown", function (event) {
    if (!event.target.classList.contains("folder__right-item")) {
      if (event.which === 1) {
        store.showRightmenu = false;
      }
    }
  });
  store.openDataDetails = false
  store.getAllFolder();
  allLayer.value = store.primaryFolder;
});

</script>
<style scoped>
.list-group-item-action.d-flex.active {
  background-color: #299cdb;
}
</style>

