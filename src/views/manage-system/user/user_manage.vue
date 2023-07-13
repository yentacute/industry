<script setup>
import {ref, reactive, onMounted, watch} from "vue";
import Layout from "../../../layouts/main.vue";
import http from "../../../helpers/api/axiosHttp";
import {BASE_URL} from "../../../helpers/api/axiosHttp";
import Swal from "sweetalert2";
import FolderHeaderBar from "../../../components/FolderHeaderBar.vue";
import MenuBarContainSearch from "../../../components/manage-data/MenuBarContainSearch.vue";
import DataTable from "datatables.net-bs5";
import DataTablesCore from "datatables.net";
import "datatables.net-buttons-bs5";
import "datatables.net-responsive-bs5";
import {errorToast, successToast} from "../../../helpers/api/toastStyle";
import flatPickr from "vue-flatpickr-component";
import Pagination from '../../../components/Pagination.vue';

DataTable.use(DataTablesCore);
const baseURL = ref(BASE_URL);
const userData = ref([]);
const roleData = ref([]);
const userDetail = ref({});
const isDetail = ref(false);
const isResetPassword = ref(false);
const isRequire = ref(false);

const option = reactive({
  currPage: 1,
  total: 0,
  pageSize: 0,
  totalPage: 0,
  searchVal: "",
  valueRole: "All",
  date: "none",
  startDate: "",
  endDate: "",
});

const options = {
  dom: "Bftip",
  responsive: true,
  select: true,
};
const showMoreItems = reactive({});

const address = ref({
  title: "Người dùng",
  details: [],
});

const items = reactive([
  {
    name: "Người dùng",
    to: "#",
  },
  {
    name: "Quản lý người dùng",
    to: "ManageUserPage",
  },
]);

const getRole = async () => {
  const {data} = await http.get(`/role`);
  roleData.value = data;
};
getRole();

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const getData = async () => {
  let urlUser = `/user/?page=${option.currPage}&q=${option.searchVal}&type=search`;
  if (option.valueRole !== "All") {
    urlUser += `&role=${option.valueRole}`;
  }
  if (option.date !== "none") {
    if (option.date === "true") urlUser += `&date=true`;
    if (option.date === "false") urlUser += `&date=false`;
  }
  if (option.startDate !== "")
    urlUser += `&start_date=${formatDate(option.startDate)}`;
  if (option.endDate !== "")
    urlUser += `&end_date=${formatDate(option.endDate)}`;
  const {data} = await http.get(urlUser);
  userData.value = data.results;
  option.pageSize = data.page_size;
  option.total = data.total_objects;
  option.totalPage = data.total_pages;
  option.currPage = data.current_page_number;
};
getData();

const pageChanged = async (page) => {
  let urlUser = `/user/?page=${page}&q=${option.searchVal}&type=search`;
  if (option.valueRole !== "All") {
    urlUser += `&role=${option.valueRole}`;
  }
  if (option.date !== "none") {
    if (option.date === "true") urlUser += `&date=true`;
    if (option.date === "false") urlUser += `&date=false`;
  }
  if (option.startDate !== "")
    urlUser += `&start_date=${formatDate(option.startDate)}`;
  if (option.endDate !== "")
    urlUser += `&end_date=${formatDate(option.endDate)}`;
  const {data} = await http.get(urlUser);
  userData.value = data.results;
  console.log(data);
}

const resetFilter = () => {
  option.searchVal = "";
  option.valueRole = "All";
  option.date = "";
  option.startDate = "";
  option.endDate = "";
  getData();
};
const searchFilter = () => {
  getData();
};

const getDetail = async (id) => {
  const item = await http.get(`/user/${id}}`);
  userDetail.value = item.data;
  isDetail.value = true;
};
const dataReset = ref({
  id: "",
  username: "",
  resetPassword: "",
  email: "",
});

const getDetailPassWord = async (id) => {
  const item = await http.get(`/user/${id}}`);
  dataReset.value = item.data;
  isResetPassword.value = true;
};
const goToCancer = () => {
  isResetPassword.value = false;
};

function deleteData(id) {
  Swal.fire({
    title: "Bạn có muốn xoá không?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "Không",
    confirmButtonText: "Đồng ý",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const response = await http.delete(`/user/${id}`);
      if (response.status === 200) {
        Swal.fire({
          title: "Đã xoá người dùng!",
          icon: "success",
        });
        getData();
      } else {
        Swal.fire({
          title: "Lỗi kiểm tra lại !",
          icon: "error",
        });
      }
    }
  });
}

const handleShowMoreCol = (index) => {
  if (showMoreItems.hasOwnProperty(index)) {
    showMoreItems[index] = !showMoreItems[index];
  } else {
    showMoreItems[index] = true;
  }
};
onMounted(() => {
  console.log(userData);
});
const handleSubmit = async () => {
  if (dataReset.value.resetPassword !== "") {
    let formData = new FormData();
    let formElement = document.getElementById("user-manage");
    formData.append("username", formElement.username.value);
    formData.append("email", formElement.email.value);
    formData.append("password", formElement.password.value);
    const response = await http.put(`/user/${dataReset.value.id}/`, formData);
    console.log(response)
    if (response.status === 200) {
      successToast("Đã cập nhật thành công!");
    } else {
      errorToast("Cập nhật thất bại!");
    }
  }
};
watch(
  () => {
    if (dataReset.value.resetPassword == "") {
      isRequire.value = true;
    } else {
      isRequire.value = false;
    }
  },
  {
    immediately: true,
    deep: true,
  }
);
</script>
<template>
  <Layout :items="items" :address="address" chooseMenu="nguoi-dung" systemMenu>
    <div class="manage-database">
      <FolderHeaderBar>
        <template #add_button>
          <b-row class="pt-3">
            <b-col cols="12" md="4" lg="3" sm="6" class="mb-2 ipad">
              <label>{{ $t("Tên đăng nhập") }}</label>
              <b-form-input
                class="form-control search w-100"
                v-model="option.searchVal"
                placeholder="Tìm kiếm"
              />
            </b-col>
            <b-col cols="12" md="4" lg="3" sm="6" class="mb-2 ipad">
              <b-form-group :label="$t('Từ ngày')" label-for="fromDate">
                <flat-pickr
                  :config="birthConfig"
                  v-model="option.startDate"
                  placeholder="YYYY-MM-DD"
                  class="form-control flatpickr-input"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12" md="4" lg="3" sm="6" class="mb-2 ipad">
              <b-form-group :label="$t('Đến ngày')" label-for="fromDate">
                <flat-pickr
                  :config="birthConfig"
                  v-model="option.endDate"
                  placeholder="YYYY-MM-DD"
                  class="form-control flatpickr-input"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12" md="4" lg="3" sm="6" class="mb-2 ipad">
              <label>{{ $t("Vai trò") }}</label>
              <select
                class="form-select form-control-icon"
                v-model="option.valueRole"
              >
                <option value="All" selected>Tất cả vai trò</option>
                <option
                  v-for="item in roleData"
                  :key="item.id"
                  :value="item.name"
                >
                  {{ item.name }}
                </option>
                <option value="">Người dùng</option>
              </select>
            </b-col>
            <b-col cols="12" class="d-flex align-items-end justify-content-end">
              <b-button variant="outline-primary" @click="resetFilter()">
                <feather-icon icon="RefreshCwIcon"/>
                {{ $t("Làm mới") }}
              </b-button>
              <b-button
                variant="primary"
                class="ml-2"
                style="margin-left: 16px"
                @click="searchFilter()"
              >
                <feather-icon icon="SearchIcon"/>
                {{ $t("Tìm kiếm") }}
              </b-button>
            </b-col>

            <!-- <b-col xl="2">
              <div class="form-icon">
                <select
                  class="form-select form-control-icon"
                  v-model="option.valueRole"
                  @change="getData()"
                >
                  <option value="All" selected>Tất cả vai trò</option>
                  <option
                    v-for="item in roleData"
                    :key="item.id"
                    :value="item.name"
                  >
                    {{ item.name }}
                  </option>
                  <option value="">Người dùng</option>
                </select>
                <i class="ri-shield-star-fill"></i>
              </div>
            </b-col>
            <b-col xl="3">
              <div class="search-box">
                <input
                  type="text"
                  class="form-control search w-100"
                  v-model="option.searchVal"
                  placeholder="Tìm kiếm"
                  @keyup="getData()"
                />
                <i class="ri-search-line search-icon"></i>
              </div>
            </b-col> -->
          </b-row>
        </template>
      </FolderHeaderBar>
      <!--      <MenuBarContainSearch>
      </MenuBarContainSearch>-->
    </div>
    <div class="page-main__content" ref="containerContent">
      <b-card no-body class="mb-1">
        <div class="px-3 my-2">
          <b-row>
            <b-col cols="12">
              <div class="d-flex align-items-center justify-content-end">
                <router-link
                  type="button"
                  class="btn btn-light"
                  :to="{ name: 'AddUserPage' }">
                  <i class="mdi mdi-plus"></i><span class="mx-1">Thêm</span>
                </router-link>
              </div>
            </b-col>
          </b-row>
        </div>
        <div data-simplebar style="height: calc(100vh - 400px);">
          <b-card-body class="pt-0" v-if="userData.length" style="height: calc(100vh - 400px);">
            <div class="table-responsive h-100">
              <table
                style="width: 100%"
                aria-describedby="example_info"
                id="example"
                class="table align-middle table-striped table-bordered dt-responsive dataTable no-footer dtr-inline collapsed"
              >
                <thead class="table-light text-dark text-center text-uppercase">
                <tr>
                  <th class="text-center" width="3%">
                    <div class="form-check">
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
                  <th width="25%">Tên đăng nhập</th>
                  <th>Họ và tên</th>
                  <th width="20%">Phân quyền</th>
                  <th width="3%"></th>
                </tr>
                </thead>
                <tbody v-for="(item, index) in userData" :key="index">
                <tr
                  class="odd dt-hasChild"
                  :class="{ parent: showMoreItems[index] }"
                >
                  <td class="text-center">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="cardtableCheck01"
                      />
                      <label
                        class="form-check-label"
                        for="cardtableCheck01"
                      ></label>
                    </div>
                  </td>
                  <td class="d-flex align-items-center">
                    <i
                      class="me-2 align-middle fs-16 cursor-pointer"
                      @click="handleShowMoreCol(index)"
                      :class="
                          !showMoreItems[index]
                            ? `ri-add-circle-fill text-primary`
                            : `ri-indeterminate-circle-fill text-danger`
                        "
                    ></i>
                    <div
                      class="w-100 cursor-pointer"
                      @click="getDetail(item.id)"
                    >
                      <img
                        :src="
                            item.photo
                              ? item.photo
                              : baseURL + `/media/photos/avatar-1.jpg`
                          "
                        alt="Ảnh đại diện"
                        class="avatar-xs rounded-circle me-2 align-middle"
                      />
                      {{ item.username }}
                    </div>
                  </td>
                  <td class="cursor-pointer" @click="getDetail(item.id)">
                    {{ item.first_name }} {{ item.last_name }}
                  </td>
                  <td class="cursor-pointer" @click="getDetail(item.id)">
                    {{ item.user_role ? item.user_role.name : "Người dùng" }}
                  </td>
                  <td class="text-center">
                    <div class="dropdown">
                      <button
                        class="btn btn-soft-secondary btn-sm dropdown"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i class="mdi mdi-dots-vertical"></i>
                      </button>
                      <ul class="dropdown-menu dropdown-menu-end">
                        <li
                          class="dropdown-item"
                          style="cursor: pointer"
                          @click="getDetailPassWord(item.id)"
                        >
                          <!-- <router-link
                            class="dropdown-item"
                            :to="{
                              name: 'UpdateUserPage',
                              params: { id: item.id },
                            }"
                          > -->
                          <i
                            class="ri-clockwise-line align-bottom me-2 text-muted"
                          ></i>
                          Đôi mật khẩu
                          <!-- </router-link> -->
                        </li>
                        <li>
                          <router-link
                            class="dropdown-item"
                            :to="{
                                name: 'UpdateUserPage',
                                params: { id: item.id },
                              }"
                          >
                            <i
                              class="ri-edit-2-line align-bottom me-2 text-muted"
                            ></i>
                            Sửa
                          </router-link>
                        </li>
                        <li>
                          <b-link
                            class="dropdown-item"
                            @click="deleteData(item.id)"
                          >
                            <i
                              class="ri-delete-bin-line align-bottom me-2 text-muted"
                            ></i>
                            Xóa
                          </b-link>
                        </li>
                      </ul>
                    </div>
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
                        <span class="dtr-title">Khu công nghiệp</span>
                        <span class="dtr-data">
                            {{
                            item.industrial_area.length > 0
                              ? item.industrial_area[0].name
                              : ""
                          }}
                          </span>
                      </li>
                      <li
                        data-dtr-index="6"
                        data-dt-row="0"
                        data-dt-column="6"
                      >
                        <span class="dtr-title">Ngày tham gia</span>
                        <span class="dtr-data">{{
                            new Date(item.date_joined).toLocaleDateString(
                              "en-GB"
                            )
                          }}</span>
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
          <Pagination :page-size="option.pageSize"
                      :total="option.total" :callback="pageChanged"></Pagination>
        </b-card-footer>
      </b-card>
      <b-modal
        v-model="isDetail"
        hide-footer
        body-class="p-0"
        header-class="p-3"
        modal-class="zoomIn"
        class="v-modal-custom"
        title="Chi tiết người dùng"
        content-class="border-0 overflow-hidden"
        centered
      >
        <div class="profile-offcanvas">
          <div class="team-cover">
            <img
              src="@/assets/images/nft/bg-home.jpg"
              alt=""
              class="img-fluid"
            />
          </div>
          <div class="p-3">
            <div class="team-settings">
              <b-row>
                <b-col class="text-end dropdown">
                  <div><i class="ri-more-fill fs-17"></i></div>
                </b-col>
              </b-row>
            </div>
          </div>
          <div class="p-3 pb-0 text-center">
            <img
              :src="
                userDetail.photo
                  ? userDetail.photo
                  : baseURL + `/media/photos/avatar-1.jpg`
              "
              alt=""
              class="avatar-lg img-thumbnail rounded-circle mx-auto profile-img"
            />
            <div class="mt-2">
              <h5 class="fs-15 profile-name">
                {{ userDetail.first_name }} {{ userDetail.last_name }}
              </h5>
              <p class="text-muted profile-designation">
                {{
                  userDetail.user_role
                    ? userDetail.user_role.name
                    : "Người dùng"
                }}
              </p>
            </div>
          </div>
          <div class="card shadow-none">
            <div class="card-body pt-0">
              <div class="table-responsive table-card mb-3">
                <table class="table mb-0">
                  <tbody id="info__detail">
                  <tr>
                    <td class="fw-medium" width="30%" scope="row">
                      Giới tính
                    </td>
                    <td>{{ userDetail.gender === 0 ? "Nam" : "Nữ" }}</td>
                  </tr>
                  <tr>
                    <td class="fw-medium" scope="row">Ngày sinh</td>
                    <td>
                      {{
                        userDetail.birth
                          ? new Date(userDetail.birth).toLocaleDateString(
                          "en-GB"
                          )
                          : ""
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td class="fw-medium" scope="row">Địa chỉ</td>
                    <td id="emp">{{ userDetail.address }}</td>
                  </tr>
                  <tr>
                    <td class="fw-medium" scope="row">Email</td>
                    <td>{{ userDetail.email }}</td>
                  </tr>
                  <tr>
                    <td class="fw-medium" scope="row">Điện thoại</td>
                    <td>{{ userDetail.phone }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div class="my-4">
                <h6 class="fw-semibold">
                  Giới thiệu
                </h6>
                <p class="text-muted">{{ userDetail.introduce }}</p>
              </div>
            </div>
          </div>
        </div>
      </b-modal>
      <b-modal
        v-model="isResetPassword"
        hide-footer
        body-class="p-0"
        header-class="p-3 m-2"
        modal-class="zoomIn"
        class="v-modal-custom"
        title="Đổi mật khẩu "
        content-class="border-0 overflow-hidden"
        centered
      >
        <form id="user-manage">
          <b-card no-body>
            <b-card-body>
              <b-row>
                <b-col class="mb-3">
                  <label for="usernameInput" class="form-label mb-1">Tên Người dùng</label>
                  <input type="text" class="form-control" id="usernameInput"
                         disabled name="username" v-model="dataReset.username"/>
                </b-col>
                <b-col class="mb-3">
                  <label for="emailInput" class="form-label mb-1"
                  >Email Người dùng</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="emailInput"
                    disabled
                    name="email"
                    v-model="dataReset.email"
                  />
                </b-col>
                <b-col class="mb-3">
                  <label for="changePassInput" class="form-label mb-1"
                  >Thay đổi mật khẩu</label
                  >
                  <input
                    type="password"
                    class="form-control"
                    id="changePassInput"
                    name="password"
                    placeholder=".........."
                    v-model="dataReset.resetPassword"
                  />
                  <div v-if="isRequire" style="color: red; margin-top: 6px">
                    Trường này là bắt buộc
                  </div>
                </b-col>
              </b-row>
            </b-card-body>
            <b-card-footer>
              <div class="hstack gap-2">
                <b-button variant="danger" type="reset" @click="goToCancer"
                >Hủy
                </b-button
                >
                <b-button
                  variant="success"
                  type="submit"
                  @click.prevent="handleSubmit"
                >Lưu
                </b-button
                >
              </div>
            </b-card-footer>
          </b-card>
        </form>
      </b-modal>
    </div>
  </Layout>
</template>
<style scoped>
.form-icon i {
  left: 10px;
}

.form-icon .form-control-icon {
  padding-left: 2rem;
  padding-right: 2.4rem;
}

#info__detail > tr > td {
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}
</style>
