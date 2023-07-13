<script setup>
// import Swal from "sweetalert2";
import { ref, defineProps, reactive, provide, toRefs } from "vue";
import API from "../../../helpers/api/useAxios";
import Layout from "../../../layouts/main.vue";
import { errorToast, successToast } from "../../../helpers/api/toastStyle";
import FolderHeaderBar from "../../../components/FolderHeaderBar.vue";
import flatPickr from "vue-flatpickr-component";
import { data, methods_map } from "../../../state/map_control/data_map.js";
import MapIotLinkVue from "../../../components/map/MapIotLink.vue";
// import { GMap, GMarker } from "vue3-google-map";

provide("map", {
  ...toRefs(data),
});
provide("draw-map", {
  ...methods_map,
});
const listPoint = ref([]);

const dataLocationScope = ref([]);
const search = reactive({
  currPage: 1,
  total: 0,
  pageSize: 0,
  name: "",
  startDate: "",
  endDate: "",
  planType: "",
  executor: "",
});
// const locations = [
//   { lat: 10.123, lng: 20.456 }, // Vị trí 1
//   { lat: 30.789, lng: 40.012 }, // Vị trí 2
//   // Thêm các vị trí khác vào đây
// ];
const latlocal = ref(21.509302);
const lnglocal = ref(105.844411);
const getPlan = async () => {
  try {
    let urlUser = `/plan-progress`;
    if (search.startDate !== "")
      urlUser += `?start_date=${formatDate(search.startDate)}`;
    if (search.endDate !== "")
      urlUser += `&end_date=${formatDate(search.endDate)}`;
    await API()
      .get(`${props.slug}${urlUser}`)
      .then((res) => {
        dataLocationScope.value = res.results;
        latlocal.value = res.results[0]?.location?.coordinates[1] ?? "21.509302";
        lnglocal.value = res.results[0]?.location?.coordinates[0] ?? "105.844411";
        methods_map.MarkerMap(
          { lat: latlocal.value, lng: lnglocal.value },
          true,
          "Địa điểm khỏa sát"
        );

        console.log(
          13123,
          dataLocationScope.value
          //   lnglocal,
          //   methods_map.MarkerMap({ lat: latlocal, lng: latlocal }, true)
        );
      });
  } catch (error) {
    console.log(error);
  }
};
getPlan();

const searchFilter = () => {
  getPlan();
};
const resetFilter = () => {
  search.startDate = "";
  search.endDate = "";
  getPlan();
};

const props = defineProps({
  slug: {
    type: String,
    default: "sipm-base",
  },
  nameKCN: {
    type: String,
    default: "KHU CÔNG NGHIỆP",
  },
});
const address = reactive({
  title: props.nameKCN,
  details: [{ name: "Quản lý phạm vi khảo sát", to: "ManagePlanPage" }],
});
function formatDate(dateString) {
  if (!dateString) {
    return "";
  }
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}
</script>

<template>
  <Layout
    :address="address"
    :items="address.details"
    chooseMenu="ke-hoach"
    :slug="props.slug"
  >
    <div class="d-flex h-100 justify-content-between flex-column">
      <div class="manage-database">
        <FolderHeaderBar>
          <template #add_button>
            <b-row class="pt-3">
              <b-col cols="12" md="4" lg="3" sm="6" class="mb-2 ipad">
                <b-form-group :label="$t('Ngày bắt đầu')" label-for="fromDate">
                  <flat-pickr
                    :config="birthConfig"
                    v-model="search.startDate"
                    placeholder="YYYY-MM-DD"
                    class="form-control flatpickr-input"
                  />
                </b-form-group>
              </b-col>
              <b-col cols="12" md="4" lg="3" sm="6" class="mb-2 ipad">
                <b-form-group :label="$t('Ngày kết thúc')" label-for="fromDate">
                  <flat-pickr
                    :config="birthConfig"
                    v-model="search.endDate"
                    placeholder="YYYY-MM-DD"
                    class="form-control flatpickr-input"
                  />
                </b-form-group>
              </b-col>
              <b-col
                cols="12"
                class="d-flex align-items-end justify-content-end"
              >
                <b-button variant="outline-primary" @click="resetFilter()">
                  <feather-icon icon="RefreshCwIcon" /> {{ $t("Làm mới") }}
                </b-button>
                <b-button
                  variant="primary"
                  class="ml-2"
                  style="margin-left: 16px"
                  @click="searchFilter()"
                >
                  <feather-icon icon="SearchIcon" /> {{ $t("Tìm kiếm") }}
                </b-button>
              </b-col>
            </b-row>
          </template>
        </FolderHeaderBar>
      </div>

      <div class="card h-100 mb-0" style="overflow-y: auto; overflow-x: hidden">
        <div class="card-body">
          <h4 style="margin-bottom: 8px">Vị trí hoạt động gần nhất</h4>
          <div class="tab-pane h-100" id="map" role="tabpanel">
            <div class="table-responsive h-100">
              <MapIotLinkVue
                @click="handleClickMap"
                :option-custommap="{
                  textSucces: true,
                  map_options: {
                    center: {
                      lat: 21.662541681321336,
                      lng: 105.83146041994102,
                    },
                    zoom: 10,
                    mapType: 'roadmap',
                    controls: false,
                    bearing: 0,
                    tilt: 0,
                  },
                }"
              ></MapIotLinkVue>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
<style scoped></style>
