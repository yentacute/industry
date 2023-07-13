<!-- Mỗi một chức năng sẽ viết riêng theo component 
Phần này được đặt trong MapControl -->

<script>
import LayoutNavbar from "../LayoutNavbar.vue";
import ZIndexState from "../../../../../utils/zIndexState.js";
import ReferenceSystem from "./ReferenceSystem.vue";
import System from "./System.vue";

function setItem(name, classIcon, active = false, component) {
  return { name: name, icon: classIcon, active: active, component: component };
}

export default {
  data: function () {
    return {
      show: false,
      menu: [
        setItem("Hệ quy chiếu", "ri-stack-line", true, ReferenceSystem),
        setItem("Hệ thống", "ri-price-tag-3-fill", false, System),
        setItem("Bản đồ", "ri-bar-chart-box-line", false),
      ],
    };
  },
  setup() {
    const zIndexState = new ZIndexState("data-layer");
    const { zIndex } = zIndexState.getState();
    return { zIndex };
  },
  components: { LayoutNavbar, ReferenceSystem, System },
  mounted: function () {},
  methods: {
    setView: function () {
      this.$router.replace({ name: "MapSetting" });
      this.show = true;
    },
    handleClose: function () {
      this.show = false;
      this.$router.replace({ name: "MapControl" });
    },
    handleClickChangeMenu: function (_index) {
      this.menu.forEach(function (item, index) {
        item.active = _index === index;
      });
    },
  },
};
</script>

<template>
  <div v-if="show">
    <LayoutNavbar :z-index="zIndex">
      <div class="card h-100">
        <div class="card-header py-2 mt-1">
          <button
            type="button"
            class="btn-close float-end fs-12 ms-2"
            @click="handleClose"
          ></button>
          <h6 class="card-title mb-0 ellipsis fs-14">Cài đặt</h6>
        </div>
        <div class="card-body hover-overflowY-scroll pt-1">
          <div
            class="d-flex justify-content-between align-items-center"
            style="line-height: 28px"
          >
            <div
              v-for="(item, index) in menu"
              :key="index"
              :title="item.name"
              :class="{ 'border-bottom-ridge': item.active }"
              :style="{ width: `${100 / menu.length}%` }"
              @click="handleClickChangeMenu(index)"
              class="d-flex justify-content-center align-items-center gap-2 cursor-pointer mx-1"
            >
              <i :class="item.icon" class="text-primary"></i>
              <span v-if="menu.length < 4" class="ellipsis">
                {{ item.name }}
              </span>
            </div>
          </div>
          <div v-for="(item, index) in menu" :key="index">
            <component v-if="item.active" :is="item.component" />
          </div>
        </div>
      </div>
    </LayoutNavbar>
  </div>
</template>
