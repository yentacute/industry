<script setup>
import flatPickr from "vue-flatpickr-component";
import {ref, reactive, computed, watch} from "vue";
import Layout from "../../../layouts/main.vue";
import http from "../../../helpers/api/axiosHttp";
import {useRoute, useRouter} from "vue-router";
import {errorToast, successToast} from "../../../helpers/api/toastStyle";
import {BASE_URL} from "../../../helpers/api/axiosHttp";
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";
import axios from "axios";

const birthConfig = ref({
  altFormat: "d/m/Y",
  altInput: true,
  dateFormat: "Y-m-d",
});
const industrialData = ref([]);
const roleData = ref([]);
const userData = ref({});
const userRole = ref({});
const enterpriseUser = ref({});
const route = useRoute();
const router = useRouter();
const baseURL = ref(BASE_URL);
const valueSelected = ref([]);
let isUpdate = false;
const attemptSubmit = ref(false);
const showPass = ref(false)
const validation = reactive({
  name: false,
  email: {
    invalid: false,
    isexits: false,
  },
  phone: false,
});

if (route.params.id) isUpdate = true;

const items = reactive([
  {
    name: "Người dùng",
  },
  {
    name: "Quản lý người dùng",
    to: "ManageUserPage",
  },
  {
    name: isUpdate ? "Cập nhật người dùng" : "Thêm người dùng",
  },
]);

const address = ref({
  title: "Người dùng",
  details: [],
});

const onFileChange = (e) => {
  const file = e.target.files[0];
  document.getElementById("img--file__output").src = URL.createObjectURL(file);
};

const getSelection = async () => {
  const industrial = await http.get(`/industrial-area?slug`);
  const role = await http.get(`/role/`);
  /*await axios.get('https://khucongnghiep.hcmgis.vn/kcn-songcong2/api/doanhnghiep').then(response => {
    enterpriseUser.value = response.data;
  })
    .catch(error => {
      console.log(error);
    });*/
  if (role.data) roleData.value = role.data;
  if (industrial.data) {
    let listItem = {}
    industrialData.value = [];
    industrial.data.forEach((res) => {
      listItem = {};
      listItem.value = res.slug;
      listItem.label = res.name;
      industrialData.value.push(listItem);
    })
  }
};
getSelection();

if (isUpdate) {
  const getUserUpdate = async () => {
    const user = await http.get(`/user/${route.params.id}/`);
    userData.value = user.data;
    if (userData.value.user_role === null) userData.value.user_role = "";
    else userData.value.user_role = user.data.user_role.id;
    if (user.data.industrial_area)
      userData.value.industrial_area.forEach((item) => valueSelected.value.push(item.slug));
    if (user.data.user_role) userRole.value = user.data.user_role;
  };
  getUserUpdate();
} else userData.value.user_role = "";

const missingFName = computed(() => {
  return !userData.value.first_name;
});

const missingLName = computed(() => {
  return !userData.value.last_name;
});

const missingUName = computed(() => {
  return !userData.value.username;
});

const missingPass = computed(() => {
  return !userData.value.password;
});

const missingEmail = computed(() => {
  return !userData.value.email;
});

const missingPhone = computed(() => {
  return !userData.value.phone;
});

const handleSubmit = async () => {
  attemptSubmit.value = true;
  validation.email.isexits = false;
  validation.email.invalid = false;
  validation.phone = false;
  validation.name = false;
  if (missingUName.value || missingFName.value || missingLName.value || missingPhone.value || missingEmail.value)
    return;
  let item = new FormData(document.getElementById("user-manage"));
  if (userData.enterprise)
    item.append("enterprise", userData.value.enterprise);
  if (userData.value.user_role)
    item.append("user_role", `{"id": "${userData.value.user_role}"}`);
  let listItemIndus = [];
  valueSelected.value.forEach((item) => listItemIndus.push({"slug": item}));
  item.append('industrial_area', `${JSON.stringify(listItemIndus)}`);
  let response;
  if (isUpdate) {
    response = await http.put(`/user/${route.params.id}/`, item).catch(error => {
      errorAPI(error);
    });
  } else {
    if (missingPass.value) return;
    response = await http.post(`/user/`, item).catch(error => {
      errorAPI(error);
    });
  }
  if (isUpdate) {
    if (response.status === 200) {
      successToast("Đã cập nhật thành công!");
    } else {
      errorToast("Cập nhật thất bại!");
    }
  } else {
    if (response.status === 201) {
      successToast("Đã thêm mới thành công!");
      router.push({name: "ManageUserPage"});
    } else {
      errorToast("Thêm mới thất bại!");
    }
  }
};

const errorAPI = (error) => {
  if (error.response.status === 400) {
    console.log(error.response.data);
    if (error.response.data.hasOwnProperty('username')) {
      validation.name = true;
      return;
    }
    if (error.response.data.hasOwnProperty('msg')) {
      if (Object.values(error.response.data)[0]?.includes(`Email đã được liên kết với một tài khoản khác.`)) {
        validation.email.isexits = true;
        validation.email.invalid = false;
        return;
      }
      if (Object.values(error.response.data)[0]?.includes(`Số điện thoại không hợp lệ.`)) {
        validation.phone = true;
        return;
      }
    }
    if (error.response.data.hasOwnProperty('email')) {
      if (Object.values(error.response.data)[0]?.includes(`Enter a valid email address.`)) {
        validation.email.invalid = true;
        validation.email.isexits = false;
        return;
      }
    }
  } else {
    errorToast("Đã xảy ra lỗi. Vui lòng thử lại sau!")
  }
}
</script>

<template>
  <Layout :items="items" :address="address" chooseMenu="nguoi-dung" systemMenu>
    <div class="page-main__content" ref="containerContent">
      <form id="user-manage">
        <b-card no-body>
          <b-card-header class="d-flex">
            <h5 class="card-title flex-grow-1">
              {{ isUpdate ? "Cập nhật người dùng" : "Thêm mới người dùng" }}
            </h5>
            <router-link :to="{ name: 'ManageUserPage' }" type="button" v-b-tooltip.hover title="Đóng"
                         class="flex-shrink-0 btn btn-ghost-primary btn-close flex-shrink-0"></router-link>
          </b-card-header>
          <b-card-body>
            <b-row class="g-3">
              <b-col xl="12">
                <div class="d-flex align-items-center gap-4 mb-2" id="flex--image__input">
                  <div class="flex-shrink-0">
                    <div class="profile-user position-relative d-inline-block mx-auto">
                      <img :src="userData.photo
                        ? userData.photo
                        : baseURL + `/media/photos/avatar-1.jpg`
                        " class="avatar-xl img-thumbnail user-profile-image" id="img--file__output"
                           alt="user-profile-image"/>
                      <div class="avatar-xs p-0 rounded-circle profile-photo-edit">
                        <input id="img-file-input" name="photo" type="file" @change="onFileChange"
                               class="profile-img-file-input"/>
                        <label for="img-file-input" class="profile-photo-edit avatar-xxs">
                          <span class="avatar-title rounded-circle bg-light text-body">
                            <i class="ri-camera-fill"></i>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <b-row>
                  <b-col lg="4" class="mb-3">
                    <label for="usernameInput" class="form-label mb-1">
                      Tên tài khoản <span class="text-danger">*</span>
                    </label>
                    <input type="text" class="form-control" id="usernameInput" placeholder="Nhập tên tài khoản"
                           name="username" v-model="userData.username" autocomplete="new-username"
                           :class="{ 'is-invalid': attemptSubmit && missingUName || attemptSubmit && validation.name}"/>
                    <div class="invalid-feedback d-block" v-if="attemptSubmit && missingUName">
                      Vui lòng nhập tài khoản người dùng
                    </div>
                    <div class="invalid-feedback d-block" v-if="attemptSubmit && validation.name">
                      Một người dùng với tên tài khoản này đã tồn tại
                    </div>
                  </b-col>
                  <b-col lg="4" class="mb-3">
                    <label for="fnameInput" class="form-label mb-1">Họ <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="fnameInput" placeholder="Nhập họ và tên đệm"
                           name="first_name" v-model="userData.first_name"
                           :class="{ 'is-invalid': attemptSubmit && missingFName}"/>
                    <div class="invalid-feedback d-block" v-if="attemptSubmit && missingFName">
                      Vui lòng nhập họ và tên đệm người dùng
                    </div>
                  </b-col>
                  <b-col lg="4" class="mb-3">
                    <label for="lnameInput" class="form-label mb-1">Tên <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="lnameInput" placeholder="Nhập tên" name="last_name"
                           v-model="userData.last_name" :class="{ 'is-invalid': attemptSubmit && missingLName}"/>
                    <div class="invalid-feedback d-block" v-if="attemptSubmit && missingLName">
                      Vui lòng nhập tên người dùng
                    </div>
                  </b-col>
                  <b-col lg="4" class="mb-3" v-if="isUpdate === false">
                    <label for="passwordInput" class="form-label mb-1">
                      Mật khẩu <span class="text-danger">*</span>
                    </label>
                    <div class="position-relative auth-pass-inputgroup">
                      <input :type="showPass ? 'text' : 'password'" class="form-control pe-5 password-input"
                             placeholder="Nhập mật khẩu"
                             name="password" id="passwordInput" autocomplete="new-password" v-model="userData.password"
                             :class="{ 'is-invalid': attemptSubmit && missingPass}"/>
                      <button :class="{'me-3': attemptSubmit && missingPass}" @click="showPass = !showPass"
                              class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                              type="button" id="password-addon">
                        <i class="ri-eye-fill align-middle"></i>
                      </button>
                    </div>
                    <div class="invalid-feedback d-block" v-if="attemptSubmit && missingPass">
                      Vui lòng nhập mật khẩu
                    </div>
                  </b-col>
                  <b-col lg="4" class="mb-3">
                    <label for="emailInput" class="form-label mb-1">Email <span class="text-danger">*</span></label>
                    <input type="email" class="form-control" id="emailInput" placeholder="Nhập email" name="email"
                           v-model="userData.email" :class="{ 'is-invalid': attemptSubmit && missingEmail || attemptSubmit
                                         && validation.email.invalid || attemptSubmit && validation.email.isexits}"/>
                    <div class="invalid-feedback d-block" v-if="attemptSubmit && missingEmail">
                      Vui lòng nhập email người dùng
                    </div>
                    <div class="invalid-feedback d-block" v-if="attemptSubmit && validation.email.invalid">
                      Email không hợp lệ
                    </div>
                    <div class="invalid-feedback d-block" v-else-if="attemptSubmit && validation.email.isexits">
                      Email này đã được đăng ký với tài khoản khác
                    </div>
                  </b-col>
                  <b-col lg="4" class="mb-3">
                    <label for="phoneInput" class="form-label mb-1">
                      Số điện thoại <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="phoneInput" placeholder="Nhập số điện thoại"
                           name="phone" v-model="userData.phone"
                           :class="{ 'is-invalid': attemptSubmit && missingPhone || attemptSubmit && validation.phone}"/>
                    <div class="invalid-feedback d-block" v-if="attemptSubmit && missingPhone">
                      Vui lòng nhập số điện thoại người dùng
                    </div>
                    <div class="invalid-feedback d-block" v-if="attemptSubmit && validation.phone">
                      Số điện thoại không hợp lệ
                    </div>
                  </b-col>
                  <b-col lg="4" class="mb-3">
                    <label class="form-label mb-1">Ngày sinh</label>
                    <flat-pickr v-model="userData.birth" name="birth" :config="birthConfig"
                                class="form-control flatpickr-input"/>
                  </b-col>
                  <b-col lg="4" class="mb-3">
                    <label class="form-label mb-1">Giới tính</label>
                    <select class="form-select" name="gender" v-model="userData.gender">
                      <option value="0">Nam</option>
                      <option value="1">Nữ</option>
                    </select>
                  </b-col>

                  <b-col lg="4" class="mb-3">
                    <label for="addressInput" class="form-label mb-1">Địa chỉ</label>
                    <input type="text" class="form-control" id="addressInput" placeholder="Nhập địa chỉ" name="address"
                           v-model="userData.address"/>
                  </b-col>
                  <b-col lg="4" class="mb-3">
                    <label class="form-label mb-1">Khu công nghiệp</label>
                    <Multiselect mode="tags" :close-on-select="false" v-model="valueSelected" class="form-control"
                                 noResultsText="Danh sách trống hoặc đã lựa chọn hết" :searchable="true"
                                 :create-option="true"
                                 :options="industrialData"/>
                  </b-col>
                  <b-col lg="4" class="mb-3">
                    <label class="form-label mb-1">Vai trò <span class="text-danger">*</span></label>
                    <select class="form-select" v-model="userData.user_role">
                      <option v-for="role in roleData" :value="role.id">
                        {{ role.name }}
                      </option>
                      <option value="">Người dùng</option>
                    </select>
                  </b-col>
                  <b-col lg="4" class="mb-3">
                    <label class="form-label mb-1">Chọn doanh nghiệp</label>
                    <!--                    <select name="enterprise" class="form-select" v-model="enterpriseUser.id">
                                          <option v-for="ent in enterpriseUser" :value="ent.id">
                                            {{ ent.ten }}
                                          </option>
                                        </select>-->
                    <select name="enterprise" class="form-select" v-model="userData.enterprise">
                      <option value="32">CÔNG TY TNHH KSD VINA</option>
                      <option value="33">CÔNG TY TNHH AJU VINA</option>
                      <option value="34">AONE HITECH COMPANY LIMITED</option>
                      <option value="35">CÔNG TY TNHH KOREA ELECTRIC TERMINAL VIETNAM</option>
                      <option value="37">Foxcon Thái Nguyên</option>
                      <option value="38">Doanh nghiệp thuộc Sông Công</option>
                      <option value="36">Công ty HMD 321</option>
                      <option value="30">CÔNG TY TNHH DOORIEN VINA</option>
                    </select>
                  </b-col>

                  <b-col lg="12" class="mb-3">
                    <label for="introInput" class="form-label mb-1">Giới thiệu</label>
                    <textarea class="form-control" id="introInput" rows="5" v-model="userData.introduce"
                              name="introduce"
                              placeholder="Nhập thông tin giới thiệu"></textarea>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-card-body>
          <b-card-footer>
            <div class="hstack gap-2">
              <b-button variant="danger" type="reset">Hủy</b-button>
              <b-button variant="success" type="submit" @click.prevent="handleSubmit">Lưu
              </b-button>
            </div>
          </b-card-footer>
        </b-card>
      </form>
    </div>
  </Layout>
</template>

<style scoped>
@media (max-width: 991px) {
  #flex--image__input {
    flex-direction: column;
  }
}
</style>
