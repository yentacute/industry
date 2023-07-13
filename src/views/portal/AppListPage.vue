<script>
import {useRouter} from "vue-router";
import Layout from "../../layouts/main.vue";
import http from "../../helpers/api/axiosHttp";
import {useFolderStore} from "../../state/folder";

const store = useFolderStore();

export default {
  components: {
    Layout,
  },
  data() {
    return {
      industrialData: {},
      KCNChoosed: {
        slug: "",
        name: "",
      },
      KCNBase: {
        slug: "sipm-base",
        name: "SIPM BASE",
      },
      stateKCN: false,
      choosedMenu: "",
      accessToken: "",
      isAdmin: store.currentUserRole === 'admin-he-thong' ? true : false
    };
  },
  async created() {
    const res = await http.get(`/industrial-area?slug`);
    this.industrialData = res.data;
  },
  mounted() {
    document
      .getElementById("navbarSupportedContent")
      .style.setProperty("display", "none", "important");
    const tokenString = localStorage.getItem("auth");
    this.accessToken = JSON.parse(tokenString);
  },
  methods: {
    handleChooseKCN(item) {
      this.stateKCN = true;
      this.KCNChoosed.slug = item.slug;
      this.KCNChoosed.name = item.name;
      store.slug = item.slug;
    },
  },
};
</script>

<style scoped>
.auth-one-bg {
  background-image: url("@/assets/images/intro_page/bg-1.jpg");
}
</style>

<template>
  <Layout pageLayout="landing" isSticky isLight>
    <section class="section nft-hero" id="content--main">
      <div class="bg-overlay" style="opacity: .55"></div>
      <div class="container">
        <div class="mb-4">
          <div class="row">
            <div class="col-lg-12 col-sm-10">
              <h4 class="section-title mb-4 text-uppercase" style="color: #f7ca2e;">
                {{ stateKCN ? "Quản lý hạ tầng kỹ thuật" : "Khu công nghiệp" }}
              </h4>
            </div>
          </div>

          <b-row
            class="row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1"
            v-if="!stateKCN"
          >

            <b-col @click="handleChooseKCN(KCNBase)">
              <b-card no-body class="card-height-100 cursor-pointer card-animate">
                <b-card-body class="text-center py-4">
                  <i class="ri-building-line display-6 text-primary"></i>
                  <h6 class="mt-4 fs-14 text-muted">SIPM-BASE</h6>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col
              v-for="item in industrialData"
              :key="item.id"
              @click="handleChooseKCN(item)"
            >
              <b-card
                no-body
                class="card-height-100 cursor-pointer card-animate"
              >
                <b-card-body class="text-center py-4">
                  <i class="ri-building-line display-6 text-primary"></i>
                  <h6 class="mt-4 fs-14 text-muted">{{ item.name }}</h6>
                </b-card-body>
              </b-card>
            </b-col>
          </b-row>
          <b-row
            class="row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1"
            v-else
          >
            <b-col>
              <b-card no-body class="card-height-100 card-animate">
                <b-card-body class="text-center py-4">
                  <i
                    class="mdi mdi-database-cog-outline display-6 text-primary"
                  ></i>
                  <router-link
                    :to="{ name: `${KCNChoosed.slug}MiningPage` }"
                    class="stretched-link"
                  >
                    <h6 class="mt-4 fs-14 text-muted">Khai thác dữ liệu</h6>
                  </router-link>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col>
              <b-card no-body class="card-height-100 card-animate">
                <b-card-body class="text-center py-4">
                  <i class="mdi mdi-database display-6 text-primary"></i>
                  <router-link
                    :to="{ name: `${KCNChoosed.slug}ManageDataPage` }"
                    class="stretched-link"
                  >
                    <h6 class="mt-4 fs-14 text-muted">Quản lý dữ liệu</h6>
                  </router-link>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col>
              <b-card no-body class="card-height-100 card-animate">
                <b-card-body class="text-center py-4">
                  <i class="ri-road-map-line display-6 text-primary"></i>
                  <router-link
                    :to="{ name: `${KCNChoosed.slug}ManageMapPage` }"
                    class="stretched-link"
                  >
                    <h6 class="mt-4 fs-14 text-muted">Quản lý bản đồ</h6>
                  </router-link>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col>
              <b-card no-body class="card-height-100 card-animate">
                <b-card-body class="text-center py-4">
                  <i class="ri-stock-line display-6 text-primary"></i>
                  <router-link
                    :to="{ name: `${KCNChoosed.slug}ManageActivities` }"
                    class="stretched-link"
                  >
                    <h6 class="mt-4 fs-14 text-muted">Quản lý hoạt động</h6>
                  </router-link>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col>
              <b-card no-body class="card-height-100 card-animate">
                <b-card-body class="text-center py-4">
                  <i class="mdi mdi-cube-scan display-6 text-primary"></i>
                  <router-link
                    :to="{ name: 'ManageObjectPage' }"
                    class="stretched-link"
                  >
                    <h6 class="mt-4 fs-14 text-muted">Quản lý đối tượng 3D</h6>
                  </router-link>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col>
              <b-card no-body class="card-height-100 card-animate">
                <b-card-body class="text-center py-4">
                  <i class="ri-community-line display-6 text-primary"></i>
                  <router-link
                    :to="{ name: `${KCNChoosed.slug}ManageDepartmentPage` }"
                    class="stretched-link"
                  >
                    <h6 class="mt-4 fs-14 text-muted">
                      Phòng ban khu công nghiệp
                    </h6>
                  </router-link>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col>
              <b-card no-body class="card-height-100 card-animate">
                <b-card-body class="text-center py-4">
                  <i class="ri-video-chat-line display-6 text-primary"></i>
                  <router-link
                    :to="{ name: `${KCNChoosed.slug}ManagePlanPage` }"
                    class="stretched-link"
                  >
                    <h6 class="mt-4 fs-14 text-muted">Tuần tra khảo sát</h6>
                  </router-link>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col>
              <b-card no-body class="card-height-100 card-animate">
                <b-card-body class="text-center py-4">
                  <i class="ri-feedback-line display-6 text-primary"></i>
                  <router-link
                    :to="{ name: `${KCNChoosed.slug}ManageFeedbackPage` }"
                    class="stretched-link"
                  >
                    <h6 class="mt-4 fs-14 text-muted">Thông tin phản ánh</h6>
                  </router-link>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col>
              <b-card no-body class="card-height-100 card-animate">
                <b-card-body class="text-center py-4">
                  <i class="ri-exchange-line display-6 text-primary"></i>
                  <router-link
                    :to="{
                      name: `${KCNChoosed.slug}ManageDataInformationPage`,
                    }"
                    class="stretched-link"
                  >
                    <h6 class="mt-4 fs-14 text-muted">
                      Quản lý trao đổi dữ liệu
                    </h6>
                  </router-link>
                </b-card-body>
              </b-card>
            </b-col>
          </b-row>
        </div>
        <div class="mb-4">
          <div class="row">
            <div class="col-lg-12 col-sm-10">
              <h4 class="section-title mb-4 text-uppercase" style="color: #f7ca2e;">
                {{ stateKCN ? "Quản lý thông tin" : "Quản trị hệ thống" }}
              </h4>
            </div>
          </div>
          <b-row
            class="row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1"
            v-if="!stateKCN"
          >
            <b-col>
              <b-card no-body class="card-height-100 card-animate">
                <b-card-body class="text-center py-4">
                  <i class="ri-settings-5-line display-6 text-primary"></i>
                  <router-link
                    :to="{ name: 'SettingPage' }"
                    class="stretched-link"
                  >
                    <h6 class="mt-4 fs-14 text-muted">Hệ thống</h6>
                  </router-link>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col>
              <router-link :to="{ name: 'ManageUserPage' }">
                <b-card no-body class="card-height-100 card-animate">
                  <b-card-body class="text-center py-4">
                    <i
                      class="ri-account-circle-line display-6 text-primary"
                    ></i>
                    <b-link href="#!" class="stretched-link">
                      <h6 class="mt-4 fs-14 text-muted">Người dùng</h6>
                    </b-link>
                  </b-card-body>
                </b-card>
              </router-link>
            </b-col>
            <b-col>
              <router-link
                :to="{
                  name: 'ManageBoundaryPage',
                  params: { item: 'province' },
                }"
              >
                <b-card no-body class="card-height-100 card-animate">
                  <b-card-body class="text-center py-4">
                    <i class="ri-treasure-map-line display-6 text-primary"></i>
                    <b-link href="#!" class="stretched-link">
                      <h6 class="mt-4 fs-14 text-muted">Đơn vị hành chính</h6>
                    </b-link>
                  </b-card-body>
                </b-card>
              </router-link>
            </b-col>
            <b-col>
              <router-link :to="{ name: 'ManageDepartmentManagePage' }">
                <b-card no-body class="card-height-100 card-animate">
                  <b-card-body class="text-center py-4">
                    <i class="bx bx-building-house display-6 text-primary"></i>
                    <b-link href="#!" class="stretched-link">
                      <h6 class="mt-4 fs-14 text-muted">Đơn vị/ Tổ chức</h6>
                    </b-link>
                  </b-card-body>
                </b-card>
              </router-link>
            </b-col>
            <b-col>
              <router-link :to="{ name: 'ManageNotificationPage' }">
                <b-card no-body class="card-height-100 card-animate">
                  <b-card-body class="text-center py-4">
                    <i
                      class="ri-notification-2-fill display-6 text-primary"
                    ></i>
                    <b-link href="#!" class="stretched-link">
                      <h6 class="mt-4 fs-14 text-muted">Thông báo</h6>
                    </b-link>
                  </b-card-body>
                </b-card>
              </router-link>
            </b-col>
            <!--            <b-col>
              <router-link :to="{name: 'APIServicePage'}">
                <b-card no-body class="card-height-100 card-animate">
                  <b-card-body class="text-center py-4">
                    <i class="mdi mdi-folder-key-network-outline display-6 text-primary"></i>
                    <b-link href="#!" class="stretched-link">
                      <h6 class="mt-4 fs-14 text-muted">
                        Dịch vụ API
                      </h6>
                    </b-link>
                  </b-card-body>
                </b-card>
              </router-link>
            </b-col>-->
          </b-row>
          <b-row
            class="row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1"
            v-else
          >
            <b-col v-if="isAdmin">
              <b-card no-body class="card-height-100 card-animate">
                <b-card-body class="text-center py-4">
                  <i class="ri-terminal-window-fill display-6 text-primary"></i>
                  <b-link
                    :href="`/kcn-songcong2/login-token/?access_token=` + accessToken + `&next=/kcn-songcong2/trangchu/dashboard`"
                    class="stretched-link">
                    <h6 class="mt-4 fs-14 text-muted">Dashboard</h6>
                  </b-link>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col v-if="isAdmin">
              <b-card no-body class="card-height-100 card-animate">
                <b-card-body class="text-center py-4">
                  <i class="ri-building-fill display-6 text-primary"></i>
                  <b-link
                    :href="`/kcn-songcong2/login-token/?access_token=` + accessToken + `&next=/kcn-songcong2/kcn/list`"
                    class="stretched-link">
                    <h6 class="mt-4 fs-14 text-muted">
                      Thông tin doanh nghiệp
                    </h6>
                  </b-link>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col v-if="isAdmin">
              <b-card no-body class="card-height-100 card-animate">
                <b-card-body class="text-center py-4">
                  <i class="ri-bar-chart-grouped-fill display-6 text-primary"></i>
                  <b-link
                    :href="`/kcn-songcong2/login-token/?access_token=` + accessToken + `&next=/kcn-songcong2/quangba/danh-sach-thong-ke`"
                    class="stretched-link"
                  >
                    <h6 class="mt-4 fs-14 text-muted">Báo cáo thống kê</h6>
                  </b-link>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col v-if="isAdmin">
              <b-card no-body class="card-height-100 card-animate">
                <b-card-body class="text-center py-4">
                  <i class="ri-settings-5-line display-6 text-primary"></i>
                  <b-link
                    :href="`/kcn-songcong2/login-token/?access_token=` + accessToken + `&next=/kcn-songcong2/nguoidung/list`"
                    class="stretched-link"
                  >
                    <h6 class="mt-4 fs-14 text-muted">Thiết lập</h6>
                  </b-link>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col v-if="!isAdmin">
              <b-card no-body class="card-height-100 card-animate">
                <b-card-body class="text-center py-4">
                  <i class="ri-building-fill display-6 text-primary"></i>
                  <b-link
                    :href="`/kcn-songcong2/login-token/?access_token=` + accessToken + `&next=/kcn-songcong2/doanhnghiep/view`"
                    class="stretched-link">
                    <h6 class="mt-4 fs-14 text-muted">
                      Thông tin doanh nghiệp
                    </h6>
                  </b-link>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col v-if="!isAdmin">
              <b-card no-body class="card-height-100 card-animate">
                <b-card-body class="text-center py-4">
                  <i class="ri-bar-chart-grouped-fill display-6 text-primary"></i>
                  <b-link
                    :href="`/kcn-songcong2/login-token/?access_token=` + accessToken + `&next=/kcn-songcong2/baocaoyeucau/doanhnghiep-list`"
                    class="stretched-link"
                  >
                    <h6 class="mt-4 fs-14 text-muted">Báo cáo thống kê</h6>
                  </b-link>
                </b-card-body>
              </b-card>
            </b-col>
          </b-row>
        </div>
        <div class="mb-4 w-100 text-center" v-if="stateKCN">
          <b-button
            variant="secondary"
            class="btn btn-primary w-lg waves-effect waves-light"
            @click="stateKCN = !stateKCN"
          ><i class="ri-arrow-left-line me-2 fw-semibold align-bottom"></i>
            Quay lại
          </b-button>
        </div>
        <div class="mb-4 w-100 text-center" v-else>
          <router-link
            :to="{ name: 'HomePage' }"
            class="btn btn-secondary w-lg waves-effect waves-light"
          >
            <i class="ri-arrow-left-line me-2 fw-semibold align-bottom"></i>
            Trang chủ
          </router-link>
        </div>
      </div>
    </section>
  </Layout>
</template>
<style scoped>
#content--main {
  padding: 6em 0.5rem;
}

@media (min-width: 992px) {
  #content--main {
    padding: 14em 12em 20em;
  }
}

.row-cols-xxl-5.row-cols-xl-4 > .col {
  padding-right: 8px !important;
  padding-left: 8px !important;
}
</style>
