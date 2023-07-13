<script>
import {errorToast} from "../../../helpers/api/toastStyle";
import {usePost} from "../../../helpers/api/api.js";
import {Token} from "../../../helpers/user/user.js";
import VerifyEmailComponent from "../VerifyEmailComponent.vue";

export default {
  components: {
    'verify-email': VerifyEmailComponent
  },
  data() {
    return {
      form: {
        account: '',
        password: '',
      },
      attemptSubmit: false,
      UserID: '',
      isVerify: false,
      stateVerify: false,
      checkNextPage: '/',
      passToogle: false,
    }
  },
  computed: {
    missingUname: function () {
      return this.form.account === '';
    },
    missingPass: function () {
      return this.form.password === '';
    },
  },
  methods: {
    handleSubmit: async function (event) {
      const vm = this;
      this.attemptSubmit = true;
      if (vm.missingUname || vm.missingPass)
        event.preventDefault();
      else {
        let status = 0;
        let formSubmit = new FormData();
        formSubmit.append('username', vm.form.account);
        formSubmit.append('password', vm.form.password);
        await usePost('login', formSubmit)
          .then(data => {
            status = data.status;
            return data.json();
          }).then(res => {
            if (!res) {
              errorToast("Hệ thống đang bảo trì, vui lòng thử lại sau!");
              return;
            }
            if (status === 400 && Object.values(res)[0]?.includes(`User not authenticate`)) {
              vm.UserID = res.user_id;
              vm.isVerify = true;
              return;
            }
            if (res?.access_token) {
              Token().setUser(res.access_token);
              location.replace(vm.checkNextPage);
            } else {
              errorToast("Tài khoản hoặc mật khẩu không chính xác!");
            }
          })
      }
    },
    async handleResendVerify() {
      const vm = this;
      let item = new FormData();
      await usePost(`user/${vm.UserID}/send-new-authentication-code/`, item).then(data => data.json()).then(res => {
        vm.stateVerify = true;
      })
    }
  },
  watch: {
    'form.account': function (value) {
      this.attemptSubmit = false;
    },
    'form.password': function (value) {
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
            <b-card no-body class="overflow-hidden">
              <b-row class="g-0">
                <b-col lg="6">
                  <div class="p-lg-5 p-4 nft-hero h-100">
                    <div class="bg-overlay opacity-50"></div>
                    <div class="position-relative h-100 d-flex flex-column">
                      <div class="mb-4">
                        <router-link :to="{name:'HomePage'}" class="d-block">
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
                              <p class="fs-15 fst-italic">" Dữ liệu và nền tảng công nghệ phải thuộc về Việt Nam,<br>
                                do người Việt Nam làm chủ."</p>
                            </div>
                            <div class="carousel-item">
                              <p class="fs-15 fst-italic">" Map4D<br>Giải pháp thay thế hoàn hảo Google Maps API tại
                                Việt Nam "</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </b-col>

                <b-col lg="6">
                  <div class="p-lg-5 p-4" v-if="!stateVerify">
                    <div>
                      <h5 class="text-primary">Chào mừng bạn quay trở lại!</h5>
                      <p class="text-muted">Vui lòng nhập thông tin đăng nhập để tiếp tục.</p>
                    </div>

                    <div class="mt-4">
                      <form>
                        <div class="mb-3">
                          <label for="username" class="form-label">Tài khoản</label>
                          <input type="text" class="form-control" tabindex="1"
                                 :class="{ 'is-invalid': attemptSubmit && missingUname}"
                                 id="username" placeholder="Nhập thông tin tài khoản"
                                 v-model="form.account">
                          <div class="invalid-feedback d-block" v-if="attemptSubmit && missingUname">Vui lòng nhập tài
                            khoản
                          </div>
                        </div>

                        <div class="mb-3">
                          <div class="float-end">
                            <router-link :to="{name: 'ForgetPasswordPage'}" class="text-muted">Quên mật khẩu?
                            </router-link>
                          </div>
                          <label class="form-label" for="password-input">Mật khẩu</label>
                          <div class="position-relative auth-pass-inputgroup mb-3">
                            <input :type="passToogle ? 'text' : 'password'" class="form-control pe-5 password-input"
                                   :class="{ 'is-invalid': attemptSubmit && missingPass}" placeholder="Nhập mật khẩu"
                                   id="password-input" v-model="form.password" @keyup.enter="handleSubmit" tabindex="2">
                            <button @click="passToogle = !passToogle" type="button" id="password-addon" tabindex="4"
                                    class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                    :class="{'me-3': attemptSubmit && missingPass}">
                              <i class="align-middle" :class="passToogle ? 'ri-eye-off-fill': 'ri-eye-fill'"></i>
                            </button>
                            <div class="invalid-feedback d-block" v-if="attemptSubmit && missingPass">Vui lòng nhập mật
                              khẩu
                            </div>
                          </div>
                        </div>

                        <!--                        <div class="form-check">
                                                  <input class="form-check-input" type="checkbox" value=""
                                                         id="auth-remember-check">
                                                  <label class="form-check-label" for="auth-remember-check">Remember
                                                    me</label>
                                                </div>-->
                        <p v-if="isVerify" class="text-danger fw-semibold mt-3">
                          Tài khoản của bạn cần xác thực Email để đăng nhập!<br>
                          <span class="fw-semibold text-primary text-decoration-underline cursor-pointer"
                                @click="handleResendVerify">Xác thực tài khoản</span>
                          hoặc đăng nhập với tài khoản khác
                        </p>
                        <div class="mt-4">
                          <b-button variant="success" class="w-100" @click.prevent="handleSubmit" tabindex="3">Đăng nhập</b-button>
                        </div>
                        <div class="mt-4 text-center">
                          <div class="signin-other-title">
                            <h5 class="fs-13 mb-4 title">Đăng nhập với</h5>
                          </div>

                          <div>
                            <b-button type="button" variant="primary"
                                      class="btn-icon"><i
                              class="ri-facebook-fill fs-16"></i></b-button>
                            <b-button type="button" variant="danger"
                                      class="btn-icon ms-1"><i
                              class="ri-google-fill fs-16"></i></b-button>
                            <b-button type="button" variant="dark"
                                      class="btn-icon ms-1"><i
                              class="ri-github-fill fs-16"></i></b-button>
                            <b-button type="button" variant="info"
                                      class="btn-icon ms-1"><i
                              class="ri-twitter-fill fs-16"></i></b-button>
                          </div>
                        </div>

                      </form>
                    </div>

                    <div class="mt-5 text-center">
                      <p class="mb-0">Bạn chưa có tài khoản ?
                        <router-link :to="{name:'RegisterPage'}" tabindex="5"
                                     class="fw-semibold text-primary text-decoration-underline"> Đăng ký
                        </router-link>
                      </p>
                    </div>
                  </div>
                  <div class="p-lg-5 p-4" v-else>
                    <div class="mb-4">
                      <h5 class="text-primary">Chào mừng bạn quay trở lại!</h5>
                      <p class="text-muted">Vui lòng xác thực tài khoản để tiếp tục.</p>
                    </div>
                    <verify-email :idUser="UserID"></verify-email>
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