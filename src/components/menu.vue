<script>
import { layoutComputed } from "@/state/helpers";

export default {
  props: {
    slug: {
      type: String,
      default: "sipm-base",
    },
    chooseMenu: {
      type: String,
      default: "none",
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
        <li class="menu-title" v-if="chooseMenu === `phong-ban`">
          <span data-key="t-widget">QUẢN LÝ PHÒNG BAN</span>
        </li>
        <li class="nav-item" v-if="chooseMenu === `phong-ban`">
          <router-link
            class="nav-link menu-link"
            :to="{ name: `${slug}ManageDepartmentPage` }"
            role="button"
          >
            <i class="ri-building-2-fill" style="color: #3498db"></i>
            <span data-key="t-dashboards">Phòng ban khu công nghiệp</span>
          </router-link>
        </li>
        <li class="menu-title" v-if="chooseMenu === `khai-thac-du-lieu`">
          <span data-key="t-widget">KHAI THÁC DỮ LIỆU</span>
        </li>
        <li class="nav-item" v-if="chooseMenu === `khai-thac-du-lieu`">
          <router-link
            :to="{ name: `${slug}MiningPage` }"
            class="nav-link menu-link"
          >
            <i class="mdi mdi-database-import" style="color: #17a589"></i>
            <span data-key="t-dashboards">Khai thác dữ liệu</span>
          </router-link>
        </li>
        <li class="menu-title" v-if="chooseMenu === `hoat-dong`">
          <span data-key="t-widget">QUẢN LÝ HOẠT ĐỘNG</span>
        </li>
        <li class="nav-item" v-if="chooseMenu === `hoat-dong`">
          <router-link
            :to="{ name: `${slug}ManageActivities` }"
            class="nav-link menu-link"
          >
            <i class="ri-stock-line" style="color: #f10f0f"></i>
            <span data-key="t-dashboards">Hoạt động</span>
          </router-link>

          <router-link
            :to="{ name: `${slug}ManageActivitiesType` }"
            class="nav-link menu-link"
          >
            <i class="ri-stock-line" style="color: #f10f0f"></i>
            <span data-key="t-dashboards">Loại hoạt động</span>
          </router-link>
        </li>
        
        <li class="menu-title" v-if="chooseMenu === `phan-anh`">
          <span data-key="t-widget">QUẢN LÝ THÔNG TIN PHẢN ÁNH</span>
        </li>
        <li class="nav-item" v-if="chooseMenu === `phan-anh`">
          <router-link
            :to="{ name: `${slug}ManageFeedbackPage` }"
            class="nav-link menu-link"
          >
            <i class="ri-feedback-fill" style="color: #f1a60f"></i>
            <span data-key="t-dashboards">Phản ánh</span>
          </router-link>
        </li>
        <li class="menu-title" v-if="chooseMenu === `du-lieu`">
          <span data-key="t-widget">DỮ LIỆU, BỘ DỮ LIỆU</span>
        </li>
        <li class="nav-item" v-if="chooseMenu === `du-lieu`">
          <router-link
            :to="{ name: `${slug}ManageDataPage` }"
            class="nav-link menu-link"
          >
            <i class="mdi mdi-database-import" style="color: #f1c40f"></i>
            <span data-key="t-dashboards">Dữ liệu</span>
          </router-link>
        </li>
        <li class="nav-item" v-if="chooseMenu === `du-lieu`">
          <b-link
            class="nav-link menu-link"
            href="#sidebarDashboards"
            role="button"
            aria-expanded="false"
            aria-controls="sidebarDashboards"
          >
            <i class="mdi mdi-database-refresh" style="color: #e67e22"></i>
            <span data-key="t-dashboards">Bộ dữ liệu</span>
          </b-link>
        </li>

        <li class="menu-title" v-if="chooseMenu === `ban-do`">
          <span data-key="t-widget">BẢN ĐỒ, LỚP BẢN ĐỒ</span>
        </li>
        <li class="nav-item" v-if="chooseMenu === `ban-do`">
          <router-link
            class="nav-link menu-link"
            :to="{ name: `${slug}ManageMapPage` }"
            role="button"
            aria-expanded="false"
            aria-controls="sidebarDashboards"
          >
            <i class="ri-map-fill" style="color: #f5c7f5"></i>
            <span data-key="t-dashboards">Bản đồ</span>
          </router-link>
        </li>
        <li class="nav-item" v-if="chooseMenu === `ban-do`">
          <router-link
            class="nav-link menu-link"
            :to="{ name: `${slug}ManageMapStylesPage` }"
            role="button"
          >
            <i class="ri-contrast-drop-fill" style="color: #4dc3ff"></i>
            <span data-key="t-dashboards">Styles</span>
          </router-link>
        </li>
        <li class="menu-title" v-if="chooseMenu === `doi-tuong-3d`">
          <span data-key="t-widget">QUẢN LÝ ĐỐI TƯỢNG 3D</span>
        </li>
        <li class="nav-item" v-if="chooseMenu === `doi-tuong-3d`">
          <router-link
            class="nav-link menu-link"
            :to="{ name: `ManageObjectPage` }"
            role="button"
          >
            <i class="mdi mdi-cube-scan" style="color: #d76262"></i>
            <span data-key="t-dashboards">Đối tượng 3D</span>
          </router-link>
        </li>

        <li class="menu-title" v-if="chooseMenu === `tai-lieu`">
          <span data-key="t-widget">TÀI LIỆU, CHIA SẺ, THU THẬP</span>
        </li>
        <li class="nav-item" v-if="chooseMenu === `tai-lieu`">
          <b-link
            class="nav-link menu-link"
            href="#sidebarDashboards"
            data-bs-toggle="collapse"
            role="button"
            aria-expanded="false"
            aria-controls="sidebarDashboards"
          >
            <i class="ri-book-open-fill" style="color: #4eb3d3"></i>
            <span data-key="t-dashboards">Tài liệu</span>
          </b-link>
        </li>
        <li class="nav-item" v-if="chooseMenu === `tai-lieu`">
          <b-link
            class="nav-link menu-link"
            href="#sidebarDashboards"
            data-bs-toggle="collapse"
            role="button"
            aria-expanded="false"
            aria-controls="sidebarDashboards"
          >
            <i class="bx bxs-share-alt" style="color: #22a3ff"></i>
            <span data-key="t-dashboards">Chia sẻ dữ liệu</span>
          </b-link>
        </li>
        <li class="nav-item" v-if="chooseMenu === `tai-lieu`">
          <b-link
            class="nav-link menu-link"
            href="#sidebarDashboards"
            data-bs-toggle="collapse"
            role="button"
            aria-expanded="false"
            aria-controls="sidebarDashboards"
          >
            <i class="bx bxs-collection" style="color: #49ce12"></i>
            <span data-key="t-dashboards">Thu thập dữ liệu</span>
          </b-link>
        </li>
        <!-- ke hoach -->
        <li class="menu-title" v-if="chooseMenu === `ke-hoach`">
          <span data-key="t-widget">QUẢN LÝ KẾ HOẠCH</span>
        </li>
        <li class="nav-item" v-if="chooseMenu === `ke-hoach`">
          <router-link
            class="nav-link menu-link"
            :to="{ name: `${slug}ManageTypePlanPage` }"
            role="button"
          >
            <i class="ri-chat-history-fill" style="color: "></i>
            <span data-key="t-dashboards">Loại kê hoạch</span>
          </router-link>
        </li>
        <li class="nav-item" v-if="chooseMenu === `ke-hoach`">
          <router-link
            class="nav-link menu-link"
            :to="{ name: `${slug}ManagePlanPage` }"
            role="button"
            aria-expanded="false"
            aria-controls="sidebarDashboards"
          >
            <i class="ri-map-fill" style="color: #f5c7f5"></i>
            <span data-key="t-dashboards">Kế hoạch</span>
          </router-link>
        </li>
        <li class="nav-item" v-if="chooseMenu === `ke-hoach`">
          <router-link
            class="nav-link menu-link"
            :to="{ name: `${slug}ManagePlanStylesPage` }"
            role="button"
          >
            <i class="ri-contrast-drop-fill" style="color: #4dc3ff"></i>
            <span data-key="t-dashboards">Phạm vi khảo sát</span>
          </router-link>
        </li>
      </ul>

      <!-- exchange-data -->
      <li class="menu-title" v-if="chooseMenu === `exchange-data`">
        <span data-key="t-widget">QUẢN LÝ TRAO ĐỔI DỮ LIỆU</span>
      </li>
      <li class="nav-item" v-if="chooseMenu === `exchange-data`">
        <router-link
          class="nav-link menu-link"
          style="padding: 12px 20px"
          :to="{ name: `${slug}ManageDataInformationPage` }"
          role="button"
        >
          <i class="ri-file-list-fill" style="color: #4dc3ff"></i>
          <span data-key="t-dashboards" style="color: white; margin-left: 4px"
            >Dữ liệu công khai</span
          >
        </router-link>
      </li>
      <li class="nav-item" v-if="chooseMenu === `exchange-data`">
        <router-link
          class="nav-link menu-link"
          style="padding: 12px 20px"
          :to="{ name: `${slug}ManageExchangeDataPage` }"
          role="button"
        >
          <i class="ri-file-paper-2-fill" style="color: #4dc3ff"></i>
          <span data-key="t-dashboards" style="color: white; margin-left: 4px"
            >Dữ liệu phản ánh hiện trường</span
          >
        </router-link>
      </li>
      <li class="nav-item" v-if="chooseMenu === `exchange-data`">
        <router-link
          class="nav-link menu-link"
          style="padding: 12px 20px"
          :to="{ name: `${slug}ManageDataInformationKcnPage` }"
          role="button"
        >
          <i class=" ri-file-fill" style="color: #4dc3ff"></i>
          <span data-key="t-dashboards" style="color: white; margin-left: 4px"
            >Dữ liệu thông tin KCN</span
          >
        </router-link>
      </li>
      <!-- <li class="nav-item" v-if="chooseMenu === `exchange-data`">
        <router-link
          class="nav-link menu-link"
          :to="{ name: `${slug}ManageDataSitePage` }"
          role="button"
        >
          <i class="ri-chat-history-fill" style="color: #4dc3ff"></i>
          <span data-key="t-dashboards">Dữ liệu phản ánh hiện trường</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="chooseMenu === `exchange-data`">
        <router-link
          class="nav-link menu-link"
          :to="{ name: `${slug}ManageInformationKCNPage` }"
          role="button"
        >
          <i class="ri-chat-history-fill" style="color: #4dc3ff"></i>
          <span data-key="t-dashboards">Dữ liệu thông tin KCN</span>
        </router-link>
      </li> -->

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
