<script>
import { inject, ref } from "vue";
import {
  usePublicLayerStore,
  useProjectViewStore,
  useTileLayerStore,
  useFilterDataStore,
} from "../../../../../state/map_control/publicLayer";
import { useStaticData2d } from "../../../../../state/map_control/staticData";
import {
  getGeomFromCoordinates,
  getfilterWmsWithGeom,
  getRectangleCoordinates,
} from "../../../../../utils/gisFunctionState";

export default {
  setup: function () {
    const data_map = inject("map");
    let methods_map = inject("draw-map");
    const listLocation = ref([]);

    const handleWindow = () => {
      if (!data_map.location?.value) return;
      listLocation.value = [...listLocation.value, data_map.location.value];
      methods_map.MannyMakerMap(
        listLocation.value,
        require("@/assets/images/maker/dot_blue.png")
      );
      methods_map.create_polygon(listLocation.value);
      listLocation.value.map((item) => {
        return [item.lng, item.lat];
      });
    };
    const deletePolygon = () => {
      if (!data_map.references.value.polygon) return;
      data_map.references.value.polygon.setMap(null);
      methods_map.SetNullMarker();
    };
    return { data_map, listLocation, handleWindow, deletePolygon };
  },
  data: function () {
    return {
      provinces: [],
      districts: [],
      communes: [],
      projects: [],
      selectedType: "project",

      selectedProvinceId: "CHOSE",
      selectedDistrictId: "CHOSE",
      selectedCommuneId: "CHOSE",

      selectedProjectId: "CHOSE",
      selectedUploadDataId: "CHOSE",
      boundaryDetail: null,

      publicLayerStore: usePublicLayerStore(),
      projectViewStore: useProjectViewStore(),
      staticData2d: useStaticData2d(),
      tileLayerStore: useTileLayerStore(),
      filterDataStore: useFilterDataStore(),
      geomDrawResult: {},
      geomDrawResultStr: "{}",
      draw: {
        type: "point",
        circle: {
          center: "",
          radius: 100,
        },
        circleMap: null,
      },
    };
  },
  mounted: function () {
    this.publicLayerStore.getAllProvince().then((data) => {
      this.provinces = data.results;
    });
    this.projectViewStore.getAllProjects().then((data) => {
      this.projects = data.results;
    });
    this.staticData2d.loadDataFromLocalStorage();

    this.selectedType = this.filterDataStore.currentFilter.type;
    this.selectedProjectId =
      this.filterDataStore.currentFilter.boundary.provinceId;
    this.selectedDistrictId =
      this.filterDataStore.currentFilter.boundary.districtId;
    this.selectedCommuneId =
      this.filterDataStore.currentFilter.boundary.communeId;

    this.selectedProjectId = this.filterDataStore.currentFilter.projectId;
    this.selectedUploadDataId = this.filterDataStore.currentFilter.uploadId;

    this.geomDrawResult = this.filterDataStore.currentFilter.draw.drawPolygon;
    this.geomDrawResultStr =
      this.filterDataStore.currentFilter.draw.drawPolyStr;
  },
  unmounted: function () {
    try {
      if (this.draw.circleMap) {
        this.draw.circleMap.setMap(null);
      }
      window.removeEventListener("click", this.handleDrawCircle);
    } catch (error) {
      // console.error();
    }
  },
  components: {},
  methods: {
    handleChangeTypeFilter: function () {},
    handleChangeSelectedProvince: function () {
      if (this.selectedProvinceId !== "CHOSE") {
        this.publicLayerStore
          .getBoundaryDetail("Province", this.selectedProvinceId)
          .then((data) => {
            this.boundaryDetail = data;
          });
        this.publicLayerStore
          .getDistrictByProvinceId(this.selectedProvinceId)
          .then((data) => {
            this.districts = data.results;
            console.log(data.results);
          });
      } else {
        this.boundaryDetail = null;
      }
      this.selectedDistrictId = "CHOSE";
      this.selectedCommuneId = "CHOSE";
      this.districts = [];
      this.communes = [];
    },
    handleChangeSelectedDistrict: function () {
      if (this.selectedDistrictId !== "CHOSE") {
        this.publicLayerStore
          .getBoundaryDetail("District", this.selectedDistrictId)
          .then((data) => {
            this.boundaryDetail = data;
          });
        this.publicLayerStore
          .getCommuneByDistrictId(this.selectedDistrictId)
          .then((data) => {
            this.communes = data.results;
            console.log(data.results);
          });
      } else {
        this.boundaryDetail = null;
      }
      this.selectedCommuneId = "CHOSE";
      this.communes = [];
    },
    handleChangeSelectedCommune: function () {
      if (this.selectedCommuneId !== "CHOSE") {
        this.publicLayerStore
          .getBoundaryDetail("Commune", this.selectedCommuneId)
          .then((data) => {
            this.boundaryDetail = data;
          });
      } else {
        this.boundaryDetail = null;
      }
    },
    applyFilterBoundary: function () {
      this.filterDataStore.resetFilter();
      this.filterDataStore.currentFilter.type = this.selectedType;

      if (this.selectedType == "boundary") {
        let boundaryFilter = {
          type: "", // province | district | commune,
          wmsInfo: {},
          value: "",
          cqlQuery: "",
        };
        let queryStr = null;

        // MVB Right Here!
        if (this.selectedProvinceId !== "CHOSE") {
          this.filterDataStore.currentFilter.boundary.provinceId =
            this.selectedProvinceId;
          boundaryFilter.type = "Province";
          boundaryFilter.value = this.selectedProvinceId;
          queryStr = `?province=${this.selectedProvinceId}&geom`;
          boundaryFilter.wmsInfo = {
            layer: "tb_province",
            workspace: "db_sipm_2023",
          };
          boundaryFilter.cqlQuery = `province_id=${boundaryFilter.value}`;
        }
        if (this.selectedDistrictId !== "CHOSE") {
          this.filterDataStore.currentFilter.boundary.provinceId =
            this.selectedProvinceId;
          boundaryFilter.type = "District";
          boundaryFilter.value = this.selectedDistrictId;
          queryStr = `?district=${this.selectedDistrictId}&geom`;
          boundaryFilter.wmsInfo = {
            layer: "tb_district",
            workspace: "db_sipm_2023",
          };
          boundaryFilter.cqlQuery = `disctrict_id=${boundaryFilter.value}`;
        }
        if (this.selectedCommuneId !== "CHOSE") {
          this.filterDataStore.currentFilter.boundary.provinceId =
            this.selectedCommuneId;
          boundaryFilter.type = "Commune";
          boundaryFilter.value = this.selectedCommuneId;
          queryStr = `?commune=${this.selectedCommuneId}&geom`;
          boundaryFilter.wmsInfo = {
            layer: "tb_commune",
            workspace: "db_sipm_2023",
          };
          boundaryFilter.cqlQuery = `commune_id=${boundaryFilter.value}`;
        }
        this.filterDataStore.currentFilter.boundary.queryStr = queryStr;
        this.tileLayerStore.removeFilterCqlPolygon();
        this.tileLayerStore.filterCqlGeomOverlay(true, boundaryFilter);
      } else if (this.selectedType == "project") {
        this.filterDataStore.currentFilter.projectId = this.selectedProjectId;
        const projectFounded = this.projects.find(
          (project) => project.id === this.selectedProjectId
        );
        const queryStr = `?project=${this.selectedProjectId}&geom`;
        this.filterDataStore.currentFilter.project.queryStr = queryStr;
        this.tileLayerStore.getfilterWmsWithGeom(projectFounded.geom);
        this.tileLayerStore.filterCqlGeomOverlay();
      } else if (this.selectedType == "uploadData") {
        this.filterDataStore.currentFilter.uploadId = this.selectedUploadDataId;
        const uploadDataFounded = this.staticData2d.listData2dObject.find(
          (obj2d) => obj2d.id === this.selectedUploadDataId
        );
        const geom = uploadDataFounded.geom.features[0].geometry;
        this.filterDataStore.currentFilter.upload.uploadPolygon = geom;
        this.tileLayerStore.getfilterWmsWithGeom(geom);
        this.tileLayerStore.filterCqlGeomOverlay();

        // const geom = uploadDataFounded.geom.features[0].geometry;
        // this.publicLayerStore.filterDataPublicByGeom(geom);
      } else if (this.selectedType == "drawData") {
        if (this.draw.type == "circle") {
          // Xử lý lọc bằng hình tròn radius
          this.filterDataStore.currentFilter.type = "drawCircle";
          this.filterDataStore.currentFilter.draw.queryCircle = `?geom=&center=${this.draw.circle.center}&radius=${this.draw.circle.radius}`;
          this.filterDataStore.currentFilter.draw.circle.center =
            this.draw.circle.center;
          this.filterDataStore.currentFilter.draw.circle.radius =
            this.draw.circle.radius;
        } else {
          this.filterDataStore.currentFilter.draw.drawPolygon =
            this.geomDrawResult;
          this.filterDataStore.currentFilter.draw.drawPolyStr =
            this.geomDrawResultStr;

          this.tileLayerStore.getfilterWmsWithGeom(this.geomDrawResult);
          this.tileLayerStore.filterCqlGeomOverlay();
        }
      }

      this.tileLayerStore.changeFilterCqlPolygon();
      // if (!this.draw.type == "circle" || !this.selectedType == "drawData") {
      //   console.log("AH")
      // }
      // else {
      //   this.tileLayerStore.changeFilterCqlPolygon();
      // }
      this.publicLayerStore.getLayerStructor();
    },
    handleClickAddEnvent: function () {
      this.geomDrawResult = [];
      this.geomDrawResultStr = "{}";
      this.data_map.location.value = null;
      try {
        this.handleClikRemoveEnvent();
      } catch (error) {
        // console.log(error);
      }
      try {
        if (this.draw.circleMap) {
          this.draw.circleMap.setMap(null);
        }
        window.removeEventListener("click", this.handleDrawCircle);
      } catch (error) {
        // console.error();
      }
      switch (this.draw.type) {
        case "point":
          window.addEventListener("click", this.handleWindow);
          break;
        case "circle":
          window.addEventListener("click", this.handleDrawCircle);
          break;
      }
    },
    handleDrawCircle: function (LatLngCenter) {
      if (this.draw.circleMap) {
        this.draw.circleMap.setMap(null);
      }
      if (!this.data_map.location.value) return;
      this.draw.circle.center = `${this.data_map.location.value.lat}, ${this.data_map.location.value.lng}`;
      let options = {
        center: this.data_map.location.value,
        fillOpacity: 0.1,
        strokeWidth: 1,
        strokeColor: "#F24C3D",
        userInteractionEnabled: true,
        radius: parseFloat(this.draw.circle.radius),
      };
      if (LatLngCenter?.lat && LatLngCenter?.lng) {
        options.center = LatLngCenter;
      }
      this.draw.circleMap = new map4d.Circle(options);
      this.draw.circleMap.setMap(this.data_map.map.value);
    },
    handleChangeRadius: function () {
      if (this.draw.circle.center.split(",").length !== 2) return;
      const LOCATIONTEMP = {
        lat: this.draw.circle.center.split(",")[0].trim(),
        lng: this.draw.circle.center.split(",")[1].trim(),
      };
      this.handleDrawCircle(LOCATIONTEMP);
    },
    // MVB RIGHT HERE
    // Chỗ này cần xử lý thêm ví dụ người dùng nhấn bắt đầu xong kết thúc luôn và bấm áp dụng hoặc chỉ chọn 1 - 2 điểm thì lọc xử lý valid như thế nào
    handleClikRemoveEnvent: function () {
      window.removeEventListener("click", this.handleWindow);
      this.deletePolygon();
      this.handleConvertDrawPolygon(this.listLocation);
      this.listLocation = [];
    },
    handleConvertDrawPolygon: function (coordinates) {
      const polygon = getGeomFromCoordinates(coordinates, "polygon");
      this.geomDrawResult = polygon;
      this.geomDrawResultStr = JSON.stringify(this.geomDrawResult);
    },
    resetAllFilter: function () {
      this.tileLayerStore.restAllFilter();
      this.geomDrawResult = [];
      this.geomDrawResultStr = "{}";
    },
  },
};
</script>

<template>
  <div>
    <label>Lọc theo:</label>
    <select
      class="form-control"
      v-model="selectedType"
      @change="handleChangeTypeFilter"
    >
      <option value="project">Dự án</option>
      <option value="uploadData">Dữ liệu đã tải lên</option>
      <option value="drawData">Vẽ</option>
      <option value="boundary">Ranh giới</option>
    </select>
    <p></p>
    <div v-if="selectedType == 'boundary'">
      <label>Chọn Tỉnh:</label>
      <select
        class="form-control"
        v-model="selectedProvinceId"
        @change="handleChangeSelectedProvince"
      >
        <option value="CHOSE">=======Chọn Tỉnh======</option>
        <option
          :value="province.id"
          v-for="province in provinces"
          :key="province.id"
        >
          {{ province.name }}
        </option>
      </select>
      <p></p>
      <label>Chọn Huyện:</label>
      <select
        class="form-control"
        v-model="selectedDistrictId"
        @change="handleChangeSelectedDistrict"
      >
        <option value="CHOSE">=======Chọn Huyện======</option>
        <option
          :value="district.id"
          v-for="district in districts"
          :key="district.id"
        >
          {{ district.name }}
        </option>
      </select>
      <p></p>
      <label>Chọn Xã:</label>
      <select
        class="form-control"
        v-model="selectedCommuneId"
        @change="handleChangeSelectedCommune"
      >
        <option value="CHOSE">=======Chọn Xã======</option>
        <option
          :value="commune.id"
          v-for="commune in communes"
          :key="commune.id"
        >
          {{ commune.name }}
        </option>
      </select>
    </div>
    <div v-if="selectedType == 'project'">
      <label>Chọn Dự án:</label>
      <select class="form-control" v-model="selectedProjectId">
        <option value="CHOSE">=======Dự án======</option>
        <option
          :value="project.id"
          v-for="project in projects"
          :key="project.id"
        >
          {{ project.ten }}
        </option>
      </select>
    </div>
    <div v-if="selectedType == 'uploadData'">
      <label>Chọn đối tượng đã tải lên:</label>
      <p class="text-justify">
        <b style="color: red">Lưu ý: </b>Hiện tại nếu tải lên FeatureCollection
        thì sẽ lấy về dữ liệu Geometry của Feature đầu tiên để lọc!.
      </p>
      <select class="form-control" v-model="selectedUploadDataId">
        <option value="CHOSE">=======Đối tượng đã tải lên======</option>
        <option
          :value="object2d.id"
          v-for="object2d in staticData2d.listData2dObject"
          :key="object2d.id"
        >
          {{ object2d.name }}
        </option>
      </select>
    </div>
    <div v-if="selectedType == 'drawData'">
      <div class="d-flex gap-3 align-items-center mb-2">
        <div class="d-flex gap-2 align-items-center">
          <input type="radio" value="point" v-model="draw.type" />
          <label class="mb-0" for="" @click="draw.type = 'point'"
            >Vẽ đa giác</label
          >
        </div>
        <div class="d-flex gap-2 align-items-center">
          <input type="radio" value="circle" v-model="draw.type" />
          <label class="mb-0" for="" @click="draw.type = 'circle'"
            >Vẽ hình tròn</label
          >
        </div>
      </div>
      <input
        v-if="draw.type === 'point'"
        type="text"
        class="form-control"
        readonly
        disabled
        v-model="geomDrawResultStr"
      />
      <div
        v-else
        class="d-flex justify-content-between align-items-center mt-2"
      >
        <div class="row">
          <div class="col-md-6">
            <label class="form-label">Center</label>
            <input
              type="text"
              class="form-control"
              placeholder="Tâm đường tròn"
              v-model="draw.circle.center"
            />
          </div>
          <div class="col-md-6">
            <label class="form-label" for="add-location-website"
              >Bán kính(m)</label
            >
            <input
              type="text"
              class="form-control"
              placeholder="Bán kính"
              v-model="draw.circle.radius"
              @change="handleChangeRadius"
            />
          </div>
        </div>
      </div>
      <p></p>
      <div class="d-flex align-items-center gap-3">
        <button class="btn btn-primary" @click="handleClickAddEnvent">
          Bắt đầu vẽ
        </button>
        <button class="btn btn-danger" @click="handleClikRemoveEnvent">
          Kết thúc
        </button>
      </div>
    </div>

    <p></p>
    <button class="btn btn-success w-100" @click="applyFilterBoundary">
      Áp dụng
    </button>
    <p></p>
    <button class="btn btn-danger w-100" @click="resetAllFilter()">
      Hủy các bộ lọc
    </button>
  </div>
</template>
