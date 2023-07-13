<script>
import { inject } from "vue";
import LayoutNavbarVue from "./LayOutLeft.vue";
import { limitText } from "../../../../../common/common";
import SwiperCustom from "../../../../../components/custom/SwiperCustom.vue";

export default {
  setup: function () {
    const methodMap = inject("draw-map");
    const { show, company, isLoading, setCompany } = inject("company-details");

    return { ...methodMap, show, company, isLoading, setCompany };
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
      table: [
        setTable("nguoi_dai_dien", "Người đại diện"),
        setTable("so_dien_thoai", "Điện thoại"),
        setTable("website", "Website"),
        setTable("dia_chi_tru_so", "Địa chỉ"),
      ],
    };
  },
  mounted: function () {},
  methods: {
    setView: function (Company) {
      this.setCompany(Company?.id);
    },
    handleClose: function () {
      this.show = false;
    },
    handleLimitText: function (text, maxLength) {
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
          <h6 class="card-title mb-0 ellipsis fs-14">Chi tiết công ty</h6>
        </div>
        <div
          v-if="isLoading"
          class="d-flex justify-content-center align-items-center w-100 mt-4"
        >
          <div style="width: 32px; height: 32px">
            <div class="spin-loading"></div>
          </div>
        </div>
        <div v-else class="card-body overflow-auto">
          <div class="w-100 pb-1" style="height: 230px">
            <SwiperCustom
              :imgs="[
                {
                  img:
                    company?.avatar ??
                    require('@/assets/images/default/Loading_image.gif'),
                },
                ...company?.images,
              ]"
              class="h-100 w-100"
              style="
                object-fit: cover;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
              "
            ></SwiperCustom>
          </div>
          <div>
            <h6 class="fs-16 border-bottom border-top py-2">
              {{ company?.name_vi ?? "Chi tiết công ty" }}
            </h6>
            <div class="d-flex"></div>
          </div>
          <div class="py-2 border-bottom">
            <div class="row">
              <img
                class="col-4"
                :src="company?.qr_code"
                style="max-height: 104px"
              />
              <div class="col">
                <h6 class="mb-2">{{ company?.nganh_nghe }}</h6>
                <!-- <a
                  href="/dia-diem/5625a42a-409b-48d6-80a5-61c47d1e0a15"
                  class="text-decoration-underline text-secondary"
                  >Xem chi tiết</a
                > -->
              </div>
            </div>
          </div>
          <div v-for="(item, index) in table" :key="index">
            <div class="row p-2 border-bottom" v-if="company[item.key]">
              <div class="col-4 fw-semibold ellipsis">{{ item.name }}</div>
              <div class="col">{{ company[item.key] }}</div>
            </div>
          </div>
        </div>
      </div>
    </LayoutNavbarVue>
  </div>
</template>
