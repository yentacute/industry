<script setup>
import {ref, reactive, computed} from 'vue';
import Layout from '../../../layouts/main.vue';
import http from "../../../helpers/api/axiosHttp";
import {useRoute, useRouter} from 'vue-router';
import {successToast, errorToast} from "../../../helpers/api/toastStyle";
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";
import removeDiacritics from "../../../helpers/api/common";
import {BASE_URL} from "../../../helpers/api/axiosHttp";

const deptData = ref({});
const userData = ref({});
const searchUser = ref('');
const baseURL = ref(BASE_URL);
const route = useRoute();
const router = useRouter();
const checkedMembers = ref([]);
const checklstMember = ref([]);
const slug = ref('');
const valueSelected = ref([]);
const userManage = reactive({
  id: '',
  name: '',
});
const userSubManage = reactive({
  id: '',
  name: '',
});
const kcnData = ref([]);
const memberListChoose = ref([]);
let isUpdate = false;
const modalAddMember = ref(false);

if (route.params.id) isUpdate = true;
const items = reactive([
  {
    name: "Đơn vị phòng ban",
    to: "ManageDepartmentManagePage",
  },
  {
    name: isUpdate ? 'Cập nhật' : 'Thêm mới',
  },
]);

const address = ref({
  title: 'Đơn vị phòng ban',
  details: [],
});

const memberList = computed(() => {
  if (!searchUser.value) {
    return userData.value;
  }
  const lowerSearchValue = removeDiacritics.toNonAccentVietnamese(searchUser.value.toLowerCase());
  return userData.value.filter((member) => {
    const fullName = `${removeDiacritics.toNonAccentVietnamese((member.first_name))} ${removeDiacritics.toNonAccentVietnamese((member.last_name))}`.toLowerCase();
    return fullName.includes(lowerSearchValue);
  });
});

if (isUpdate) {
  const getDepartmentManage = async () => {
    const dept = await http.get(`/department-manager/${route.params.id}/`);
    deptData.value = dept.data;
    if (deptData.value.manager) {
      userManage.id = deptData.value.manager.id;
      userManage.name = `${deptData.value.manager.first_name} ${deptData.value.manager.last_name}`;
    }
    if (deptData.value.sub_manager) {
      userSubManage.id = deptData.value.sub_manager.id;
      userSubManage.name = `${deptData.value.sub_manager.first_name} ${deptData.value.sub_manager.last_name}`;
    }
    if (deptData.value.industrial) {
      deptData.value.industrial.forEach((item) => valueSelected.value.push(item.slug));
    }
    if (deptData.value.member) {
      memberListChoose.value = deptData.value.member;
      memberListChoose.value.forEach((item) => checklstMember.value.push(item.id))
    }
  }
  getDepartmentManage();
}

const getUser = async () => {
  const user = await http.get(`/user/?q=${searchUser.value}&type=search`);
  userData.value = user.data.results;
}
getUser();

const getIndustrial = async () => {
  let listItem = {}
  const item = await http.get(`/industrial-area`);
  kcnData.value = [];
  item.data.forEach((res) => {
    listItem = {};
    listItem.value = res.slug;
    listItem.label = res.name;
    kcnData.value.push(listItem);
  })
}
getIndustrial();

const getManage = async (res, item) => {
  item.id = res.id;
  item.name = `${res.first_name} ${res.last_name}`
}

const removeSearch = async () => {
  searchUser.value = '';
  getUser();
}

const getListMember = () => {
  const checkedMemberIds = checkedMembers.value;
  memberListChoose.value = userData.value.filter((member) => checkedMemberIds.includes(member.id));
  modalAddMember.value = false;
}

const handleSubmit = async (e) => {
  let item = new FormData(document.getElementById("department-manage"));
  let listItemIndus = [];
  valueSelected.value.forEach((item) => listItemIndus.push(`"${item}"`))
  item.append('industrial', `[${listItemIndus}]`);
  item.append('manager_id', userManage.id);
  item.append('sub_manager_id', userSubManage.id);
  let listItemMember = [];
  memberListChoose.value.forEach((item) => listItemMember.push(`"${item.id}"`))
  item.append('member', `[${listItemMember}]`);
  if (!isUpdate) {
    const response = await http.post(`/department-manager/`, item,
      {headers: {'Content-Type': 'multipart/form-data'}});
    if (response.status === 201) {
      successToast("Đã thêm mới thành công!");
      router.push({name: "ManageDepartmentManagePage"});
    } else {
      errorToast("Thêm mới thất bại!")
    }
  } else {
    const response = await http.put(`/department-manager/${route.params.id}/`, item,
      {headers: {'Content-Type': 'multipart/form-data'}});
    if (response.status === 200) {
      successToast("Đã cập nhật thành công!")
    } else {
      errorToast("Cập nhật thất bại!")
    }
  }
}

</script>

<template>
  <Layout :items="items" :address="address" chooseMenu="don-vi" systemMenu>
    <div class="page-main__content" ref="containerContent">
      <form id="department-manage">
        <b-card no-body>
          <b-card-header class="d-flex">
            <h5 class="card-title flex-grow-1">{{
                isUpdate ? 'Cập nhật phòng ban quản lý' : 'Thêm mới phòng ban quản lý'
              }}</h5>
            <router-link :to="{name: 'ManageDepartmentManagePage'}" type="button" v-b-tooltip.hover title="Đóng"
                         class="flex-shrink-0 btn btn-ghost-primary btn-close flex-shrink-0"></router-link>
          </b-card-header>
          <b-card-body>
            <b-row class="g-4">
              <b-col xl="6">
                <b-col lg="12" class="mb-3">
                  <label for="nameInput" class="form-label mb-1">
                    Tên đơn vị phòng ban <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="nameInput" placeholder="Nhập tên đơn vị phòng ban"
                         name="name" v-model="deptData.name">
                </b-col>
                <b-col lg="12" class="mb-3">
                  <label for="shortNameInput" class="form-label mb-1">
                    Tên ngắn <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="shortNameInput" v-model="deptData.short_name"
                         placeholder="Nhập tên ngắn đơn vị phòng ban" name="short_name">
                </b-col>
                <b-col lg="12" class="mb-3">
                  <label for="emailInput" class="form-label mb-1">Email <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="emailInput" placeholder="Nhập email đơn vị phòng ban"
                         name="email" v-model="deptData.email">
                </b-col>
                <b-row>
                  <b-col sm="6" class="mb-3">
                    <label for="phoneInput" class="form-label mb-1">Điện thoại
                      <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="phoneInput" placeholder="Nhập số điện thoại"
                           name="phone_number" v-model="deptData.phone_number">
                  </b-col>
                  <b-col sm="6" class="mb-3">
                    <label for="faxInput" class="form-label mb-1">Fax</label>
                    <input type="text" class="form-control" id="faxInput" placeholder="Nhập số fax"
                           name="fax" v-model="deptData.fax">
                  </b-col>
                </b-row>
                <b-col lg="12" class="mb-3">
                  <label for="descriptionInput" class="form-label mb-1">Mô tả đơn vị phòng ban</label>
                  <textarea class="form-control" id="descriptionInput" rows="2" name="description"
                            v-model="deptData.description"></textarea>
                </b-col>
              </b-col>
              <b-col xl="6" id="right--col__content">
                <b-row>
                  <b-col lg="12" class="mb-3">
                    <label for="addressInput" class="form-label mb-1">
                      Địa chỉ <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="addressInput"
                           placeholder="Nhập địa chỉ đơn vị phòng ban"
                           name="address" v-model="deptData.address">
                  </b-col>
                  <b-col lg="6" class="mb-3">
                    <label class="form-label mb-1">Trưởng phòng</label>
                    <div data-input-flag data-option-flag-name>
                      <input type="text" class="form-control rounded-end flag-input" readonly @click="removeSearch"
                             v-model="userManage.name" placeholder="Chọn trưởng phòng" data-bs-toggle="dropdown"
                             aria-expanded="false"/>
                      <div class="dropdown-menu w-100">
                        <div class="p-2 px-3 pt-1 searchlist-input">
                          <input type="text" class="form-control form-control border" v-model="searchUser"
                                 @keyup="getUser" placeholder="Tìm kiếm người dùng"/>
                        </div>
                        <ul class="list-unstyled dropdown-menu-list mb-0">
                          <li class="dropdown-item d-flex align-items-center" v-for="user in userData"
                              @click="getManage(user,userManage)">
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
                  <b-col lg="6" class="mb-3">
                    <label class="form-label mb-1">Phó phòng</label>
                    <div data-input-flag data-option-flag-name>
                      <input type="text" class="form-control rounded-end flag-input" readonly
                             v-model="userSubManage.name" placeholder="Chọn phó phòng" @click="removeSearch"
                             data-bs-toggle="dropdown" aria-expanded="false"/>
                      <div class="dropdown-menu w-100">
                        <div class="p-2 px-3 pt-1 searchlist-input">
                          <input type="text" class="form-control form-control border" v-model="searchUser"
                                 @keyup="getUser" placeholder="Tìm kiếm người dùng"/>
                        </div>
                        <ul class="list-unstyled dropdown-menu-list mb-0">
                          <li class="dropdown-item d-flex align-items-center" v-for="user in userData"
                              @click="getManage(user,userSubManage)">
                            <div class="flex-shrink-0 me-2">
                              <img :src="user.photo ? user.photo : baseURL + `/media/photos/avatar-1.jpg`"
                                   alt="user" class="options-flagimg avatar-xs rounded-circle" height="20"></div>
                            <div class="flex-grow-1">
                              <div class="d-flex">
                                <div class="me-1">{{ user.first_name }} {{ user.last_name }}</div>
                                <span class="text-muted">({{ user.username }})</span></div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </b-col>
                  <b-col lg="12" class="mb-3">
                    <label class="form-label mb-1">Khu công nghiệp</label>
                    <Multiselect mode="tags" :close-on-select="false" v-model="valueSelected"
                                 noResultsText="Danh sách trống hoặc đã lựa chọn hết"
                                 :searchable="true" :create-option="true" :options="kcnData"/>
                  </b-col>
                </b-row>
                <div class="mb-3">
                  <label class="form-label mb-1">Thành viên</label>
                  <div class="avatar-group">
                    <b-link href="javascript: void(0);" v-for="person in memberListChoose" class="avatar-group-item"
                            v-b-tooltip.hover :title="`${person.first_name} ${person.last_name}`">
                      <div class="avatar-xs">
                        <img :src="person.photo ? person.photo : baseURL + `/media/photos/avatar-1.jpg`"
                             alt="" class="rounded-circle img-fluid avatar-xs"/>
                      </div>
                    </b-link>
                    <div class="avatar-group-item" v-b-tooltip.hover title="Thêm thành viên">
                      <div class="avatar-xs" @click="modalAddMember = !modalAddMember">
                        <div class="avatar-title fs-16 rounded-circle bg-light border text-primary">+</div>
                      </div>
                    </div>
                  </div>
                  <b-modal v-model="modalAddMember" hide-footer title="Thành viên" class="v-modal-custom" centered
                           modal-class="zoomIn">
                    <input type="text" class="form-control form-control border mb-2" v-model="searchUser"
                           placeholder="Tìm kiếm" @keyup="search"/>
                    <div data-simplebar style="height: 225px;">
                      <div class="list-group list-group-flush">
                        <label class="list-group-item d-flex align-items-center ps-0 cursor-pointer"
                               v-for="member in memberList" :key="member.id">
                          <input class="form-check-input me-3" type="checkbox" :value="member.id"
                                 v-model="checkedMembers"/>
                          <div class="d-flex align-items-center">
                            <div class="flex-shrink-0">
                              <img alt class="avatar-xxs rounded-circle"
                                   :src="member.photo ? member.photo : baseURL + `/media/photos/avatar-1.jpg`"/>
                            </div>
                            <div class="flex-grow-1 ms-2">
                              {{ member.first_name }} {{ member.last_name }}
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                    <div class="modal-footer v-modal-footer">
                      <b-button type="button" variant="success" @click="getListMember">Lưu</b-button>
                    </div>
                  </b-modal>
                </div>
              </b-col>
            </b-row>
          </b-card-body>
          <b-card-footer>
            <div class="hstack gap-2">
              <b-button variant="danger" type="reset">Hủy</b-button>
              <b-button variant="success" type="submit" @click.prevent="handleSubmit">Lưu</b-button>
            </div>
          </b-card-footer>
        </b-card>
      </form>
    </div>
  </Layout>
</template>

<style scoped>
@media (max-width: 1200px) {
  #right--col__content {
    margin-top: 0;
  }
}
</style>