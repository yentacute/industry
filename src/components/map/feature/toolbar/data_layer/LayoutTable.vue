<script>
import { useCommonStore } from "../../../../../state/common";

export default {
  setup: function () {
    const comonStore = useCommonStore();
    return { comonStore };
  },
  data: function () {
    return {
      hidden: false,
    };
  },
  mounted: function () {
  },
  methods: {
    setview: function () {
      this.comonStore.showModal = true;
    },
    handleClose: function () {
      this.comonStore.showModal = false;
    },
    handleHidden: function () {
      this.hidden = true;
    },
    handleVisibility: function () {
      this.hidden = false;
    },
  },
};
</script>

<template>
  <Teleport to="body">
    <div
      v-if="comonStore.showModal"
      class="show-table-data-layer"
      :class="{ 'hidden-layout-custom': hidden }"
    >
      <div
        :class="{ 'd-none': hidden }"
        class="row h-100 pb-3 position-relative"
      >
        <slot></slot>
      </div>
      <div
        @click="handleVisibility"
        class="d-flex justify-content-center align-items-center cursor-pointer"
        v-if="hidden"
      >
        <i class="fs-20 ri-arrow-right-s-fill"></i>
      </div></div
  ></Teleport>
</template>

<style scoped>
.show-table-data-layer {
  position: fixed;
  bottom: 114px;
  left: 400px;
  height: 40vh;
  background: #fff;
  border-radius: 4px;
  margin-left: 8px;
  right: 8px;
  overflow: hidden;
  border-bottom: 6px solid #fff;
}
.hidden-layout-custom {
  height: 30px !important;
  width: 30px !important;
}
</style>
