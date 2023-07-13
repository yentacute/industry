<script>
import {Token} from "../../../helpers/user/user.js";
import {errorToast, successToast} from "../../../helpers/api/toastStyle";

export default {
  data() {
    return {
      id: '',
      username: '',
      currPass: '',
      newPass: '',
      rePass: '',
      checkPass: false,
      attemptSubmit: false,
      showPass: {
        old: false,
        new: false,
        renew: false,
      }
    }
  },
  computed: {
    missingCurrPass: function () {
      return this.currPass === '';
    },
    missingNewPass: function () {
      return this.newPass === '';
    },
    missingRePass: function () {
      return this.rePass === '';
    },
    passNotMatch: function () {
      return this.rePass !== this.newPass;
    },
    passSameOld: function () {
      if (this.missingCurrPass) return;
      if (this.checkPass) return;
      return this.newPass === this.currPass;
    }
  },
  created() {
    const vm = this;
    Token().getUser()
      .then(
        res => {
          vm.id = res.id;
          vm.username = res.username;
        })
  },
  methods: {
    handleSubmit: async function (event) {
      this.attemptSubmit = true;
      if (this.missingCurrPass || this.missingNewPass || this.missingRePass || this.passNotMatch) {
        event.preventDefault();
      } else {
        let status = 0;
        let item = new FormData();
        item.append('password_old', this.currPass);
        item.append('password_new', this.rePass);
        usePost(`user/change-password`, item).then(data => {
          status = data.status;
          return data.json();
        }).then(res => {
          if (status === 400 && Object.values(res)?.includes(`Mật khẩu không chính xác.`)) {
            this.checkPass = true;
            event.preventDefault();
            return;
          }
          if (this.passSameOld) {
            event.preventDefault();
            return;
          }
          if (status === 202) {
            this.attemptSubmit = false;
            successToast("Thay đổi mật khẩu thành công!");
            this.currPass = '';
            this.newPass = '';
            this.rePass = '';
          }
        })
      }
    },
  },
  mounted() {
  },
  watch: {
    currPass: function (value) {
      this.attemptSubmit = false;
    },
    newPass: function (value) {
      this.attemptSubmit = false;
    },
    rePass: function (value) {
      this.attemptSubmit = false;
    }
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
                        <b-link href="/" class="d-block">
                          <img src="@/assets/images/logo-thai-nguyen.svg" alt="" height="40">
                        </b-link>
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
                  <div class="p-lg-5 p-4">
                    <h5 class="text-primary">Đổi mật khẩu</h5>
                    <p class="text-muted">Mật khẩu mới của bạn phải khác với mật khẩu đã sử dụng trước đó.</p>

                    <div class="p-2">
                      <form>
                        <div class="mb-3">
                          <label class="form-label" for="password-input">Mật khẩu hiện tại <span
                            class="text-danger">*</span></label>
                          <div class="position-relative auth-pass-inputgroup">
                            <input :type="showPass.old ? 'text' : 'password'" class="form-control pe-5 password-input"
                                   v-model="currPass" id="password-input" placeholder="Nhập mật khẩu hiện tại"
                                   :class="{ 'is-invalid': attemptSubmit && missingCurrPass || attemptSubmit && checkPass}">
                            <button @click="showPass.old = !showPass.old" type="button" id="password-addon"
                                    class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                    :class="{'me-3': attemptSubmit && missingCurrPass || attemptSubmit && checkPass}">
                              <i class="align-middle" :class="showPass.old ? 'ri-eye-off-fill': 'ri-eye-fill'"></i>
                            </button>
                          </div>
                          <div class="invalid-feedback d-block" v-if="attemptSubmit && missingCurrPass">
                            Mật khẩu hiện tại không được để trống.
                          </div>
                          <div class="invalid-feedback d-block" v-if="attemptSubmit && checkPass">
                            Mật khẩu hiện tại chưa đúng, vui lòng thử lại.
                          </div>
                        </div>

                        <div class="mb-3">
                          <label class="form-label" for="new-password-input">Mật khẩu mới <span
                            class="text-danger">*</span></label>
                          <div class="position-relative auth-pass-inputgroup">
                            <input :type="showPass.new ? 'text' : 'password'" class="form-control pe-5 password-input"
                                   v-model="newPass" placeholder="Nhập mật khẩu mới" id="new-password-input"
                                   :class="{ 'is-invalid': attemptSubmit && missingNewPass || attemptSubmit && passSameOld}">
                            <button type="button" id="new-password-addon" @click="showPass.new = !showPass.new"
                                    class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                    :class="{'me-3': attemptSubmit && missingNewPass || attemptSubmit && passSameOld}">
                              <i class="align-middle" :class="showPass.new ? 'ri-eye-off-fill': 'ri-eye-fill'"></i>
                            </button>
                          </div>
                          <div class="invalid-feedback d-block" v-if="attemptSubmit && missingNewPass">
                            Mật khẩu mới không được để trống.
                          </div>
                          <div class="invalid-feedback d-block" v-if="attemptSubmit && passSameOld">
                            Mật khẩu mới không được trùng với mật khẩu hiện tại.
                          </div>
                        </div>
                        <div class="mb-3">
                          <label class="form-label" for="confirm-new-password-input">Xác nhận mật khẩu mới <span
                            class="text-danger">*</span></label>
                          <div class="position-relative auth-pass-inputgroup">
                            <input :type="showPass.renew ? 'text' : 'password'" class="form-control pe-5 password-input"
                                   v-model="rePass" placeholder="Nhập lại mật khẩu mới" id="confirm-new-password-input"
                                   :class="{ 'is-invalid': attemptSubmit && missingRePass || attemptSubmit && passNotMatch}">
                            <button @click="showPass.renew = !showPass.renew" type="button"
                                    class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                    :class="{'me-3': attemptSubmit && missingRePass || attemptSubmit && passNotMatch}">
                              <i class="align-middle" :class="showPass.renew ? 'ri-eye-off-fill': 'ri-eye-fill'"></i>
                            </button>
                          </div>
                          <div class="invalid-feedback d-block" v-if="attemptSubmit && missingRePass">
                            Xác nhận mật khẩu mới không được để trống.
                          </div>
                          <div class="invalid-feedback d-block" v-if="attemptSubmit && passNotMatch && rePass !==''">
                            Mật khẩu không trùng khớp với mật khẩu mới.
                          </div>
                        </div>

                        <div class="mt-4">
                          <b-button variant="success" class="w-100" type="submit" @click.prevent="handleSubmit">
                            Đổi mật khẩu
                          </b-button>
                        </div>
                      </form>
                    </div>

                    <div class="mt-5 text-center">
                      <a onclick="history.back()"
                         class="fw-semibold text-primary text-decoration-underline cursor-pointer">
                        Quay lại
                      </a>
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
              <p class="mb-0 text-muted">&copy; {{ new Date().getFullYear() }} SMART INDUSTRIAL PARK. Phát triển bởi
                Công ty TNHH IOTLink</p>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </footer>
  </div>
</template>