<template>
  <Layout :address="address" :items="address.details" chooseMenu="du-lieu" :slug="props.slug">
    <div class="manage-database">
      <FolderHeaderBar>
        <template #add_button>
          <b-col xl="2">
            <b-dropdown variant="light">
              <template #button-content>
                <i class="mdi mdi-plus"></i>
                <span class="mx-1">Thêm</span>
                <i class="mdi mdi-chevron-down"></i>
              </template>
              <b-dropdown-item @click="store.clickToAddFolder = true; store.openDataDetails = false">
                <i class="mdi mdi-folder fs-14" style="color: #f7b84b"></i>
                <span class="mx-2">Thư mục</span>
              </b-dropdown-item>
              <b-dropdown-item v-if="store.currentFolder !== ''">
                <div data-bs-toggle="modal" data-bs-target="#modalAddModelForm" class="d-flex align-items-center">
                  <i class="ri-table-line fs-14 align-middle text-info" style="color: #f7b84b"></i>
                  <span class="mx-2">Lớp dữ liệu</span>
                </div>
              </b-dropdown-item>
              <b-dropdown-item v-if="store.currentFolder !== ''">
                <div data-bs-toggle="modal" data-bs-target="#modalAddModalFormCopy" class="d-flex align-items-center">
                  <i class="ri-table-line fs-14 align-middle text-info" style="color: #f7b84b"></i>
                  <span class="mx-2">Lớp dữ liệu copy</span>
                </div>
              </b-dropdown-item>
              <b-dropdown-item v-if="store.currentFolder !== ''">
                <div data-bs-toggle="modal" data-bs-target="#modalImportModelFile" class="d-flex align-items-center">
                  <i class="mdi mdi-file fs-14" style="color: #ff7b00"></i>
                  <span class="mx-2">Import file</span>
                </div>
              </b-dropdown-item>
            </b-dropdown>
          </b-col>
        </template>
        <template #input_search>
          <div class="search-group">
            <select name="" id="" class="form-select" v-model="searchOption">
              <option value="" selected disabled>Tìm kiếm theo</option>
              <option value="all">Tất cả</option>
              <option value="folder">Folder</option>
            </select>
            <div data-input-flag data-option-flag-name :class="{ hide: searchOption !== 'folder' }" class="me-3">
              <input type="text" class="form-control" readonly :placeholder="folderName === '' ? 'Mời chọn folder' : folderName
                " data-bs-toggle="dropdown" aria-expanded="false" />
              <div class="dropdown-menu w-100">
                <div class="p-2 px-3 pt-1 searchlist-input">
                  <Search @get-search-data="getSearchFolder" :api-url="`${store.slug}/folder/?`" />
                </div>
                <ul class="list-unstyled dropdown-menu-list mb-0">
                  <li class="dropdown-item d-flex" v-for="(item, index) in allFolder" :key="index">
                    <a href="#" @click="handleFolderSearch(item.id, item.name)">
                      <i class="mdi mdi-folder me-2" style="color: #f7b84b"></i>
                      <span class="d-inline-block">{{ item.name }}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <Search @get-search-data="getSearchValue"
              :api-url="searchOption === 'all' ? `${store.slug}/layer/?` : `${store.slug}/layer/?folder=${searchFolderId}&`" />
          </div>
        </template>
      </FolderHeaderBar>
      <!--            <MenuBarContainSearch>
                    <template #input_search>
                      <b-col>
                        <div class="breadcrumbs">
                    <div class="breadcrumbs-input">
                      <b-form-input
                        squared
                        class="form-control"
                        placeholder="Dữ liệu"
                      ></b-form-input>
                      <b-button squared variant="outline" class="btn-down">
                        <i class="mdi mdi-chevron-down"></i>
                      </b-button>
                    </div>
                    <div class="btn-reload">
                      <b-button squared variant="outline">
                        <i class="mdi mdi-replay"></i>
                      </b-button>
                    </div>
                  </div>
                      </b-col>
                      <b-col cols="3">
                        <div class="search-box">
                          <Search />
                          <i class="ri-search-line search-icon"></i>
                        </div>
                      </b-col>
                    </template>
                  </MenuBarContainSearch>-->
      <div class="page-main__content" ref="containerContent">
        <div class="sidebar" ref="sidebarLeft">
          <b-card no-body>
            <b-card-body>
              <ul class="left-sidebar">
                <h3 class="left__sidebar-heading">Dữ liệu khu công nghiệp</h3>
                <FolderRightMenu :current-el-id="store.currentId" :current-type="store.currentType" />
                <TreeItem class="item-folder" @get-detail-child="handleGetDetailChild"
                  :class="{ 'no-child': item.children.length === 0 }" v-for="(item, index) in store.listFolders"
                  :model="item" :key="index" />
              </ul>
            </b-card-body>
          </b-card>
        </div>
        <div class="resizer" id="dragMe" @mousedown="mouseDownHandle($event)" @mouseup="mouseUpHandler($event)"></div>
        <div class="content-container" ref="rightContent">
          <TabDetailsClassData v-if="store.openDataDetails" :current-id="store.folderId" />
          <b-card no-body v-else>
            <b-card-body class="px-4 py-3">
              <h3 class="content-heading">{{ store.dataPath }}</h3>
              <div class="flex-shrink-0 card__header--bottom pb-3">
                <ul
                  class="nav nav-tabs-custom rounded card-header-tabs border-bottom-0 nav__menu--bar-tabs justify-content-start"
                  role="tablist">
                  <li class="nav-item">
                    <b-link class="nav-link active" data-bs-toggle="tab" href="#layer" role="tab" data-type="layer">
                      Lớp dữ liệu
                    </b-link>
                  </li>
                  <li class="nav-item" v-if="store.allowSetRoles && store.errorMessage !== 'Không có quyền truy cập.'">
                    <b-link class="nav-link" data-bs-toggle="tab" href="#folderRole" role="tab">
                      Phân quyền
                    </b-link>
                  </li>
                </ul>
              </div>
              <div class="tab-content text-muted">
                <TabLayerContent />
                <div class="tab-pane" id="folderRole" role="tabpanel">
                  <AddUserMangeFolder />
                </div>
              </div>
            </b-card-body>
          </b-card>
        </div>
      </div>
    </div>
    <ImportModelForm />
  </Layout>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, defineProps, provide } from "vue";
import apiRequest from "../../helpers/api/folderApi";
import FolderRightMenu from "../../components/accordion/FolderRightMenu.vue";
import TreeItem from "../../components/accordion/FolderTreeComponent.vue";
import FolderHeaderBar from "../../components/FolderHeaderBar.vue";
import Layout from "../../layouts/main.vue";
import { useFolderStore } from "../../state/folder";
import TabDetailsClassData from "../../components/manage-data/TabDetailsClassData.vue";
import ImportModelForm from "../../components/manage-data/ImportModelForm.vue";
import Search from "../../components/Search.vue";
import TabLayerContent from "../../components/manage-data/TabLayerContent.vue";
import AddUserMangeFolder from "../../components/manage-data/AddUserMangeFolder.vue";
const store = useFolderStore();
const sidebarLeft = ref();
const rightContent = ref();
let leftSidebarWidth = ref(0);
const allFolder = ref([]);
const searchFolderId = ref("");
const x = ref(0);
const y = ref(0);
const dx = ref(0);
const dy = ref(0);
const containerContent = ref();
const pinFolders = ref([]);
const folderName = ref("");
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
  details: [{ name: "Quản lý thư mục", to: `${props.slug}ManageDataPage` }],
});

const searchOption = ref("");
store.getSlug();

function handleGetDetailChild(value) {
  store.primaryFolder = value.children;
  store.currentFolder = value.id;
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
  const { data } = await apiRequest.getAllPin();
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

const getSearchValue = (value) => {
  store.primaryFolder = value.results;
};

const getSearchFolder = (value) => {
  allFolder.value = value;
};

const handleFolderSearch = (id, name) => {
  searchFolderId.value = id;
  folderName.value = name;
};


onMounted(async () => {
  document.addEventListener("mousedown", function (event) {
    if (!event.target.classList.contains("folder__right-item")) {
      if (event.which === 1) {
        store.showRightmenu = false;
      }
    }
  });

  await store.getAllFolder();
  //set all folder
  allFolder.value = store.listFolders;

  // cancel add new folder and click outside to go out folder 

  const btnFolders = document.querySelectorAll('.btn-folder');
  const headerBar = document.querySelector('.manage__header--bar');
  const lefSidebar = document.querySelector('.left-sidebar');
  const navMenu = document.querySelector('.nav__menu--bar-tabs')
  const mainContent = document.querySelector('.main-folder__content')
  document.addEventListener('click', function (event) {
    const tabBar = document.querySelectorAll('.nav__menu--bar-tabs .nav-item .nav-link');

    const inputCreateFolder = document.querySelector('.new-folder-name');
    var target = event.target || event.srcElement || event.currentTarget;
    const isClickNavBar = navMenu &&  navMenu.contains(target);
    // const isClickTabBar = tabBar &&  tabBar.contains(target);
    const isClickHeaderBar = headerBar &&  headerBar.contains(target);
    const isClickLeftBar = lefSidebar &&  lefSidebar.contains(target);
    const isClickMainContent = mainContent &&  mainContent.contains(target);
    const isClickinputCreateFolder = inputCreateFolder && inputCreateFolder.contains(target);
    if(tabBar) {
      for (let index = 0; index < tabBar.length; index++) {
        const element = tabBar[index];
        if(element.contains(target)) {
          return;
        }
      }
    } 

    if (isClickHeaderBar || isClickinputCreateFolder || isClickLeftBar || isClickMainContent|| isClickNavBar) {
      return;
    } else {
      for (let i = 0; i < btnFolders.length; i++) {
        btnFolders[i].classList.remove('active');
        btnFolders[i].nextElementSibling.classList.remove('show')
      }
      store.currentFolder = '';
      store.primaryFolder = [];
      store.allowSetRoles = true;
      store.dataPath = '';
    }

    if (event.target.parentElement.classList.contains('form-group') || event.target.classList.contains('form-group')) {
      return;
    } else {
      store.clickToAddFolder = false;
    }
 
  });

});
</script>
