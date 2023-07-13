<script>
import {layoutComputed} from "@/state/helpers";

export default {
  props: {
    chooseMenu: {
      type: String,
      default: "none",
    },
    slug: {
      type: String,
      default: "sipm-base",
    },
  },
  data() {
    return {
      settings: {
        minScrollbarLength: 60,
      },
    };
  },
  computed: {
    ...layoutComputed,
    layoutType: {
      get() {
        return this.$store ? this.$store.state.layout.layoutType : {} || {};
      },
    },
  },

  watch: {
    $route: {
      handler: "onRoutechange",
      immediate: true,
      deep: true,
    },
  },

  mounted() {
    if (document.querySelectorAll(".navbar-nav .collapse")) {
      let collapses = document.querySelectorAll(".navbar-nav .collapse");

      collapses.forEach((collapse) => {
        // Hide sibling collapses on `show.bs.collapse`
        collapse.addEventListener("show.bs.collapse", (e) => {
          e.stopPropagation();
          let closestCollapse = collapse.parentElement.closest(".collapse");
          if (closestCollapse) {
            let siblingCollapses =
              closestCollapse.querySelectorAll(".collapse");
            siblingCollapses.forEach((siblingCollapse) => {
              if (siblingCollapse.classList.contains("show")) {
                siblingCollapse.classList.remove("show");
                siblingCollapse.parentElement.firstChild.setAttribute(
                  "aria-expanded",
                  "false"
                );
              }
            });
          } else {
            let getSiblings = (elem) => {
              // Setup siblings array and get the first sibling
              let siblings = [];
              let sibling = elem.parentNode.firstChild;
              // Loop through each sibling and push to the array
              while (sibling) {
                if (sibling.nodeType === 1 && sibling !== elem) {
                  siblings.push(sibling);
                }
                sibling = sibling.nextSibling;
              }
              return siblings;
            };
            let siblings = getSiblings(collapse.parentElement);
            siblings.forEach((item) => {
              if (item.childNodes.length > 2) {
                item.firstElementChild.setAttribute("aria-expanded", "false");
                item.firstElementChild.classList.remove("active");
              }
              let ids = item.querySelectorAll("*[id]");
              ids.forEach((item1) => {
                item1.classList.remove("show");
                item1.parentElement.firstChild.setAttribute(
                  "aria-expanded",
                  "false"
                );
                item1.parentElement.firstChild.classList.remove("active");
                if (item1.childNodes.length > 2) {
                  let val = item1.querySelectorAll("ul li a");

                  val.forEach((subitem) => {
                    if (subitem.hasAttribute("aria-expanded"))
                      subitem.setAttribute("aria-expanded", "false");
                  });
                }
              });
            });
          }
        });

        // Hide nested collapses on `hide.bs.collapse`
        collapse.addEventListener("hide.bs.collapse", (e) => {
          e.stopPropagation();
          let childCollapses = collapse.querySelectorAll(".collapse");
          childCollapses.forEach((childCollapse) => {
            let childCollapseInstance = childCollapse;
            childCollapseInstance.classList.remove("show");
            childCollapseInstance.parentElement.firstChild.setAttribute(
              "aria-expanded",
              "false"
            );
          });
        });
      });
    }
  },

  methods: {
    onRoutechange(ele) {
      this.initActiveMenu(ele.path);
      if (document.getElementsByClassName("mm-active").length > 0) {
        const currentPosition =
          document.getElementsByClassName("mm-active")[0].offsetTop;
        if (currentPosition > 500)
          if (this.$refs.isSimplebar)
            this.$refs.isSimplebar.value.getScrollElement().scrollTop =
              currentPosition + 300;
      }
    },

    initActiveMenu(ele) {
      setTimeout(() => {
        if (document.querySelector("#navbar-nav")) {
          let a = document
            .querySelector("#navbar-nav")
            .querySelector('[href="' + ele + '"]');
          if (a) {
            a.classList.add("active");
            let parentCollapseDiv = a.closest(".collapse.menu-dropdown");
            if (parentCollapseDiv) {
              parentCollapseDiv.classList.add("show");
              parentCollapseDiv.parentElement.children[0].classList.add(
                "active"
              );
              parentCollapseDiv.parentElement.children[0].setAttribute(
                "aria-expanded",
                "true"
              );
              if (
                parentCollapseDiv.parentElement.closest(
                  ".collapse.menu-dropdown"
                )
              ) {
                parentCollapseDiv.parentElement
                  .closest(".collapse")
                  .classList.add("show");
                if (
                  parentCollapseDiv.parentElement.closest(".collapse")
                    .previousElementSibling
                )
                  parentCollapseDiv.parentElement
                    .closest(".collapse")
                    .previousElementSibling.classList.add("active");
                const grandparent = parentCollapseDiv.parentElement
                  .closest(".collapse")
                  .previousElementSibling.parentElement.closest(".collapse");
                if (
                  grandparent &&
                  grandparent &&
                  grandparent.previousElementSibling
                ) {
                  grandparent.previousElementSibling.classList.add("active");
                  grandparent.classList.add("show");
                }
              }
            }
          }
        }
      }, 0);
    },
  },
};
</script>

<template>
  <b-container fluid>
    <div id="two-column-menu"></div>

    <template v-if="layoutType === 'twocolumn'"></template>

    <template v-else>
      <ul class="navbar-nav h-100" id="navbar-nav">
        <li class="menu-title" v-if="chooseMenu === `huong-dan`">
          <span data-key="t-widget">Hướng dẫn sử dụng</span>
        </li>
        <li class="nav-item" v-if="chooseMenu === `huong-dan`">
          <router-link
            class="nav-link menu-link"
            :to="{ name: 'HowToUsePage' }"
            role="button"
          >
            <i class="mdi mdi-lifebuoy" style="color: #fac629"></i>
            <span data-key="t-dashboards">Hướng dẫn sử dụng</span>
          </router-link>
        </li>
        <li class="menu-title" v-if="chooseMenu === `he-thong`">
          <span data-key="t-widget">QUẢN LÝ KHU CÔNG NGHIỆP</span>
        </li>
        <li class="nav-item" v-if="chooseMenu === `he-thong`">
          <router-link
            class="nav-link menu-link"
            :to="{ name: 'ManageIndustrialPage' }"
            role="button"
          >
            <i class="ri-building-fill" style="color: #fa2929"></i>
            <span data-key="t-dashboards">Khu công nghiệp</span>
          </router-link>
        </li>
        <li class="menu-title" v-if="chooseMenu === `don-vi`">
          <span data-key="t-widget">QUẢN LÝ ĐƠN VỊ PHÒNG BAN</span>
        </li>
        <li class="nav-item" v-if="chooseMenu === `don-vi`">
          <router-link
            class="nav-link menu-link"
            :to="{ name: 'ManageDepartmentManagePage' }"
            role="button"
          >
            <i class="mdi mdi-office-building-cog" style="color: #ff0000"></i>
            <span data-key="t-dashboards">Đơn vị phòng ban</span>
          </router-link>
        </li>
        <li class="menu-title" v-if="chooseMenu === `dieu-khoan-chinh-sach`">
          <span data-key="t-widget">ĐIỀU KHOẢN & CHÍNH SÁCH</span>
        </li>
        <li class="nav-item" v-if="chooseMenu === `dieu-khoan-chinh-sach`">
          <router-link
            class="nav-link menu-link"
            :to="{ name: 'TermPage' }"
            role="button"
          >
            <i class="ri-pages-line" style="color: #00aeff"></i>
            <span data-key="t-dashboards">Điều khoản sử dụng</span>
          </router-link>
        </li>
        <li class="nav-item" v-if="chooseMenu === `dieu-khoan-chinh-sach`">
          <router-link
            class="nav-link menu-link"
            :to="{ name: 'PolicyPage' }"
            role="button"
          >
            <i class="ri-honour-line" style="color: #ff7700"></i>
            <span data-key="t-dashboards">Chính sách bảo mật</span>
          </router-link>
        </li>
        <li class="menu-title" v-if="chooseMenu === `don-vi-hanh-chinh`">
          <span data-key="t-widget">QUẢN LÝ ĐƠN VỊ HÀNH CHÍNH</span>
        </li>
        <li class="nav-item" v-if="chooseMenu === `don-vi-hanh-chinh`">
          <b-link
            class="nav-link menu-link"
            :href="
              $router.resolve({
                name: 'ManageBoundaryPage',
                params: { item: 'province' },
              }).href
            "
            role="button"
          >
            <i class="ri-community-fill" style="color: #f1c40f"></i>
            <span data-key="t-dashboards">Hành chính cấp Tỉnh</span>
          </b-link>
        </li>
        <li class="nav-item" v-if="chooseMenu === `don-vi-hanh-chinh`">
          <b-link
            class="nav-link menu-link"
            :href="
              $router.resolve({
                name: 'ManageBoundaryPage',
                params: { item: 'district' },
              }).href
            "
            role="button"
          >
            <i class="ri-community-fill" style="color: #0fd7f1"></i>
            <span data-key="t-dashboards">Hành chính cấp Huyện</span>
          </b-link>
        </li>
        <li class="nav-item" v-if="chooseMenu === `don-vi-hanh-chinh`">
          <b-link
            class="nav-link menu-link"
            :href="
              $router.resolve({
                name: 'ManageBoundaryPage',
                params: { item: 'commune' },
              }).href
            "
            role="button"
          >
            <i class="ri-community-fill" style="color: #f10f0f"></i>
            <span data-key="t-dashboards">Hành chính cấp Xã</span>
          </b-link>
        </li>
        <li class="menu-title" v-if="chooseMenu === `nguoi-dung`">
          <span data-key="t-widget">QUẢN LÝ NGƯỜI DÙNG</span>
        </li>
        <li class="nav-item" v-if="chooseMenu === `nguoi-dung`">
          <router-link
            class="nav-link menu-link"
            :to="{ name: 'ManageUserPage' }"
            role="button"
          >
            <i class="ri-user-2-fill" style="color: #82c756"></i>
            <span data-key="t-dashboards">Người dùng</span>
          </router-link>
        </li>
        <li class="nav-item" v-if="chooseMenu === `nguoi-dung`">
          <router-link
            class="nav-link menu-link"
            :to="{ name: 'ManageRolePage' }"
            role="button"
          >
            <i class="ri-user-star-fill" style="color: #e67e22"></i>
            <span data-key="t-dashboards">Phân quyền</span>
          </router-link>
        </li>

        <!-- kế hoạch -->

        <!-- <li class="menu-title text-center" v-if="chooseMenu === `ke-hoach`">
          <span data-key="t-widget">QUẢN LÝ KẾ HOẠCH</span>
        </li>
        <li class="nav-item" v-if="chooseMenu === `ke-hoach`">
          <router-link
            class="nav-link menu-link"
            :to="{ name: `${slug}ManageTypePlanPage` }"
            role="button"
          >
            <i class="ri-user-star-fill" style="color: #e67e22"></i>
            <span data-key="t-dashboards">Loại kế hoạch</span>
        <li class="nav-item" v-if="chooseMenu === `ke-hoach`">
          <router-link
            class="nav-link menu-link"
            :to="{ name: `${slug}ManagePlanPage` }"
            role="button"
          >
            <i class="ri-user-star-fill" style="color: #e67e22"></i>
            <span data-key="t-dashboards">Kế hoạch</span>
          </router-link>
        </li> -->
        <li class="menu-title" v-if="chooseMenu === `thong-bao`">
          <span data-key="t-widget">QUẢN LÝ THÔNG BÁO</span>
        </li>
        <li class="nav-item" v-if="chooseMenu === `thong-bao`">
          <router-link
            class="nav-link menu-link"
            :to="{ name: 'ManageNotificationPage' }"
            role="button"
          >
            <i class="ri-notification-3-fill" style="color: #82c756"></i>
            <span data-key="t-dashboards">Thông báo</span>
          </router-link>
        </li>
        <li class="nav-item" v-if="chooseMenu === `thong-bao`">
          <router-link
            class="nav-link menu-link"
            :to="{ name: 'ManageModelNotificationPage' }"
            role="button"
          >
            <i class="ri-message-2-fill" style="color: #ecd832"></i>
            <span data-key="t-dashboards">Mẫu thông báo</span>
          </router-link>
        </li>
        <li class="nav-item" v-if="chooseMenu === `thong-bao`">
          <router-link
            class="nav-link menu-link"
            :to="{ name: 'ManageSubscriberPage' }"
            role="button"
          >
            <i class="ri-registered-fill" style="color: "></i>
            <span data-key="t-dashboards">Đăng ký</span>
          </router-link>
        </li>

        <li class="menu-title" v-if="chooseMenu === `he-thong`">
          <span data-key="t-widget">CẤU HÌNH HỆ THỐNG</span>
        </li>
        <li class="nav-item" v-if="chooseMenu === `he-thong`">
          <router-link class="nav-link menu-link" role="button" :to="{name: 'SettingPage'}">
            <i class="ri-settings-5-fill" style="color: #333333"></i>
            <span data-key="t-dashboards">Cấu hình hệ thống</span>
          </router-link>
        </li>
        <li class="menu-title" v-if="chooseMenu === `he-thong`">
          <span data-key="t-widget">Nhật ký hệ thống</span>
        </li>
        <li class="nav-item" v-if="chooseMenu === `he-thong`">
          <router-link
            class="nav-link menu-link"
            :to="{ name: 'LogAuthPage' }"
            role="button"
          >
            <i class="ri-newspaper-fill" style="color: #4dc3ff"></i>
            <span data-key="t-dashboards">Nhật ký hoạt động</span>
          </router-link>
        </li>
        <li class="nav-item" v-if="chooseMenu === `he-thong`">
          <router-link
            class="nav-link menu-link"
            :to="{ name: 'ActivityAuthPage' }"
            role="button"
          >
            <i class="ri-pencil-ruler-2-line" style="color: #5fff4d"></i>
            <span data-key="t-dashboards">Nhật ký thao tác</span>
          </router-link>
        </li>
      </ul>
      <div class="d-flex position-fixed bottom-0" id="bottom__menu">
        <p class="fs-11 text-white-50 mb-3" id="bottom__menu--content">
          {{ new Date().getFullYear() }} © SIPM by IOTLink
        </p>
      </div>
    </template>
  </b-container>
</template>

<style scoped>
#bottom__menu {
  padding: 0 10px;
}
</style>
