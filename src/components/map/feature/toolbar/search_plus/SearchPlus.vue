<!-- Mỗi một chức năng sẽ viết riêng theo component 
Phần này được đặt trong MapControl -->

<script>
import { reactive } from "vue";
import LayoutNavbar from "../LayoutNavbar.vue";
import ZIndexState from "../../../../../utils/zIndexState.js";
import SearchGeocode from "./SearchGeocode.vue";
import SearchW2000Geocode from "./SearchW2000Geocode.vue";
import SearchDataLocal from "./SearchDataLocal.vue";

export default {
  setup() {
    const zIndexState = new ZIndexState("search-plus");
    const { zIndex } = zIndexState.getState();

    const setMenu = function (name, classIcon, active = false, component) {
      return {
        name: name,
        icon: classIcon,
        active: active,
        component: component,
      };
    };

    const menuNav = reactive([
      // setMenu("Địa điểm", "ri-arrow-right-s-fill", true),
      setMenu("Tọa độ WGS8", "ri-search-line search-icon", true, SearchGeocode),
      setMenu(
        "Tọa độ VN2000",
        "ri-search-line search-icon",
        false,
        SearchW2000Geocode
      ),
      setMenu(
        "Bộ dữ liệu",
        "ri-search-line search-icon",
        false,
        SearchDataLocal
      ),
      // setMenu("Danh mục gợi ý", "ri-arrow-right-s-fill"),
    ]);

    const onClickChangeMenu = function (_index) {
      menuNav.forEach((item, index) => {
        item.active = _index === index;
      });
    };

    return { zIndex, menuNav, onClickChangeMenu };
  },
  data: function () {
    return {
      show: false,
    };
  },
  components: {
    LayoutNavbar,
    SearchGeocode,
    SearchW2000Geocode,
    SearchDataLocal,
  },
  methods: {
    setView: function () {
      this.show = true;
      this.$router.replace(`/ban-do/search-plus`);
    },
    handleClose: function () {
      this.show = false;
      this.$router.replace(this.$route.query.redirect || "/ban-do");
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
          <h6 class="card-title mb-0 ellipsis fs-14">Tìm kiếm</h6>
        </div>
        <div class="card-body px-0 pt-1 overflow-hidden">
          <div class="d-flex justify-content-between align-items-center px-2">
            <div
              v-for="(item, index) in menuNav"
              :key="index"
              :title="item.name"
              @click="onClickChangeMenu(index)"
              class="d-flex gap-1 mt-1 pe-3 ps-1 cursor-pointer"
              :class="{ 'border-bottom-ridge': item.active }"
              style="line-height: 36px"
            >
              <i :class="item.icon"></i>
              <span class="ellipsis">
                {{ item.name }}
              </span>
            </div>
          </div>
          <ul v-if="menuNav.length" class="h-100 w-100 hover-overflowY-scroll">
            <li v-for="(item, index) in menuNav" :key="index">
              <component v-if="item.active" :is="item.component"></component>
            </li>
          </ul>
        </div>
      </div>
    </LayoutNavbar>
  </div>
</template>

<style scoped>
.active {
  background-color: #e8f0fe;
  border-radius: 0 66px 66px 0;
  color: #185abc !important;
  font-weight: 700;
}

.hover-menu:hover {
  background-color: #3c40431a;
  border-radius: 0 66px 66px 0;
}
</style>
