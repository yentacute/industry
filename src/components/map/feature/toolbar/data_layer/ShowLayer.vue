<script setup>
import { defineProps, ref, onMounted, computed } from "vue";
import FeatureMoreInLayer from "./FeatureMoreInLayer.vue";
import {
  useTileLayerStore,
  usePublicLayerStore,
} from "../../../../../state/map_control/publicLayer";
import { useRoute } from "vue-router";
import { warningToast } from "../../../../../helpers/api/toastStyle";
import http from "../../../../../helpers/api/common";

const tileLayerStore = useTileLayerStore();
const publicLayerStore = usePublicLayerStore();
const route = useRoute();
const searchQuery = ref("");

const props = defineProps({
  group: {
    type: Object,
    default: function () {
      return {};
    },
  },
});
const show = ref(true);
const layerShowCounter = ref(0);

const handleClickToggleShow = function () {
  show.value = !show.value;
};

const handleLayerShowChange = function (layer) {
  // hieubx: Hàm này sửa một chút phục vụ trang khai thác dữ liệu đã kiểm tra trên trang bản đồ công khai và không lỗi
  const isOverlay = document.getElementById(`${layer.id}layer`);
  if (isOverlay.checked === false) {
    tileLayerStore.removeLayerOverlay(layer);
    layerShowCounter.value--;
    return;
  }
  if (layerShowCounter.value > 5 && route.params.folderId) {
    warningToast("Chỉ được bật tối đa 6 lớp");
    isOverlay.checked = false;
    return;
  }
  isOverlay.checked;
  layerShowCounter.value++;
  tileLayerStore.addlayerToOverlay(layer);
};

const counterLayerOnShow = function () {
  layerShowCounter.value = 0;
  props.group.layers.forEach((layer) => {
    if (layer.actice) layerShowCounter.value++;
  });
};
const handleOpenLayer = function () {
  tileLayerStore.removeAllLayerShowTile();
  if (props.group.layers.length > 0) {
    props.group.layers.forEach((item) => (item.actice = true));
  }
  tileLayerStore.openALlLayer(publicLayerStore.groupLayers[0]);
  counterLayerOnShow();
};

const filteredItems = computed(() => {
  return props.group.layers.filter((item) => {
    return http
      .toNonAccentVietnamese(item.name_display.toLowerCase())
      .includes(http.toNonAccentVietnamese(searchQuery.value.toLowerCase()));
  });
});

const handleRemoveAllLayer = function () {
  if (props.group.layers.length > 0) {
    props.group.layers.forEach((item) => (item.actice = false));
  }
  tileLayerStore.removeAllLayerShowTile();
  counterLayerOnShow();
};

// Xử lý phần này thì bị lỗi không xóa được layer hoặc add quá nhiều layer
onMounted(() => {
  tileLayerStore.layersShowTile.forEach((layerTile) => {
    props.group.layers.forEach((layer, index) => {
      if (layer.id == layerTile.id) {
        props.group.layers[index].actice = true;
      }
    });
  });
  counterLayerOnShow();
});
</script>

<template>
  <div class="w-100">
    <div
      class="search-box search-box-sm d-flex mb-2"
      v-if="route.params.folderId"
    >
      <input
        type="text"
        class="form-control"
        placeholder="Tìm kiếm..."
        v-model="searchQuery"
      />
      <i class="ri-search-line search-icon"></i>
    </div>
    <div
      class="card h-100"
      style="margin-bottom: 12px; border: 1px solid #299cdb"
    >
      <div
        :class="{ 'text-bg-light': !show }"
        class="card-head px-2 head-show text-bg-primary"
        @click="handleClickToggleShow"
      >
        <div class="d-flex align-items-center">
          <!-- <span class="text-bg-danger d-flex justify-content-center align-content-center" data-v-3145da97=""
              style="height: 12px; width: 12px; border-radius: 50%;"><span data-v-3145da97=""
                style="line-height: 12px; font-size: 8px;">{{ layerShowCounter }}</span></span> -->
          <span class="fs-10 badge rounded-pill bg-danger">{{
            layerShowCounter
          }}</span>
          <h6
            :class="{ 'text-white': show }"
            class="card-title mb-0 ellipsis fs-14 ms-2"
          >
            {{ props.group.name }}
          </h6>
        </div>
        <i
          class="ri-arrow-down-s-line fs-18"
          style="transition: all linear 0.3s"
          :class="{ rotage: !show }"
        ></i>
      </div>
      <div class="card-body px-2 py-1" v-if="show">
        <ul>
          <li
            v-for="(item, index) in filteredItems"
            :key="index"
            class="form-check form-switch d-flex gap-3 align-items-center hover-bg"
            style="line-height: 28px; border-radius: 4px"
          >
            <div class="w-100 d-flex align-items-center gap-2">
              <input
                v-model="item.actice"
                class="form-check-input"
                type="checkbox"
                role="switch"
                :id="item.id + 'layer'"
                @change="handleLayerShowChange(item)"
              />
              <label class="form-check-label ellipsis" :for="item.id + 'layer'">
                {{ item.name_display }}
              </label>
            </div>
            <FeatureMoreInLayer :layerInfo="item"></FeatureMoreInLayer>
          </li>
        </ul>
        <div class="w-100 text-center my-3" v-if="route.params.folderId">
          <button
            type="button"
            class="btn btn-ghost-info btn-sm btn-rounded px-2 custom-toggle"
            data-bs-toggle="button"
          >
            <span class="icon-on" @click="handleOpenLayer()">Mở toàn bộ</span>
            <span class="icon-off" @click="handleRemoveAllLayer()"
              >Đóng toàn bộ</span
            >
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.head-show {
  line-height: 38px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.rotage {
  transform: rotate(180deg);
}
</style>
