<script>
import { provide, toRefs } from "vue";
import { methods_map, data } from "../../../state/map_control/data_map.js";
import MapIotLink from "../../../components/map/MapIotLink.vue";

export default {
  setup() {
    provide("map", {
      ...toRefs(data),
    });
    provide("draw-map", {
      ...methods_map,
    });
  },
  data: function () {
    return {
      show: false,
      listPoint: [],
    };
  },
  methods: {
    handleClose: function () {
      this.show = false;
    },
    handleSetView: function () {
      this.show = true;
    },
    handleClickMap: function () {
      if (!this.handleAddPoint()) return;
      methods_map.create_polyline("#0377fc", "solid", [...this.listPoint]);
      methods_map.MarkersOderByIndex(this.listPoint, "Địa điểm tuần tra");
    },
    handleMapMounted: function () {
      if (!this.listPoint.length) return;
      methods_map.create_polyline("#0377fc", "solid", [...this.listPoint]);
      methods_map.MarkersOderByIndex(this.listPoint, "Địa điểm tuần tra");
    },
    handleAddPoint: function () {
      if (!data.location) return false;
      const VALIDATELOOP = this.listPoint
        .map((item) => `${item.lat}, ${item.lng}`)
        .includes(`${data.location.lat}, ${data.location.lng}`);
      if (VALIDATELOOP) return false;
      this.listPoint = [...this.listPoint, data.location];
      return true;
    },
    handleClickDeletePoint: function (point, _index) {
      this.listPoint = this.listPoint.filter((item, index) => {
        return index !== _index;
      });
      this.handleMapMounted();
    },
    handleSubmit: function () {
      this.$emit("result-point", this.listPoint);
      this.handleClose();
    },
    handleCancle: function () {
      this.listPoint = [];
      methods_map.deleteAllDrawingOnMap();
    },
  },
  components: { MapIotLink },
};
</script>

<template>
  <div v-if="show">
    <div
      class="position-fixed"
      style="inset: 19.5%; z-index: 10000; border-radius: 4px; overflow: hidden"
    >
      <div
        class="position-absolute bg-white"
        style="top: 0; left: 0; bottom: 0; width: 290px; z-index: 1"
      >
        <div class="main-card h-100">
          <div class="card h-100">
            <div class="card-header py-2 mt-1">
              <h6 class="card-title mb-0 ellipsis fs-14">Thêm điểm tuần tra</h6>
            </div>
            <div class="card-body h-100" style="overflow-y: auto">
              <p v-if="!listPoint.length" class="p-2 text-black-50">
                Click vào bản đồ để thêm điểm tuần tra
              </p>
              <div v-else class="h-100 w-100">
                <div
                  v-for="(item, index) in listPoint"
                  :key="index"
                  class="d-flex align-items-center gap-2 p-2 border mb-2 position-relative"
                >
                  <b class="fs-14">Điểm {{ index + 1 }}:</b>
                  <span>{{ `${item.lat}, ${item.lng}` }}</span>
                  <div
                    class="d-flex justify-content-center align-items-center position-absolute hover-bg"
                    style="top: 6px; bottom: 6px; right: 2px"
                    @click="handleClickDeletePoint(item, index)"
                  >
                    <i
                      class="ri-delete-bin-fill text-danger fs-16 cursor-pointer"
                    ></i>
                  </div>
                </div>
                <div class="d-flex align-content-center gap-2 pb-4 pt-2">
                  <button class="btn btn-danger" @click="handleCancle">
                    Huỷ bỏ
                  </button>
                  <button class="btn btn-primary" @click="handleSubmit">
                    Hoàn tất
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="h-100 w-100" style="z-index: 0" @click="handleClickMap">
        <MapIotLink @map-moundted="handleMapMounted"></MapIotLink>
      </div>
    </div>
  </div>
</template>
