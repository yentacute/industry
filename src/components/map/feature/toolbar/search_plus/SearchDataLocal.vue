<script>
import { ref, inject } from "vue";
import { limitText } from "../../../../../common/common.js";
import API from "../../../../../helpers/api/useAxios.js";
import { useTileLayerStore } from "../../../../../state/map_control/publicLayer.js";

var varSetTimeout;

export default {
  setup() {
    const data_map = inject("map");
    const layerStore = useTileLayerStore();
    const layer = ref(layerStore.layersShowTile);
    return { layer, layerStore, ...data_map };
  },
  data: function () {
    return {
      search: "",
      result: null,
      isLoading: false,
      NEWDRAWTEMP: null,
    };
  },
  methods: {
    handleSearch: function () {
      if (!this.search) return;
      if (!this.layer.length) return;
      clearTimeout(varSetTimeout);
      this.isLoading = true;
      const vm = this;
      const data = {
        keys: vm.search,
        layers: vm.layer.map((item) => item.layer_id),
      };
      varSetTimeout = setTimeout(() => {
        API()
          .post(`sipm-base/filter-datasets`, data)
          .then((res) => {
            vm.isLoading = false;
            vm.result = res;
          });
      }, 500);
    },
    handleDirect: function () {
      this.origin = this.result?.result?.location;
      this.$router.replace({ name: "MapDirect" });
    },
    fc_limitText: function (string, number) {
      if (!string) return "";
      return limitText(string, number);
    },
    handleClickResult: function (field) {
      if (this.NEWDRAWTEMP) {
        this.NEWDRAWTEMP.setMap(null);
      }
      this.NEWDRAWTEMP = this.layerStore.highlightResultSearchGeom(field.geom);
      this.NEWDRAWTEMP.setMap(this.map);
    },
  },
  unmounted: function () {
    if (this.NEWDRAWTEMP) {
      this.NEWDRAWTEMP.setMap(null);
    }
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
    <div class="offcanvas-body px-1 w-100">
      <div class="mt-2">
        <div class="hstack gap-2">
          <div class="search-box w-100 h-100">
            <i class="ri-search-line search-icon"></i>
            <input
              type="text"
              v-model="search"
              placeholder="Tìm kiếm..."
              class="form-control me-auto"
              @keyup="handleSearch"
            />
          </div>
          <!-- <button
            type="button"
            @click="handleSearch"
            class="btn btn-primary border-top-0 search-btn"
          >
            <i class="ri-search-line search-icon"></i>
          </button> -->
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
      <template v-else-if="!layer.length">
        <p class="p-2">Vui lòng bật lớp dữ liệu</p>
      </template>
      <template v-else>
        <div v-if="!(search && result)">
          <p class="p-2 text-black-50">Tìm kiếm kết quả theo bộ dữ liệu</p>
        </div>
        <template v-else>
          <div
            v-if="result"
            data-simple-bar=""
            class="offcanvas-body overflow-hidden p-1"
            style="overflow-y: auto !important"
          >
            <div v-for="(item, index) in layer" :key="index">
              <h5 class="fs-14 pt-1 offcanvas-title">
                {{ item.name_display ?? "name layer" }}
              </h5>
              <template v-if="result[item.name_display].length">
                <div
                  class="border p-2 mt-2 hover-bg cursor-pointer"
                  v-for="(filed, indexField) in result[item.name_display]"
                  :key="indexField"
                  @click="handleClickResult(filed)"
                >
                  <div v-for="(value, key) in filed" :key="key" class="">
                    <template v-if="key !== 'geom'">
                      <b>{{ key }}: &nbsp;</b>
                      {{ fc_limitText(value, 50) }}</template
                    >
                  </div>
                </div>
              </template>
              <template v-else>
                <p class="mb-0 p-2 py-1">Không có kết quả nào!</p>
              </template>
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
