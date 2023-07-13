<script setup>
import { ref, onMounted, onUnmounted, defineProps } from "vue";

import { usePublicLayerStore } from "../../../../../state/map_control/publicLayer";
import { useCommonStore } from "../../../../../state/common";
import { useTileLayerStore } from "../../../../../state/map_control/publicLayer";

const publicLayerStore = usePublicLayerStore();
const tileLayerStore = useTileLayerStore()
const comonStore = useCommonStore()
const props = defineProps({
  layerInfo: {},
});

const setMore = function (name, class_icon, handle_function) {
  return {
    name: name,
    icon: class_icon,
    handle: handle_function,
  };
};

const showMenuMore = ref(false);
const IConShow = ref(null);
const handleClickShowMenuMore = function () {
  showMenuMore.value = true;
};

const menuMore = ref([
  setMore("Phóng tới", "mdi mdi-map-search-outline", () => {
    tileLayerStore.zoomToLayerOverlay(props.layerInfo)
  }),
  setMore("Xem thông tin", "ri-information-line", () => {
    publicLayerStore.selectedLayer = props.layerInfo;
    publicLayerStore.modalShowType = 1;
    publicLayerStore.getLayerStructor();
    comonStore.showModal = true;
  }),
  setMore("Bảng dữ liệu", "ri-table-fill", () => {
    publicLayerStore.selectedLayer = props.layerInfo;
    publicLayerStore.modalShowType = 0;
    publicLayerStore.getLayerStructor();
    comonStore.showModal = true;
  }),
]);

function handleClickMenu(item) {
  item.handle()
  showMenuMore.value = !showMenuMore.value;
}

onMounted(() => {
  window.addEventListener("click", (event) => {
    if (event.srcElement === IConShow.value) return;
    showMenuMore.value = false;
  });
});

onUnmounted(() => {
  window.removeEventListener("click", () => { });
});
</script>

<template>
  <div class="position-relative d-flex align-items-center justify-content-center" style="width: 48px">
    <i :title="
      props.layerInfo.description
        ? `${props.layerInfo.description.substring(0, 100)} ...`
        : 'Thông tin mô tả lớp dữ liệu'
    " class="ri-information-line text-muted fs-16 align-middle me-1 cursor-pointer"></i>
    <i ref="IConShow" @click="handleClickShowMenuMore"
      class="ri-more-2-fill text-muted fs-16 align-middle me-1 cursor-pointer"></i>
    <div v-if="showMenuMore" @click.stop="" class="position-absolute m-0" style="
              top: 25px; 
              right: 0;
              background: #fff;
              box-shadow: 0 5px 10px #1e20251f;
              z-index: 2; 
            ">
      <div v-for="(item, index) in menuMore" :key="index"
        class="d-flex gap-2 align-items-center hover-bg px-2 cursor-pointer" @click="handleClickMenu(item)">
        <i :class="item.icon" class="text-muted fs-16 align-middle me-1"></i>
        <span class="ellipsis">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>