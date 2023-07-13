<script>
import ShowResult from "./ShowResult.vue";
import API from "../../../../../helpers/api/useAxios";
import { inject } from "vue";

let temTimeOut;

export default {
  setup() {
    const { search, dataShow } = inject("search-context");
    const { show: dataShowCompanys } = inject("list-company");
    const { show: dataShowDetailsCompany } = inject("company-details");
    return { search, dataShow, dataShowCompanys, dataShowDetailsCompany };
  },
  data: function () {
    return {
      isFocus: false,
      isLoading: false,
    };
  },
  components: {
    ShowResult,
  },
  methods: {
    handlerFocus: function () {
      this.isFocus = true;
      this.$refs.resuls.setView();
    },
    handlerBlur: function () {
      this.isFocus = false;
      if (this.$refs.resuls) {
        this.$refs.resuls.handleClose();
      }
    },
    handlerSearch: function () {
      if (!this.search) {
        this.isLoading = false;
        return;
      }
      this.isLoading = true;
      const vm = this;
      clearTimeout(temTimeOut);
      temTimeOut = setTimeout(async () => {
        const res = await API().get(
          `kcn-song-cong-2/business/?name_vi=${vm.search}`
        );
        if (res?.results?.length) {
          vm.dataShow = [
            ...res.results.map((item) => {
              return { ...item, name: item.name_vi };
            }),
          ];
        } else {
          vm.dataShow = [
            {
              id: "",
              name: "Không có kết quả nào!",
            },
          ];
        }
        vm.isLoading = false;
      }, 650);
    },
    handleClickSearch: function () {},
    handleCLickShowCompany: function () {
      this.dataShowCompanys = true;
      this.dataShowDetailsCompany = false;
    },
  },
};
</script>

<template>
  <div
    class="d-flex align-items-center h-100 position-relative"
    :class="{ 'boder-radius-bottom': isFocus && dataShow.length }"
    style="
      border-radius: 10px;
      background-color: #fff;
      box-shadow: 0px 3px 6px #00000029;
      min-width: 100wh;
      width: 392px;
    "
  >
    <div
      class="align-items-center d-flex hover-cricle-bg justify-content-center px-2 h-100 gap-1"
      style="min-width: 48px"
    >
      <router-link class="p-1 pe-0" to="/">
        <img
          src="@/assets/images/logo-thai-nguyen.svg"
          style="width: 42px; height: 42px; object-fit: cover"
        />
      </router-link>
      <span style="border-left: 1px solid #ccc; height: 32px"></span>
    </div>
    <div class="w-100 position-relative d-flex align-items-center h-100">
      <input
        v-model="search"
        type="text"
        class="border-0 form-control"
        placeholder="Tìm kiếm..."
        @focus="handlerFocus"
        @blur="handlerBlur"
        @keyup="handlerSearch"
      />
      <div
        class="position-absolute h-100 d-flex align-items-center justify-content-center"
        style="top: 0; right: 0; bottom: 0"
      >
        <div
          class="align-items-center h-100 d-flex hover-cricle-bg justify-content-center px-2"
          style="top: 0; right: 0; bottom: 0; min-width: 40px; max-height: 40px"
        >
          <i
            style="font-size: 20px"
            class="ri-search-line search-icon text-black-50 cursor-pointer"
          ></i>
        </div>
        <!-- <div
          class="cursor-pointer hover-bg d-flex align-items-center"
          style="width: 15px"
          @click.stop="handleClickChangeTypeSearch"
        >
          <i class="ri-arrow-down-s-fill"></i>
        </div> -->
      </div>
    </div>
    <div class="d-flex align-items-center h-100">
      <span style="border-left: 1px solid #ccc; height: 32px"></span>
      <div
        v-if="isLoading"
        class="d-flex justify-content-center align-items-center"
        style="width: 48px"
      >
        <div style="width: 22px; height: 22px">
          <div class="spin-loading"></div>
        </div>
      </div>
      <div
        v-else
        class="align-items-center d-flex hover-cricle-bg justify-content-center px-2 h-100"
        style="min-width: 48px"
        title="Danh sách các công ty"
        @click="handleCLickShowCompany"
      >
        <i
          style="font-size: 24px"
          class="ri-building-2-fill text-primary cursor-pointer"
        ></i>
      </div>
    </div>
    <ShowResult :locations="dataShow" ref="resuls"></ShowResult>
  </div>
</template>

<style scoped>
.boder-radius-bottom {
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
</style>
