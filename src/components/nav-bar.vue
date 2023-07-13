<script>
import {SimpleBar} from "simplebar-vue3";
import {useRouter} from "vue-router";

import i18n from "../i18n";
import {Token} from "../helpers/user/user.js";
import {BASE_URL} from "../helpers/api/axiosHttp.js";
import User from "../components/map/feature/user/User.vue";

/**
 * Nav-bar Component
 */
export default {
  setup() {
    const router = useRouter();

    const goToPage = (to) => {
      router.push({name: to});
    };

    return {
      goToPage,
    };
  },
  props: {
    address: {
      type: Object,
      default: function () {
        return {
          title: "",
          details: [],
        };
      },
    },
  },
  data() {
    return {
      currUser: {
        id: "",
        username: "",
        fname: "",
        lname: "",
        photo: "",
        user_role: {},
      },
      baseURL: BASE_URL,
      languages: [
        {
          flag: require("@/assets/images/flags/us.svg"),
          language: "en",
          title: "English",
        },
        {
          flag: require("@/assets/images/flags/spain.svg"),
          language: "sp",
          title: "Española",
        },
        {
          flag: require("@/assets/images/flags/germany.svg"),
          language: "gr",
          title: "Deutsche",
        },
        {
          flag: require("@/assets/images/flags/italy.svg"),
          language: "it",
          title: "italiana",
        },
        {
          flag: require("@/assets/images/flags/russia.svg"),
          language: "ru",
          title: "русский",
        },
        {
          flag: require("@/assets/images/flags/china.svg"),
          language: "ch",
          title: "中國人",
        },
        {
          flag: require("@/assets/images/flags/french.svg"),
          language: "fr",
          title: "Français",
        },
        {
          flag: require("@/assets/images/flags/ae.svg"),
          language: "ar",
          title: "Arabic",
        },
      ],
      lan: i18n.locale,
      text: null,
      flag: null,
      value: null,
      myVar: 1,
    };
  },
  components: {
    SimpleBar,
    User,
  },

  methods: {

    isCustomDropdown() {
      //Search bar
      var searchOptions = document.getElementById("search-close-options");
      var dropdown = document.getElementById("search-dropdown");
      var searchInput = document.getElementById("search-options");

      searchInput.addEventListener("focus", () => {
        var inputLength = searchInput.value.length;
        if (inputLength > 0) {
          dropdown.classList.add("show");
          searchOptions.classList.remove("d-none");
        } else {
          dropdown.classList.remove("show");
          searchOptions.classList.add("d-none");
        }
      });

      searchInput.addEventListener("keyup", () => {
        var inputLength = searchInput.value.length;
        if (inputLength > 0) {
          dropdown.classList.add("show");
          searchOptions.classList.remove("d-none");
        } else {
          dropdown.classList.remove("show");
          searchOptions.classList.add("d-none");
        }
      });

      searchOptions.addEventListener("click", () => {
        searchInput.value = "";
        dropdown.classList.remove("show");
        searchOptions.classList.add("d-none");
      });

      document.body.addEventListener("click", (e) => {
        if (e.target.getAttribute("id") !== "search-options") {
          dropdown.classList.remove("show");
          searchOptions.classList.add("d-none");
        }
      });
    },
    toggleHamburgerMenu() {
      var windowSize = document.documentElement.clientWidth;
      let layoutType = document.documentElement.getAttribute("data-layout");
      let visiblilityType = document.documentElement.getAttribute(
        "data-sidebar-visibility"
      );

      document.documentElement.setAttribute("data-sidebar-visibility", "show");

      if (windowSize > 767)
        document.querySelector(".hamburger-icon").classList.toggle("open");

      //For collapse horizontal menu
      if (
        document.documentElement.getAttribute("data-layout") === "horizontal"
      ) {
        document.body.classList.contains("menu")
          ? document.body.classList.remove("menu")
          : document.body.classList.add("menu");
      }

      //For collapse vertical menu

      if (
        visiblilityType === "show" &&
        (layoutType === "vertical" || layoutType === "semibox")
      ) {
        if (windowSize < 1025 && windowSize > 767) {
          document.body.classList.remove("vertical-sidebar-enable");
          document.documentElement.getAttribute("data-sidebar-size") == "sm"
            ? document.documentElement.setAttribute("data-sidebar-size", "")
            : document.documentElement.setAttribute("data-sidebar-size", "sm");
        } else if (windowSize > 1025) {
          document.body.classList.remove("vertical-sidebar-enable");
          if (document.documentElement.getAttribute("data-sidebar-size") == "lg") {
            document.documentElement.setAttribute("data-sidebar-size", "sm");
            document.getElementById('bottom__menu--content').innerHTML = `© IOTLink`
          } else {
            document.documentElement.setAttribute("data-sidebar-size", "lg");
            document.getElementById('bottom__menu--content').innerHTML = `${new Date().getFullYear()} © SIPM by IOTLink`
          }
        } else if (windowSize <= 767) {
          document.body.classList.add("vertical-sidebar-enable");
          document.documentElement.setAttribute("data-sidebar-size", "lg");
        }
      }

      //Two column menu
      if (document.documentElement.getAttribute("data-layout") == "twocolumn") {
        document.body.classList.contains("twocolumn-panel")
          ? document.body.classList.remove("twocolumn-panel")
          : document.body.classList.add("twocolumn-panel");
      }
    },
    toggleMenu() {
      this.$parent.toggleMenu();
    },
    toggleRightSidebar() {
      this.$parent.toggleRightSidebar();
    },
    initFullScreen() {
      document.body.classList.toggle("fullscreen-enable");
      if (
        !document.fullscreenElement &&
        /* alternative standard method */
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
      ) {
        // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(
            Element.ALLOW_KEYBOARD_INPUT
          );
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    },
    setLanguage(locale, country, flag) {
      this.lan = locale;
      this.text = country;
      this.flag = flag;
      document.getElementById("header-lang-img").setAttribute("src", flag);
      i18n.global.locale = locale;
    },
    toggleDarkMode() {
      if (document.documentElement.getAttribute("data-layout-mode") == "dark") {
        document.documentElement.setAttribute("data-layout-mode", "light");
      } else {
        document.documentElement.setAttribute("data-layout-mode", "dark");
      }
    },
    initTopbarComponents() {
      function updateCartPrice() {
        var currencySign = "$";
        var subtotal = 0;
        Array.from(document.getElementsByClassName("cart-item-price")).forEach(
          function (e) {
            subtotal += parseFloat(e.innerHTML);
          }
        );
        if (document.getElementById("cart-item-total")) {
          document.getElementById("cart-item-total").innerHTML =
            currencySign + subtotal.toFixed(2);
        }
      }

      if (document.getElementsByClassName("dropdown-item-cart")) {
        var dropdownItemCart = document.querySelectorAll(
          ".dropdown-item-cart"
        ).length;
        Array.from(
          document.querySelectorAll(
            "#page-topbar .dropdown-menu-cart .remove-item-btn"
          )
        ).forEach(function (item) {
          item.addEventListener("click", function () {
            dropdownItemCart--;
            this.closest(".dropdown-item-cart").remove();
            Array.from(
              document.getElementsByClassName("cartitem-badge")
            ).forEach(function (e) {
              e.innerHTML = dropdownItemCart;
            });
            updateCartPrice();
            if (document.getElementById("empty-cart")) {
              document.getElementById("empty-cart").style.display =
                dropdownItemCart == 0 ? "block" : "none";
            }
            if (document.getElementById("checkout-elem")) {
              document.getElementById("checkout-elem").style.display =
                dropdownItemCart == 0 ? "none" : "block";
            }
          });
        });
        Array.from(document.getElementsByClassName("cartitem-badge")).forEach(
          function (e) {
            e.innerHTML = dropdownItemCart;
          }
        );
        if (document.getElementById("empty-cart")) {
          document.getElementById("empty-cart").style.display = "none";
        }
        if (document.getElementById("checkout-elem")) {
          document.getElementById("checkout-elem").style.display = "block";
        }
        updateCartPrice();
      }

      // notification messages
      if (document.getElementsByClassName("notification-check")) {
        Array.from(
          document.querySelectorAll(".notification-check input")
        ).forEach(function (element) {
          element.addEventListener("click", function (el) {
            el.target.closest(".notification-item").classList.toggle("active");
          });
        });
      }
    },
  },
  computed: {},
  mounted() {
  },
};
</script>

<template>
  <header id="page-topbar">
    <div class="layout-width">
      <div class="navbar-header" style="height: 45px">
        <div class="d-flex">
          <!-- LOGO -->
          <div class="navbar-brand-box horizontal-logo">
            <router-link to="/" class="logo logo-dark">
              <span class="logo-sm">
                <img src="@/assets/images/logo-sm.png" alt="" height="22"/>
              </span>
              <span class="logo-lg">
                <img src="@/assets/images/logo-thai-nguyen.svg" alt="" height="17"/>
              </span>
            </router-link>

            <router-link to="/" class="logo logo-light">
              <span class="logo-sm">
                <img src="@/assets/images/logo-sm.png" alt="" height="22"/>
              </span>
              <span class="logo-lg">
                <img src="@/assets/images/logo-thai-nguyen.svg" alt="" height="17"/>
              </span>
            </router-link>
          </div>

          <div class="d-flex justify-content-center gap-2 align-items-center">
            <button @click="toggleHamburgerMenu"
                    type="button"
                    class="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
                    id="topnav-hamburger-icon"
            >
              <span class="hamburger-icon">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
            <div class="d-flex justify-content-center flex-column">
              <span class="text-uppercase fs-14 text-b fw-semibold">{{
                  address.title
                }}</span>
              <!--              <div class="d-flex gap-1">
                              <div
                                  class=""
                                  v-for="(item, index) in address.details"
                                  :key="index"
                              >
                                <span
                                    @click="goToPage(item.to)"
                                    class="hover-text-underline text-capitalize fs-12"
                                >
                                  {{ item.name }}
                                </span>
                                <span v-if="index < address.details.length - 1">
                                  &nbsp; > &nbsp;</span
                                >
                              </div>
                            </div>-->
            </div>
          </div>
        </div>

        <div class="d-flex align-items-center">
          <div class="dropdown d-md-none topbar-head-dropdown header-item">
            <button
              type="button"
              class="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
              id="page-header-search-dropdown"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i class="bx bx-search fs-22"></i>
            </button>
            <div
              class="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
              aria-labelledby="page-header-search-dropdown"
            >
              <form class="p-3">
                <div class="form-group m-0">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Search ..."
                      aria-label="Recipient's username"
                    />
                    <b-button variant="primary" type="submit">
                      <i class="mdi mdi-magnify"></i>
                    </b-button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div class="ms-1 header-item d-none d-sm-flex">
            <!--            <img src="../assets/images/logo_iotlink.png" alt="" width="100">-->
          </div>

          <div class="ms-1 header-item d-none d-sm-flex">
            <!--            <img src="../assets/images/logo-map4d-new.png" alt="" width="100">-->
          </div>
          <User></User>
        </div>
      </div>
    </div>
  </header>
</template>