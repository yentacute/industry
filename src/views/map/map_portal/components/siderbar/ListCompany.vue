<script>
import { inject } from "vue";
import LayoutNavbarVue from "./LayOutLeft.vue";
import CompanyDetails from "./CompanyDetails.vue";
import { limitText } from "../../../../../common/common";
import API from "../../../../../helpers/api/useAxios";

export default {
  setup: function () {
    const methodMap = inject("draw-map");
    const { show } = inject("list-company");
    return { ...methodMap, show };
  },
  components: {
    LayoutNavbarVue,
    CompanyDetails,
  },
  data: function () {
    return {
      results: [],
      isLoading: false,
      isLoadMore: false,
      page: 1,
      total_pages: 1,
    };
  },
  mounted: function () {
    this.handleCallCompany();
  },
  methods: {
    setView: function () {
      this.show = true;
    },
    handleClose: function () {
      this.show = false;
    },
    handleClickLocation: function (point) {
      this.MarkerMap(point?.location, true, point?.name);
    },
    handleCallCompany: async function () {
      this.isLoading = true;
      const res = await API().get(
        `kcn-song-cong-2/business/?page=${this.page}`
      );
      this.total_pages = res.total_pages;
      this.results = res.results;
      this.isLoading = false;
    },
    handleLimitText: function (text, maxLength) {
      return limitText(text, maxLength);
    },
    handleClickViewCompany: function (company) {
      this.$refs.companyDetails.setView(company);
    },
    loadMoreData: async function () {
      console.log("more");
      if (this.total_pages <= this.page) return;
      this.isLoadMore = true;
      const res = await API().get(
        `kcn-song-cong-2/business/?page=${this.page + 1}`
      );
      this.isLoadMore = false;
      if (!res?.results?.length) return;
      this.results = [...this.results, ...res.results];
    },
    handleScroll: function ($e) {
      const listElm = $e.target;
      const VALIDATE = Boolean(
        listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight
      );
      if (!VALIDATE) {
        return;
      }
      this.loadMoreData();
    },
  },
};
</script>

<template>
  <div v-if="show">
    <LayoutNavbarVue>
      <div class="card h-100 pb-2">
        <div class="card-header py-2 mt-1">
          <button
            type="button"
            class="btn-close float-end fs-12 ms-2"
            @click="handleClose"
          ></button>
          <h6 class="card-title mb-0 ellipsis fs-14">Danh sách các công ty</h6>
        </div>
        <div
          v-if="isLoading"
          class="d-flex justify-content-center align-items-center w-100 mt-4"
        >
          <div style="width: 32px; height: 32px">
            <div class="spin-loading"></div>
          </div>
        </div>
        <div
          v-else
          class="card-body px-0"
          style="overflow-y: auto; overflow-x: hidden"
          @scroll="($e) => handleScroll($e)"
        >
          <template v-if="results.length">
            <div
              v-for="(item, index) in results"
              :key="item?.id ?? index"
              @click="handleClickViewCompany(item)"
              class="list-group hover-bg cursor-pointer border-bottom mb-2 py-2 ps-4 pe-2"
              style="border-radius: unset; height: 98px"
            >
              <div class="row overflow-hidden" style="" title="">
                <img
                  :src="
                    item?.avatar ??
                    require('@/assets/images/background/bg-4.jpg')
                  "
                  :alt="item?.name_en"
                  class="rounded col-3 px-0"
                  style="
                    widows: 100px;
                    height: 80px;
                    object-fit: cover;
                    border-radius: 4px;
                  "
                />
                <div class="list-item-info col h-100">
                  <h6 class="mb-1 lh-base fw-semibold">
                    {{ handleLimitText(item?.name_vi, 50) }}
                  </h6>
                  <p class="text-muted fs-12 mb-0">
                    <!-- {{ item?.tinh_trang_hoat_dong ? 'Đang hoạt động' : 'Ngưng hoạt động' }}
                    <br> -->
                    {{ handleLimitText(item?.nganh_nghe, 60) }}
                  </p>
                </div>
              </div>
            </div>
            <div
              v-if="isLoadMore"
              class="d-flex justify-content-center align-items-center w-100 mt-4"
            >
              <div style="width: 32px; height: 32px">
                <div class="spin-loading"></div>
              </div>
            </div>
            <div v-else>
              <div
                v-if="page == total_pages && page != 1"
                class="d-flex justify-content-center align-items-center w-100 mt-4"
              >
                Bạn đã xem hết các công ty
              </div>
            </div>
          </template>
          <div v-else>Không có công ty nào!</div>
        </div>
      </div>
    </LayoutNavbarVue>
  </div>
  <CompanyDetails ref="companyDetails"></CompanyDetails>
</template>
