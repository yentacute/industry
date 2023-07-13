<script setup>
import {ref, reactive, computed, defineProps} from 'vue';
import Layout from '../../../layouts/main.vue';
import http from "../../../helpers/api/axiosHttp";
import {useRoute, useRouter} from 'vue-router';
import {errorToast, successToast} from "../../../helpers/api/toastStyle";
import {BASE_URL} from "../../../helpers/api/axiosHttp";

const departmentData = ref([]);
const lstTemplateData = ref([]);
const memberListChoose = ref([]);
const userData = ref({});
const searchUser = ref('');
const route = useRoute();
const router = useRouter();
const checkedMembers = ref([]);
const baseURL = ref(BASE_URL);
const checklstMember = ref([]);
const userManage = reactive({
  id: '',
  name: '',
});
const userSubManage = reactive({
  id: '',
  name: '',
});
let isUpdate = false;
const modalAddMember = ref(false);
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

if (route.params.id) isUpdate = true;
const address = ref({
  title: props.nameKCN,
  details: [{name: "Quản lý phòng ban", to: `${props.slug}ManageDepartmentPage`}, {name: isUpdate ? "Cập nhật phòng ban" : "Thêm mới phòng ban", to: "#"}],
});

const getUser = async () => {
  const user = await http.get(`/user/?q=${searchUser.value}&type=search`);
  userData.value = user.data.results;
}
getUser();

if (isUpdate) {
  const getIndusData = async () => {
    console.log(props.slug);
    const dept = await http.get(`/${props.slug}/department/${route.params.id}/`);
    departmentData.value = dept.data;
    if (departmentData.value.manager) {
      userManage.id = departmentData.value.manager.id;
      userManage.name = `${departmentData.value.manager.first_name} ${departmentData.value.manager.last_name}`;
    }
    if (departmentData.value.sub_manager) {
      userSubManage.id = departmentData.value.sub_manager.id;
      userSubManage.name = `${departmentData.value.sub_manager.first_name} ${departmentData.value.sub_manager.last_name}`;
    }
    if (departmentData.value.member) {
      memberListChoose.value = departmentData.value.member;
      memberListChoose.value.forEach((item) => checklstMember.value.push(item.id))
    }
  }
  getIndusData();
}

const getTemplateData = async () => {
  const temp = await http.get(`/department-manager/get-template`);
  lstTemplateData.value = temp.data;
}
getTemplateData();

const getManage = async (res, item) => {
  item.id = res.id;
  item.name = `${res.first_name} ${res.last_name}`
}

const removeSearch = async () => {
  searchUser.value = '';
  getUser();
}

const memberList = computed(() => {
  if (!searchUser.value) {
    return userData.value;
  }
  const lowerSearchValue = searchUser.value.toLowerCase();
  return userData.value.filter((member) => {
    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
    return fullName.includes(lowerSearchValue);
  });
});

const getListMember = () => {
  const checkedMemberIds = checkedMembers.value;
  memberListChoose.value = userData.value.filter((member) => checkedMemberIds.includes(member.id));
  modalAddMember.value = false;
}

const handleSubmit = async (e) => {
  let item = new FormData(document.getElementById("department-manage"));
  item.append('manager_id', userManage.id);
  item.append('sub_manager_id', userSubManage.id);
  let listItemMember = [];
  memberListChoose.value.forEach((item) => listItemMember.push(`"${item.id}"`))
  item.append('member', `[${listItemMember}]`);
  if (!isUpdate) {
    const response = await http.post(`/${props.slug}/department/`, item);
    if (response.status === 201) {
      successToast("Đã thêm mới thành công!");
      router.push({name: `${props.slug}ManageDepartmentPage`});
    } else {
      errorToast("Thêm mới thất bại!")
    }
  } else {
    const response = await http.patch(`/${props.slug}/department/${route.params.id}/`, item);
    if (response.status === 200) {
      successToast("Đã cập nhật thành công!");
    } else {
      errorToast("Cập nhật thất bại!")
    }
  }

}

</script>

<template>
  <Layout :address="address" :items="address.details" chooseMenu="phong-ban" :slug="props.slug">
    <div class="page-main__content" ref="containerContent">
      <form id="department-manage">
        <b-card no-body>
          <b-card-header class="d-flex">
            <h5 class="card-title flex-grow-1">{{
                isUpdate ? 'Cập nhật đơn vị phòng ban' : 'Thêm mới đơn vị phòng ban'
              }}</h5>
            <router-link :to="{name: `${props.slug}ManageDepartmentPage` }" type="button" v-b-tooltip.hover title="Đóng"
                         class="flex-shrink-0 btn btn-ghost-primary btn-close"></router-link>
          </b-card-header>
          <b-card-body>
            <b-row class="g-4">
              <b-col xl="6">
                <b-col lg="12" class="mb-3">
                  <label for="nameInput" class="form-label mb-1">
                    Tên đơn vị phòng ban <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="nameInput" placeholder="Nhập tên đơn vị phòng ban"
                         name="name" v-model="departmentData.name">
                </b-col>
                <b-col lg="12" class="mb-3">
                  <label class="form-label mb-1">Tên ngắn <span class="text-danger">*</span></label>
                  <select class="form-select" name="short_name" v-model="departmentData.short_name">
                    <option v-for="item in lstTemplateData" :key="item.short_name" :value="item.short_name">
                      {{ item.short_name }}
                    </option>
                  </select>
                </b-col>
                <b-col lg="12" class="mb-3">
                  <label for="emailInput" class="form-label mb-1">Email <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="emailInput" placeholder="Nhập email đơn vị phòng ban"
                         name="email" v-model="departmentData.email">
                </b-col>
                <b-row>
                  <b-col sm="6" class="mb-3">
                    <label for="phoneInput" class="form-label mb-1">Điện thoại
                      <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="phoneInput" placeholder="Nhập số điện thoại"
                           name="phone_number" v-model="departmentData.phone_number">
                  </b-col>
                  <b-col sm="6" class="mb-3">
                    <label for="faxInput" class="form-label mb-1">Fax</label>
                    <input type="text" class="form-control" id="faxInput" placeholder="Nhập số fax"
                           name="fax" v-model="departmentData.fax">
                  </b-col>
                </b-row>
                <b-col lg="12" class="mb-3">
                  <label for="descriptionInput" class="form-label mb-1">Mô tả đơn vị phòng ban</label>
                  <textarea class="form-control" id="descriptionInput" rows="2" name="description"
                            v-model="departmentData.description"></textarea>
                </b-col>
              </b-col>
              <b-col xl="6" id="right--col__content">
                <b-row>
                  <b-col lg="12" class="mb-3">
                    <label for="addressInput" class="form-label mb-1">
                      Địa chỉ <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="addressInput"
                           placeholder="Nhập địa chỉ đơn vị phòng ban"
                           name="address" v-model="departmentData.address">
                  </b-col>
                  <b-col lg="6" class="mb-3">
                    <label class="form-label mb-1">Trưởng phòng</label>
                    <div data-input-flag data-option-flag-name>
                      <input type="text" class="form-control rounded-end flag-input" readonly @click="removeSearch"
                             v-model="userManage.name" placeholder="Chọn người dùng" data-bs-toggle="dropdown"
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
                             v-model="userSubManage.name" placeholder="Chọn người dùng" @click="removeSearch"
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
                </b-row>
                <div>
                  <label class="form-label">Thành viên</label>
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
                           @keyup="search"/>
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