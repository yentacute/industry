<!-- Mỗi một chức năng sẽ viết riêng theo component 
Phần này được đặt trong MapControl -->

<script>
import { onMounted } from "vue";
import LayoutNavbar from "../LayoutNavbar.vue";
import ShowLayer from "./ShowLayer.vue";
import ZIndexState from "../../../../../utils/zIndexState.js";
import { usePublicLayerStore } from "../../../../../state/map_control/publicLayer";

export default {
  props: {
    componentStyleLayer: {
      type: Boolean,
      default: false,
    }
  },
  data: function () {
    return {
      show: false
    };
  },
  setup() {
    const publicLayerStore = usePublicLayerStore();
    // publicLayerStore.getAllLayersPublic();
    const zIndexState = new ZIndexState("data-layer");
    const { zIndex } = zIndexState.getState();

    onMounted(() => {});

    return { zIndex, publicLayerStore };
  },
  mounted: function () {
    this.show = this.componentStyleLayer;
  },
  components: { LayoutNavbar, ShowLayer },
  methods: {
    setView: function () {
      this.$router.replace({ name: "MapDataLayer F" });
      this.show = true;
    },
    handleClose: function () {
      this.$refs.tableShow.handleClose();
      this.show = false;
      this.$router.replace({ name: "MapControl" });
    },
  },
};
</script>

<template>
  <div v-if="show">
    <template v-if="!componentStyleLayer">
      <LayoutNavbar :z-index="zIndex">
        <div class="card h-100">
          <div class="card-header py-2 mt-1">
            <button
              type="button"
              class="btn-close float-end fs-12 ms-2"
              @click="handleClose"
            ></button>
            <h6 class="card-title mb-0 ellipsis fs-14">Lớp dữ liệu</h6>
          </div>
          <div
            v-if="publicLayerStore.groupLayers.length"
            class="card-body h-100 hover-overflowY-scroll"
          >
            <ShowLayer
              v-for="item in publicLayerStore.groupLayers"
              :key="item"
              :group="item"
            ></ShowLayer>
          </div>
          <div v-else>Không có lớp dữ liệu nào!</div>
        </div>
      </LayoutNavbar>
    </template>
    <template v-else>
      <div class="h-100" v-if="publicLayerStore.groupLayers.length">
        <ShowLayer
          v-for="item in publicLayerStore.groupLayers"
          :key="item"
          :group="item"
        ></ShowLayer>
      </div>
      <div v-else>Không có lớp dữ liệu nào!</div>
    </template>
    <ShowModalDetail ref="tableShow" :layer-id="myName"> </ShowModalDetail>
  </div>
  </template>
