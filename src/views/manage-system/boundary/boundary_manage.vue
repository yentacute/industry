<script>
import {ref, reactive, watch, provide} from 'vue';
import Layout from '../../../layouts/main.vue';
import http from "../../../helpers/api/axiosHttp";
import {BASE_URL} from "../../../helpers/api/axiosHttp";
import FolderHeaderBar from '../../../components/FolderHeaderBar.vue'
import {useRoute} from "vue-router";
import MapIotLink from "../../../components/map/MapIotLink.vue";
import {methods_map, data as data_map} from "../../../state/map_control/data_map";
import {errorToast, successToast} from "../../../helpers/api/toastStyle";
import Swal from "sweetalert2";
import {debounce} from 'lodash';
import Pagination from '../../../components/Pagination.vue';
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default {
  setup() {
    provide("map", data_map);
    provide("draw-map", methods_map);
    const baseURL = ref(BASE_URL);
    const communeData = ref([]);
    const districtData = ref([]);
    const provinceData = ref([]);
    const communeDetail = ref({});
    const districtDetail = ref({});
    const provinceDetail = ref({});
    const route = useRoute();
    const modalAddEdit = ref(false);
    const itemBoundary = ref(route.params.item);
    const isUpdate = ref(false);
    const isDetail = ref(false);
    const option = reactive({
      commune: {
        currPage: 1,
        total: 0,
        totalPage: 0,
        pageSize: 0,
        searchVal: '',
      },
      district: {
        currPage: 1,
        total: 0,
        pageSize: 0,
        searchVal: '',
      },
      province: {
        currPage: 1,
        total: 0,
        pageSize: 0,
        searchVal: '',
      },
    });
    watch(() => route.params.item, (newId, oldId) => {
      itemBoundary.value = newId;
    });
    const address = ref({
      title: 'Đơn vị hành chính',
      details: [],
    });
    const setTitle = () => {
      let title = '';
      if (itemBoundary.value === "commune") title = 'Quản lý hành chính cấp xã';
      if (itemBoundary.value === "district") title = 'Quản lý hành chính cấp huyện';
      if (itemBoundary.value === "province") title = 'Quản lý hành chính cấp tỉnh';
      return title;
    }
    document.title = setTitle();

    const items = reactive([
      {
        name: "Đơn vị hành chính",
        to: "#",
      },
      {
        name: itemBoundary.value === "province" ? 'Hành chính cấp tỉnh' :
          (itemBoundary.value === 'district' ? 'Hành chính cấp huyện' : 'Hành chính cấp xã'),
        to: "#",
      },
    ]);
    const getCommune = async (m_huyen) => {
      let apiURL = `/Commune/?page=${option.commune.currPage}&matinh=19&q=${option.commune.searchVal}`;
      if (m_huyen) apiURL += `&mahuyen=${m_huyen}`;
      const boundCommune = await http.get(apiURL);
      communeData.value = boundCommune.data.results;
      option.commune.total = boundCommune.data.total_objects;
      option.commune.totalPage = boundCommune.data.total_pages;
      option.commune.pageSize = boundCommune.data.page_size;
      option.commune.currPage = boundCommune.data.current_page_number;
    }
    const getDistrict = async () => {
      let apiURL = `/District/?page=${option.district.currPage}&q=${option.district.searchVal}&matinh=19`;
      const boundDistrict = await http.get(apiURL);
      districtData.value = boundDistrict.data.results;
      option.district.total = boundDistrict.data.total_objects;
    }

    const getProvince = async () => {
      const boundProvince = await http.get(`/Province/?q=thai nguyen`);
      provinceData.value = boundProvince.data.results;
      option.province.total = boundProvince.data.total_objects;
    }

    const getData = async () => {
      if (itemBoundary.value === "commune") {
        getCommune();
      }
      if (itemBoundary.value === "district" || itemBoundary.value === "commune") {
        getDistrict();
      }
      getProvince();
    }
    getData();

    const titleModal = () => {
      if (isUpdate.value) {
        if (itemBoundary.value === `province`) return `Sửa thông tin tỉnh`;
        if (itemBoundary.value === `district`) return `Sửa thông tin huyện`;
        if (itemBoundary.value === `commune`) return `Sửa thông tin xã`;
      } else {
        if (itemBoundary.value === `province`) return `Thêm mới tỉnh`;
        if (itemBoundary.value === `district`) return `Thêm mới huyện`;
        if (itemBoundary.value === `commune`) return `Thêm mới xã`;
      }
    }

    const getBound = async (res, item) => {
      item.id = res.id;
      item.name = res.name;
    }

    const getCommunebyID = async (id) => {
      const item = await http.get(`/Commune/${id}/`);
      communeDetail.value.id = item.data.id;
      communeDetail.value.name = item.data.name;
      communeDetail.value.name_end = item.data.name_end;
      communeDetail.value.geom = item.data.geom;
      communeDetail.value.id_parent = item.data.id_parent;
      communeDetail.value.description = item.data.description;
      getDistrictbyID(communeDetail.value.id_parent);
    }

    const getDistrictbyID = async (id) => {
      const item = await http.get(`/District/${id}/`);
      districtDetail.value.id = item.data.id;
      districtDetail.value.name = item.data.name;
      districtDetail.value.name_en = item.data.name_en;
      districtDetail.value.geom = item.data.geom;
      districtDetail.value.id_parent = item.data.id_parent;
      districtDetail.value.description = item.data.description;
      getProvincebyID(districtDetail.value.id_parent);
    }

    const getProvincebyID = async (id) => {
      const item = await http.get(`/Province/${id}/`);
      provinceDetail.value.id = item.data.id;
      provinceDetail.value.name = item.data.name;
      provinceDetail.value.name_en = item.data.name_en;
      provinceDetail.value.geom = item.data.geom;
      provinceDetail.value.description = item.data.description;
    }
    const handleShowModal = (id) => {
      provinceDetail.value = {};
      districtDetail.value = {};
      communeDetail.value = {};
      modalAddEdit.value = true;
      if (id !== '') {
        isUpdate.value = true;
        if (itemBoundary.value === `province`) {
          getProvincebyID(id);
        }
        if (itemBoundary.value === `district`) {
          getDistrictbyID(id);
        }
        if (itemBoundary.value === `commune`) {
          getCommunebyID(id);
        }
      } else isUpdate.value = false;
    }

    const handleSubmit = async () => {
      let item = new FormData(document.getElementById('form_boundary'));
      if (itemBoundary.value === `province`) {
        item.append('description', provinceDetail.value.description);
        const eleProvince = document.getElementById("formFileProvine");
        if (eleProvince.files.length > 0)
          item.append("geom", eleProvince.files[0]);
        item.append('id_parent', 84);
        if (isUpdate.value) {
          const response = await http.put(`/Province/${provinceDetail.value.id}/`, item);
          if (response.status === 200) {
            successToast("Đã cập nhật thành công!")
          } else {
            errorToast("Cập nhật thất bại!")
          }
        } else {
          const response = await http.post(`/Province/`, item);
          if (response.status === 201) {
            successToast("Đã thêm mới thành công!");
          } else {
            errorToast("Thêm mới thất bại!")
          }
        }
        option.province.searchVal = '';
        getProvince();
        // provinceDetail.value = {};
        modalAddEdit.value = false;
        isUpdate.value = false;
      } else if (itemBoundary.value === `district`) {
        item.append('description', districtDetail.value.description);
        const eleDistrict = document.getElementById("formFileDistrict");
        if (eleDistrict.files.length > 0)
          item.append("geom", eleDistrict.files[0]);
        item.append('id_parent', provinceDetail.value.id);
        if (isUpdate.value) {
          const response = await http.put(`/District/${districtDetail.value.id}/`, item);
          if (response.status === 200) {
            successToast("Đã cập nhật thành công!")
          } else {
            errorToast("Cập nhật thất bại!")
          }
        } else {
          const response = await http.post(`/District/`, item);
          if (response.status === 201) {
            successToast("Đã thêm mới thành công!");
          } else {
            errorToast("Thêm mới thất bại!")
          }
        }
        option.district.searchVal = '';
        getDistrict();
        // provinceDetail.value = {};
        // districtDetail.value = {};
        modalAddEdit.value = false;
        isUpdate.value = false;
      } else if (itemBoundary.value === `commune`) {
        item.append('description', communeDetail.value.description);
        item.append('id_parent', districtDetail.value.id);
        const eleCommune = document.getElementById("formFileCommune");
        if (eleCommune.files.length > 0)
          item.append("geom", eleCommune.files[0]);
        if (isUpdate.value) {
          const response = await http.put(`/Commune/${communeDetail.value.id}/`, item);
          if (response.status === 200) {
            successToast("Đã cập nhật thành công!")
          } else {
            errorToast("Cập nhật thất bại!")
          }
        } else {
          const response = await http.post(`/Commune/`, item);
          if (response.status === 201) {
            successToast("Đã thêm mới thành công!");
          } else {
            errorToast("Thêm mới thất bại!")
          }
        }
        option.commune.searchVal = '';
        getCommune();
        // provinceDetail.value = {};
        // districtDetail.value = {};
        // communeDetail.value = {};
        modalAddEdit.value = false;
        isUpdate.value = false;
      }
    }


    const handleDelete = async (id) => {
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
          let response = {};
          if (itemBoundary.value === `commune`)
            response = await http.delete(`/Commune/${id}`);
          if (itemBoundary.value === `district`)
            response = await http.delete(`/District/${id}`);
          if (itemBoundary.value === `province`)
            response = await http.delete(`/Province/${id}`);

          if (response.status === 204) {
            Swal.fire(
              {
                title: 'Đã xoá thành công!',
                icon: 'success'
              }
            );
            option.commune.searchVal = ``;
            option.district.searchVal = ``;
            option.province.searchVal = ``;
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
    const handleClickFilter = (itList, itDetail, type) => {
      getBound(itList, itDetail);
      if (type === 'di')
        getCommune(itDetail.id);
      if (type === 'pr') {
        if (itemBoundary.value === 'commune')
          getCommune('');
        else
          getDistrict(itDetail.id)
      }
    }

    const handleGetPolygon = async (bound, id) => {
      data_map.map.data.clear();
      bound = bound[0].toUpperCase() + bound.slice(1)
      const item = await http.get(`${bound}/${id}/`);
      const geometryVal = JSON.stringify(item.data.geom);
      let geoJsonStr = `{
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": ${geometryVal}
      }
    ]
  }`;
      let features = methods_map.creatGeoJson(geoJsonStr, true, item.data.geom.type);
    }

    const handleShowDetail = (id) => {
      isDetail.value = true;
      if (itemBoundary.value === `province`)
        getProvincebyID(id);
      else if (itemBoundary.value === `district`)
        getDistrictbyID(id);
      else if (itemBoundary.value === `commune`)
        getCommunebyID(id);
    }

    const handleSearch = debounce(() => {
      if (itemBoundary.value === `province`)
        getProvince();
      else if (itemBoundary.value === `district`)
        getDistrict();
      else if (itemBoundary.value === `commune`)
        getCommune();
    }, 1000);
    watch(() => {
      if (itemBoundary.value === `province`)
        return option.province.searchVal;
      else if (itemBoundary.value === `district`)
        return option.district.searchVal;
      else if (itemBoundary.value === `commune`)
        return option.commune.searchVal;
    }, handleSearch)

    const pageChanged = async (page) => {
      if (itemBoundary.value === `commune`) {
        let apiURL = `/Commune/?page=${page}&matinh=19&q=${option.commune.searchVal}`;
        if (districtDetail.value.id !==undefined) apiURL += `&mahuyen=${districtDetail.value.id}`
        const boundCommune = await http.get(apiURL);
        communeData.value = boundCommune.data.results;
      }
      if (itemBoundary.value === `district`) {
        let apiURL = `/District/?page=${page}&q=${option.district.searchVal}&matinh=19`;
        const boundDistrict = await http.get(apiURL);
        option.district.pageSize = page;
        districtData.value = boundDistrict.data.results;
      }
    }


    return {
      baseURL,
      communeData,
      districtData,
      provinceData,
      communeDetail,
      districtDetail,
      provinceDetail,
      route,
      modalAddEdit,
      itemBoundary,
      isUpdate,
      isDetail,
      option,
      address,
      setTitle,
      items,
      getCommune,
      getDistrict,
      getProvince,
      getData,
      titleModal,
      getBound,
      getCommunebyID,
      getDistrictbyID,
      getProvincebyID,
      handleShowModal,
      handleSubmit,
      handleDelete,
      handleClickFilter,
      handleSearch,
      handleGetPolygon,
      handleShowDetail,
      pageChanged
    };
  },
  components: {
    Layout,
    FolderHeaderBar,
    MapIotLink,
    Pagination,
    ckeditor: CKEditor.component
  },
  data() {
    return {
      editor: ClassicEditor,
    };
  },
}
</script>
<template>
  <Layout :items="items" :address="address" chooseMenu="don-vi-hanh-chinh" systemMenu>
    <div class="manage-database">
      <FolderHeaderBar>
        <template #add_button>
          <b-col xl="2">
            <router-link type="button" class="btn btn-light" to="#" @click="handleShowModal('')">
              <i class="mdi mdi-plus"></i><span class="mx-1">Thêm</span>
            </router-link>
          </b-col>
        </template>
        <template #input_search>
          <b-col xl="3"></b-col>
          <b-col xl="2" v-if="itemBoundary !== `commune`"></b-col>
          <b-col xl="2" v-if="itemBoundary === `district` || itemBoundary === `commune`">
            <div data-input-flag data-option-flag-name>
              <input type="text" class="form-control rounded-end flag-input cursor-pointer" readonly
                     v-model="provinceDetail.name" placeholder="Chọn Tỉnh/Thành phố"
                     data-bs-toggle="dropdown" aria-expanded="false"/>
              <div class="dropdown-menu w-100">
                <div class="p-2 px-3 pt-1 searchlist-input">
                  <input type="text" class="form-control form-control border" v-model="option.province.searchVal"
                         placeholder="Tìm kiếm..." @input="handleSearch()"/>
                </div>
                <ul class="list-unstyled dropdown-menu-list mb-0">
                  <li class="dropdown-item d-flex align-items-center" v-for="prov in provinceData"
                      @click="handleClickFilter(prov,provinceDetail,'pr')">
                    <div class="me-1">{{ prov.name }}</div>
                  </li>
                </ul>
              </div>
            </div>
          </b-col>
          <b-col xl="2" v-if="itemBoundary === `commune`">
            <div data-input-flag data-option-flag-name>
              <input type="text" class="form-control rounded-end flag-input cursor-pointer" readonly
                     v-model="districtDetail.name" placeholder="Chọn Quận/Huyện"
                     @click="getDistrict()"
                     data-bs-toggle="dropdown" aria-expanded="false"/>
              <div class="dropdown-menu w-100">
                <div class="p-2 px-3 pt-1 searchlist-input">
                  <input type="text" class="form-control form-control border" v-model="option.district.searchVal"
                         placeholder="Tìm kiếm..." @input="handleSearch()"/>
                </div>
                <ul class="list-unstyled dropdown-menu-list mb-0">
                  <li class="dropdown-item d-flex align-items-center" v-for="dtrc in districtData"
                      @click="handleClickFilter(dtrc,districtDetail,'di')">
                    <div class="me-1">{{ dtrc.name }}</div>
                  </li>
                </ul>
              </div>
            </div>
          </b-col>

          <b-col xl="2" v-if="itemBoundary === `province`"></b-col>
          <b-col xl="3">
            <div class="search-box">
              <input type="text" v-if="itemBoundary === `province`" class="form-control search" @input="handleSearch()"
                     v-model="option.province.searchVal" placeholder="Tìm kiếm"/>
              <input type="text" v-if="itemBoundary === `district`" class="form-control search"
                     v-model="option.district.searchVal" placeholder="Tìm kiếm"
                     @input="handleSearch()"/>
              <input type="text" v-if="itemBoundary === `commune`" class="form-control search"
                     v-model="option.commune.searchVal" placeholder="Tìm kiếm"
                     @input="handleSearch()"/>
              <i class="ri-search-line search-icon"></i>
            </div>
          </b-col>
        </template>
      </FolderHeaderBar>
    </div>
    <!--      <MenuBarContainSearch>
            <template #input_search>
              <b-col sm></b-col>

              <b-col sm="2">
                <div class="d-flex justify-content-end">
                  <div class="search-box w-100">

                    <i class="ri-search-line search-icon"></i>
                  </div>
                </div>
              </b-col>
            </template>
          </MenuBarContainSearch>-->
    <div class="page-main__content" ref="containerContent">
      <b-row class="g-2">
        <b-col md="4">
          <b-card class="mb-2" no-body>
            <b-card-header class="border-bottom-dash pb-0">
              <h6 class="card-title text-muted flex-grow-1">Danh sách
                {{ itemBoundary === `province` ? `tỉnh` : itemBoundary === `district` ? `huyện` : `xã` }}</h6>
            </b-card-header>
            <div data-simplebar style="max-height: calc(100vh - 315px)">
              <b-card-body class="p-2" style="height: calc(100vh - 285px)" v-if="provinceData.length">
                <div class="table-responsive h-100">
                  <table class="table align-middle table-striped table-hover table-bordered">
                    <thead class="table-light text-dark text-center text-uppercase">
                    <tr>
                      <th>Mã</th>
                      <th>Tên</th>
                      <th width="10%"></th>
                    </tr>
                    </thead>
                    <tbody v-if="itemBoundary === `province`">
                    <tr class="cursor-pointer" v-for="(item,index) in provinceData" :key="index">
                      <td class="text-center" @click="handleGetPolygon(itemBoundary, item.id)">{{ item.id }}</td>
                      <td @click="handleGetPolygon(itemBoundary, item.id)">{{ item.name }}</td>
                      <td>
                        <div class="dropdown">
                          <button class="btn btn-soft-secondary btn-sm dropdown" type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false">
                            <i class="mdi mdi-dots-vertical"></i>
                          </button>
                          <ul class="dropdown-menu dropdown-menu-end">
                            <li>
                              <b-link class="dropdown-item" @click="handleShowDetail(item.id)">
                                <i class="ri-eye-line align-bottom me-2 text-muted"></i>
                                Chi tiết
                              </b-link>
                            </li>
                            <li>
                              <b-link class="dropdown-item" @click="handleShowModal(item.id)">
                                <i class="ri-edit-2-line align-bottom me-2 text-muted"></i>
                                Sửa
                              </b-link>
                            </li>
                            <li>
                              <b-link class="dropdown-item" @click="handleDelete(item.id)">
                                <i class="ri-delete-bin-line align-bottom me-2 text-muted"></i> Xóa
                              </b-link>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                    </tbody>
                    <tbody v-if="itemBoundary === `district`">
                    <tr class="cursor-pointer" v-for="(item,index) in districtData" :key="index">
                      <td class="text-center" @click="handleGetPolygon(itemBoundary, item.id)">{{ item.id }}</td>
                      <td @click="handleGetPolygon(itemBoundary, item.id)">{{ item.name }}</td>
                      <td>
                        <div class="dropdown">
                          <button class="btn btn-soft-secondary btn-sm dropdown" type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false">
                            <i class="mdi mdi-dots-vertical"></i>
                          </button>
                          <ul class="dropdown-menu dropdown-menu-end">
                            <li>
                              <b-link class="dropdown-item" @click="handleShowDetail(item.id)">
                                <i class="ri-eye-line align-bottom me-2 text-muted"></i>
                                Chi tiết
                              </b-link>
                            </li>
                            <li>
                              <b-link class="dropdown-item" @click="handleShowModal(item.id)">
                                <i class="ri-edit-2-line align-bottom me-2 text-muted"></i>
                                Sửa
                              </b-link>
                            </li>
                            <li>
                              <b-link class="dropdown-item" @click="handleDelete(item.id)">
                                <i class="ri-delete-bin-line align-bottom me-2 text-muted"></i> Xóa
                              </b-link>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                    </tbody>
                    <tbody v-if="itemBoundary === `commune`">
                    <tr class="cursor-pointer" v-for="(item,index) in communeData" :key="index">
                      <td class="text-center" @click="handleGetPolygon(itemBoundary, item.id)">{{ item.id }}</td>
                      <td @click="handleGetPolygon(itemBoundary, item.id)">{{ item.name }}</td>
                      <td>
                        <div class="dropdown">
                          <button class="btn btn-soft-secondary btn-sm dropdown" type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false">
                            <i class="mdi mdi-dots-vertical"></i>
                          </button>
                          <ul class="dropdown-menu dropdown-menu-end">
                            <li>
                              <b-link class="dropdown-item" @click="handleShowDetail(item.id)">
                                <i class="ri-eye-line align-bottom me-2 text-muted"></i>
                                Chi tiết
                              </b-link>
                            </li>
                            <li>
                              <b-link class="dropdown-item" @click="handleShowModal(item.id)">
                                <i class="ri-edit-2-line align-bottom me-2 text-muted"></i>
                                Sửa
                              </b-link>
                            </li>
                            <li>
                              <b-link class="dropdown-item" @click="handleDelete(item.id)">
                                <i class="ri-delete-bin-line align-bottom me-2 text-muted"></i> Xóa
                              </b-link>
                            </li>
                          </ul>
                        </div>
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
              <div class="d-flex align-self-center">
                <p class="flex-grow-1 mb-0 text-muted mt-3 d-flex align-items-center">
                  Tổng: {{
                    itemBoundary === `province` ? `${option.province.total} tỉnh` :
                      itemBoundary === `district` ? `${option.district.total} huyện` : `${option.commune.total} xã`
                  }}
                </p>
                <div class="d-flex justify-content-end">
                  <div class="pagination-wrap hstack gap-2">
                    <Pagination v-if="itemBoundary === `commune`" :page-size="option.commune.pageSize"
                                :total="option.commune.total" :callback="pageChanged"></Pagination>
                    <ul v-else class="pagination pagination-separated mt-3">
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
                </div>
              </div>
            </b-card-footer>
          </b-card>
        </b-col>
        <b-col md="8">
          <b-card no-body class="mb-2">
            <b-card-header class="border-bottom-dash pb-0">
              <h6 class="card-title text-muted flex-grow-1">Bản đồ</h6>
            </b-card-header>
            <b-card-body class="card-body__custom--scroll p-2">
              <MapIotLink></MapIotLink>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
      <b-modal v-model="modalAddEdit" hide-footer body-class="p-0" header-class="p-3" size="xl"
               class="v-modal-custom" :title="titleModal()" content-class="border-0 overflow-hidden" centered>
        <div class="modal-body">
          <form id="form_boundary">
            <div v-if="itemBoundary === `province`">
              <b-row>
                <b-col md="5">
                  <div class="mb-3">
                    <label for="idProvineInput" class="form-label">Mã tỉnh <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="idProvineInput" v-model="provinceDetail.id" name="id"
                           placeholder="Nhập mã tỉnh. VD:199">
                  </div>
                  <div class="mb-3">
                    <label for="fullNameProvine" class="form-label">Tên tỉnh <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="fullNameProvine" v-model="provinceDetail.name"
                           name="name"
                           placeholder="Nhập tên">
                  </div>
                  <div class="mb-3">
                    <label for="fullNameEnProvine" class="form-label">Tên quốc tế</label>
                    <input type="text" class="form-control" id="fullNameEnProvine" v-model="provinceDetail.name_en"
                           name="name_en" placeholder="Nhập tên">
                  </div>
                  <div class="mb-3">
                    <label for="formFileProvine" class="form-label">Dữ liệu (geojson,shp....) <span
                      class="text-danger">*</span></label>
                    <input class="form-control" type="file" id="formFileProvine">
                  </div>
                </b-col>
                <b-col md="7">
                  <div class="mb-3">
                    <label class="form-label">Thông tin</label>
                    <div class="ckeditor-classic">
                      <ckeditor v-model="provinceDetail.description" :editor="editor"></ckeditor>
                    </div>
                  </div>
                </b-col>
              </b-row>
            </div>
            <div v-if="itemBoundary === `district`">
              <b-row>
                <b-col md="5">
                  <div class="mb-3">
                    <label class="form-label">Tỉnh/Thành phố <span class="text-danger">*</span></label>
                    <div data-input-flag data-option-flag-name>
                      <input type="text" class="form-control rounded-end flag-input cursor-pointer" readonly
                             v-model="provinceDetail.name" placeholder="Chọn Tỉnh/Thành phố"
                             data-bs-toggle="dropdown" aria-expanded="false"/>
                      <div class="dropdown-menu w-100">
                        <div class="p-2 px-3 pt-1 searchlist-input">
                          <input type="text" class="form-control form-control border"
                                 v-model="option.province.searchVal"
                                 placeholder="Tìm kiếm..." @input="handleSearch()"/>
                        </div>
                        <ul class="list-unstyled dropdown-menu-list mb-0">
                          <li class="dropdown-item d-flex align-items-center" v-for="prov in provinceData"
                              @click="getBound(prov,provinceDetail)">
                            <div class="me-1">{{ prov.name }}</div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="idDistrictInput" class="form-label">Mã huyện <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="idDistrictInput" v-model="districtDetail.id" name="id"
                           placeholder="Nhập mã huyện. VD:1999">
                  </div>
                  <div class="mb-3">
                    <label for="fullNameDistrict" class="form-label">Tên huyện <span
                      class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="fullNameDistrict" v-model="districtDetail.name"
                           name="name"
                           placeholder="Nhập tên">
                  </div>
                  <div class="mb-3">
                    <label for="fullNameEnDistrict" class="form-label">Tên quốc tế</label>
                    <input type="text" class="form-control" id="fullNameEnDistrict" v-model="districtDetail.name_en"
                           name="name_en" placeholder="Nhập tên">
                  </div>
                  <div class="mb-3">
                    <label for="formFileDistrict" class="form-label">Dữ liệu (geojson,shp....) <span
                      class="text-danger">*</span></label>
                    <input class="form-control" type="file" id="formFileDistrict" name="geom">
                  </div>
                </b-col>
                <b-col md="7">
                  <div class="mb-3">
                    <label class="form-label">Thông tin</label>
                    <div class="ckeditor-classic">
                      <ckeditor v-model="districtDetail.description" :editor="editor"></ckeditor>
                    </div>
                  </div>
                </b-col>
              </b-row>
            </div>
            <div v-if="itemBoundary === `commune`">
              <b-row>
                <b-col md="5">
                  <div class="mb-3">
                    <label class="form-label">Tỉnh/Thành phố <span class="text-danger">*</span></label>
                    <div data-input-flag data-option-flag-name>
                      <input type="text" class="form-control rounded-end flag-input cursor-pointer" readonly
                             v-model="provinceDetail.name" placeholder="Chọn Tỉnh/Thành phố"
                             data-bs-toggle="dropdown" aria-expanded="false"/>
                      <div class="dropdown-menu w-100">
                        <div class="p-2 px-3 pt-1 searchlist-input">
                          <input type="text" class="form-control form-control border"
                                 v-model="option.province.searchVal"
                                 placeholder="Tìm kiếm..." @input="handleSearch()"/>
                        </div>
                        <ul class="list-unstyled dropdown-menu-list mb-0">
                          <li class="dropdown-item d-flex align-items-center" v-for="prov in provinceData"
                              @click="getBound(prov,provinceDetail)">
                            <div class="me-1">{{ prov.name }}</div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Quận/Huyện <span class="text-danger">*</span></label>
                    <div data-input-flag data-option-flag-name>
                      <input type="text" class="form-control rounded-end flag-input cursor-pointer" readonly
                             v-model="districtDetail.name" placeholder="Chọn Quận/Huyện"
                             @click="getDistrict()"
                             data-bs-toggle="dropdown" aria-expanded="false"/>
                      <div class="dropdown-menu w-100">
                        <div class="p-2 px-3 pt-1 searchlist-input">
                          <input type="text" class="form-control form-control border"
                                 v-model="option.district.searchVal"
                                 placeholder="Tìm kiếm..." @input="handleSearch()"/>
                        </div>
                        <ul class="list-unstyled dropdown-menu-list mb-0">
                          <li class="dropdown-item d-flex align-items-center" v-for="dtrc in districtData"
                              @click="getBound(dtrc,districtDetail)">
                            <div class="me-1">{{ dtrc.name }}</div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="idCommuneInput" class="form-label">Mã xã <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="idCommuneInput" v-model="communeDetail.id" name="id"
                           placeholder="Nhập mã xã. VD:19999">
                  </div>
                  <div class="mb-3">
                    <label for="fullNameCommune" class="form-label">Tên xã <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="fullNameCommune" v-model="communeDetail.name"
                           name="name" placeholder="Nhập tên">
                  </div>
                  <div class="mb-3">
                    <label for="fullNameEnComunne" class="form-label">Tên quốc tế</label>
                    <input type="text" class="form-control" id="fullNameEnComunne" v-model="communeDetail.name_en"
                           name="name_en" placeholder="Nhập tên">
                  </div>
                  <div class="mb-3">
                    <label for="formFileCommune" class="form-label">Dữ liệu (geojson,shp....) <span
                      class="text-danger">*</span></label>
                    <input class="form-control" type="file" id="formFileCommune">
                  </div>
                </b-col>
                <b-col md="7">
                  <div class="mb-3">
                    <label class="form-label">Thông tin</label>
                    <div class="ckeditor-classic">
                      <ckeditor v-model="communeDetail.description" :editor="editor"></ckeditor>
                    </div>
                  </div>
                </b-col>
              </b-row>
            </div>
            <div class="text-end">
              <b-button type="submit" variant="primary" @click.prevent="handleSubmit">Lưu</b-button>
            </div>
          </form>
        </div>
      </b-modal>
      <b-modal v-model="isDetail" hide-footer body-class="p-0" header-class="p-3"
               class="v-modal-custom"
               :title="itemBoundary === `province` ? `Chi tiết tỉnh` : itemBoundary === `district` ? `Chi tiết huyện` : `Chi tiết xã`"
               content-class="border-0 overflow-hidden" centered>
        <div class="p-2">
          <div class="table-responsive">
            <table class="table table-nowrap mb-3">
              <tbody id="info__detail">
              <tr>
                <td width="25%" class="fw-medium">Tên</td>
                <td>{{
                    itemBoundary === `province` ? provinceDetail.name : itemBoundary === `district` ? districtDetail.name : communeDetail.name
                  }}
                </td>
              </tr>
              <tr v-if="itemBoundary === `commune`">
                <td class="fw-medium">Tên quận/ huyện</td>
                <td>{{ districtDetail.name }}</td>
              </tr>
              <tr v-if="itemBoundary === `commune` || itemBoundary === `district`">
                <td class="fw-medium">Tên tỉnh/ thành phố</td>
                <td>{{ provinceDetail.name }}</td>
              </tr>
              <tr>
                <td class="fw-medium">Tên quốc tế</td>
                <td>{{
                    itemBoundary === `province` ? provinceDetail.name_en : itemBoundary === `district` ? districtDetail.name_en : communeDetail.name_en
                  }}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <h6 class="fw-semibold mt-2 ms-2">Thông tin</h6>
          <div class="mt-2 ms-2">
            <div v-if="itemBoundary === `province`">
              <div v-html="provinceDetail.description"></div>
            </div>
            <div v-if="itemBoundary === `district`">
              <div v-html="districtDetail.description"></div>
            </div>
            <div v-if="itemBoundary === `commune`">
              <span v-html="communeDetail.description"></span>
            </div>
          </div>
        </div>
      </b-modal>
    </div>
  </Layout>
</template>
<style scoped>
#info__detail > tr > td {
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}
</style>