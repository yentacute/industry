<script setup>
import { ref, provide, reactive, toRef } from "vue";
import API from "../../helpers/api/useAxios";

// dữ liệu cho chức năng search trang map portal
const search = ref("");
const companys = ref([]);

// data show lên chi tiết danh sách công ty, chi tiết của 1 công ty
const data_list_company = reactive({
  show: true,
});
// data show lên  chi tiết của 1 công ty
const data_company_details = reactive({
  show: false,
  isLoading: false,
  company: {},
});
const metods_comapny_details = {
  setCompany: async function (idCompany) {
    data_company_details.isLoading = true;
    data_company_details.show = true;
    const res = await API().get(`kcn-song-cong-2/business/${idCompany}/`);
    data_company_details.company = res;
    data_company_details.isLoading = false;
  },
};

provide("search-context", { search: search, dataShow: companys });
provide("list-company", {
  show: toRef(data_list_company, "show"),
  results: companys,
});
provide("company-details", {
  show: toRef(data_company_details, "show"),
  isLoading: toRef(data_company_details, "isLoading"),
  company: toRef(data_company_details, "company"),
  setCompany: metods_comapny_details.setCompany,
});
</script>

<template>
  <slot></slot>
</template>
