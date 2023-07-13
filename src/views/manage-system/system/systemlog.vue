<script setup>
import {ref, reactive} from 'vue';
import Layout from '../../../layouts/main.vue';
import http from "../../../helpers/api/axiosHttp";
import {BASE_URL} from "../../../helpers/api/axiosHttp";
import Swal from "sweetalert2";
import FolderHeaderBar from '../../../components/FolderHeaderBar.vue'
import MenuBarContainSearch from '../../../components/manage-data/MenuBarContainSearch.vue';
import flatPickr from "vue-flatpickr-component";
import Pagination from '../../../components/Pagination.vue'

const baseURL = ref(BASE_URL);
const logData = ref([]);
const option = reactive({
  currPage: 1,
  total: 0,
  pageSize: 0,
  filter: 'null',
});
const birthConfig = reactive({
  altFormat: 'd/m/Y',
  altInput: true,
  dateFormat: 'd/m/Y',
});
const dateFilter = reactive({
  start: '',
  end: '',
})
const items = reactive([
  {
    name: "Hệ thống",
    to: "#",
  },
  {
    name: "Nhật ký hệ thống",
    to: "#",
  },
]);

const address = ref({
  title: 'Hệ thống',
  details: [],
});
const getData = async () => {
  let urlAPI = `/log-auth?type`;
  if (dateFilter.start) urlAPI += `&date_start=${dateFilter.start}`;
  if (dateFilter.end) urlAPI += `&date_end=${dateFilter.end}`;
  const {data} = await http.get(urlAPI);
  logData.value = data.results;
  option.pageSize = data.page_size;
  option.total = data.total_object;
}
getData();

const pageChanged = async (page) => {
  let apiURL = `/log-auth/?page=${page}&type`;
  if (dateFilter.start) apiURL += `&date_start=${dateFilter.start}`;
  if (dateFilter.end) apiURL += `&date_end=${dateFilter.end}`;
  const logs = await http.get(apiURL);
  option.pageSize = page;
  logData.value = logs.data.results;
}

const reSetFilter = () => {
  dateFilter.start = '';
  dateFilter.end = '';
  getData();
}
</script>
<template>
  <Layout :items="items" :address="address" chooseMenu="he-thong" systemMenu>
    <div class="manage-database">
      <FolderHeaderBar>
        <template #add_button>
          <b-col xl="2">
          </b-col>
        </template>
        <template #input_search>
          <b-col xl="5"></b-col>
          <b-col xl="2" class="position-relative d-flex align-items-center">
            <flatPickr :config="birthConfig" v-model="dateFilter.start" placeholder="Từ ngày" @on-change="getData"
                       class="form-control flatpickr-input">
            </flatPickr>
          </b-col>
          <b-col xl="2" class="d-flex align-items-center">
            <flatPickr :config="birthConfig" v-model="dateFilter.end" placeholder="Đến ngày" @on-change="getData"
                       class="form-control flatpickr-input"/>
          </b-col>
          <b-col xl="1">
            <b-button variant="outline-primary" class="waves-effect waves-light w-100" @click="reSetFilter">Làm mới</b-button>
          </b-col>
        </template>
      </FolderHeaderBar>
      <!--      <MenuBarContainSearch>
              <template #input_search>
                <b-col sm></b-col>
                <b-col sm="2">
                  <div class="d-flex justify-content-end">
                    <select class="form-select form-control-icon" v-model="option.filter" @change="getData()">
                      <option value="null">Tất cả</option>
                      <option value="true">Đăng nhập</option>
                      <option value="false">Đăng xuất</option>

                    </select>
                  </div>
                </b-col>
              </template>
            </MenuBarContainSearch>-->
    </div>
    <div class="page-main__content" ref="containerContent">
      <b-card no-body class="mb-2">
        <div data-simplebar class="card-body__custom--scroll">
          <b-card-body class="card-body__custom--height" v-if="logData.length">
            <div class="table-responsive">
              <table class="table align-middle table-striped table-bordered">
                <thead class="table-light text-dark text-center text-uppercase">
                <tr>
                  <th>#</th>
                  <th width="20%">Thời gian</th>
                  <th width="15%">Người dùng</th>
                  <th width="15%">Hành động</th>
                  <th width="15%">Trạng thái</th>
                  <th>Địa chỉ IP</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in logData" :key="index">
                  <td class="text-center">{{ index + 1 + (option.currPage - 1) * 10 }}</td>
                  <td class="text-center">{{ new Date(item.time).toLocaleDateString('en-GB') }} -
                    {{ new Date(item.time).toLocaleTimeString('en-GB') }}
                  </td>
                  <td class="text-center">{{ item.user }}</td>
                  <td class="text-center">{{ item.login === true ? 'Đăng nhập' : 'Đăng xuất' }}</td>
                  <td class="text-center">
                  <span class="badge text-uppercase w-badge"
                        :class="{'badge-soft-success': item.status === true, 'badge-soft-danger': item.status === false}">
                    {{ item.status === true ? 'Thành công' : 'Thất bại' }}
                  </span>
                  </td>
                  <td>{{ item.country_code }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </b-card-body>
          <b-card-body class="card-body__custom--height" v-else>
            Không có dữ liệu!
          </b-card-body>
        </div>
        <b-card-footer class="pt-0 border-0">
          <div class="d-flex justify-content-end">
            <div class="pagination-wrap hstack gap-2">
              <Pagination :page-size="option.pageSize" :total="option.total"
                          :callback="pageChanged"></Pagination>
            </div>
          </div>
        </b-card-footer>
      </b-card>
    </div>
  </Layout>
</template>