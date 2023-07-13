<script>
import Layout from "../../../layouts/main.vue";
import {Token} from "../../../helpers/user/user.js";
import http, {BASE_URL} from "../../../helpers/api/axiosHttp.js";
import Pagination from '../../../components/Pagination.vue'

export default {
  data() {
    return {
      baseURL: '',
      infoUser: {},
      userFacebook: '',
      userGitHub: '',
      userKCN: {},
      logData: {},
      option: {
        currPage: 1,
        total: 0,
        pageSize: 0,
      }
    };
  },
  components: {
    Layout,
    Pagination
  },
  created() {
    const vm = this;
    Token().getUser()
      .then(
        res => {
          vm.infoUser = res;
          vm.userKCN = res.industrial_area;
          if (vm.infoUser.social_network_link) {
            for (let i = 0; i < vm.infoUser.social_network_link.length; i++) {
              if (vm.infoUser.social_network_link[i].facebook) vm.userFacebook = vm.infoUser.social_network_link[i].facebook;
              if (vm.infoUser.social_network_link[i].github) vm.userGitHub = vm.infoUser.social_network_link[i].github;
            }
          }
        }
      )
  },
  mounted() {
    const vm = this;
    vm.baseURL = BASE_URL;
  },
  methods: {
    async handleGetLog() {
      let urlAPI = `/activity/?handler=${this.infoUser.id}`;
      const {data} = await http.get(urlAPI);
      this.logData = data.results;
      this.option.pageSize = data.page_size;
      this.option.total = data.total_object;
    },
    async pageChanged(page) {
      let urlAPI = `/activity/?page=${page}&handler=${this.infoUser.id}`;
      const {data} = await http.get(urlAPI);
      this.option.pageSize = page;
      this.logData = data.results;
    }
  }
};
</script>

<template>
  <Layout pageLayout="landing">
    <b-container class="mt-3">
      <div class="profile-foreground position-relative mx-n4 mt-n4">
        <div class="profile-wid-bg">
          <img v-if="infoUser.cover_img" :src="baseURL + infoUser.cover_img" alt=""
               class="profile-wid-img" style="opacity: .5;"/>
          <img v-else src="@/assets/images/nft/bg-home.jpg" alt=""
               class="profile-wid-img" style="opacity: .5;"/>

        </div>
      </div>
      <div class="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper">
        <b-row class="g-4">
          <b-col lg="auto">
            <div class="profile-user position-relative d-inline-block mx-auto mb-4">
              <img :src="infoUser.photo ? infoUser.photo : baseURL + `/media/photos/avatar-1.jpg`"
                   class="rounded-circle avatar-lg img-thumbnail user-profile-image" alt="user-profile-image">
            </div>
          </b-col>
          <b-col>
            <div class="p-2">
              <h5 class="text-white mb-1">{{ infoUser.first_name }} {{ infoUser.last_name }}</h5>
              <p class="text-white-75">{{ userKCN.name_display }}</p>
              <div class="hstack text-white-50 gap-1">
                <div class="me-2">
                  <i class="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle"></i>Vietnam
                </div>
                <div>
                  <i class="ri-building-line me-1 text-white-75 fs-16 align-middle"></i>Tỉnh Thái Nguyên
                </div>
              </div>
            </div>
          </b-col>
        </b-row>
      </div>
      <b-row>
        <b-col lg="12">
          <div>
            <div class="d-flex profile-wrapper">
              <ul class="nav nav-pills animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1" role="tablist">
                <li class="nav-item">
                  <b-link class="nav-link fs-14 active" data-bs-toggle="tab" href="#overview-tab" role="tab">
                    <i class="ri-airplay-fill d-inline-block d-md-none"></i>
                    <span class="d-none d-md-inline-block">Thông tin</span>
                  </b-link>
                </li>
                <li class="nav-item">
                  <b-link class="nav-link fs-14" data-bs-toggle="tab" href="#activities" role="tab"
                          @click="handleGetLog">
                    <i class="ri-list-unordered d-inline-block d-md-none"></i>
                    <span class="d-none d-md-inline-block">Hoạt động</span>
                  </b-link>
                </li>
              </ul>
              <div class="flex-shrink-0">
                <router-link :to="{name: 'ProfileUpdatePage'}" class="btn btn-success"><i
                  class="ri-edit-box-line align-bottom"></i> Cập nhật
                </router-link>
              </div>
            </div>
            <div class="tab-content pt-4 text-muted">
              <div class="tab-pane active" id="overview-tab" role="tabpanel">
                <b-row>
                  <b-col xxl="4">
                    <b-card no-body>
                      <b-card-body>
                        <h5 class="card-title mb-3">Thông tin cá nhân</h5>
                        <div class="table-responsive">
                          <table class="table table-borderless mb-0">
                            <tbody>
                            <tr>
                              <th class="ps-0" style="width: 40%" scope="row">Họ và tên:</th>
                              <td class="text-muted">{{ infoUser.first_name }} {{ infoUser.last_name }}</td>
                            </tr>
                            <tr>
                              <th class="ps-0" scope="row">Giới tính:</th>
                              <td class="text-muted">{{ infoUser.gender === 0 ? "Nam" : "Nữ" }}</td>
                            </tr>
                            <tr>
                              <th class="ps-0" scope="row">Ngày sinh:</th>
                              <td class="text-muted">
                                {{ infoUser.birth ? new Date(infoUser.birth).toLocaleDateString('en-GB') : `` }}
                              </td>
                            </tr>
                            <tr>
                              <th class="ps-0" scope="row">Điện thoại:</th>
                              <td class="text-muted">{{ infoUser.phone }}</td>
                            </tr>
                            <tr>
                              <th class="ps-0" scope="row">Email:</th>
                              <td class="text-muted">{{ infoUser.email }}</td>
                            </tr>
                            <tr>
                              <th class="ps-0" scope="row">Địa chỉ:</th>
                              <td class="text-muted">{{ infoUser.address }}
                              </td>
                            </tr>
                            <tr>
                              <th class="ps-0" scope="row">Ngày tham gia:</th>
                              <td class="text-muted">{{
                                  new Date(infoUser.date_joined).toLocaleDateString('en-GB')
                                }}
                              </td>
                            </tr>
                            </tbody>
                          </table>
                        </div>
                      </b-card-body>
                    </b-card>
                  </b-col>
                  <b-col xxl="8">
                    <b-card no-body class="h-50">
                      <b-card-body>
                        <h5 class="card-title mb-3">Giới thiệu</h5>
                        <p>{{ infoUser.introduce ? infoUser.introduce : 'Chưa có giới thiệu' }}</p>
                      </b-card-body>
                    </b-card>
                    <b-card no-body>
                      <b-card-body>
                        <h5 class="card-title">Liên kết</h5>
                        <b-row>
                          <b-col cols="6">
                            <div class="d-flex mt-2">
                              <div class="flex-shrink-0 avatar-xs align-self-center me-3">
                                <div class="avatar-title rounded bg-primary text-white">
                                  <i class="ri-facebook-fill fs-16"></i>
                                </div>
                              </div>
                              <div class="flex-grow-1 overflow-hidden">
                                <p class="mb-0 fs-13">Facebook :</p>
                                <a v-if="userFacebook !== ''" :href="userFacebook"
                                   class="text-info text-decoration-underline">{{ userFacebook }}</a>
                              </div>
                            </div>
                          </b-col>
                          <b-col cols="6">
                            <div class="d-flex mt-2">
                              <div class="flex-shrink-0 avatar-xs align-self-center me-3">
                                <div class="avatar-title rounded bg-dark text-light">
                                  <i class="ri-github-fill fs-16"></i>
                                </div>
                              </div>
                              <div class="flex-grow-1 overflow-hidden">
                                <p class="mb-0 fs-13">Github :</p>
                                <a v-if="userGitHub !== ''" :href="userGitHub"
                                   class="text-info text-decoration-underline">{{ userGitHub }}</a>
                              </div>
                            </div>
                          </b-col>
                        </b-row>
                      </b-card-body>
                    </b-card>
                  </b-col>
                </b-row>
              </div>
              <div class="tab-pane fade" id="activities" role="tabpanel">
                <b-card no-body style="min-height: 40vh">
                  <b-card-body>
                    <h5 class="card-title mb-3">Nhật ký hoạt động</h5>
                    <div class="table-responsive">
                      <table class="table align-middle table-striped table-bordered">
                        <thead class="table-light text-dark text-center text-uppercase">
                        <tr>
                          <th>Thời gian</th>
                          <th>Tên hoạt động</th>
                          <th width="10%">Chức năng</th>
                          <th>Đối tượng</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item, index) in logData" :key="index">
                          <td class="text-center">{{ new Date(item.action_time).toLocaleDateString('en-GB') }} -
                            {{ new Date(item.action_time).toLocaleTimeString('en-GB') }}
                          </td>
                          <td>{{ item.name_action }}</td>
                          <td class="text-center">
                            {{
                              item.action === `Create` ? `Tạo mới` : item.action === `Update` ? `Sửa` : item.action === `Delete` ? `Xóa` : item.action === `Create record` ? `Tạo bản ghi` : item.action === `Update record` ? `Sửa bản ghi` : `Khác`
                            }}
                          </td>
                          <td class="text-center">{{ item.target }}</td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </b-card-body>
                  <b-card-footer class="pt-0 border-0">
                    <div class="d-flex justify-content-end">
                      <div class="pagination-wrap hstack gap-2">
                        <Pagination :page-size="option.pageSize" :total="option.total"
                                    :callback="pageChanged"></Pagination>
                      </div>
                    </div>
                  </b-card-footer>
                </b-card>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </Layout>
</template>
