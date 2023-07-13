<script>
import { reactive, toRefs, inject } from "vue";
import LayoutNavbarVue from "./LayoutNavbar.vue";
import ZIndexState from "../../../../utils/zIndexState.js";

export default {
  setup: function () {
    const ZzIndexState = new ZIndexState("show-text-search");
    const { zIndex } = ZzIndexState.getState();

    const data = reactive({
      show: false,
    });

    const textSearch = inject("searchead");
    const methodMap = inject("draw-map");

    const { search, result } = toRefs(textSearch);

    return { zIndex, ...toRefs(data), search, result, ...methodMap };
  },
  components: {
    LayoutNavbarVue,
  },
  methods: {
    setView: function () {
      this.show = true;
      this.$router.replace({ name: "MapShowQickSearch" });
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
          <h6 class="card-title mb-0 ellipsis fs-14">Kết quả tìm kiếm</h6>
        </div>
        <div class="card-body overflow-auto">
          <div
            v-for="(item, index) in result"
            :key="index"
            @click="handleClickLocation(item)"
            class="d-flex align-middle search-item hover-bg mb-2 cursor-pointer"
          >
            <div class="flex-shrink-0">
              <img
                src="https://map.map4d.vn/mapAppRoot/imageDefault/avater-default.png"
                alt=""
                class="rounded img-fluid"
                style="height: 64px"
              />
            </div>
            <div class="flex-grow-1 ms-3">
              <h6 class="mb-1 lh-base fw-semibold">
                <a href="#" class="text-reset">{{ item.name }}</a>
              </h6>
              <p class="text-muted fs-12 mb-0">
                {{ item.address }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </LayoutNavbarVue>
  </div>
</template>
