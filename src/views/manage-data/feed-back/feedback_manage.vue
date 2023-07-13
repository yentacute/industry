<script setup>
import {ref, reactive, defineProps, onMounted, provide, toRefs} from 'vue';
import Layout from '../../../layouts/main.vue';
import http from "../../../helpers/api/axiosHttp";
import {BASE_URL} from "../../../helpers/api/axiosHttp";
import Swal from "sweetalert2";
import FolderHeaderBar from '../../../components/FolderHeaderBar.vue'
import MenuBarContainSearch from '../../../components/manage-data/MenuBarContainSearch.vue';
import flatPickr from "vue-flatpickr-component";
import {methods_map, data} from "../../../state/map_control/data_map.js";
import MapIotLink from "../../../components/map/MapIotLink.vue";


provide("map", {
  ...toRefs(data),
});
provide("draw-map", {
  ...methods_map,
});
const baseURL = ref(BASE_URL);
const feedbackData = ref([]);
const feedbackDtData = ref({});
const isDetail = ref(false);
const showMoreItems = reactive({});
const markerMap = ref(null);
/*const birthConfig = reactive({
  altFormat: 'd/m/Y',
  altInput: true,
  dateFormat: 'd/m/Y',
});*/
const option = reactive({
  currPage: 1,
  total: 0,
  pageSize: 0,
  searchVal: '',
  dateStart: '',
  dateEnd: '',
});
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
const address = ref({
  title: props.nameKCN,
  details: [{name: "Quản lý thông tin phản ánh", to: `${props.slug}ManageFeedbackPage`}],
});

const getData = async () => {
  const dept = await http.get(`/${props.slug}/feedback/?search=${option.searchVal}`);
  feedbackData.value = dept.data.results;
  option.pageSize = dept.data.page_size;
  option.total = dept.data.total_object;
}

function deleteData(id) {
  Swal.fire({
    title: 'Bạn có muốn xoá không?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Không',
    confirmButtonText: 'Đồng ý'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const response = await http.delete(`/${props.slug}/feedback/${id}/`);
      if (response.status === 204) {
        Swal.fire(
          {
            title: 'Đã xoá thông tin phản ánh!',
            icon: 'success'
          }
        );
        getData();
      } else {
        Swal.fire({
            title: 'Lỗi kiểm tra lại !',
            icon: 'error'
          }
        )
      }
    }
  })
}

const viewDetail = async (item) => {
  isDetail.value = true;
  const deptDt = await http.get(`/${props.slug}/feedback/${item}/`);
  feedbackDtData.value = deptDt.data;
  let locate = {
    lat: feedbackDtData.value.location.coordinates[1],
    lng: feedbackDtData.value.location.coordinates[0],
  }
  markerMap.value = new map4d.Marker({
    position: locate,
  })

  methods_map.MarkerMap(locate, true)

}
onMounted(async () => {
  await getData();
});

const handleShowMoreCol = (index) => {
  if (showMoreItems.hasOwnProperty(index)) {
    showMoreItems[index] = !showMoreItems[index];
  } else {
    showMoreItems[index] = true;
  }
};

</script>
<template>
  <Layout :address="address" :items="address.details" chooseMenu="phan-anh" :slug="props.slug">
    <div class="manage-database">
      <FolderHeaderBar>
        <template #add_button>
          <b-col xl="2">
            <!--            <router-link type="button" class="btn btn-light" :to="{ name: `${props.slug}AddFeedbackPage` }">
                          <i class="mdi mdi-plus"></i><span class="mx-1">Thêm</span>
                        </router-link>-->
          </b-col>
        </template>
        <template #input_search>
          <b-col xl="3"></b-col>
          <b-col xl="2" class="d-flex align-items-center">
            <!--            <flatPickr :config="birthConfig" v-model="option.dateStart" placeholder="Từ ngày" @on-change="getData"
                                   class="form-control flatpickr-input"></flatPickr>-->
          </b-col>
          <b-col xl="2" class="d-flex align-items-center">
            <!--            <flatPickr :config="birthConfig" v-model="option.dateEnd" placeholder="Đến ngày" @on-change="getData"
                                   class="form-control flatpickr-input"/>-->
          </b-col>
          <b-col xl="3">
            <div class="search-box">
              <input type="text" class="form-control search" v-model="option.searchVal" placeholder="Tìm kiếm"
                     @keyup="getData()"/>
              <i class="ri-search-line search-icon"></i>
            </div>
          </b-col>
        </template>
      </FolderHeaderBar>
      <!--      <MenuBarContainSearch>
              <template #input_search>
                <b-col sm>
                  <div class="d-flex justify-content-end">
                    <div class="search-box">
                      <input type="text" class="form-control search" v-model="option.searchVal" placeholder="Tìm kiếm"
                             @keyup="getData()"/>
                      <i class="ri-search-line search-icon"></i>
                    </div>
                  </div>
                </b-col>
              </template>
            </MenuBarContainSearch>-->
    </div>
    <div class="page-main__content" ref="containerContent">
      <b-card no-body class="mb-2">
        <div data-simplebar class="card-body__custom--scroll">
          <b-card-body class="card-body__custom--height" v-if="feedbackData.length">
            <div class="table-responsive">
              <table class="table align-middle table-striped table-bordered">
                <thead class="table-light text-dark text-center text-uppercase">
                <tr>
                  <th width="3%">
                    <div class="form-check text-center">
                      <input class="form-check-input" type="checkbox" value="" id="cardtableCheck"/>
                      <label class="form-check-label" for="cardtableCheck"></label>
                    </div>
                  </th>
                  <th>Tiêu đề</th>
                  <th>Nội dung</th>
                  <th>Email phản ánh</th>
                  <th>Điện thoại</th>
                  <th>Ngày tạo</th>
                  <th></th>
                </tr>
                </thead>
                <tbody v-for="(item,index) in feedbackData" :key="index">
                <tr class="odd dt-hasChild" :class="{ parent: showMoreItems[index] }">
                  <td class="text-center">
                    <div class="form-check text-center">
                      <input class="form-check-input" type="checkbox" value="" id="cardtableCheck01"/>
                      <label class="form-check-label" for="cardtableCheck01"></label>
                    </div>
                  </td>
                  <td>
                    <i class="me-2 align-middle fs-16 cursor-pointer" @click="handleShowMoreCol(index)"
                       :class="!showMoreItems[index] ? `ri-add-circle-fill text-primary` : `ri-indeterminate-circle-fill text-danger`"></i>
                    {{ item.title }}
                  </td>
                  <td>{{ item.description }}</td>
                  <td>{{ item.email }}</td>
                  <td>{{ item.phone_number }}</td>
                  <td class="text-center">{{ new Date(item.created_date).toLocaleDateString("en-GB") }}</td>
                  <td>
                    <ul class="list-inline hstack gap-3 mb-0 d-flex justify-content-center">
                      <li class="list-inline-item">
                        <div class="link-info fs-15 cursor-pointer" v-b-tooltip.hover title="Xem chi tiết"
                             @click="viewDetail(item.id)">
                          <i class="ri-eye-line"></i>
                        </div>
                      </li>
                      <li class="list-inline-item">
                        <div class="link-danger fs-15 cursor-pointer" @click="deleteData(item.id)"
                             v-b-tooltip.hover
                             title="Xóa">
                          <i class="ri-delete-bin-line"></i>
                        </div>
                      </li>
                    </ul>
                  </td>
                </tr>
                <tr class="child" v-show="showMoreItems[index]">
                  <td class="child" colspan="5">
                    <ul data-dtr-index="0" class="dtr-details">
                      <li data-dtr-index="5" data-dt-row="0" data-dt-column="5">
                        <span class="dtr-title fw-semibold">Lượt xem</span>
                        <span class="dtr-data">{{ item.view_count }}</span>
                      </li>
                      <!--                      <li data-dtr-index="6" data-dt-row="0" data-dt-column="6">
                                              <span class="dtr-title">Người cập nhật</span>
                                              <span class="dtr-data">
                                                {{
                                                  item.update_by ? `${item.updated_by.first_name} ${item.updated_by.last_name}`
                                                    : `${item.created_by.first_name} ${item.created_by.last_name}`
                                                }}
                                              </span>
                                            </li>-->
                    </ul>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </b-card-body>
          <b-card-body class="card-body__custom--height" v-else>
            <p>Không có dữ liệu!</p>
          </b-card-body>
        </div>
        <b-card-footer class="pt-0 border-0">
          <div class="d-flex justify-content-end">
            <ul class="pagination pagination-sm pagination-separated">
              <li class="page-item disabled">
                <b-link href="#" class="page-link">Trước</b-link>
              </li>
              <li class="page-item active">
                <b-link href="#" class="page-link">1</b-link>
              </li>
              <li class="page-item">
                <b-link href="#" class="page-link">Sau</b-link>
              </li>
            </ul>
          </div>
        </b-card-footer>
      </b-card>
      <b-modal v-model="isDetail" hide-footer body-class="p-0" header-class="p-3" size="xl" modal-class="zoomIn"
               class="v-modal-custom" title="Chi tiết thông tin phản ánh" content-class="border-0 overflow-hidden"
               centered>
        <div class="p-3">
          <b-row class="g-2">
            <b-col md="6">
              <div class="mb-2">
                <h6 class="text-secondary fw-semibold fs-14">Thông tin người phản ánh:</h6>
                <b-card class="shadow-none mb-1">
                  <div class="p-1">
                    <div class="table-responsive table-card mb-2">
                      <table class="table mb-0">
                        <tbody>
                        <tr>
                          <td class="fw-medium" width="30%" scope="row">
                            Email
                          </td>
                          <td>{{ feedbackDtData.email }}</td>
                        </tr>
                        <tr>
                          <td class="fw-medium" width="30%" scope="row">
                            Điện thoại
                          </td>
                          <td>{{ feedbackDtData.phone_number }}</td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </b-card>
              </div>
              <div class="mb-2">
                <h6 class="text-secondary fw-semibold fs-14">Thông tin phản ánh:</h6>
                <b-card class="shadow-none mb-1">
                  <div class="p-1">
                    <div class="table-responsive table-card mb-2">
                      <table class="table mb-0">
                        <tbody>
                        <tr>
                          <td class="fw-medium" width="30%" scope="row">
                            Ngày phản ánh
                          </td>
                          <td>{{ new Date(feedbackDtData.created_date).toLocaleDateString("en-GB") }}</td>
                        </tr>
                        <tr>
                          <td class="fw-medium" width="30%" scope="row">
                            Tiêu đề
                          </td>
                          <td>{{ feedbackDtData.title }}</td>
                        </tr>
                        <tr>
                          <td class="fw-medium" width="30%" scope="row">
                            Nội dung
                          </td>
                          <td>{{ feedbackDtData.description }}</td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </b-card>
              </div>
            </b-col>
            <b-col md="6">
              <div class="w-100 h-100">
                <MapIotLink></MapIotLink>
              </div>
            </b-col>
          </b-row>
        </div>
      </b-modal>
    </div>
  </Layout>
</template>
<style scoped>
tr > td {
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}
</style>