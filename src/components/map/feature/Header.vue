<script>
import { inject } from "vue";
import Search from "./search/Search.vue";
import User from "./user/User.vue";
import LocationMapIotLink from "./toolbar/LocationMapIotLink.vue";
import { typePOI } from "../../../common/map/function_map.js";

export default {
  setup: function () {
    const methodMap = inject("draw-map");
    return { ...methodMap };
  },
  data() {
    return {
      typePOI: [],
    };
  },
  components: { Search, User, LocationMapIotLink },
  mounted: async function () {
    this.typePOI = typePOI.map((item) => {
      return { ...item, active: false };
    });
  },
  methods: {
    handleClickTypePOI: function (type, _index) {
      this.typePOI.forEach((item, index) => {
        if (_index === index) {
          item.active = true;
        } else {
          item.active = false;
        }
      });
      this.$refs.listLocationsMap4d.setView(type);
    },
    handleSetFalseActive: function () {
      this.typePOI = typePOI.map((item) => {
        return { ...item, active: false };
      });
    },
  },
};
</script>

<template>
  <div
    class="position-fixed align-items-center d-flex gap-5 justify-content-center justify-content-sm-between mx-2 mt-2"
    style="height: 48px; top: 0; right: 0; left: 0; z-index: 2"
  >
    <div
      class="d-flex gap-3 align-items-center h-100 flex-grow-1 justify-content-center justify-content-sm-between"
    >
      <Search @direct="$emit('direct')" @search="$emit('search')"></Search>
      <div
        class="d-none d-md-flex hover-overflow-none position-relative flex-grow-1"
      >
        <ul class="d-flex gap-2 py-2" style="width: calc(100% -35px)">
          <li
            v-for="(item, index) in typePOI"
            @click="handleClickTypePOI(item, index)"
            :key="index"
            style="max-width: 195px; height: 32px"
          >
            <div
              :title="item.name"
              :class="{
                'text-bg-primary': item.active,
                ' hover-bg': !item.active,
              }"
              class="w-100 h-100 px-2 d-flex gap-1 align-items-center justify-content-center cursor-pointer"
              style="
                background-color: #fff;
                box-shadow: 0px 3px 6px #00000029;
                border-radius: 4px;
              "
            >
              <i :class="item.class" class="fs-16"></i>
              <b class="ellipsis">{{ item.name }}</b>
            </div>
            <!-- Rounded Buttons -->
          </li>
        </ul>
        <div class="type-poi-menu" style="max-width: 195px; height: 32px">
          <div
            class="h-100 rounded-pill px-3 d-flex gap-1 align-items-center justify-content-center cursor-pointer"
            style="
              width: 32px;
              background-color: #fff;
              box-shadow: 0px 3px 6px #00000029;
            "
          >
            <i class="fs-16 ri-arrow-down-s-line me-1"></i>
          </div>
          <!-- Rounded Buttons -->
        </div>
      </div>
    </div>
    <User></User>
  </div>
  <LocationMapIotLink
    ref="listLocationsMap4d"
    @close="handleSetFalseActive"
  ></LocationMapIotLink>
</template>

<style scoped>
.flex-grow-1 {
  flex: 1;
  min-width: 0;
}
.type-poi-menu {
  display: none;
}

@media (min-width: 1200px) {
  .navbar .flex-grow-1 {
    min-width: 500px;
  }
}
@media (max-width: 1240px) {
  .type-poi-menu {
    display: block;
    position: absolute;
    top: 8px;
    bottom: 0;
    right: -15px;
  }
}
</style>
