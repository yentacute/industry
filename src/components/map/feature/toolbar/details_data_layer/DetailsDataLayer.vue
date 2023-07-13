<!-- Mỗi một chức năng sẽ viết riêng theo component 
Phần này được đặt trong Head -->

<script>
import LayoutRightNavBarVue from "../LayoutRightNavBar.vue";
import ShowDataLayer from "./ShowDataLayer.vue";
import { useTileLayerStore } from "../../../../../state/map_control/publicLayer.js";

export default {
  data: function () {
    return {
      show: false,
    };
  },
  setup: function () {
    const tileLayerStore = useTileLayerStore();
    return { tileLayerStore };
  },
  components: { LayoutRightNavBarVue, ShowDataLayer },
  mounted: function () {},
  methods: {
    setView: function () {
      this.show = true;
      this.$router.push({ name: "MapDetailsLayer" });
    },
    handleClose: function () {
      this.tileLayerStore.resetAllMapDetail();
      this.show = false;
      this.$router.push({ name: "MapControl" });
    },
  },
};
</script>

<template>
  <div v-if="show">
    <LayoutRightNavBarVue>
      <div class="card h-100">
        <div class="card-header py-2 mt-1">
          <button
            type="button"
            class="btn-close float-end fs-12 ms-2"
            @click="handleClose"
          ></button>
          <h6 class="card-title mb-0 ellipsis fs-14">Chi tiết lớp dữ liệu</h6>
        </div>
        <div class="card-body hover-overflowY-scroll">
          <ShowDataLayer
            v-for="item in tileLayerStore.detailLayerMap"
            :key="item"
            :detailLayer="item"
          ></ShowDataLayer>
        </div>
      </div>
    </LayoutRightNavBarVue>
  </div>
</template>
