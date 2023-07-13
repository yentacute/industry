<template>
    <Layout :address="address" :items="address.details" chooseMenu="hoat-dong" :slug="props.slug">
      <div class="manage-database">
        <!-- <FolderHeaderBar>
        </FolderHeaderBar> -->
        
        <div class="page-main__content" ref="containerContent">
          <div class="sidebar" ref="sidebarLeft">
            <b-card no-body>
              <b-card-body>
                <ul class="left-sidebar">
                  <TreeItem class="item-folder" @get-detail-child="handleGetDetailChild"
                    :class="{ 'no-child': item.children.length === 0 }" v-for="(item, index) in store.listFolders"
                    :model="item" :key="index"/>
                </ul>
              </b-card-body>
            </b-card>
          </div>
          <div class="resizer" id="dragMe" @mousedown="mouseDownHandle($event)" @mouseup="mouseUpHandler($event)"></div>
          <div class="content-container" ref="rightContent">
            <TabActivities v-if="store.openDataDetails" :current-id="store.folderId" />
            <b-card no-body v-else>
              <b-card-body class="p-4">
                <div class="header-bar">
                  <div class="name">Tên</div>
                  <div class="date">Ngày tạo</div>
                  <div class="type">Loại</div>
                </div>
                <ul class="main-folder__content" :class="{ 'row-lists': store.viewMode }">
                  <DynamicContentFolder v-if="store.primaryFolder.length" :folder-data="store.primaryFolder"
                    @update-folder-data="updateFolderData" />
                  <span v-else class="d-block text-center m-2" style="color: var(--vz-vertical-menu-item-color)">Folder
                    trống</span>
                </ul>
              </b-card-body>
            </b-card>
          </div>
        </div>
      </div>
    </Layout>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, nextTick, defineProps, provide } from "vue";
  import DynamicContentFolder from "../../components/accordion/DynamicContentFolder.vue";
  import apiRequest from "../../helpers/api/folderApi";
  import TreeItem from "../../components/accordion/FolderTreeComponent.vue";
  import Layout from "../../layouts/main.vue";
  import { useFolderStore } from "../../state/folder";
  import TabActivities from "../../components/manage-activities/TabActivities.vue";
  import Search from "../../components/Search.vue";
  
  const sidebarLeft = ref();
  const rightContent = ref();
  let leftSidebarWidth = ref(0);
  const fileImportModel = ref(null);
  const x = ref(0);
  const y = ref(0);
  const dx = ref(0);
  const dy = ref(0);
  const containerContent = ref();
  const pinFolders = ref([]);
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
    details: [{ name: "Quản lý hoạt động", to: `${props.slug}ManageActivities` }],
  });
  
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
    const { data } = apiRequest.post();
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
  
  onMounted(() => {
    document.addEventListener("mousedown", function (event) {
      if (!event.target.classList.contains("folder__right-item")) {
        if (event.which === 1) {
          store.showRightmenu = false;
        }
      }
    });
  
    store.getAllFolder();
  });
  </script>
  