<script>
import { inject } from "vue";
import Calculation from "./Calculation.vue";
import LayoutEstimate from "./LayoutEstimate.vue";
import PoligonCal from "./PoligonCal.vue";

const setMenuEstimate = (
  title,
  classIcon,
  active = false,
  func_handle = () => {},
  components
) => {
  return {
    title: title,
    icon: classIcon,
    active: active,
    handle: func_handle,
    components: components,
  };
};

export default {
  setup() {
    const method_map = inject("draw-map");
    return { ...method_map };
  },
  data: function () {
    return {
      show: false,
      menu: [
        // setMenuEstimate(
        //   "Lấy tọa độ địa điểm",
        //   "ri-send-plane-2-fill",
        //   false,
        //   () => {}
        // ),
        setMenuEstimate(
          "Đo khoảng cách",
          "ri-pencil-ruler-2-line",
          false,
          () => {
            this.deleteAllDrawingOnMap();
          },
          Calculation
        ),
        setMenuEstimate(
          "Đo diện tích",
          "ri-shape-fill",
          false,
          () => {
            this.deleteAllDrawingOnMap();
          },
          PoligonCal
        ),
        // setMenuEstimate("Chỉ đường", "ri-direction-fill", false, () => {
        //   this.$router.replace({ name: "MapDirect" });
        // }),
      ],
    };
  },
  components: { LayoutEstimate, Calculation, PoligonCal },
  methods: {
    setView: function () {
      this.show = true;
      //   this.$router.replace(`/ban-do/direct`);
    },
    handleClose: function () {
      this.show = false;
      //   this.$router.replace(`/ban-do`);
    },
    handleToggle: function () {
      this.show = !this.show;
      this.deleteAllDrawingOnMap();
    },
    handleClickItemMenu: function (_menu) {
      _menu.handle();
      this.menu.forEach((item) => {
        item.active = false;
        if (item.title !== _menu.title) return;
        item.active = !item.active;
      });
    },
  },
};
</script>

<template>
  <div @click.stop class="map-type-wrapper hover-bg">
    <div
      class="align-items-center d-flex justify-content-center h-100"
      title="Đo"
      @click="handleToggle"
    >
      <i
        :class="[show ? 'ri-delete-back-2-fill' : 'ri-dashboard-fill']"
        class="text-primary cursor-pointer fs-20 hover-text-red"
      ></i>
    </div>
    <template v-if="show">
      <LayoutEstimate>
        <div
          v-for="(item, index) in menu"
          :key="index"
          :title="item.title"
          @click="handleClickItemMenu(item)"
          class="overflow-hidden col-6 bg-white d-flex justify-content-center align-items-center cursor-pointer hover-bg"
          style="
            width: 40px;
            height: 40px;
            border-radius: 50%;
            box-shadow: #00000029 0px 3px 6px;
          "
        >
          <i
            :class="[item.icon, item.active ? 'text-primary' : 'text-black-50']"
            class="fs-20"
          ></i>
        </div>
      </LayoutEstimate>
      <template v-for="(item, index) in menu">
        <component :key="index" v-if="item.active" :is="item.components"></component
      ></template>
    </template>
  </div>
</template>

<style scoped>
.map-type-wrapper {
  width: 30px;
  height: 30px;
  box-shadow: 0px 0px 4px #666;
  background-color: #fff;
  border-radius: 4px;
  position: relative;
}
</style>
