<script>
import { inject } from "vue";
import LayoutNavbarVue from "./LayOutLeft.vue";
import SwiperCustom from "../../../../../components/custom/SwiperCustom.vue";
import { limitText } from "../../../../../common/common.js";

export default {
  setup: function () {
    const { show, detailsMap4D } = inject("details-bulding");
    return { show, detailsMap4D };
  },
  components: {
    LayoutNavbarVue,
    SwiperCustom,
  },
  data: function () {
    const setTable = function (keyGet, nameFeild) {
      return { key: keyGet, name: nameFeild };
    };
    return {
      isLoading: false,
      table: [
        setTable("name", "Tên"),
        setTable("website", "Website"),
        setTable("address", "Địa chỉ"),
        setTable("description", "Mô tả"),
      ],
      readMore: false,
    };
  },
  mounted: function () {},
  methods: {
    setView: function () {
      this.show = true;
    },
    handleClose: function () {
      this.show = false;
    },
    vmLimitText: function (text, maxLength) {
      return limitText(text, maxLength);
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
          <h6 class="card-title mb-0 ellipsis fs-14">Chi tiết đối tượng 3D</h6>
        </div>
        <div class="card-body overflow-auto">
          <div class="w-100 pb-1" style="height: 230px">
            <SwiperCustom
              v-if="detailsMap4D?.placeDetails.length"
              :imgs="[
                ...detailsMap4D?.placeDetails[0]?.photos.map((item) => {
                  return { img: item.url };
                }),
              ]"
              class="h-100 w-100"
              style="
                object-fit: cover;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
              "
            ></SwiperCustom>
            <img
              v-else
              class="h-100 w-100"
              style="
                object-fit: cover;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
              "
              :src="require('@/assets/images/background/bg-4.jpg')"
            />
          </div>
          <div>
            <h6 class="fs-16 border-bottom border-top py-2 fw-semibold lh-base">
              {{ detailsMap4D?.name ?? "Đối tượng" }}
            </h6>
            <div
              class="d-flex align-items-center gap-3 border-bottom pb-2 fw-semibold"
            >
              <i
                class="mdi mdi-map-marker-radius-outline fs-20 text-primary"
              ></i>
              <span class="lh-base">
                {{ detailsMap4D?.address ?? "Địa chỉ" }}
              </span>
            </div>
          </div>
          <div class="px-2" v-if="detailsMap4D.placeDetails.length">
            <template v-for="(item, index) in table">
              <div
                :key="index"
                class="row py-2 border-bottom"
                v-if="detailsMap4D?.placeDetails[0][item.key]"
              >
                <div class="col-3 fw-semibold ellipsis">{{ item.name }}</div>
                <div class="col-9">
                  {{
                    item.name !== "Mô tả"
                      ? detailsMap4D?.placeDetails[0][item.key]
                      : readMore
                      ? detailsMap4D?.placeDetails[0][item.key]
                      : vmLimitText(detailsMap4D?.placeDetails[0][item.key], 90)
                  }}
                  <template v-if="item.name == 'Mô tả'">
                    <span
                      v-if="!readMore"
                      class="text-black-50 hover-text-underline"
                      @click="readMore = true"
                    >
                      Xem thêm
                    </span>
                    <span
                      v-else
                      class="text-black-50 hover-text-underline"
                      @click="readMore = false"
                    >
                      Ẩn bớt
                    </span>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </LayoutNavbarVue>
  </div>
</template>
