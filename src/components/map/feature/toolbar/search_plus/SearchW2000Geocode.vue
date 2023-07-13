<script>
import { inject, toRefs } from "vue";
import { errorToast } from "../../../../../helpers/api/toastStyle.js";
import API from "../../../../../helpers/api/useAxios.js";
import { fcChangeVN2000ToWGS84 } from "../../../../../utils/wgs84vn2000.js";
import { listMui3VN2000 } from "../setting/danh_sach_mui_chieu";

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
      dataHe200: {
        loaiMuiChieu: 3,
        muiChieu: 106.5,
      },
      viewResult: false,
      listMui3VN2000Custom: listMui3VN2000.map((item) => {
        return {
          ...item,
          value:
            parseFloat(parseFloat(item.axis_meridian.split("-")[0])) +
            parseFloat(parseFloat(item.axis_meridian.split("-")[1]) / 60),
        };
      }),
    };
  },
  methods: {
    handleSearch: async function () {
      if (!this.search) return;
      const LATTEM = this.search.split(",")[0].trim(" ");
      const LNGTEM = this.search.split(",")[1].trim(" ");
      if (this.dataHe200.loaiMuiChieu == 3) {
        const location = await fcChangeVN2000ToWGS84(
          LATTEM,
          LNGTEM,
          this.dataHe200
        );
        if (location.length !== 2) {
          errorToast("Vui lòng nhập đúng kiểu toạ độ");
          return;
        }
        this.handleSearchGeocode(location[1], location[0]);
        return;
      }
      const lat = parseFloat(LATTEM).toFixed(6);
      const lng = parseFloat(LNGTEM).toFixed(6);
      const VALIDATE = !lat && !lng;
      if (VALIDATE) {
        errorToast("Vui lòng nhập đúng kiểu toạ độ");
      }
      this.handleSearchGeocode(lat, lng);
    },
    handleSearchGeocode: function (lat, lng) {
      this.isLoading = true;
      API()
        .call(`https://api-app.map4d.vn/map/geocode?lat=${lat}&lng=${lng}`)
        .then((res) => {
          this.isLoading = false;
          this.result = res;
          this.viewResult = true;
        });
      this.MarkerMap({ lat: lat, lng: lng }, true);
    },
    handleChangMui3VN2000: function ($e) {
      this.dataHe200.muiChieu = $e.target.value;
      // handleChangeHeToaDo();
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
    <div class="offcanvas-body px-1 pt-2" v-if="!viewResult">
      <div class="px-2 border py-3">
        <label for="" class="form-label">Loại múi chiếu</label>
        <select v-model="dataHe200.loaiMuiChieu" class="form-select">
          <option value="3">Múi chiếu 3</option>
          <option value="6" selected="selected">Múi chiếu 6</option>
        </select>
        <p></p>
        <label for="" class="form-label"><span>Múi chiếu</span></label>
        <select
          v-if="dataHe200.loaiMuiChieu == 6"
          v-model="dataHe200.muiChieu"
          class="form-select"
          @change="handleChangeHeToaDo"
        >
          <option value="64">Múi 48 - 105-00</option>
          <option value="65">Múi 49 - 111-00</option>
        </select>
        <select
          v-else
          class="form-select"
          @change="($e) => handleChangMui3VN2000($e)"
        >
          <option
            v-for="item in listMui3VN2000Custom"
            :key="item.id"
            :value="item.value"
            :selected="item.value == dataHe200.muiChieu"
          >
            {{ item.city + " " + item.axis_meridian }}
          </option>
        </select>
      </div>
      <div class="mt-2">
        <div class="hstack gap-2">
          <div class="search-box w-100">
            <i class="ri-search-line search-icon"></i>
            <input
              type="text"
              v-model="search"
              placeholder="x, y"
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
    <div v-else class="offcanvas-header border-bottom px-1">
      <div
        @click="viewResult = false"
        class="position-absolute hover-cricle-bg cursor-pointer"
        style="
          top: 95px;
          left: 8px;
          z-index: 5;
          width: 40px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
        "
      >
        <i class="mdi mdi-keyboard-backspace fs-22"></i>
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
          <div class="pt-2 ps-2 text-black-50">
            VD: Múi chiếu: 3, TP Thái Nguyên
          </div>
          <p class="p-2 pt-1 text-black-50">
            2379540.541517467, 431710.7683154579
          </p>
        </div>
        <template v-else-if="viewResult">
          <div
            v-if="result?.code === `ok`"
            class="offcanvas-body overflow-hidden p-1 position-relative"
            style="overflow-y: auto !important"
          >
            <img
              src="https://map.map4d.vn/mapAppRoot/imageDefault/thumbnail-default.svg"
              class="w-100"
              style="height: 200px; object-fit: cover"
            />
            <div class="p-3">
              <span style="font-size: 18px">{{
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
                <p class="p-0 m-0" style="font-size: 15px">
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
          <div class="pt-2 ps-5" v-else>
            <p class="p-2">Không có kết quả phù hợp</p>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
