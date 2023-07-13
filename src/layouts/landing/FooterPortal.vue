<template>
  <footer class="custom-footer bg-primary h-auto text-start pb-3">
    <div class="container">
      <div class="hstack gap-3 flex-wrap footer__menu">
        <a href="#" class="text-white"><i class="ri-home-4-line align-bottom me-1"></i> Trang
          chủ</a>
        <div class="vr"></div>
        <router-link :to="{name: `TermPage`}" class="text-white">Điều khoản</router-link>
        <div class="vr"></div>
        <router-link :to="{name: `PolicyPage`}" class="text-white">Chính sách</router-link>

      </div>
      <h5 class="text-white fs-16 text-uppercase footer__title">{{ infoData.system_name }}</h5>
      <div class="row">
        <div class="col-lg-6">
          <div class="card-body footer__content">
            <p>
              <i class="mdi mdi-office-building-cog-outline me-1 align-bottom"></i>
              Đơn vị chủ quản: {{ infoData.donvi }}
            </p>
            <p><i class="ri-map-pin-line me-1 align-bottom"></i> Địa chỉ: {{ infoData.address }}</p>
            <p><i class=" ri-phone-line me-1 align-bottom"></i>
              Điện thoại: {{ infoData.phone }} - Fax: {{ infoData.fax }}</p>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="email-form">
            <div class="subscribe">
              <input type="text" class="form-control" placeholder="Đăng ký để nhận thông tin mới nhất"
                     v-model="userEmail">
              <button class="btn btn-danger" @click="userSubcriber">Đăng ký</button>
            </div>
          </div>
        </div>
      </div>
      <div class="copyright">
        <p class="copy-rights">
          2023 © SMART INDUSTRIAL PARK | Phát triển bởi công ty IOTLink
        </p>
        <div class="card-body text-sm-end social__container">
          <ul class="list-inline mb-0 footer-social-link">
            <li class="list-inline-item">
              <a href="javascript: void(0);" class="avatar-xs d-block">
                <div class="avatar-title rounded-circle">
                  <i class="ri-facebook-fill"></i>
                </div>
              </a>
            </li>
            <li class="list-inline-item">
              <a href="javascript: void(0);" class="avatar-xs d-block">
                <div class="avatar-title rounded-circle">
                  <i class="ri-github-fill"></i>
                </div>
              </a>
            </li>
            <li class="list-inline-item">
              <a href="javascript: void(0);" class="avatar-xs d-block">
                <div class="avatar-title rounded-circle">
                  <i class="ri-linkedin-fill"></i>
                </div>
              </a>
            </li>
            <li class="list-inline-item">
              <a href="javascript: void(0);" class="avatar-xs d-block">
                <div class="avatar-title rounded-circle">
                  <i class="ri-google-fill"></i>
                </div>
              </a>
            </li>
            <li class="list-inline-item">
              <a href="javascript: void(0);" class="avatar-xs d-block">
                <div class="avatar-title rounded-circle">
                  <i class="ri-dribbble-line"></i>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import {errorToast, successToast} from '../../helpers/api/toastStyle';
import apiRequest from "../../helpers/api/folderApi";

export default {
  name: "FooterPortal",
  data: function () {
    return {
      userEmail: "",
      infoData: {},
    }
  },
  methods: {
    async userSubcriber() {
      try {
        const {data} = await apiRequest.post(`/subscriber/`, {email: this.userEmail});
        console.log(data)
          if (data?.id) {
            successToast("Đăng ký nhận thông tin thành công!");
          } else {
            errorToast("Đăng ký thất bại vui lòng thử lại sau!");
          }
        }
      catch (error) {
          errorToast(error.response?.data?.error);
      }
    }
  },
  async mounted() {
    const {data} = await apiRequest.get(`/config/system/`);
    this.infoData = data.system_config;
  }
}
</script>

<style lang="scss" scoped>
footer {
  font-weight: 500;
  position: relative;
  padding: 36px 0;

  &::before {
    content: none;
  }

  .footer__menu {
    margin-bottom: 2em;
  }

  .footer__title {
    margin-bottom: 16px;
  }

  .footer__content p {
    padding: 6px 0;
    margin-bottom: 0;
  }

  .copyright {
    display: flex;
    align-items: center;

    p {
      margin-top: 15px;
      color: #fff;
    }
  }
}
</style>