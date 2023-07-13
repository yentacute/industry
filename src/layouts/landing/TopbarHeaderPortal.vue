<script>
import "@/assets/scss/frontend/topbar.scss";
// import userPortal from "./userPortal";
import User from "../../components/map/feature/user/User.vue";

export default {
  name: "TopbarHeaderPortal",
  components: {
    User,
  },
  props: {
    stickyBar: Boolean,
    isLight: Boolean,
  },
  data() {
    return {
      isFixed: false,
      topBarLight: false,
    };
  },

  mounted() {
    window.addEventListener("scroll", function (ev) {
      ev.preventDefault();
      var navbar = document.getElementById("navbar");
      if (navbar) {
        if (
          document.body.scrollTop >= 50 ||
          document.documentElement.scrollTop >= 50
        ) {
          navbar.classList.add("is-sticky");
        } else {
          navbar.classList.remove("is-sticky");
        }
      }
    });
    if (this.stickyBar === true) {
      this.isFixed = true;
    } else {
      this.isFixed = false;
    }

    if (this.isLight === true) {
      this.topBarLight = true;
    } else {
      this.topBarLight = false;
    }
  },
  methods: {},
};
</script>
<template>
  <nav
    class="navbar navbar-expand-lg navbar-landing py-0"
    id="navbar"
    :class="{ 'fixed-top': isFixed, 'navbar-light': topBarLight }"
  >
    <b-container>
      <b-link class="navbar-brand" href="/">
        <img
          src="@/assets/images/logo-thai-nguyen.svg"
          class="card-logo card-logo-dark navbar--brand__logo"
          alt="logo dark"
          height="17"
        />
        <img
          src="@/assets/images/logo-thai-nguyen.svg"
          class="card-logo card-logo-light navbar--brand__logo"
          alt="logo light"
          height="17"
        />
      </b-link>
      <button
        class="navbar-toggler py-0 fs-20 text-body"
        type="button"
        v-b-toggle.navbarSupportedContent
      >
        <i class="mdi mdi-menu"></i>
      </button>

      <b-collapse class="navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mx-auto mt-2 mt-lg-0" id="navbar-example">
          <li class="nav-item">
            <router-link class="nav-link menu-link" :to="{ name: 'HomePage' }">
              Trang chủ
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'IntroducePage' }">
              Giới thiệu
            </router-link>
          </li>
          <li class="nav-item">
            <div class="dropdown">
              <div
                class="nav-link menu-link cursor-pointer d-flex"
                data-bs-toggle="dropdown"
              >
                <span data-key="t-widgets login-title">Bản đồ</span>
              </div>
              <div class="dropdown-menu dropdown-menu-md">
                <router-link class="dropdown-item" :to="{ name: 'MapControl' }">
                  <span class="align-middle"
                    >Khu công nghiệp sông công II</span
                  ></router-link
                >
                <router-link
                  class="dropdown-item"
                  :to="{ name: 'MapPortalNew' }"
                >
                  <span class="align-middle"
                    >Bản đồ thông tin</span
                  ></router-link
                >
              </div>
            </div>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'IndustrialListPage' }">
              Khu công nghiệp
            </router-link>
          </li>
          <li class="nav-item">
            <div class="dropdown">
              <div
                class="nav-link menu-link cursor-pointer d-flex"
                data-bs-toggle="dropdown"
              >
                <span data-key="t-widgets login-title">Tài liệu</span>
              </div>
              <div class="dropdown-menu dropdown-menu-md">
                <router-link class="dropdown-item" to="#">
                  <span class="align-middle"
                    >Hướng dẫn sử dụng</span
                  ></router-link
                >
                <router-link class="dropdown-item" to="#">
                  <span class="align-middle"
                    >Dành cho nhà phát triển</span
                  ></router-link
                >
              </div>
            </div>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'ContactPage' }">
              Liên hệ
            </router-link>
          </li>
        </ul>
      </b-collapse>
      <div class="nav-item user">
        <User></User>
      </div>
    </b-container>
  </nav>
</template>
<style scoped>
.nav-item .nav-link {
  text-transform: uppercase;
  font-weight: 300;
  padding: 10px !important;
  font-size: 14px !important;
}
</style>
