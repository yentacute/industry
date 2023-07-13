<script>
import { inject, toRefs } from "vue";
import { TextSearchAPIMap4D } from "../../../../../common/map/function_map";

let temTimeOut;

export default {
  props: {
    placeholder: {
      type: String,
      default: "Chọn điểm bắt đầu hoặc nhấp trên bản đồ",
    },
    isOrigin: {
      type: Boolean,
      default: false,
    },
    isDestination: {
      type: Boolean,
      default: false,
    },
    keyIndex: {},
  },
  setup: function () {
    const direct_data = inject("direct");
    const methodMap = inject("draw-map");
    const methods_direct = inject("methods-direct");
    const { origin, destination, mode } = toRefs(direct_data);
    return { origin, destination, mode, ...methods_direct, ...methodMap };
  },
  data: function () {
    return {
      search: "",
      result: [],
      isLoading: true,
      isShow: false,
    };
  },
  mounted: function () {
    if (this.isOrigin) {
      this.search = this.origin?.name ?? "";
    } else {
      this.search = this.destination?.name ?? "";
    }
  },
  methods: {
    setSearch: function (name) {
      this.search = name;
    },
    handleShow: function () {
      this.isShow = true;
    },
    handleHidden: function () {
      this.isShow = false;
    },
    handlerSearchMap4d: function () {
      if (!this.search) {
        this.result = [];
        this.isLoading = false;
        return;
      }
      this.isLoading = true;
      const vm = this;
      clearTimeout(temTimeOut);
      temTimeOut = setTimeout(async () => {
        await TextSearchAPIMap4D(vm.search).then((res) => {
          vm.result = res?.length ? res : [];
        });
        vm.isLoading = false;
      }, 650);
    },
    handleClickLocation: async function (location) {
      this.search = location?.name;
      if (this.isOrigin) {
        this.setOrigin({ ...location.location, name: location?.name });
      } else if (this.isDestination) {
        this.setDestination({ ...location.location, name: location?.name });
      }
      this.$emit(
        "driect",
        await this.Directing([this.origin, this.destination], this.mode)
      );
      this.$emit("result", location, this.keyIndex);
    },
  },
  computed: {
    dataShow: function () {
      if (!this.search || this.isLoading) {
        return [];
      }
      const CHECKDTA = !this.isLoading && this.result.length && this.search;
      if (CHECKDTA) {
        return this.result;
      }
      return [
        {
          name: "Không có kết quả nào!",
          address: "",
        },
      ];
    },
  },
};
</script>

<template>
  <div class="w-100 position-relative">
    <input
      type="text"
      :placeholder="placeholder"
      class="form-control"
      v-model="search"
      @focus="handleShow"
      @blur="handleHidden"
      @keyup="handlerSearchMap4d"
    />
    <div v-if="isShow && search" class="position-absolute div-show-data">
      <template v-if="isLoading">
        <div
          class="d-flex justify-content-center align-items-center"
          style="height: 70px"
        >
          <div style="height: 30px; width: 30px">
            <div class="spin-loading"></div>
          </div>
        </div>
      </template>
      <template v-else>
        <ul class="h-100 w-100">
          <li
            v-for="(item, index) in dataShow"
            :key="index"
            class="d-flex align-items-center px-2 py-1 cursor-pointer hover-bg"
            @mousedown="handleClickLocation(item)"
          >
            <i
              v-if="item?.address"
              class="mdi mdi-map-marker-radius-outline fs-20 text-primary px-3"
            ></i>
            <i v-else class="mdi mdi-close fs-20 text-danger px-3"></i>
            <div class="d-flex ellipsis">
              <b class="text-nowrap">{{ item?.name }}</b> &nbsp;
              <span class="ellipsis pe-3">
                {{ item.address }}
              </span>
            </div>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<style scoped>
.div-show-data {
  top: calc(100% + 3px);
  left: 0;
  right: 0;
  max-height: 225px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ccc;
  overflow: hidden;
  z-index: 1;
  overflow-y: auto;
}
</style>
