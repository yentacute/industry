<script setup>
import {ref, reactive, onMounted, computed} from 'vue';
import Layout from '../../../layouts/main.vue';
import http from "../../../helpers/api/axiosHttp";
import {BASE_URL} from "../../../helpers/api/axiosHttp";
import Swal from "sweetalert2";
import FolderHeaderBar from '../../../components/FolderHeaderBar.vue'
import MenuBarContainSearch from '../../../components/manage-data/MenuBarContainSearch.vue';
import flatPickr from "vue-flatpickr-component";

const birthConfig = reactive({
  altFormat: 'd/m/Y',
  altInput: true,
  dateFormat: 'd/m/Y',
});
const departmentMData = ref([]);
const departmentDtData = ref({});
// const departmentToGetManage = ref([]);
const userManager = ref({});
const isDetail = ref(false);
const managerFilter = ref({});
const showMoreItems = reactive({});
const option = reactive({
  currPage: 1,
  total: 0,
  pageSize: 0,
  searchVal: '',
  managerVal: '',
  dateStart: '',
  dateEnd: '',
});
const items = reactive([
  {
    name: "Đơn vị phòng ban",
    to: "ManageDepartmentManagePage",
  },
]);
const address = ref({
  title: 'Đơn vị phòng ban',
  details: [],
});
const getData = async () => {
  const dept = await http.get(`/department-manager/?page=${option.currPage}&search=${option.searchVal}&manager=${option.managerVal}&start_date=${option.dateStart ? option.dateStart : ''}&end_date=${option.dateEnd ? option.dateEnd : ''}`);
  departmentMData.value = dept.data.results;
  option.pageSize = dept.data.page_size;
  option.total = dept.data.total_object;
}
getData();

const getManage = async (res, item) => {
  item.id = res.id;
  item.name = `${res.first_name} ${res.last_name}`;
  option.managerVal = res.id;
  getData();
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
      const response = await http.delete(`/department-manager/${id}/`);
      console.log(response)
      if (response.status === 200) {
        Swal.fire(
          {
            title: 'Đã xoá phòng ban!',
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
  const deptDt = await http.get(`/department-manager/${item}/`);
  departmentDtData.value = deptDt.data;
  userManager.value = departmentDtData.value.manager;
}

const handleReloadManage = () => {
  option.managerVal = ``;
  managerFilter.value = {};
  getData();
}

onMounted(async () => {
  await getData();
  // departmentToGetManage.value = departmentMData.value;
});

const handleShowMoreCol = (index) => {
  if (showMoreItems.hasOwnProperty(index)) {
    showMoreItems[index] = !showMoreItems[index];
  } else {
    showMoreItems[index] = true;
  }
};

/*const listManage = computed(() => {
  let arr = [];
  departmentToGetManage.value.forEach(obj => {
    if (!arr.includes(obj.manager)) {
      arr.push(obj.manager);
    }
  });
  return arr.reduce((unique, item) => {
    return unique.includes(item.id) ? unique : [...unique, item.id];
  }, []).map(id => {
    return arr.find(item => item.id === id);
  });
});*/
</script>
<template>
  <Layout :items="items" :address="address" chooseMenu="don-vi" systemMenu>
    <div class="manage-database">
      <FolderHeaderBar>
        <template #add_button>
          <b-col xl="2">
            <router-link type="button" class="btn btn-light" :to="{name: 'AddDepartmentManagePage'}">
              <i class="mdi mdi-plus"></i><span class="mx-1">Thêm</span>
            </router-link>
          </b-col>
        </template>
        <template #input_search>
          <b-col xl="3"></b-col>
          <b-col xl="2" class="d-flex align-items-center">
            <flatPickr :config="birthConfig" v-model="option.dateStart" placeholder="Từ ngày" @on-change="getData"
                       class="form-control flatpickr-input"></flatPickr>
          </b-col>
          <b-col xl="2" class="d-flex align-items-center">
            <flatPickr :config="birthConfig" v-model="option.dateEnd" placeholder="Đến ngày" @on-change="getData"
                       class="form-control flatpickr-input"/>
          </b-col>
          <!--          <b-col xl="2">
                      <div data-input-flag data-option-flag-name>
                        <input type="text" class="form-control rounded-end flag-input cursor-pointer" readonly
                               v-model="managerFilter.name" placeholder="Lọc theo trưởng phòng"
                               data-bs-toggle="dropdown" aria-expanded="false"/>
                        <div class="dropdown-menu w-100">
                          <ul class="list-unstyled dropdown-menu-list mb-0">
                            <li class="dropdown-item d-flex align-items-center cursor-pointer" @click="handleReloadManage()">
                              Tất cả
                            </li>
                            <li class="dropdown-item d-flex align-items-center cursor-pointer" v-for="user in listManage"
                                @click="getManage(user,managerFilter)">
                              <div>{{ user.first_name }} {{ user.last_name }}</div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </b-col>-->
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
          <b-card-body class="card-body__custom--height" v-if="departmentMData.length">
            <div class="table-responsive">
              <table
                class="table align-middle table-striped table-bordered dt-responsive dataTable no-footer dtr-inline collapsed">
                <thead class="table-light text-dark text-center text-uppercase">
                <tr>
                  <th width="3%">
                    <div class="form-check text-center">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="cardtableCheck"
                      />
                      <label
                        class="form-check-label"
                        for="cardtableCheck"
                      ></label>
                    </div>
                  </th>
                  <th>Tên phòng ban</th>
                  <th>Tên ngắn</th>
                  <th>Địa chỉ</th>
                  <th>Điện thoại</th>
                  <th>Ngày khởi tạo</th>
                  <th width="10%"></th>
                </tr>
                </thead>
                <tbody v-for="(item,index) in departmentMData" :key="index">
                <tr class="odd dt-hasChild" :class="{ parent: showMoreItems[index] }">
                  <td class="text-center">
                    <div class="form-check text-center">
                      <input class="form-check-input" type="checkbox" value="" id="cardtableCheck01"/>
                      <label
                        class="form-check-label"
                        for="cardtableCheck01"
                      ></label>
                    </div>
                  </td>
                  <td>
                    <i class="me-2 align-middle fs-16 cursor-pointer" @click="handleShowMoreCol(index)"
                       :class="!showMoreItems[index] ? `ri-add-circle-fill text-primary` : `ri-indeterminate-circle-fill text-danger`"></i>
                    {{ item.name }}
                  </td>
                  <td class="text-center">{{ item.short_name }}</td>
                  <td>{{ item.address }}</td>
                  <td>{{ item.phone_number }}</td>
                  <td class="text-center">
                    {{ new Date(item.created_date).toLocaleDateString("en-GB") }}
                  </td>
                  <td>
                    <ul class="list-inline hstack gap-3 mb-0 d-flex justify-content-center">
                      <li class="list-inline-item">
                        <div class="link-info fs-15 cursor-pointer" v-b-tooltip.hover title="Xem chi tiết"
                             @click="viewDetail(item.id)">
                          <i class="ri-eye-line"></i>
                        </div>
                      </li>
                      <li class="list-inline-item">
                        <router-link :to="{name: 'UpdateDepartmentManagePage', params: {id: item.id}}"
                                     class="link-success fs-15" v-b-tooltip.hover title="Cập nhật">
                          <i class="ri-edit-2-line"></i>
                        </router-link>
                      </li>

                      <li class="list-inline-item">
                        <div class="link-danger fs-15" @click="deleteData(item.id)" v-b-tooltip.hover title="Xóa">
                          <i class="ri-delete-bin-line"></i>
                        </div>
                      </li>
                    </ul>
                  </td>
                </tr>
                <tr class="child" v-show="showMoreItems[index]">
                  <td class="child" colspan="5">
                    <ul data-dtr-index="0" class="dtr-details">
                      <li
                        data-dtr-index="5"
                        data-dt-row="0"
                        data-dt-column="5"
                      >
                        <span class="dtr-title">Ngày cập nhật</span>
                        <span class="dtr-data">
                          {{ new Date(item.updated_date ? item.updated_date : item.created_date).toLocaleDateString("en-GB") }}
                        </span>
                      </li>
                      <li
                        data-dtr-index="6"
                        data-dt-row="0"
                        data-dt-column="6"
                      >
                        <span class="dtr-title">Người cập nhật</span>
                        <span class="dtr-data">
                          {{
                            item.update_by ? `${item.updated_by.first_name} ${item.updated_by.last_name}`
                              : `${item.created_by.first_name} ${item.created_by.last_name}`
                          }}
                        </span>
                      </li>
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
      <b-modal v-model="isDetail" hide-footer body-class="p-0" header-class="p-3"
               class="v-modal-custom" title="Chi tiết đơn vị" content-class="border-0 overflow-hidden" centered>
        <div class="p-2">
          <div class="table-responsive">
            <table class="table table-nowrap mb-3">
              <tbody>
              <tr>
                <td width="25%" class="fw-medium">Tên phòng ban</td>
                <td>{{ departmentDtData.name }}</td>
              </tr>
              <tr>
                <td class="fw-medium">Tên ngắn</td>
                <td>{{ departmentDtData.short_name }}</td>
              </tr>
              <tr>
                <td class="fw-medium align-middle">Trưởng phòng</td>
                <td>
                  <div class="d-flex align-items-center">
                    <img
                      :src="userManager.photo ? userManager.photo :  baseURL + `/media/photos/avatar-1.jpg`"
                      alt="user"
                      class="options-flagimg avatar-xs rounded-circle me-1">
                    <span>{{ userManager.first_name }} {{ userManager.last_name }}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="fw-medium">Địa chỉ</td>
                <td>{{ departmentDtData.address }}</td>
              </tr>
              <tr>
                <td class="fw-medium">Địện thoại</td>
                <td>{{ departmentDtData.phone_number }}</td>
              </tr>
              <tr>
                <td class="fw-medium">Fax</td>
                <td>{{ departmentDtData.fax }}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <h6 class="fw-semibold mt-2 ms-2">Mô tả</h6>
          <p class="text-muted mt-2 ms-2">{{ departmentDtData.description }}</p>
        </div>
      </b-modal>
    </div>
  </Layout>
</template>