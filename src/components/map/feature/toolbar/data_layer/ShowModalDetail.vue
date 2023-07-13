<script>
import { usePublicLayerStore } from "../../../../../state/map_control/publicLayer";
import Pagination from "../../../../../components/Pagination.vue";
import LayoutTableVue from "./LayoutTable.vue";
import { errorToast } from "../../../../../helpers/api/toastStyle";

function setItem(name, classIcon, active = false, component) {
  return {
    name: name,
    icon: classIcon,
    active: active,
    component: component,
  };
}
export default {
  props: ["layerId"],
  setup: function () {
    const publicLayerStore = usePublicLayerStore();

    const handleClickCheckbox = ($e, item) => {
      // Using try catch here because when using click() or checked on a ElementChild
      // That throw an error but it still work
      try {
        item.active = !item.active
        if (item.active)
          publicLayerStore.addLayerHighlight(item);
        else
          publicLayerStore.removeLayerHightlight(item);
      } catch (err) { }
    };

    const handleClickShowHighlight = ($e, item) => {
      publicLayerStore.destroyhighlightLayersOnMap();
      publicLayerStore.addLayerHighlight(item);
      publicLayerStore.hightlightLayersOnMap();
    };

    const highlightChecked = () => {
      publicLayerStore.removeOlderHighlight();
      publicLayerStore.hightlightLayersOnMap();

    }

    const destroyAllHighlight = () => {
      publicLayerStore.destroyhighlightLayersOnMap();
    }

    return { publicLayerStore, handleClickCheckbox, handleClickShowHighlight, highlightChecked, destroyAllHighlight };
  },
  data() {
    return {
      searchDateHandle: {
        searchDateType: "",
        year: 24,
        month: 6,
        quarter: 2,
        startDate: '19/05/2023',
        endDate: '16/09/2023',
        fileDate: ""
      },
      MENU: [
        setItem("Bảng dữ liệu", "ri-table-fill", true),
        setItem("Xem thông tin", "ri-information-line", false),
      ],
    };
  },
  components: { LayoutTableVue, Pagination },
  mounted() {

  },
  methods: {
    handleClose: function () {
      this.publicLayerStore.destroyhighlightLayersOnMap();
      this.$refs.layoutTable.handleClose();
    },
    onClickChangeMenu: function (_index) {
      this.MENU.forEach(function (item, index) {
        item.active = _index === index;
      });
    },
    handleHidden: function () {
      this.$refs.layoutTable.handleHidden();
    },
    filterDataByDate: function () {
      const year = this.searchDateHandle.year + 1999
      let queryStr = `?field_date=${this.searchDateHandle.fileDate}`

      if (this.searchDateHandle.searchDateType == 'quarter') {
        queryStr += `&quarter=${this.searchDateHandle.quarter}&year=${year}`
      }
      else if (this.searchDateHandle.searchDateType == 'timeline') {
        queryStr += `&month=${this.searchDateHandle.month}&year=${year}`
      }
      else if (this.searchDateHandle.searchDateType == 'rangeDate') {
        const dateStart = new Date(this.searchDateHandle.startDate);
        let formattedStartDate = dateStart.toLocaleDateString('en-GB').replaceAll('/', '-');

        const dateEnd = new Date(this.searchDateHandle.endDate);
        let formattedEndDate = dateEnd.toLocaleDateString('en-GB').replaceAll('/', '-');
        if (dateEnd < dateStart) {
          errorToast("Vui lòng chọn thời gian kết thúc lớn hơn thời gian bắt đầu!")
          return;
        }
        queryStr += `&date=${formattedStartDate},${formattedEndDate}`

      }
      this.publicLayerStore.filterDataPublicByBoundary(queryStr)
    },
    handleChangeFieldDate: function (fieldName) {
      this.searchDateHandle.fileDate = fieldName;
      console.log(fieldName)
    }
  },
  watch: {
    "publicLayerStore.modalShowType"()  {
      this.onClickChangeMenu(this.publicLayerStore.modalShowType)
    }
  }
};
</script>

<template>
  <LayoutTableVue ref="layoutTable">
    <div class="card-header px-4 d-flex justify-content-between align-items-center" style="height: 32px">
      <div class="d-flex justify-content-between gap-3 align-items-center" style="line-height: 28px">
        <div v-for="(item, index) in MENU" :key="index" :title="item.name" :class="{ 'border-bottom-ridge': item.active }"
          :style="{ width: `${100 / MENU.length}%` }" @click="onClickChangeMenu(index)"
          class="d-flex justify-content-center align-items-center gap-2 cursor-pointer mx-1">
          <i :class="item.icon" class="text-primary"></i>
          <span v-if="MENU.length < 4" class="ellipsis">{{ item.name }}</span>
        </div>
      </div>
      <div class="d-flex align-items-center">
        <i title="Ẩn" @click="handleHidden" class="ri-subtract-fill float-end fs-20 ms-2 cursor-pointer"></i>
        <button title="Đóng" @click="handleClose" type="button" class="btn-close float-end fs-12 ms-2"></button>
      </div>
    </div>
    <div class="h-100 flex-grow-1 col-12">
      <div v-if="MENU[0].active" class="card-body h-100 px-2" style="overflow-y: auto">
        <div class="pt-2">
          <div class="input-group search-box w-100">
            <select class="input-group-text filter-select" v-model="publicLayerStore.searchField" @change="(e) => {
              publicLayerStore.searchDataPublic();
              handleChangeFieldDate(publicLayerStore.searchField)
            }">
              <option value="" selected disabled>Lọc theo:</option>
              <option :value="item.name" v-for="(item, key) in publicLayerStore.tableStructor" :key="key">
                <span v-if="item.name !== 'geom'">
                  {{ item.name.toLowerCase() }}
                </span>
              </option>
            </select>
            <div v-if="publicLayerStore.isDateFieldSearch" style="display: flex; ">
              <select v-model="searchDateHandle.searchDateType" class="form-control" style="margin-right: 4px;">
                <option value="">Lọc đối tượng theo: </option>
                <option value="quarter">Theo Quý, Năm</option>
                <option value="timeline">Theo Mốc thời gian</option>
                <option value="rangeDate">Theo Khoảng thời gian</option>
              </select>
              <div v-if="searchDateHandle.searchDateType == 'quarter'">
                <div>
                  <select v-model="searchDateHandle.quarter">
                    <option :value="quarter" v-for="quarter in 4">Quý {{ quarter }}</option>
                  </select>
                  <select v-model="searchDateHandle.year">
                    <option :value="year" v-for="year in 50">{{ year + 1999 }}</option>
                  </select>
                </div>
              </div>
              <div v-if="searchDateHandle.searchDateType == 'timeline'" style="padding-right: 4px;">
                <select v-model="searchDateHandle.month">
                  <option :value="month" v-for="month in 12">Tháng {{ month }}</option>
                </select>
                <select v-model="searchDateHandle.year" style="padding-right: 4px;">
                  <option :value="year" v-for="year in 50">{{ year + 1999 }}</option>
                </select>
              </div>
              <div v-if="searchDateHandle.searchDateType == 'rangeDate'" style="padding-right: 4px;">
                <input type="date" v-model="searchDateHandle.startDate" class="w-100">
                <input type="date" v-model="searchDateHandle.endDate" class="w-100 ">
              </div>
              <button type="button" class="btn btn-primary" v-if="searchDateHandle.searchDateType !== ''" @click="filterDataByDate">Lọc</button>
            </div>
            <input type="text" class="form-control" placeholder="Tìm kiếm" aria-label="Tìm kiếm"
              v-if="!publicLayerStore.isDateFieldSearch" v-model="publicLayerStore.searchValue"
              @keyup="publicLayerStore.searchDataPublic" />
          </div>
        </div>
        <p></p>
        <div class="table-responsive">
          <template v-if="publicLayerStore?.tableStructor">
            <table role="grid" class="table align-middle table-striped table-bordered gridjs-table">
              <thead class="table-light text-dark text-center text-uppercase">
                <tr>
                  <th>Highlight</th>
                  <th v-for="(data, key) in publicLayerStore.tableStructor" class="table__data-name"
                    data-sort="currency_name" scope="col" :key="key" :data-type="data.data_type" :data-name="data.name"
                    ref="fieldName">
                    {{ data.name !== "geom" ? data.name : "" }}
                  </th>
                </tr>
              </thead>
              <tbody class="form-check-all">
                <template v-if="publicLayerStore.tableData.length > 0">
                  <tr v-for="(item, index) in publicLayerStore.tableData" :key="index" class="table__data-view"
                    id="my-table">
                    <td class="text-center" @click="event => handleClickCheckbox(event, item)">
                      <input type="checkbox" v-model="item.active">
                    </td>
                    <td v-for="(value, key) of item" :key="key" class="table__data-info">
                      <span v-if="key !== 'id' && key !== 'geom' && key !== 'active'" class="table__data-field-name">
                        {{ value }}
                      </span>
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr>
                    <td :colspan="publicLayerStore.tableStructor.length + 1" class="text-align-center">
                      <span>Không có dữ liệu!</span>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </template>
        </div>
        <div class="d-flex">
          <button type="button" class="btn btn-success btn-sm" style="margin-top: 10px; margin-right: 10x;" @click="highlightChecked">Nổi bật đối tượng</button>
          <button type="button" class="btn btn-danger btn-sm" style="margin-top: 10px;" @click="destroyAllHighlight">Hủy nổi bật đối tượng</button>
        </div>
        <div class="d-flex justify-content-between align-items-center mt-3 pb-4">
          <div class="pagination-wrap hstack gap-2" v-if="publicLayerStore.totalObject > 10 && publicLayerStore.isGetMethod">
            <Pagination :page-size="publicLayerStore.pageSize" :total="publicLayerStore.totalObject"
              :callback="publicLayerStore.pageChanged"></Pagination>
          </div>
        </div>
      </div>
      <div class="p-2" v-else-if="MENU[1].active">
        <h6 class="fs-15">Tên lớp dữ liệu:</h6>
        <p class="text-muted mb-0">{{ publicLayerStore.selectedLayer.name_display }}</p>
        <h6 class="fs-15">Thông tin mô tả:</h6>
        <p class="text-muted mb-0">{{ publicLayerStore.selectedLayer.description == null ? "Chưa có thông tin mô tả nào dành cho lớp dữ liệu này" : publicLayerStore.selectedLayer.description }}</p>
      </div>
    </div>
  </LayoutTableVue>
</template>
