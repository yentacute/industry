<script setup>
import Swal from "sweetalert2";
import { onMounted, ref, defineProps, reactive } from "vue";
import API from "../../../helpers/api/useAxios";
import Layout from "../../../layouts/main.vue";
import { errorToast } from "../../../helpers/api/toastStyle";
import FolderHeaderBar from "../../../components/FolderHeaderBar.vue";
import PaginationUI from "../../../components/paging/PaginationUI.vue";

const dataMap = ref([]);
const feature = reactive({
  search: "",
  isLoading: true,
});
const PaginationData = reactive({
  pageSize: 1,
  currentPage: 1,
});

const getAPITableMap = () => {
  feature.isLoading = true;
  API()
    .get(
      `${props.slug}/style-geomap?page=${PaginationData.currentPage}&q=${feature.search}`
    )
    .then((res) => {
      dataMap.value = res.results;
      PaginationData.pageSize = res.total_pages;
      feature.isLoading = false;
    });
};
getAPITableMap();

const handleChangePagination = (page) => {
  PaginationData.currentPage = page;
  getAPITableMap();
};

const props = defineProps({
  slug: {
    type: String,
    default: "sipm-base",
  },
  nameKCN: {
    type: String,
    default: "KHU CÔNG NGHIỆP",
  },
});
const address = ref({
  title: props.nameKCN,
  details: [{ name: "Quản lý styles", to: "ManageMapStylesPage" }],
});
onMounted(() => {
  // document.querySelector(".page-content").style.height = "100vh";
  // document.querySelector(".page-content .container-fluid").style.height =
  //   "100%";
});

let timeout;
const handleKeySearch = function ($e) {
  feature.isLoading = true;
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    API()
      .get(`${props.slug}/style-geomap/?q=${$e.target.value}`)
      .then((res) => {
        PaginationData.pageSize = res.total_pages;
        PaginationData.currentPage = 1;
        dataMap.value = res.results ?? [];
        feature.isLoading = false;
      });
  }, 500);
};

const handleClickDeleteMap = (map) => {
  Swal.fire({
    title: "Bạn có muốn xoá không?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Đồng ý",
    cancelButtonText: "Không",
  }).then((result) => {
    if (!result.isConfirmed) {
      return;
    }

    API()
      .remove(`/${props.slug}/style-geomap/${map.id}/`)
      .then((res) => {
        if (res?.instance?.id) {
          dataMap.value = dataMap.value.filter((item) => map.id !== item.id);
          Swal.fire(
            "Deleted!",
            `Bạn đã xoá nhóm dữ liệu ${res.instance.name}`,
            "success"
          );
          return;
        }
        errorToast(
          "Hệ thống đang bảo trì! Thêm mới nhóm lớp dữ liệu không thành công. Vui lòng thử lại sau"
        );
      });
  });
};
</script>

<template>
  <Layout
    :address="address"
    :items="address.details"
    chooseMenu="ban-do"
    :slug="props.slug"
  >
    <div class="d-flex h-100 justify-content-between flex-column">
      <FolderHeaderBar style="margin-bottom: 12px">
        <template #add_button>
          <b-col xl="2">
            <router-link :to="{ name: `${props.slug}ManageAddStyle` }">
              <button class="btn btn-light btn-md" type="button">
                <i class="mdi mdi-plus"></i>
                <span class="mx-1">Thêm</span>
              </button>
            </router-link>
          </b-col>
        </template>
        <template #input_search>
          <b-col xl="3"></b-col>
          <b-col xl="2"></b-col>
          <b-col xl="2"></b-col>
          <b-col xl="3">
            <div class="search-box">
              <input
                type="text"
                class="form-control"
                @keyup="($e) => handleKeySearch($e)"
                placeholder="Tìm kiếm"
                v-model="feature.search"
              />
              <i class="ri-search-line search-icon"></i>
            </div>
          </b-col>
        </template>
      </FolderHeaderBar>

      <div class="card h-100 mb-0" style="overflow-y: auto; overflow-x: hidden">
        <div
          v-if="feature.isLoading"
          class="d-flex justify-content-center align-items-center w-100 mt-4"
        >
          <div style="width: 32px; height: 32px">
            <div class="spin-loading"></div>
          </div>
        </div>
        <div v-else class="card-body">
          <template v-if="dataMap.length">
            <table class="table align-middle table-striped table-bordered">
              <thead class="table-light text-dark text-center text-uppercase">
                <tr>
                  <th width="5%">#</th>
                  <th width="20%">Tên</th>
                  <th>workspace</th>
                  <th width="20%">Người khởi tạo</th>
                  <th width="10%"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in dataMap" :key="index">
                  <td class="text-center">
                    {{ index + PaginationData.currentPage * 10 - 9 }}
                  </td>
                  <td>{{ item.name }}</td>
                  <td>
                    {{ item.workspace }}
                  </td>
                  <td class="text-center">
                    {{ item?.created_by?.name ?? "admin" }}
                  </td>
                  <td>
                    <ul
                      class="list-inline hstack gap-2 mb-0 d-flex justify-content-center"
                    >
                      <li
                        class="list-inline-item"
                        data-bs-toggle="tooltip"
                        data-bs-trigger="hover"
                        data-bs-placement="top"
                        aria-label="Remove"
                      >
                        <router-link
                          :to="{
                            name: `${props.slug}ManageAddStyle`,
                          }"
                        >
                          <button class="btn btn-soft-danger btn-sm">
                            <i class="ri-external-link-fill"></i>
                          </button>
                        </router-link>
                      </li>
                      <li class="list-inline-item">
                        <div class="dropdown">
                          <button
                            class="btn btn-soft-secondary btn-sm dropdown"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i class="mdi mdi-dots-vertical"></i>
                          </button>
                          <ul class="dropdown-menu dropdown-menu-end">
                            <li>
                              <router-link
                                class="dropdown-item"
                                :to="{
                                  name: `${props.slug}ManageAddStyle`,
                                }"
                                ><i
                                  class="ri-eye-fill align-bottom me-2 text-muted"
                                ></i>
                                Xem chi tiết
                              </router-link>
                            </li>
                            <li>
                              <router-link
                                :to="{
                                  name: `${props.slug}MapUpdateStyle`,
                                  params: {
                                    idStyle: item.id,
                                  },
                                }"
                                class="dropdown-item"
                              >
                                <i
                                  class="ri-pencil-fill align-bottom me-2 text-muted"
                                ></i>
                                Cập nhật
                              </router-link>
                            </li>
                            <li @click="handleClickDeleteMap(item)">
                              <b-link class="dropdown-item text-danger">
                                <i
                                  class="ri-delete-bin-fill align-bottom me-2 text-muted"
                                ></i>
                                Xóa
                              </b-link>
                            </li>
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
          <template v-else>
            <p>Không có dữ liệu!</p>
          </template>
        </div>
      </div>
      <div class="d-flex justify-content-end p-3">
        <PaginationUI
          @change="handleChangePagination"
          :current-page="PaginationData.currentPage"
          :page-size="PaginationData.pageSize"
        ></PaginationUI>
      </div>
    </div>
    <!-- <b-modal
      v-model="showFormAddMap"
      hide-footer
      class="v-modal-custom"
      hide-header-close
      centered
    >
      <div class="modal-body text-center">
        <lottie
          colors="primary:#121331,secondary:#08a88a"
          trigger="loop"
          :options="defaultOptions"
          :height="180"
          :width="120"
        />
        <div class="mt-4">
          <h4 class="mb-3">Oops something went wrong!</h4>
          <p class="text-muted mb-4">
            The transfer was not successfully received by us. the email of the
            recipient wasn't correct.
          </p>
          <div class="hstack gap-2 justify-content-center">
            <b-button type="button" variant="light" @click="modalShow1 = false">
              Close</b-button
            >
            <b-link href="javascript:void(0);" class="btn btn-danger"
              >Try Again
            </b-link>
          </div>
        </div>
      </div>
    </b-modal> -->
  </Layout>
</template>
<style scoped></style>
