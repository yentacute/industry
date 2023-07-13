<script>
import { reactive, toRefs, inject } from "vue";
import LayoutNavbarVue from "./LayoutNavbar.vue";
import ZIndexState from "../../../../utils/zIndexState.js";
import DEDataLayer from "./style_layer/DEDataLayer.vue";

export default {
  setup: function () {
    const ZzIndexState = new ZIndexState("show-de");
    const { zIndex } = ZzIndexState.getState();

    const data = reactive({
      show: false,
    });
    const methodMap = inject("draw-map");

    return { zIndex, ...toRefs(data), ...methodMap };
  },
  components: {
    LayoutNavbarVue,
    DEDataLayer,
  },
  methods: {
    setView: function () {
      this.show = true;
      this.$router.replace({ name: "MapShowDe" });
    },
    handleClose: function () {
      this.show = false;
      this.$router.replace({ name: "MapControl" });
    },
    handleClickLocation: function (point) {
      this.MarkerMap(point?.location, true, point?.name);
    },
  },
};
</script>

<template>
  <div v-if="show">
    <LayoutNavbarVue :z-index="zIndex">
      <div class="card h-100 pb-2">
        <div class="card-header py-2 mt-1">
          <button
            type="button"
            class="btn-close float-end fs-12 ms-2"
            @click="handleClose"
          ></button>
          <h6 class="card-title mb-0 ellipsis fs-14">Chú thích</h6>
        </div>
        <div class="card-body overflow-auto">
          <DEDataLayer></DEDataLayer>
        </div>
      </div>
    </LayoutNavbarVue>
  </div>
</template>
