<script>
import {Token} from "../../../../helpers/user/user";
import {ref, reactive} from "vue";
import http from "../../../../helpers/api/axiosHttp";
import {BASE_URL} from "../../../../helpers/api/axiosHttp";
import {useFolderStore} from "../../../../state/folder";

export default {
  setup() {
    const listNotis = ref([]);
    const listFilter = ref([]);
    const notisUnRead = ref(0);
    const detailNotis = ref({});
    const modalDetailNotis = ref(false);
    const modalListNotis = ref(false);
    const optionType = ref(2);
    const baseURL = ref(BASE_URL);
    const option = reactive({
      currPage: 1,
      total: 0,
      pageSize: 0,
      searchVal: "",
    });
    const getList = async (type) => {
      notisUnRead.value = 0;
      let urlAPI = `/notification/current-user/?search=${option.searchVal}`;
      const notis = await http.get(urlAPI);
      listNotis.value = notis.data.results;
      listNotis.value.forEach((item) => {
        if (!item.is_read) notisUnRead.value++;
        1
      })
    };
    getList();

    const groupNotis = (item, index) => {
      if (!index) return item;
      else if (index === 0) {
        let lst = [];
        item.forEach(res => {
          if (res.notification_type === `0`) lst.push(res);
        })
        return lst;
      } else if (index === 1) {
        let ds = [];
        item.forEach(res => {
          if (res.notification_type === `1`) ds.push(res);
        })
        return ds;
      }
    }

    const getDetail = async (id) => {
      const notisD = await http.get(`/notification/${id}/`);
      detailNotis.value = notisD.data;
      modalDetailNotis.value = true;
      modalListNotis.value = false
    };
    return {
      listNotis,
      notisUnRead,
      getList,
      modalDetailNotis,
      modalListNotis,
      detailNotis,
      getDetail,
      option,
      optionType,
      baseURL,
      groupNotis
    }
  },
  data: function () {
    return {
      currUser: {
        id: '',
        username: '',
        photo: '',
      },
    };
  },
  components: {},
  created() {
    Token().getUser()
      .then(
        res => {
          if (res) {
            this.currUser.id = res.id;
            this.currUser.username = res.username;
            this.currUser.photo = res.photo;
            useFolderStore().currentUserRole = res.user_role.slug;
          }
        }
      )
  },
  mounted: function () {
  },
  methods: {
    handleRemoveUser() {
      Token().removeUser();
      this.currUser.id = '';
      this.currUser.username = '';
      this.currUser.photo = '';
    }
  },
};
</script>

<template>
  <div class="d-none d-sm-flex align-items-center h-100 position-relative">
    <div class="d-flex align-items-center gap-2 h-100" v-if="currUser.id !== ''">
      <div class="dropdown topbar-head-dropdown ms-1 header-item">
        <button type="button" class="btn btn-icon btn-topbar btn-ghost-info rounded-circle"
                id="page-header-notifications-dropdown" data-bs-toggle="dropdown" aria-haspopup="true"
                aria-expanded="false">
          <i class="bx bx-bell fs-22"></i>
          <span class="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger"
                v-if="notisUnRead > 0">{{ notisUnRead }}</span>
        </button>
        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
             aria-labelledby="page-header-notifications-dropdown">
          <div class="dropdown-head bg-primary bg-pattern rounded-top">
            <div class="p-3">
              <b-row class="align-items-center">
                <b-col>
                  <h6 class="m-0 fs-16 fw-semibold text-white">
                    Thông báo
                  </h6>
                </b-col>
              </b-row>
            </div>

            <div class="px-2 pt-2">
              <ul class="nav nav-tabs dropdown-tabs nav-tabs-custom fs-12" data-dropdown-tabs="true"
                  id="notificationItemsTab" role="tablist">
                <li class="nav-item">
                  <b-link class="nav-link active" data-bs-toggle="tab" href="#noti-tab" role="tab"
                          aria-selected="false" @click.capture.stop="groupNotis(listNotis)">
                    Tất cả
                  </b-link>
                </li>
                <li class="nav-item">
                  <b-link class="nav-link" data-bs-toggle="tab" href="#noti-tab" role="tab" aria-selected="true"
                          @click.capture.stop="groupNotis(listNotis, 0)">
                    Hệ thống
                  </b-link>
                </li>
                <li class="nav-item">
                  <b-link class="nav-link" data-bs-toggle="tab" href="#noti-tab" role="tab" aria-selected="false"
                          @click.capture.stop="groupNotis(listNotis,1)">
                    Người dùng
                  </b-link>
                </li>
              </ul>
            </div>
          </div>

          <div class="tab-content" id="notificationItemsTabContent">
            <div class="tab-pane fade py-2 ps-2 show active" id="noti-tab" role="tabpanel">
              <div v-if="listNotis.length">
                <div data-simplebar style="max-height: 300px" class="pe-2">
                  <div class="list-group list-group-flush">
                    <div class="list-group-item list-group-item-action cursor-pointer" v-for="item in listNotis"
                         :key="item.id" @click="getDetail(item.notification_id)">
                      <div class="d-flex mb-2 justify-content-between">
                        <div class="d-flex">
                          <div class="avatar-xs me-3" v-if="item.notification_type === `1`">
                          <span class="avatar-title bg-soft-info text-info rounded-circle fs-16">
                            <i class="ri-user-line"></i></span>
                          </div>
                          <div class="avatar-xs me-3" v-else>
                          <span class="avatar-title bg-soft-danger text-danger rounded-circle fs-16">
                            <i class="bx bx-badge-check"></i></span>
                          </div>
                          <div>
                            <h6 class="list-title mb-1" :class="{'fw-semibold': !item.is_read}">
                              {{ item.notification_title }}</h6>
                            <small class="list-text text-muted mb-0" :class="{'fw-semibold text-dark': !item.is_read}">
                              {{ item.notification_content.slice(0, 85) }}
                              {{ item.notification_content.length > 85 ? '...' : '' }}</small>
                          </div>
                        </div>
                        <i v-if="!item.is_read" class="mdi mdi-checkbox-blank-circle fs-10 text-danger"></i>
                      </div>
                    </div>
                  </div>
                  <div class="my-3 w-100 text-center">
                    <b-link class="link-success text-decoration-underline" @click="modalListNotis = true">
                      Xem tất cả thông báo <i class="ri-arrow-right-line align-middle"></i>
                    </b-link>
                  </div>
                </div>
              </div>
              <div v-else>
                <div class="w-25 w-sm-50 pt-3 mx-auto">
                  <img src="@/assets/images/svg/bell.svg" class="img-fluid" alt="user-pic"/>
                </div>
                <div class="text-center pb-5 mt-2">
                  <h6 class="fs-18 fw-semibold lh-base">
                    Chưa có thông báo
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <b-modal v-model="modalDetailNotis" hide-footer body-class="p-0" header-class="p-3" modal-class="zoomIn"
               class="v-modal-custom" content-class="overflow-hidden" centered title="Thông tin thông báo">
        <div class="modal-body">
          <div class="mb-3">
            <label for="basiInput" class="form-label">Tiêu đề</label>
            <input type="text" class="form-control bg-light" id="basiInput" name="title" readonly
                   v-model="detailNotis.title">
          </div>
          <div class="mb-3">
            <label for="exampleFormControlTextarea5" class="form-label">Nội dung</label>
            <textarea class="form-control bg-light" name="content" id="exampleFormControlTextarea5" rows="7" readonly
                      v-model="detailNotis.content"></textarea>
          </div>
        </div>
      </b-modal>
      <b-modal v-model="modalListNotis" hide-footer body-class="p-0" header-class="p-3" modal-class="zoomIn" size="lg"
               class="v-modal-custom" content-class="overflow-hidden" centered title="Dánh sách thông báo">
        <div class="modal-body">
          <div class="row g-4">
            <div class="col-sm-auto">
            </div>
            <div class="col-sm-4"></div>
            <div class="col-sm">
              <div class="d-flex justify-content-end">
                <div class="search-box">
                  <input type="text" class="form-control" placeholder="Tìm kiếm..." v-model="option.searchVal"
                         @keyup="getList()">
                  <i class="ri-search-line search-icon"></i></div>
              </div>
            </div>
          </div>
          <div data-simplebar style="height: 375px" class="mt-3">
            <div class="table-responsive h-100">
              <table class="table align-middle table-striped table-bordered table-hover">
                <thead class="table-light text-dark text-center text-uppercase">
                <tr>
                  <th width="35%">Tiêu đề</th>
                  <th>Nội dung</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in listNotis" :key="index"
                    @click="getDetail(item.notification_id)" class="cursor-pointer">
                  <td>{{ item.notification_title }}</td>
                  <td>{{ item.notification_content }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </b-modal>
      <router-link :to="{name: 'AppsPage'}" type="button" class="btn btn-icon btn-topbar btn-ghost-info rounded-circle">
        <i class="bx bx-category-alt fs-22"></i>
      </router-link>
      <div class="d-flex align-items-center justify-content-center cursor-pointer dropdown"
           style="
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #7b1fa2;
        ">
        <b-link data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <img :src="currUser.photo ? currUser.photo : baseURL + `/media/photos/avatar-1.jpg`" alt=""
               class="avatar-xs rounded-circle">
        </b-link>
        <div class="dropdown-menu dropdown-menu-end mt-2">
          <h6 class="dropdown-header">Chào mừng {{ currUser.username }}</h6>
          <router-link class="dropdown-item" :to="{name:'ProfilePage'}"><i
            class="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
            <span class="align-middle">Thông tin</span>
          </router-link>
          <router-link class="dropdown-item" :to="{name:'ChangePasswordPage'}">
            <i class="ri-rotate-lock-fill text-muted fs-16 align-middle me-1"></i>
            <span class="align-middle">Đổi mật khẩu</span>
          </router-link>
          <router-link class="dropdown-item" :to="{name:'HomePage'}"><i
            class="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
            <span class="align-middle" data-key="t-logout" @click="handleRemoveUser">Đăng xuất</span>
          </router-link>
        </div>
      </div>
    </div>
    <router-link v-else :to="{name:'LoginPage'}" type="button"
                 class="btn btn-sm rounded-pill btn-soft-info border-info fw-semibold d-flex align-items-center">
      <i class="ri-login-box-line me-1"></i> Đăng nhập
    </router-link>
  </div>
</template>
<style scoped>
#notificationItemsTab > .nav-item > .nav-link {
  color: white;
}

#notificationItemsTab > .nav-item > .nav-link.active {
  color: #405189;
}

.avatar-xs > .avatar-title {
  width: 2rem;
  height: 2rem;
}
</style>
