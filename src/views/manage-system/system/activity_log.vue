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
const userData = ref({});
const searchUser = ref('');
const userFullName = ref('');
const option = reactive({
  currPage: 1,
  total: 0,
  pageSize: 0,
  filter: 'null',
  activeValue: '',
});
const filterUser = ref({});
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
    name: "Nhật ký thao tác",
    to: "#",
  },
]);

const address = ref({
  title: 'Hệ thống',
  details: [],
});
const getData = async () => {
  let urlAPI = `/activity/?`;
  if (dateFilter.start) urlAPI += `&start_date=${dateFilter.start}`;
  if (dateFilter.end) urlAPI += `&end_date=${dateFilter.end}`;
  if (filterUser.value.id) urlAPI += `&handler=${filterUser.value.id}`;
  if (option.activeValue) urlAPI += `&name_action=${option.activeValue}`;
  const {data} = await http.get(urlAPI);
  logData.value = data.results;
  option.pageSize = data.page_size;
  option.total = data.total_object;
}
getData();

const pageChanged = async (page) => {
  let urlAPI = `/activity/?page=${page}`;
  if (dateFilter.start) urlAPI += `&start_date=${dateFilter.start}`;
  if (dateFilter.end) urlAPI += `&end_date=${dateFilter.end}`;
  if (filterUser.value.id) urlAPI += `&handler=${filterUser.value.id}`;
  if (option.activeValue) urlAPI += `&name_action=${option.activeValue}`;
  const logs = await http.get(urlAPI);
  option.pageSize = page;
  logData.value = logs.data.results;
}

const getUser = async () => {
  const user = await http.get(`/user/?q=${searchUser.value}&type=search`);
  userData.value = user.data.results;
}
getUser();

const getByFilter = async (user) => {
  filterUser.value = user;
  userFullName.value = `${filterUser.value.first_name} ${filterUser.value.last_name}`
  await getData();
}

const reSetFilter = () => {
  dateFilter.start = '';
  dateFilter.end = '';
  filterUser.value = {};
  option.activeValue = '';
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
          <b-col xl="1"></b-col>
          <b-col xl="2">
            <select class="form-select form-control-icon" v-model="option.activeValue" @change="getData">
              <option value="" selected>Tất cả thao tác</option>
              <option value="ManageMapLayer" selected>Quản lý lớp bản đồ</option>
              <option value="Plan">Tuần tra phản ánh</option>
              <option value="Object3D">Đối tượng 3D</option>
            </select>
          </b-col>
          <b-col xl="2">
            <div data-input-flag data-option-flag-name>
              <input type="text" class="form-control rounded-end flag-input cursor-pointer" readonly
                     v-model="userFullName" placeholder="Lọc theo người dùng" data-bs-toggle="dropdown"
                     aria-expanded="false"/>
              <div class="dropdown-menu w-100">
                <div class="p-2 px-3 pt-1 searchlist-input">
                  <input type="text" class="form-control form-control border" v-model="searchUser"
                         @keyup="getUser" placeholder="Tìm kiếm người dùng"/>
                </div>
                <ul class="list-unstyled dropdown-menu-list mb-0">
                  <li class="dropdown-item d-flex align-items-center cursor-pointer" v-for="user in userData"
                      @click="getByFilter(user)">
                    <div class="flex-shrink-0 me-2">
                      <img :src="user.photo ? user.photo : baseURL + `/media/photos/avatar-1.jpg`"
                           alt="user"
                           class="options-flagimg avatar-xs rounded-circle" height="20"></div>
                    <div class="flex-grow-1">
                      <div class="d-flex">
                        <div class="me-1">{{ user.first_name }} {{ user.last_name }}</div>
                        <span class="text-muted">( {{ user.username }} )</span></div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </b-col>
          <b-col xl="2" class="d-flex align-items-center">
            <flatPickr :config="birthConfig" v-model="dateFilter.start" placeholder="Từ ngày" @on-change="getData"
                       class="form-control flatpickr-input"/>
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
                  <th>Thời gian</th>
                  <th>Tên hoạt động</th>
                  <th>Đối tượng</th>
                  <th width="10%">Chức năng</th>
                  <th>Người thực hiện</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in logData" :key="index">
                  <td class="text-center">{{ index + 1 + (option.currPage - 1) * 10 }}</td>
                  <td class="text-center">{{ new Date(item.action_time).toLocaleDateString('en-GB') }} -
                    {{ new Date(item.action_time).toLocaleTimeString('en-GB') }}
                  </td>
                  <td>{{ item.name_action }}</td>
                  <td>{{ item.target }}</td>
                  <td>
                    {{
                      item.action === `Create` ? `Tạo mới` : item.action === `Update` ? `Sửa` : item.action === `Delete` ? `Xóa` : item.action === `Create record` ? `Tạo bản ghi` : item.action === `Update record` ? `Sửa bản ghi` : `Khác`
                    }}
                  </td>
                  <td class="text-center">{{ item.handler.username }}</td>
                  <!--                  <td class="text-center">
                                    <span class="badge text-uppercase w-badge"
                                          :class="{'badge-soft-success': item.status === true, 'badge-soft-danger': item.status === false}">
                                      {{ item.status === true ? 'Thành công' : 'Thất bại' }}
                                    </span>
                                    </td>
                                    <td>{{ item.country_code }}</td>-->
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