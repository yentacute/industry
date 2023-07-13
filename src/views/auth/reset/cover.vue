<script>
import Lottie from "@/components/widgets/lottie.vue";
import animationData from "@/components/widgets/rhvddzym.json";
import animationData2 from "@/components/widgets/lupuorrc.json";
import {errorToast, successToast} from "../../../helpers/api/toastStyle";
import {usePost} from "../../../helpers/api/api.js";
import {Token} from "../../../helpers/user/user.js";

export default {
  components: {lottie: Lottie},
  data() {
    return {
      defaultOptions: {animationData: animationData},
      defaultOptions2: {animationData: animationData2},
      userEA: '',
      attemptSubmit: false,
      stateSite: 1,
      idRequest: '',
      confirmCode: '',
      verifyState: false,
      isExits: false,
      hashCode: '',
      newPass: {
        pass: '',
        confirm: '',
      },
      showPass: {
        pass: false,
        repass: false
      }
    };
  },
  methods: {
    async handleSubmit(event) {
      this.attemptSubmit = true;
      if (this.missingEA) event.preventDefault();
      else {
        const regexExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let status = 0;
        let item = new FormData();
        if (regexExp.test(this.userEA))
          item.append('email', this.userEA);
        else
          item.append('username', this.userEA);

        await usePost('forgot-password', item)
          .then(data => {
            status = data.status;
            return data.json();
          }).then(res => {
            if (res) {
              if (status === 202) {
                this.idRequest = res.id_request;
                this.stateSite = 2;
                this.attemptSubmit = false;
              }
              if (status === 400 && Object.values(res)[0]?.includes(`Tài khoản không tồn tại.`)) {
                this.isExits = true;
                event.preventDefault();
              } else event.preventDefault();
            } else {
              errorToast("Đã xảy ra lỗi. Vui lòng thử lại sau!")
            }
          })
      }
    },
    handleConfirm(event) {
      this.attemptSubmit = true;
      if (this.missingConfirmCode) event.preventDefault();
      else {
        let item = new FormData();
        let status = 0;
        item.append('id', this.idRequest);
        item.append('code', this.confirmCode);
        usePost('confirm-code-forgot', item).then(data => {
          status = data.status;
          return data.json();
        }).then(res => {
          if (status === 400) {
            this.verifyState = true;
            event.preventDefault();
          } else {
            this.hashCode = res.hash;
            this.stateSite = 3;
            this.attemptSubmit = false
          }
        })
      }
    },
    handleNewPass(event) {
      this.attemptSubmit = true;
      if (this.missingNewPass || this.missingCofirmNewPass || this.passNotMatch) event.preventDefault();
      else {
        let status = 0;
        let item = new FormData();
        item.append('hash', this.hashCode);
        item.append('new_password', this.newPass.confirm);
        usePost('reset-password', item).then(data => {
          status = data.status;
          return data.json();
        }).then(res => {
          if (status === 400) {
            errorToast("Đã xảy ra lỗi. Vui lòng thử lại sau!")
          } else {
            this.attemptSubmit = false;
            this.stateSite = 4;
          }
        })
      }
    }

  },
  computed: {
    missingEA: function () {
      return this.userEA === '';
    },
    missingConfirmCode: function () {
      return this.confirmCode === '';
    },
    missingNewPass: function () {
      return this.newPass.pass === '';
    },
    missingCofirmNewPass: function () {
      return this.newPass.confirm === '';
    },
    passNotMatch: function () {
      if (this.missingCofirmNewPass) return;
      return this.newPass.confirm !== this.newPass.pass;
    }
  },
  watch: {
    'newPass.pass': function (value) {
      this.attemptSubmit = false;
    },
    'newPass.confirm': function (value) {
      this.attemptSubmit = false;
    },
    userEA: function (value) {
      this.attemptSubmit = false;
    },
    confirmCode: function (value) {
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
              <b-row class="justify-content-center g-0">
                <b-col lg="6">
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

                <b-col lg="6">
                  <div v-if="stateSite === 1" class="p-lg-5 p-4">
                    <h5 class="text-primary">Quên mật khẩu?</h5>
                    <p class="text-muted">Đừng lo, chúng tôi sẽ hỗ trợ cho bạn</p>

                    <div class="mt-2 text-center">
                      <lottie class="avatar-xl" colors="primary:#0ab39c,secondary:#405189"
                              :options="defaultOptions" :height="120" :width="120"/>
                    </div>

                    <b-alert variant="warning" class="alert-borderless text-center mb-2 mx-2" show>
                      Nhập thông tin và hướng dẫn sẽ được gửi đến bạn!
                    </b-alert>
                    <div class="p-2">
                      <form>
                        <div class="mb-3">
                          <label class="form-label">Nhập tài khoản hoặc email <span class="text-danger">*</span></label>
                          <input type="text" class="form-control" placeholder="Nhập tài khoản hoặc email đăng ký"
                                 v-model="userEA"
                                 :class="{ 'is-invalid': attemptSubmit && missingEA || attemptSubmit && isExits}">
                          <div class="invalid-feedback d-block" v-if="attemptSubmit && missingEA">
                            Tài khoản hoặc email không được để trống.
                          </div>
                          <div class="invalid-feedback d-block" v-if="attemptSubmit && isExits">
                            Không tìm thấy tài khoản hoặc email.
                          </div>
                        </div>
                        <div class="text-center mt-3">
                          <b-button variant="success" class="w-100" @click.prevent="handleSubmit">
                            Nhận hướng dẫn
                          </b-button>
                        </div>
                      </form>
                    </div>
                    <div class="mt-5 text-center">
                      <p class="mb-0">Bạn đã nhớ mật khẩu ?
                        <router-link :to="{name:'LoginPage'}" class="fw-semibold text-primary text-decoration-underline">
                          Đăng nhập
                        </router-link>
                      </p>
                    </div>
                  </div>
                  <div v-else-if="stateSite === 2" class="p-lg-5 p-4">
                    <p class="mb-5 text-secondary fw-semibold fst-italic fs-15">Một mã khôi phục tài khoản được gửi
                      tới Email đăng ký của bạn.<br> Vui lòng kiểm tra Email và nhập mã để tiếp tục!</p>
                    <div class="my-5">
                      <div class="input-group">
                        <input type="text" class="form-control" placeholder="Nhập mã khôi phục" v-model="confirmCode"
                               :class="{ 'is-invalid': attemptSubmit && missingConfirmCode || attemptSubmit && verifyState}">
                        <button class="btn btn-primary" type="button" @click="handleConfirm">Tiếp tục</button>
                      </div>
                      <div class="invalid-feedback d-block" v-if="attemptSubmit && missingConfirmCode">
                        Vui lòng nhập mã khôi phục
                      </div>
                      <div class="invalid-feedback d-block" v-if="attemptSubmit && verifyState">
                        Mã khôi phục không đúng. Vui lòng kiểm tra lại
                      </div>
                    </div>
                    <p class="text-muted fst-italic">Chưa nhận được mã?
                      <span
                        class="fw-semibold text-primary text-decoration-underline cursor-pointer">Nhấn vào đây </span>
                      để nhận lại mã</p>
                  </div>
                  <div v-else-if="stateSite === 3" class="p-lg-5 p-4">
                    <p class="mb-5 text-secondary fw-semibold fst-italic fs-15">
                      Nhập mật khẩu mới cho tài khoản của bạn</p>
                    <form>
                      <div class="mb-3">
                        <label class="form-label" for="password-input">Mật khẩu mới</label>
                        <div class="position-relative auth-pass-inputgroup">
                          <input :type="showPass.pass ? 'text' : 'password'" class="form-control pe-5 password-input"
                                 v-model="newPass.pass" placeholder="Nhập mật khẩu mới" id="password-input"
                                 :class="{ 'is-invalid': attemptSubmit && missingNewPass}">
                          <button :class="{ 'me-3': attemptSubmit && missingNewPass}"
                                  class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                  type="button" id="password-addon" @click="showPass.pass = !showPass.pass">
                            <i class="align-middle" :class="showPass.pass ? 'ri-eye-off-fill': 'ri-eye-fill'"></i>
                          </button>
                        </div>
                        <div class="invalid-feedback d-block" v-if="attemptSubmit && missingNewPass">
                          Mật khẩu mới không được để trống
                        </div>
                      </div>

                      <div class="mb-3">
                        <label class="form-label" for="confirm-pass-input">Nhập lại mật khẩu mới</label>
                        <div class="position-relative auth-pass-inputgroup mb-3">
                          <input :type="showPass.repass ? 'text' : 'password'" class="form-control pe-5 password-input"
                                 v-model="newPass.confirm" id="confirm-pass-input" placeholder="Nhập lại mật khẩu mới"
                                 :class="{ 'is-invalid': attemptSubmit && missingCofirmNewPass || attemptSubmit && passNotMatch}">
                          <button type="button" @click="showPass.repass = !showPass.repass"
                                  :class="{ 'me-3': attemptSubmit && missingCofirmNewPass || attemptSubmit && passNotMatch}"
                                  class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon">
                            <i class="align-middle" :class="showPass.repass ? 'ri-eye-off-fill': 'ri-eye-fill'"></i>
                          </button>
                        </div>
                        <div class="invalid-feedback d-block" v-if="attemptSubmit && missingCofirmNewPass">
                          Nhập lại mật khẩu mới không được để trống
                        </div>
                        <div class="invalid-feedback d-block" v-if="attemptSubmit && passNotMatch">
                          Hai mật khẩu không trùng khớp
                        </div>
                      </div>
                      <div class="mt-4 w-100 text-center">
                        <b-button variant="success" class="w-100" @click.prevent="handleNewPass">
                          Xác nhận
                        </b-button>
                      </div>

                    </form>
                  </div>
                  <div v-else class="p-lg-5 p-4">
                    <div class="text-center py-5">
                      <div class="mb-4">
                        <lottie colors="primary:#0ab39c,secondary:#405189" :options="defaultOptions2" :height="120"
                                :width="120"/>
                      </div>
                      <h5>Tài khoản của bạn đã được đổi mật khẩu thành công !</h5>
                      <p class="text-muted">Bây giờ bạn có thể đăng nhập tài khoản của mình bằng mật khẩu mới!</p>
                      <router-link type="button" class="btn btn-success mt-4" :to="{name: 'LoginPage'}">Đăng nhập ngay
                      </router-link>
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