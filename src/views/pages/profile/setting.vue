<script>
import Layout from "../../../layouts/main.vue";
import appConfig from "../../../../app.config";
import {BASE_URL} from "../../../helpers/api/axiosHttp.js";
import {usePatch} from "../../../helpers/api/api.js";
import {Token} from "../../../helpers/user/user.js";
import {errorToast, successToast} from "../../../helpers/api/toastStyle";
import flatPickr from "vue-flatpickr-component";
import {ref} from "vue";

export default {
  page: {
    title: "Setting",
    meta: [{
      name: "description",
      content: appConfig.description
    }],
  },
  data() {
    return {
      birthConfig: {
        altFormat: 'd/m/Y',
        altInput: true,
        dateFormat: 'Y-m-d',
      },
      baseURL: '',
      infoUser: {},
      publicInfo: {
        email: true,
        phone: true,
        address: true,
      },
      userFacebook: '',
      userGitHub: '',
      userKCN: {},
      userFullName: '',
      attemptSubmit: false,
      statusCode: 0,
      validation: {
        email: {
          invalid: false,
          isexits: false,
        },
        phone: false,
      }
    };
  },
  components: {
    Layout,
    flatPickr,
  },
  created() {
    const vm = this;
    Token().getUser()
      .then(
        res => {
          vm.infoUser = res;
          vm.userKCN = res.industrial_area;
          vm.userFullName = `${res.first_name} ${res.last_name}`;
          if (!res.phone) vm.publicInfo.phone = false;
          if (!res.address) vm.publicInfo.address = false;
          if (!res.email) vm.publicInfo.email = false;
          if (Object.keys(res.info_public).length > 0) {
            if (res.hasOwnProperty('email')) vm.publicInfo.email = res.info_public.email;
            if (res.hasOwnProperty('phone')) vm.publicInfo.phone = res.info_public.phone;
            if (res.hasOwnProperty('address')) vm.publicInfo.address = res.info_public.address;
          }
          if (vm.infoUser.social_network_link) {
            for (let i = 0; i < vm.infoUser.social_network_link.length; i++) {
              if (vm.infoUser.social_network_link[i].facebook) vm.userFacebook = vm.infoUser.social_network_link[i].facebook;
              if (vm.infoUser.social_network_link[i].github) vm.userGitHub = vm.infoUser.social_network_link[i].github;
            }
          }
        }
      )
  },
  computed: {
    missingEmail: function () {
      if (this.infoUser.email === '') {
        this.validation.email.invalid = false;
        this.validation.email.isexits = false;
      }
      return this.infoUser.email === '';
    },
    missingPhone: function () {
      return this.infoUser.phone === '';
    },
  },
  mounted() {
    const vm = this;
    vm.localURL = window.location.origin;
    vm.baseURL = BASE_URL;
  },
  methods: {
    handleSubmit(id) {
      const vm = this;
      this.attemptSubmit = true;
      if (vm.missingEmail || vm.missingPhone)
        event.preventDefault();
      else {
        const item = new FormData(document.getElementById('form-profile'));
        item.append('birth', this.infoUser.birth)
        let avatar = document.getElementById('profile-img-file-input').files[0];
        if (avatar) {
          item.append('photo', avatar);
        }
        /*let cover = document.getElementById('profile-foreground-img-file-input').files[0];
        if (cover) {
          item.append('cover_img', cover);
        }*/
        item.append('info_public', `{"email": ${vm.publicInfo.email}, "phone": ${vm.publicInfo.phone}, "address": ${vm.publicInfo.address}}`)
        if (vm.userFacebook !== '' || vm.userGitHub !== '') {
          let social = `[`
          if (vm.userFacebook !== '') {
            social += `{"facebook": "${vm.userFacebook}"}`;
            if (vm.userGitHub !== '') social += `,`;
          }
          if (vm.userGitHub !== '') {
            social += `{"github": "${vm.userGitHub}"}`;
          }
          social += `]`;
          item.append('social_network_link', social);
        }
        usePatch(`user/${id}/`, item).then(data => {
          vm.statusCode = data.status;
          return data.json();
        }).then(res => {
          if (res) {
            if (vm.statusCode === 400 && res.hasOwnProperty('email')) {
              if (Object.values(res)[0]?.includes(`Enter a valid email address.`)) {
                vm.validation.email.invalid = true;
                vm.validation.email.isexits = false;
              } else if (Object.values(res)[0]?.includes(`Một tài khoản đã đăng ký với email này.`)) {
                vm.validation.email.isexits = true;
                vm.validation.email.invalid = false;
              }
              event.preventDefault();
            }
            if (vm.statusCode === 400 && res.hasOwnProperty('msg')) {
              vm.validation.phone = true;
              event.preventDefault();
            }
            if (vm.statusCode === 200 && res.username && res.email && res.phone) {
              successToast("Đã cập nhật thông tin!");
              this.$router.push({name: "ProfilePage"});
            } else {
              errorToast("Cập nhật thất bại!")
            }
          } else {
            errorToast("Hệ thống bảo trì!")
          }
        })
      }
    }
  },
  watch: {
    'infoUser.first_name': function (value) {
      this.attemptSubmit = false;
    },
    'infoUser.last_name': function (value) {
      this.attemptSubmit = false;
    },
    'infoUser.phone': function (value) {
      this.attemptSubmit = false;
    },
    'infoUser.email': function (value) {
      this.attemptSubmit = false;
    },
    'infoUser.birth': function (value) {
      this.attemptSubmit = false;
    },
    'infoUser.gender': function (value) {
      this.attemptSubmit = false;
    },
    'infoUser.address': function (value) {
      this.attemptSubmit = false;
    },
    'infoUser.introduce': function (value) {
      this.attemptSubmit = false;
    },
  }
};
</script>

<template>
  <Layout pageLayout="landing">
    <b-container class="mt-3">
      <form id="form-profile">
        <div class="position-relative mx-n4 mt-n4">
          <div class="profile-wid-bg profile-setting-img">
            <img v-if="infoUser.cover_img" :src="baseURL + infoUser.cover_img" alt="" style="opacity: .5;"/>
            <img src="@/assets/images/nft/bg-home.jpg" class="profile-wid-img" alt="" style="opacity: .5;"/>
            <!--            <div class="overlay-content">
                          <div class="text-end p-3">
                            <div class="p-0 ms-auto rounded-circle profile-photo-edit">
                              <input id="profile-foreground-img-file-input" type="file" class="profile-foreground-img-file-input"/>
                              <label for="profile-foreground-img-file-input" class="profile-photo-edit btn btn-light">
                                <i class="ri-image-edit-line align-bottom me-1"></i> Đổi ảnh bìa
                              </label>
                            </div>
                          </div>
                        </div>-->
          </div>
        </div>
        <b-row>
          <b-col xxl="4">
            <b-card no-body class="mt-n5">
              <b-card-body class="p-4">
                <div class="text-center">
                  <div class=" profile-user position-relative d-inline-block mx-auto mb-4 ">
                    <img :src="infoUser.photo ? infoUser.photo : baseURL + `/media/photos/avatar-1.jpg`"
                         class=" rounded-circle avatar-xl img-thumbnail user-profile-image"
                         alt="user-profile-image"/>
                    <div class="avatar-xs p-0 rounded-circle profile-photo-edit">
                      <input id="profile-img-file-input" type="file" class="profile-img-file-input"/>
                      <label for="profile-img-file-input" class="profile-photo-edit avatar-xs">
                    <span class="avatar-title rounded-circle bg-light text-body">
                      <i class="ri-camera-fill"></i>
                    </span>
                      </label>
                    </div>
                  </div>
                  <h5 class="fs-16 mb-1">{{ userFullName }}</h5>
                  <p class="text-muted mb-0">{{ userKCN.name_display }}</p>
                </div>
              </b-card-body>
            </b-card>
            <b-card no-body>
              <b-card-body>
                <div class="d-flex align-items-center mb-4">
                  <div class="flex-grow-1">
                    <h5 class="card-title mb-0">Hoàn thiện hồ sơ của bạn</h5>
                  </div>
                </div>

                <b-progress class="animated-progress custom-progress progress-label">
                  <b-progress-bar :value="infoUser.completed_fields_percent" variant="danger">
                    <div class="label">{{ infoUser.completed_fields_percent }}%</div>
                  </b-progress-bar>
                </b-progress>
              </b-card-body>
            </b-card>
            <b-card no-body>
              <b-card-body>
                <h5 class="card-title mb-4">Liên kết</h5>
                <div class="mb-3 d-flex">
                  <div class="avatar-xs d-block flex-shrink-0 me-3">
                    <span class="avatar-title rounded-circle fs-16 bg-primary">
                        <i class="ri-facebook-fill"></i>
                    </span>
                  </div>
                  <input type="text" class="form-control" id="websiteInput"
                         placeholder="VD: https://www.fb.com/iotlinkmap4d.vn"
                         v-model="userFacebook">
                </div>
                <div class="mb-3 d-flex">
                  <div class="avatar-xs d-block flex-shrink-0 me-3">
                      <span class="avatar-title rounded-circle fs-16 bg-dark text-light">
                          <i class="ri-github-fill"></i>
                      </span>
                  </div>
                  <input type="email" class="form-control" id="gitUsername" placeholder="VD: https://github.com/map4d"
                         v-model="userGitHub">
                </div>
              </b-card-body>
            </b-card>
          </b-col>
          <b-col xxl="8">
            <b-card no-body class="mt-xxl-n5">
              <b-card-header class="d-flex align-items-center">
                <h5 class="card-title mb-0 flex-grow-1">Thông tin chi tiết</h5>
                <router-link :to="{name: 'ProfilePage'}" type="button" v-b-tooltip.hover title="Đóng"
                             class="flex-shrink-0 btn btn-ghost-primary btn-close"></router-link>
              </b-card-header>
              <b-card-body class="p-4">
                <b-row>
                  <b-col lg="6">
                    <div class="mb-3">
                      <label for="firstnameInput" class="form-label">Họ</label>
                      <input type="text" class="form-control" id="firstnameInput" name="first_name"
                             placeholder="Nhập họ và tên đệm" v-model="infoUser.first_name">
                    </div>
                  </b-col>
                  <b-col lg="6">
                    <div class="mb-3">
                      <label for="lastnameInput" class="form-label">Tên</label>
                      <input type="text" class="form-control" id="lastnameInput" name="last_name"
                             placeholder="Nhập tên" v-model="infoUser.last_name">
                    </div>
                  </b-col>
                  <b-col lg="6">
                    <div class="mb-3">
                      <label for="phonenumberInput" class="form-label">Số điện thoại</label>

                      <div class="input-group">
                        <input type="tel" class="form-control"
                               :class="{ 'is-invalid': attemptSubmit && missingPhone || attemptSubmit && validation.phone}"
                               id="phonenumberInput" name="phone"
                               placeholder="Nhập số điện thoại" v-model="infoUser.phone">
                        <div class="input-group-text">
                          <input class="form-check-input mt-0 cursor-pointer" type="checkbox" value="" v-b-tooltip.hover
                                 title="Công khai thông tin của bạn" v-model="publicInfo.phone">
                        </div>
                      </div>
                      <div class="invalid-feedback d-block" v-if="attemptSubmit && missingPhone">
                        Vui lòng nhập số điện thoại
                      </div>
                      <div class="invalid-feedback d-block" v-if="attemptSubmit && validation.phone">
                        Số điện thoại không hợp lệ
                      </div>
                    </div>
                  </b-col>
                  <b-col lg="6">
                    <div class="mb-3">
                      <label for="emailInput" class="form-label">Email</label>
                      <div class="input-group">
                        <input type="email" class="form-control"
                               :class="{ 'is-invalid': attemptSubmit && missingEmail || attemptSubmit && validation.email.invalid || attemptSubmit && validation.email.isexits}"
                               id="emailInput" placeholder="Nhập địa chỉ email" name="email" v-model="infoUser.email">
                        <div class="input-group-text">
                          <input class="form-check-input mt-0 cursor-pointer" type="checkbox" value="" v-b-tooltip.hover
                                 title="Công khai thông tin của bạn" v-model="publicInfo.email">
                        </div>
                      </div>
                      <div class="invalid-feedback d-block" v-if="attemptSubmit && missingEmail">
                        Vui lòng nhập địa chỉ email
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
                  <b-col lg="6">
                    <div class="mb-3">
                      <label class="form-label">Ngày sinh</label>
                      <flat-pickr v-model="infoUser.birth" :config="birthConfig" class="form-control flatpickr-input"/>
                    </div>
                  </b-col>
                  <b-col lg="6">
                    <div class="mb-3">
                      <label class="form-label">Giới tính</label>
                      <select class="form-select" v-model="infoUser.gender" name="gender">
                        <option value="0" selected>Nam</option>
                        <option value="1">Nữ</option>
                      </select>
                    </div>
                  </b-col>
                  <b-col lg="12">
                    <div class="mb-3">
                      <label class="form-label" for="addressInput">Địa chỉ</label>
                      <div class="input-group">
                        <input type="text" class="form-control" id="addressInput" placeholder="Nhập địa chỉ"
                               name="address" v-model="infoUser.address">
                        <div class="input-group-text">
                          <input class="form-check-input mt-0 cursor-pointer" type="checkbox" value="" v-b-tooltip.hover
                                 title="Công khai thông tin của bạn" v-model="publicInfo.address">
                        </div>
                      </div>
                    </div>
                  </b-col>
                  <b-col lg="12">
                    <div class="mb-3 pb-2">
                      <label for="exampleFormControlTextarea" class="form-label">Giới thiệu</label>
                      <textarea class="form-control" id="exampleFormControlTextarea" rows="6"
                                v-model="infoUser.introduce" name="introduce">
                        </textarea>
                    </div>
                  </b-col>
                  <b-col lg="12">
                    <div class="hstack gap-2 justify-content-end">
                      <router-link type="button" class="btn btn-soft-danger w-sm d-flex align-items-center" to="#">
                        <i class="bx bx-rotate-left me-1 align-bottom"></i> Hủy bỏ
                      </router-link>
                      <button type="submit" class="btn btn-success w-sm" @click.prevent="handleSubmit(infoUser.id)">
                        <i class="ri-save-3-line me-1 align-bottom"></i> Lưu
                      </button>
                    </div>
                  </b-col>
                </b-row>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </form>
    </b-container>
  </Layout>
</template>