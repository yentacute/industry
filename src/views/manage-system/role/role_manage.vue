<script setup>
import {ref, reactive} from 'vue';
import Layout from '../../../layouts/main.vue';
import http from "../../../helpers/api/axiosHttp";
import {BASE_URL} from "../../../helpers/api/axiosHttp";
import Swal from "sweetalert2";
import FolderHeaderBar from '../../../components/FolderHeaderBar.vue'
import MenuBarContainSearch from '../../../components/manage-data/MenuBarContainSearch.vue';

const baseURL = ref(BASE_URL);
const roleData = ref([]);
const option = reactive({
  currPage: 1,
  total: 0,
  pageSize: 0,
  searchVal: '',
});

const address = ref({
  title: 'Người dùng',
  details: [],
});

const items = reactive([
  {
    name: "Người dùng",
    to: "#",
  },
  {
    name: "Quản lý phân quyền",
    to: "ManageRolePage",
  }
]);
const getData = async () => {
  const {data} = await http.get(`/role/?page=${option.currPage}&q=${option.searchVal}&type=search`);
  roleData.value = data;
  option.pageSize = data.page_size;
  option.total = data.total_object;
}
getData();

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
      const response = await http.delete(`/role/${id}/`);
      if (response.status === 204) {
        Swal.fire(
            {
              title: 'Đã xoá phân quyền!',
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


</script>
<template>
  <Layout :items="items" :address="address" chooseMenu="nguoi-dung" systemMenu>
    <div class="manage-database">
      <FolderHeaderBar>
        <template #add_button>
          <b-col xl="2">
            <router-link type="button" class="btn btn-light" :to="{name: 'AddRolePage'}">
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
                       @keyup="getData()"/>
              <i class="ri-search-line search-icon"></i>
            </div>
          </b-col>
        </template>
      </FolderHeaderBar>
<!--      <MenuBarContainSearch>

      </MenuBarContainSearch>-->
    </div>
    <div class="page-main__content" ref="containerContent">
      <b-card no-body class="mb-2">
        <div data-simplebar class="card-body__custom--scroll">
          <b-card-body class="card-body__custom--height" v-if="roleData.length">
            <div class="table-responsive">
              <table class="table align-middle table-striped table-bordered">
                <thead class="table-light text-dark text-center text-uppercase">
                <tr>
                  <th>#</th>
                  <th>Tên phân quyền</th>
                  <th>Mã phân quyền</th>
                  <th width="10%"></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in roleData" :key="index">
                  <td class="text-center">{{ index + 1 + (option.currPage - 1) * 10 }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.slug }}</td>
                  <td>
                    <ul class="list-inline hstack gap-3 mb-0 d-flex justify-content-center">
                      <li class="list-inline-item">
                        <div class="link-info fs-15" v-b-tooltip.hover title="Xem chi tiết">
                          <i class="ri-eye-line"></i>
                        </div>
                      </li>
                      <li class="list-inline-item">
                        <router-link :to="{name: 'UpdateRolePage', params: {id: item.id}}" class="link-success fs-15"
                                     v-b-tooltip.hover title="Cập nhật">
                          <i class="ri-edit-2-line"></i>
                        </router-link>
                      </li>

                      <li class="list-inline-item">
                        <div class="link-danger fs-15" @click="deleteData(item.id)" v-b-tooltip.hover title="Xóa">
                          <i class="ri-delete-bin-line"></i>
                        </div>
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
            <ul class="pagination pagination-sm pagination-separated">
              <li class="page-item disabled">
                <b-link href="#" class="page-link">Trước</b-link>
              </li>
              <li class="page-item active">
                <b-link href="#" class="page-link">1</b-link>
              </li>
              <li class="page-item">
                <b-link href="#" class="page-link">Sau</b-link>
              </li>
            </ul>
          </div>
        </b-card-footer>
      </b-card>
    </div>
  </Layout>
</template>