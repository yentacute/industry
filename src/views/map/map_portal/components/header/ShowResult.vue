<script>
import { inject } from "vue";
export default {
  props: {
    locations: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  setup: function () {
    const methodMap = inject("draw-map");
    const {
      show: dataShowCompanyDetails,
      company: dataDetailsCompany,
      setCompany: setCompanyDetails,
    } = inject("company-details");

    return {
      ...methodMap,
      dataShowCompanyDetails,
      dataDetailsCompany,
      setCompanyDetails,
    };
  },
  data: function () {
    return {
      show: false,
      isLoading: true,
    };
  },
  methods: {
    setView: function () {
      this.show = true;
    },
    handleClose: function () {
      this.show = false;
    },
    handleClickCompany: async function (company) {
      this.setCompanyDetails(company.id);
      this.dataShowCompanyDetails = true;
    },
  },
};
</script>

<template>
  <div v-if="show && locations.length" class="position-absolute pb-2 show-data">
    <div class="w-100">
      <ul>
        <li
          v-for="(item, index) in locations"
          :key="index"
          :class="{
            'cursor-pointer': item?.id,
            'hover-bg': item?.id,
          }"
          @mousedown="handleClickCompany(item)"
          class="py-2"
        >
          <div class="d-flex gap-2 align-items-center">
            <i
              v-if="item?.id"
              class="mdi mdi-map-marker-radius-outline fs-20 text-primary px-3"
            ></i>
            <i v-else class="mdi mdi-close fs-20 text-danger px-3"></i>
            <div class="d-flex ellipsis">
              <b class="text-nowrap">{{ item?.name }}</b> &nbsp;
              <!-- <span class="ellipsis pe-3">
                {{ item.id }}
              </span> -->
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
.show-data {
  max-height: 201px;
  top: 49px;
  left: 0;
  right: 0;
  background-color: #fff;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  box-shadow: 0px 3px 6px #00000029;
  overflow-y: auto;
}
</style>
