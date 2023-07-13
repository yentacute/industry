<script setup>
import { ref, reactive } from 'vue';
import Layout from '../../../layouts/main.vue';
import http from "../../../helpers/api/axiosHttp";
import Swal from "sweetalert2";
import FolderHeaderBar from '../../../components/FolderHeaderBar.vue'
import MenuBarContainSearch from '../../../components/manage-data/MenuBarContainSearch.vue';
import Pagination from '../../../components/Pagination.vue';

const objectData = ref([]);
const option = reactive({
  currPage: 1,
  total: 0,
  pageSize: 0,
  searchVal: '',
  totalPage: 0,
});

const currentUrl = ref()
const showMoreItems = reactive({});
const showModal = ref(true)

const toggleShowModal3D = (url) => {
  showModal.value = true
  currentUrl.value = url
  console.log(currentUrl.value)
}
const items = reactive([
  {
    name: "Quản lý đối tượng 3D",
    to: "#",
  },
]);

const getData = async () => {
  const { data } = await http.get(`/object3d/?page=${option.currPage}&q=${option.searchVal}&type=search`);
  objectData.value = data.results;
  option.pageSize = data.page_size;
  option.total = data.total_objects;
  option.totalPage = data.total_pages;
  option.currPage = data.current_page_number;
}
getData();

const pageChanged = async (page) => {
  const obj3d = await http.get(`/object3d/?page=${page}&q=${option.searchVal}&type=search`);
  objectData.value = obj3d.data.results;
}

function deleteData(id) {
  Swal.fire({
    title: 'Bạn có muốn xoá không?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Không',
    confirmButtonText: 'Đồng ý'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const response = await http.delete(`/object3d/${id}`);
      if (response.status === 200) {
        Swal.fire(
          {
            title: 'Đã xoá đối tượng!',
            icon: 'success'
          }
        );
        getData();
      } else {
        Swal.fire({
          title: 'Lỗi kiểm tra lại !',
          icon: 'error'
        }
        )
      }
    }
  })
}

const handleShowMoreCol = (index) => {
  if (showMoreItems.hasOwnProperty(index)) {
    showMoreItems[index] = !showMoreItems[index];
  } else {
    showMoreItems[index] = true;
  }
}

</script>
<template>
  <Layout :items="items" chooseMenu="doi-tuong-3d">
    <div class="manage-database">
      <FolderHeaderBar>
        <template #add_button>
          <b-col xl="2">
            <router-link type="button" class="btn btn-light" :to="{ name: 'AddObjectPage' }">
              <i class="mdi mdi-plus"></i><span class="mx-1">Thêm</span>
            </router-link>
          </b-col>
        </template>
        <template #input_search>
          <b-col xl="3"></b-col>
          <b-col xl="2"></b-col>
          <b-col xl="2"></b-col>
          <b-col xl="3">
            <div class="search-box">
              <input type="text" class="form-control search" v-model="option.searchVal" placeholder="Tìm kiếm"
                @keyup="getData()" />
              <i class="ri-search-line search-icon"></i>
            </div>
          </b-col>
        </template>
      </FolderHeaderBar>
      <!--      <MenuBarContainSearch>
                            <template #input_search>
                              <b-col sm></b-col>
                              &lt;!&ndash;          <b-col sm="2">
                                          <div class="form-icon">
                                            <select class="form-select form-control-icon" v-model="option.date" @change="getData()">
                                              <option value="none" selected>Mặc định</option>
                                              <option value="false">Tham gia gần nhất</option>
                                              <option value="true">Tham gia lâu nhất</option>
                                            </select>
                                            <i class="ri-history-line"></i>
                                          </div>
                                        </b-col>
                                        <b-col sm="2">
                                          <div class="form-icon">
                                            <select class="form-select form-control-icon" v-model="option.valueRole" @change="getData()">
                                              <option value="All" selected>Tất cả vai trò</option>
                                              <option v-for="item in roleData" :key="item.id" :value="item.name">{{ item.name }}</option>
                                              <option value="">Người dùng</option>
                                            </select>
                                            <i class="ri-shield-star-fill"></i>
                                          </div>
                                        </b-col>&ndash;&gt;
                              <b-col sm="3">
                                <div class="search-box">
                                  <input type="text" class="form-control search" v-model="option.searchVal" placeholder="Tìm kiếm"
                                         @keyup="getData()"/>
                                  <i class="ri-search-line search-icon"></i>
                                </div>
                              </b-col>
                            </template>
                          </MenuBarContainSearch>-->
    </div>
    <div class="page-main__content" ref="containerContent">
      <b-card no-body class="mb-2">
        <div data-simplebar class="card-body__custom--scroll">
          <b-card-body class="card-body__custom--height" v-if="objectData.length">
            <div class="table-responsive">
              <table style="width: 100%" aria-describedby="example_info" id="example"
                class="table align-middle table-striped table-bordered dt-responsive dataTable no-footer dtr-inline collapsed">
                <thead class="table-light text-dark text-center text-uppercase">
                  <tr>
                    <th class="text-center" width="3%">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="cardtableCheck">
                        <label class="form-check-label" for="cardtableCheck"></label>
                      </div>
                    </th>
                    <th>Tên</th>
                    <th>Phân loại</th>
                    <!-- <th>Trạng thái</th> -->
                    <th>3D</th>
                    <th>Người tạo</th>
                    <th width="3%"></th>
                  </tr>
                </thead>
                <tbody v-for="(item, index) in objectData" :key="index">
                  <tr class="odd dt-hasChild" :class="{ parent: showMoreItems[index] }">
                    <td class="text-center">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="cardtableCheck01">
                        <label class="form-check-label" for="cardtableCheck01"></label>
                      </div>
                    </td>
                    <td class="dtr-control sorting_1">
                      <i class="me-2 align-middle fs-16 cursor-pointer" @click="handleShowMoreCol(index)"
                        :class="!showMoreItems[index] ? `ri-add-circle-fill text-primary` : `ri-indeterminate-circle-fill text-danger`"></i>
                      {{ item.name }}
                    </td>
                    <td class="text-center">{{
                      item.type === 0 ? 'Chọn từ bản đồ' :
                      item.type === 1 ? 'Chọn từ thư viện' :
                        item.type === 2 ? 'Tải lên' : 'Vẽ'
                    }}
                    </td>
                    <td class="d-flex justify-content-center"><button type="button" class="btn btn-success btn-sm"
                        @click="toggleShowModal3D(item.iframe)">Xem</button></td>
                    <!-- <td class="text-center">{{ item.is_sync ? 'Đã đồng bộ' : 'Chưa đồng bộ' }}</td> -->
                    <td class="text-center">{{ item.created_by ? item.created_by.username : `` }}</td>
                    <td class="text-center">
                      <div class="dropdown">
                        <button class="btn btn-soft-secondary btn-sm dropdown" type="button" data-bs-toggle="dropdown"
                          aria-expanded="false">
                          <i class="mdi mdi-dots-vertical"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                          <li>
                            <router-link class="dropdown-item"
                              :to="{ name: 'UpdateObjectPage', params: { id: item.id } }">
                              <i class="ri-edit-2-line align-bottom me-2 text-muted"></i>
                              Cập nhật
                            </router-link>
                          </li>
                          <li>
                            <b-link class="dropdown-item" @click="deleteData(item.id)">
                              <i class="ri-delete-bin-line align-bottom me-2 text-muted"></i> Xóa
                            </b-link>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr class="child" v-show="showMoreItems[index]">
                    <td class="child" colspan="5">
                      <ul data-dtr-index="0" class="dtr-details">
                        <li data-dtr-index="5" data-dt-row="0" data-dt-column="5"><span class="dtr-title">Ngày khởi
                            tạo</span>
                          <span class="dtr-data">
                            {{ new Date(item.created_date).toLocaleDateString('en-GB') }}
                          </span>
                        </li>
                        <li data-dtr-index="6" data-dt-row="0" data-dt-column="6"><span class="dtr-title">Ngày chỉnh
                            sửa</span>
                          <span class="dtr-data">{{ new Date(item.updated_date).toLocaleDateString('en-GB') }}</span>
                        </li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </b-card-body>
          <b-card-body class="card-body__custom--height" v-else>
            <p>Không có dữ liệu!</p>
          </b-card-body>
        </div>
        <b-card-footer class="pt-0 border-0">
          <div class="d-flex justify-content-end">
            <Pagination :page-size="option.pageSize" :total="option.total" :callback="pageChanged"></Pagination>
          </div>
        </b-card-footer>
      </b-card>
    </div>
    <b-modal v-model="showModal" hide-footer class="v-modal-custom" hide-header-close centered size="lg">
      <div class="modal-body text-center p-0">
        <iframe :src="currentUrl" class="w-100" height="650" frameborder="0" allowfullscreen=""></iframe>
        <div class="hstack gap-2 justify-content-center">
          <b-button type="button" variant="light" @click="showModal = false">
            Đóng</b-button>
        </div>
      </div>
    </b-modal>
  </Layout>
</template>
<style scoped>
/*.form-icon i {
  left: 10px;
}

.form-icon .form-control-icon {
  padding-left: 2rem;
  padding-right: 2.4rem;
}*/
</style>