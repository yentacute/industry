<template>
  <div class="tab-pane h-100 active" id="layer" role="tabpanel">
    <div class="header-bar mt-2">
      <div class="name">Tên</div>
      <div class="date">Ngày tạo</div>
      <div class="type">Loại</div>
    </div>
    <ul class="main-folder__content" :class="{ 'row-lists': store.viewMode }">
      <DynamicContentFolder
        v-if="store.primaryFolder.length"
        :folder-data="store.primaryFolder"
        @update-folder-data="updateFolderData"
      />
      <span
        v-else
        class="d-block text-center m-2"
        style="color: var(--vz-vertical-menu-item-color)"
        >Folder trống</span
      >
      <CreateNewFolder v-if="store.clickToAddFolder" />
      <ModalDataClass :folder-id="store.currentFolder" />
      <ModalDataCopy :folder-id="store.currentFolder" />
    </ul>
  </div>
</template>

<script setup>
import { useFolderStore } from "../../state/folder";
import DynamicContentFolder from "../accordion/DynamicContentFolder.vue";
import CreateNewFolder from "./CreateNewFolder.vue";
import ModalDataClass from "./ModalDataClass.vue";
import ModalDataCopy from "./ModalDataCopy.vue";
const store = useFolderStore();
function updateFolderData(data) {
  store.primaryFolder = data;
}
</script>
