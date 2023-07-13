<script>
import {usePost, usePatch} from "../../../helpers/api/api.js";
import {errorToast} from "../../../helpers/api/toastStyle";
import VerifyEmailComponent from "../VerifyEmailComponent.vue";


export default {
  components: {
    'verify-email': VerifyEmailComponent
  },
  data() {
    return {
      userData: {
        id: '',
        fname: '',
        lname: '',
        username: '',
        password: '',
        rePass: '',
        phone: '',
        gender: 0,
        email: '',
        publicInfo: {
          email: true,
          phone: true,
        }
      },
      validation: {
        name: false,
        email: {
          invalid: false,
          isexits: false,
        },
        phone: false,
      },
      attemptSubmit: false,
      statusCode: 0,
      signupSuccess: 0,
      showPass: {
        pass: false,
        repass: false
      }
    }

  },
  computed: {
    missingFName: function () {
      return this.userData.fname === '';
    },
    missingLName: function () {
      return this.userData.lname === '';
    },
    missingUName: function () {
      return this.userData.username === '';
    },
    missingPass: function () {
      return this.userData.password === '';
    },
    missingrePass: function () {
      return this.userData.rePass === '';
    },
    missingEmail: function () {
      return this.userData.email === '';
    },
    missingPhone: function () {
      return this.userData.phone === '';
    },
    passNotMatch: function () {
      return this.userData.rePass !== this.userData.password;
    },
  },
  methods: {
    async handleSubmit(event) {
      const vm = this;
      vm.attemptSubmit = true;
      vm.validation.email.isexits = false;
      vm.validation.email.invalid = false;
      vm.validation.phone = false;
      vm.validation.name = false;
      vm.signupSuccess = 0;
      if (vm.missingFName || vm.missingLName || vm.missingUName || vm.missingPass
        || vm.missingrePass || vm.missingEmail || vm.missingPhone || vm.passNotMatch)
        event.preventDefault();
      else {
        let item = new FormData();
        item.append('first_name', vm.userData.fname);
        item.append('last_name', vm.userData.lname);
        item.append('username', vm.userData.username);
        item.append('phone', vm.userData.phone);
        item.append('email', vm.userData.email);
        item.append('gender', vm.userData.gender);
        item.append('password', vm.userData.rePass);
        item.append('info_public', `{"email": ${vm.userData.publicInfo.email}, "phone": ${vm.userData.publicInfo.phone}, "address": true}`)
        await usePost('user', item).then(data => {
          vm.statusCode = data.status;
          return data.json();
        }).then(res => {
          if (res) {
            if (vm.statusCode === 400 && res.hasOwnProperty('username')) {
              vm.validation.name = true;
              return;
            }
            if (vm.statusCode === 400 && res.hasOwnProperty('msg')) {
              if (Object.values(res)[0]?.includes(`Email đã được liên kết với một tài khoản khác.`)) {
                vm.validation.email.isexits = true;
                vm.validation.email.invalid = false;
                return;
              }
              if (Object.values(res)[0]?.includes(`Số điện thoại không hợp lệ.`)) {
                vm.validation.phone = true;
                return;
              }
            }
            if (vm.statusCode === 400 && res.hasOwnProperty('email')) {
              if (Object.values(res)[0]?.includes(`Enter a valid email address.`)) {
                vm.validation.email.invalid = true;
                vm.validation.email.isexits = false;
                return;
              }
            }
            if (vm.statusCode === 201 && res.username && res.email && res.phone) {
              vm.userData.id = res.id;
              vm.signupSuccess = 1;
              vm.attemptSubmit = false;
            } else {
              errorToast("Đăng ký thất bại!");
            }
          } else {
            errorToast("Hệ thống bảo trì!");
          }
        })
      }
    },
  },
  mounted() {
  },
  watch: {
    'userData.fname': function (value) {
      this.attemptSubmit = false;
    },
    'userData.lname': function (value) {
      this.attemptSubmit = false;
    },
    'userData.username': function (value) {
      this.attemptSubmit = false;
    },
    'userData.password': function (value) {
      this.attemptSubmit = false;
    },
    'userData.rePass': function (value) {
      this.attemptSubmit = false;
    },
    'userData.email': function (value) {
      this.attemptSubmit = false;
    },
    'userData.phone': function (value) {
      this.attemptSubmit = false;
    },
    'userData.gender': function (value) {
      this.attemptSubmit = false;
    },
  }

};
</script>

<template>
  <div class="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
    <div class="bg-overlay"></div>
    <div class="auth-page-content overflow-hidden pt-lg-5">
      <b-container>
        <b-row>
          <b-col lg="12">
            <b-card no-body class="overflow-hidden m-0">
              <b-row class="justify-content-center g-0">
                <b-col lg="5">
                  <div class="p-lg-5 p-4 nft-hero h-100">
                    <div class="bg-overlay opacity-50"></div>
                    <div class="position-relative h-100 d-flex flex-column">
                      <div class="mb-4">
                        <router-link to="/" class="d-block">
                          <img src="@/assets/images/logo-thai-nguyen.svg" alt="" height="40">
                        </router-link>
                      </div>
                      <div class="mt-auto">
                        <div class="mb-3">
                          <i class="ri-double-quotes-l display-4 text-success"></i>
                        </div>

                        <div id="qoutescarouselIndicators" class="carousel slide"
                             data-bs-ride="carousel">
                          <div class="carousel-indicators">
                            <button type="button" data-bs-target="#qoutescarouselIndicators"
                                    data-bs-slide-to="0" class="active" aria-current="true"
                                    aria-label="Slide 1"></button>
                            <button type="button" data-bs-target="#qoutescarouselIndicators"
                                    data-bs-slide-to="1" aria-label="Slide 2"></button>
                            <button type="button" data-bs-target="#qoutescarouselIndicators"
                                    data-bs-slide-to="2" aria-label="Slide 3"></button>
                          </div>
                          <div class="carousel-inner text-center text-white pb-5">
                            <div class="carousel-item active">
                              <p class="fs-15 fst-italic">" Map4D - Nền tảng của các nền tảng "</p>
                            </div>
                            <div class="carousel-item">
                              <p class="fs-15 fst-italic">" Dữ liệu và nền tảng công nghệ phải thuộc về Việt Nam,
                                do người Việt Nam làm chủ."</p>
                            </div>
                            <div class="carousel-item">
                              <p class="fs-15 fst-italic">" Map4D
                                Giải pháp thay thế hoàn hảo Google Maps API tại Việt Nam "</p>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </b-col>

                <b-col lg="7">
                  <div class="p-lg-4 p-4">
                    <div>
                      <h5 class="text-primary">Đăng ký tài khoản</h5>
                      <p class="text-muted">Đăng ký một tài khoản mới để truy cập hệ thống.</p>
                    </div>
                    <div v-if="signupSuccess === 0">
                      <div class="mt-4">
                        <form>
                          <b-row>
                            <b-col md="6">
                              <div class="mb-3">
                                <label for="userFirstName" class="form-label">Họ <span
                                  class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="userFirstName" v-model="userData.fname"
                                       placeholder="Họ" :class="{ 'is-invalid': attemptSubmit && missingFName}">
                                <div class="invalid-feedback d-block" v-if="attemptSubmit && missingFName">
                                  Vui lòng nhập họ của bạn
                                </div>
                              </div>
                            </b-col>
                            <b-col md="6">
                              <div class="mb-3">
                                <label for="userLastName" class="form-label">Tên <span
                                  class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="userLastName" v-model="userData.lname"
                                       placeholder="Tên"
                                       :class="{ 'is-invalid': attemptSubmit && missingLName}">
                                <div class="invalid-feedback d-block" v-if="attemptSubmit && missingLName">
                                  Vui lòng nhập tên của bạn
                                </div>
                              </div>
                            </b-col>
                            <b-col md="6">
                              <div class="mb-3">
                                <label for="username" class="form-label">Tài khoản <span
                                  class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="username" v-model="userData.username"
                                       :class="{ 'is-invalid': attemptSubmit && missingUName || attemptSubmit && validation.name}"
                                       placeholder="Nhập tài khoản">
                                <div class="invalid-feedback d-block" v-if="attemptSubmit && missingUName">
                                  Vui lòng nhập tài khoản đăng ký
                                </div>
                                <div class="invalid-feedback d-block" v-if="attemptSubmit && validation.name">
                                  Một người dùng với tên tài khoản này đã tồn tại
                                </div>
                              </div>
                            </b-col>
                            <b-col md="6">
                              <div class="mb-3">
                                <label for="userPhoneNumber" class="form-label">Số điện thoại <span
                                  class="text-danger">*</span></label>
                                <div class="input-group">
                                  <input type="tel" id="userPhoneNumber" v-model="userData.phone"
                                         placeholder="Số điện thoại" class="form-control"
                                         :class="{ 'is-invalid': attemptSubmit && missingPhone || attemptSubmit && validation.phone}">
                                  <div class="input-group-text">
                                    <input class="form-check-input mt-0 cursor-pointer" type="checkbox" value=""
                                           v-b-tooltip.hover title="Công khai thông tin của bạn"
                                           v-model="userData.publicInfo.phone">
                                  </div>
                                </div>
                                <div class="invalid-feedback d-block" v-if="attemptSubmit && missingPhone">
                                  Vui lòng nhập số điện thoại đăng ký
                                </div>
                                <div class="invalid-feedback d-block" v-if="attemptSubmit && validation.phone">
                                  Số điện thoại không hợp lệ
                                </div>
                              </div>
                            </b-col>
                            <b-col md="6">
                              <div class="mb-3">
                                <label for="userEmail" class="form-label">Email <span
                                  class="text-danger">*</span></label>
                                <div class="input-group">
                                  <input type="email" id="userEmail" class="form-control" v-model="userData.email"
                                         placeholder="Email" :class="{ 'is-invalid': attemptSubmit && missingEmail || attemptSubmit
                                         && validation.email.invalid || attemptSubmit && validation.email.isexits}">
                                  <div class="input-group-text">
                                    <input class="form-check-input mt-0 cursor-pointer" type="checkbox" value=""
                                           v-b-tooltip.hover
                                           title="Công khai thông tin của bạn" v-model="userData.publicInfo.email">
                                  </div>
                                </div>
                                <div class="invalid-feedback d-block" v-if="attemptSubmit && missingEmail">
                                  Vui lòng nhập email đăng ký
                                </div>
                                <div class="invalid-feedback d-block" v-if="attemptSubmit && validation.email.invalid">
                                  Email không hợp lệ
                                </div>
                                <div class="invalid-feedback d-block"
                                     v-else-if="attemptSubmit && validation.email.isexits">
                                  Email này đã được đăng ký với tài khoản khác
                                </div>
                              </div>
                            </b-col>
                            <b-col md="6">
                              <div class="mb-3">
                                <label class="mb-2">Giới tính</label>
                                <select class="form-control" v-model="userData.gender">
                                  <option value="0">Nam</option>
                                  <option value="1">Nữ</option>
                                </select>
                              </div>
                            </b-col>
                            <b-col md="6">
                              <div class="mb-3">
                                <label class="form-label" for="password-input">Mật khẩu đăng ký <span
                                  class="text-danger">*</span></label>
                                <div class="position-relative auth-pass-inputgroup">
                                  <input :type="showPass.pass ? 'text' : 'password'" id="password-input"
                                         class="form-control pe-5 password-input" aria-describedby="passwordInput"
                                         v-model="userData.password" placeholder="Nhập mật khẩu"
                                         :class="{ 'is-invalid': attemptSubmit && missingPass}">
                                  <button type="button" id="password-addon" @click="showPass.pass = !showPass.pass"
                                          :class="{'me-3': attemptSubmit && missingPass}"
                                          class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon">
                                    <i class="align-middle"
                                       :class="showPass.pass ? 'ri-eye-off-fill': 'ri-eye-fill'"></i>
                                  </button>
                                  <div class="invalid-feedback d-block" v-if="attemptSubmit && missingPass">
                                    Vui lòng nhập mật khẩu
                                  </div>
                                </div>
                              </div>
                            </b-col>
                            <b-col md="6">
                              <div class="mb-3">
                                <label class="form-label" for="password-input">Nhập lại mật khẩu <span
                                  class="text-danger">*</span></label>
                                <div class="position-relative auth-pass-inputgroup">
                                  <input :type="showPass.repass ? 'text' : 'password'"
                                         class="form-control pe-5 password-input"
                                         v-model="userData.rePass" id="re-password-input" placeholder="Nhập mật khẩu"
                                         :class="{ 'is-invalid': attemptSubmit && missingrePass || attemptSubmit && passNotMatch}">
                                  <button @click="showPass.repass = !showPass.repass"
                                          :class="{'me-3': attemptSubmit && missingrePass || attemptSubmit && passNotMatch}"
                                          class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                          type="button" id="re-password-addon">
                                    <i class="align-middle"
                                       :class="showPass.repass ? 'ri-eye-off-fill': 'ri-eye-fill'"></i>
                                  </button>
                                  <div class="invalid-feedback d-block" v-if="attemptSubmit && missingrePass">
                                    Vui lòng nhập lại mật khẩu
                                  </div>
                                  <div class="invalid-feedback d-block"
                                       v-if="attemptSubmit && passNotMatch && userData.rePass !==''">
                                    Mật khẩu không trùng khớp với mật khẩu đăng ký.
                                  </div>
                                </div>
                              </div>
                            </b-col>
                          </b-row>
                          <div class="mt-4">
                            <b-button variant="success" class="w-100" @click.prevent="handleSubmit">Đăng ký</b-button>
                          </div>

                          <div class="mt-4 text-center">
                            <div class="signin-other-title">
                              <h5 class="fs-13 mb-4 title text-muted">Đăng ký tài khoản với</h5>
                            </div>

                            <div>
                              <b-button type="button" variant="primary" class="btn-icon"><i
                                class="ri-facebook-fill fs-16"></i></b-button>
                              <b-button type="button" variant="danger" class="btn-icon ms-1">
                                <i class="ri-google-fill fs-16"></i></b-button>
                              <b-button type="button" variant="dark" class="btn-icon ms-1"><i
                                class="ri-github-fill fs-16"></i></b-button>
                              <b-button type="button" variant="info" class="btn-icon ms-1"><i
                                class="ri-twitter-fill fs-16"></i></b-button>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div class="mt-5 text-center">
                        <p class="mb-0">Bạn đã có tài khoản ?
                          <router-link :to="{name:'LoginPage'}"
                                       class="fw-semibold text-primary text-decoration-underline"> Đăng nhập
                          </router-link>
                        </p>
                      </div>
                    </div>
                    <div v-else>
                      <verify-email :idUser="userData.id"></verify-email>
                    </div>
                  </div>
                </b-col>
              </b-row>
            </b-card>
          </b-col>

        </b-row>
      </b-container>
    </div>

    <footer class="footer">
      <b-container>
        <b-row>
          <b-col lg="12">
            <div class="text-center">
              <p class="mb-0">&copy; {{ new Date().getFullYear() }} SMART INDUSTRIAL PARK. Phát triển bởi Công ty TNHH
                IOTLink</p>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </footer>
  </div>
</template>