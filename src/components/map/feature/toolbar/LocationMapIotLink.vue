<!-- Mỗi một chức năng sẽ viết riêng theo component 
Phần này được đặt trong Head -->

<script>
import { watch, inject } from "vue";
import { useRoute } from "vue-router";
import { reactive, toRefs } from "vue";
import LayoutNavbar from "./LayoutNavbar.vue";
import { callDataTypeSearch } from "../../../../common/map/function_map.js";
import { typePOI } from "../../../../common/map/function_map.js";

export default {
  setup() {
    const route = useRoute();
    let state = reactive({
      zIndex: 1,
      dataShow: [],
      nameType: "Đang tìm kiếm...",
      isLoading: false,
    });
    watch(
      () => route.path,
      (newValue) => {
        // Handle the new value of the "id" param here
        state.zIndex = 1;
        if (newValue.includes("map-type")) {
          state.isLoading = true;
          state.zIndex = 3;
          callDataTypeSearch(newValue.split("/").pop()).then((res) => {
            state.dataShow = res.result;
            state.isLoading = false;
          });
          state.nameType = typePOI.filter(
            (item) => item.type_search == newValue.split("/").pop()
          )[0].name;
        }
      }
    );

    const methodMap = inject("draw-map");

    return { ...toRefs(state), ...methodMap };
  },
  data: function () {
    return {
      show: false,
    };
  },
  components: { LayoutNavbar },
  mounted: function () {},
  methods: {
    setView: function (type) {
      this.show = true;
      this.$router.replace({
        name: "MapViewTypePOI",
        params: { typePOI: type.type_search },
      });
    },
    handleClose: function () {
      this.show = false;
      this.$router.replace({ name: "MapControl" });
      this.$emit("close");
    },
    handleClickLocation: function (point) {
      this.MarkerMap(point?.location, true, point?.name);
    },
  },
};
</script>

<template>
  <div v-if="show">
    <LayoutNavbar :z-index="zIndex">
      <div class="card h-100 pb-2">
        <div class="card-header py-2 mt-1">
          <button
            type="button"
            class="btn-close float-end fs-12 ms-2"
            @click="handleClose"
          ></button>
          <h6 class="card-title mb-0 ellipsis fs-14">
            {{ nameType }}
          </h6>
        </div>
        <div class="card-body" style="overflow-y: auto">
          <template v-if="isLoading"></template>
          <template v-else>
            <template v-if="dataShow.length > 0">
              <div
                v-for="(item, index) in dataShow"
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
            </template>
            <template v-else>
              <div><b>Không có kết quả nào!</b></div>
            </template>
          </template>
        </div>
      </div>
    </LayoutNavbar>
  </div>
</template>
