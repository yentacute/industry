<script>
import { inject, toRefs } from "vue";
import { errorToast } from "../../../../../helpers/api/toastStyle.js";
import API from "../../../../../helpers/api/useAxios.js";

export default {
  setup() {
    // const data_map = inject("map");
    const data_direct = inject("direct");
    const methodMap = inject("draw-map");
    return { ...toRefs(data_direct), ...methodMap };
  },
  data: function () {
    return {
      search: "",
      result: null,
      isLoading: false,
    };
  },
  methods: {
    handleSearch: function () {
      if (!this.search) return;
      const location = this.search.split(",");
      if (location.length !== 2) {
        errorToast("Vui lòng nhập đúng kiểu toạ độ");
        return;
      }
      const lat = location[0].trim(" ");
      const lng = location[1].trim(" ");
      const VALIDATE = !lat && !lng;
      this.MarkerMap({ lat: lat, lng: lng }, true);
      if (VALIDATE) {
        errorToast("Vui lòng nhập đúng kiểu toạ độ");
      }

      this.isLoading = true;
      API()
        .call(`https://api-app.map4d.vn/map/geocode?lat=${lat}&lng=${lng}`)
        .then((res) => {
          this.isLoading = false;
          this.result = res;
        });
    },
    handleDirect: function () {
      this.origin = this.result?.result?.location;
      this.$router.replace({ name: "MapDirect" });
    },
  },
  watch: {
    search: function (value) {
      if (!value) {
        this.result = null;
      }
    },
  },
};
</script>

<template>
  <div>
    <div class="offcanvas-header border-bottom px-1"></div>
    <div class="offcanvas-body px-1">
      <div class="mt-2">
        <div class="hstack gap-2">
          <div class="search-box w-100">
            <i class="ri-search-line search-icon"></i>
            <input
              type="text"
              v-model="search"
              placeholder="lat, lng"
              class="form-control me-auto"
              @keyup.enter="handleSearch"
            />
          </div>
          <button
            type="button"
            @click="handleSearch"
            class="btn btn-primary border-top-0 search-btn"
          >
            <i class="ri-search-line search-icon"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="scroll-custom offcanvas-searchlist-scroll">
      <div
        v-if="isLoading"
        class="w-100 mt-3 d-flex justify-content-center align-items-center"
      >
        <div style="width: 32px; height: 32px">
          <div class="spin-loading"></div>
        </div>
      </div>
      <template v-else>
        <div v-if="!(search && result)">
          <p class="p-2 text-black-50">VD: 21.509831,105.8427514</p>
          <!-- <span class="p-2 text-black-50">Tìm kiếm theo toạ độ WGS8</span> -->
        </div>
        <template v-else>
          <div
            v-if="result?.code"
            data-simple-bar=""
            class="offcanvas-body overflow-hidden p-1"
            style="overflow-y: auto !important"
          >
            <img
              src="https://map.map4d.vn/mapAppRoot/imageDefault/thumbnail-default.svg"
              class="w-100"
              style="height: 200px; object-fit: cover"
            />
            <div class="p-3">
              <span class="fs-16">{{
                result?.result?.name ??
                `${result?.result?.location?.lat}, ${result?.result?.location?.lng}`
              }}</span>
            </div>
            <div
              class="d-flex justify-content-around align-items-center py-3"
              style="
                border-top: 1px solid rgba(0, 0, 0, 0.12);
                border-bottom: 1px solid rgba(0, 0, 0, 0.12);
              "
            >
              <a @click="handleDirect" class="text-center col-3 cursor-pointer"
                ><div class="avatar-xs mx-auto">
                  <div class="avatar-title bg-soft-info rounded-circle">
                    <i class="ri-direction-fill text-info"></i>
                  </div>
                </div>
                <p class="text-muted mb-0">Chỉ đường</p></a
              >
              <a class="text-center col-3 cursor-pointer"
                ><div class="avatar-xs mx-auto">
                  <div class="avatar-title bg-soft-info rounded-circle">
                    <i class="ri-share-fill text-info"></i>
                  </div>
                </div>
                <p class="text-muted mb-0">Chia sẻ</p></a
              >
            </div>
            <div class="p-2">
              <div class="d-flex align-items-end gap-2">
                <i
                  class="ri-map-pin-line"
                  style="color: rgb(64, 81, 137); font-size: 24px"
                ></i>
                <p class="p-0 m-0">
                  {{ result?.result?.address }}
                </p>
              </div>
              <!-- <div class="d-flex align-items-end gap-2">
                <i
                  class="ri-map-pin-line"
                  style="color: rgb(64, 81, 137); font-size: 24px"
                ></i>
                <p class="p-0 m-0" style="font-size: 15px">Loại: restaurant</p>
              </div> -->
            </div>
          </div>
          <div v-else>
            <p class="p-2">Không có kết quả phù hợp</p>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
