<template>
  <!-- map bao bọc phía sau, có sự kiện click chuột phải -->
  <div style="height: 0; width: 0; max-width: 0; max-height: 0; z-index: -1">
    <div
      class="position-fixed"
      @contextmenu.prevent="($e) => showContextMenu($e)"
      @click="handleClickFMap"
      style="inset: 0; z-index: -1"
    >
      <MapIotLink @map-moundted="mapMoundted"></MapIotLink>
    </div>
    <Header @direct="emitDriect" @search="emitSearch"></Header>
    <Footer
      @direct="emitDriect"
      @data-layer="emitDataLayer"
      @details-layer="emitDetailsLayer"
      @project-view="emitProjectView"
      @style-layer="emitStyleLayer"
      @change-type-search="emitChangeTypeSearch"
      @time-dimension="emitSetDataMap"
      @static-data="emitStaticData"
      @setting="emitSetting"
      @data-e="emitDe"
    ></Footer>
    <!-- <WidgetVr></WidgetVr> -->
    <ControlMap></ControlMap>
    <Direct ref="navDirect"></Direct>
    <DataLayer ref="dataLayer"></DataLayer>
    <ProjectView ref="projectView"></ProjectView>
    <DetailsDataLayer ref="detailsLayer"></DetailsDataLayer>
    <DetailProjectView ref="detailProjectView"></DetailProjectView>
    <StyleLayer ref="styleLayer"></StyleLayer>
    <Search ref="searchPlus"></Search>
    <StaticData ref="staticData"></StaticData>
    <SettingVue ref="setting"></SettingVue>
    <SetDateMapVue ref="setDateMap"></SetDateMapVue>
    <ShowResultsTextSearchVue ref="showTextSearch"></ShowResultsTextSearchVue>
    <!-- <HighlightRecordLayerPannel
    ref="hightLightRecordLayerPannel"
  ></HighlightRecordLayerPannel> -->
    <RightClick ref="contextRightClick" @direct="emitDriect"></RightClick>
    <ChuThichThem ref="DeDataChuThichThem"></ChuThichThem>
  </div>
</template>

<script>
import { provide, toRefs } from "vue";
import API from "../../../helpers/api/useAxios";
import { data, methods_map } from "../../../state/map_control/data_map.js";
import {
  data as data_direct,
  methos_change as methods_direct,
} from "../../../state/map_control/direct";
import {
  useTileLayerStore,
  usePublicLayerStore,
} from "../../../state/map_control/publicLayer.js";
import {
  textSearch,
  methodsSearchHead,
} from "../../../state/map_control/init_state_page_mapcontrol.js";
import MapIotLink from "../../../components/map/MapIotLink.vue";
import Header from "../../../components/map/feature/Header.vue";
import Footer from "../../../components/map/feature/Footer.vue";
// import WidgetVr from "../../../components/map/feature/widget/WidgetVr.vue";
import ChuThichThem from "../../../components/map/feature/toolbar/ChuThichThem.vue";
import Direct from "../../../components/map/feature/toolbar/driect/Direct.vue";
import Search from "../../../components/map/feature/toolbar/search_plus/SearchPlus.vue";
import StyleLayer from "../../../components/map/feature/toolbar/style_layer/StyleLayer.vue";
import DataLayer from "../../../components/map/feature/toolbar/data_layer/DataLayer.vue";
import ProjectView from "../../../components/map/feature/toolbar/project_view/ProjectView.vue";
import ShowResultsTextSearchVue from "../../../components/map/feature/toolbar/ShowResultsTextSearch.vue";
import DetailsDataLayer from "../../../components/map/feature/toolbar/details_data_layer/DetailsDataLayer.vue";
import DetailProjectView from "../../../components/map/feature/toolbar/project_view/DetailProjectView.vue";
import SetDateMapVue from "../../../components/map/feature/toolbar/SetDateMap.vue";
import StaticData from "../../../components/map/feature/toolbar/static_data/StaticData.vue";
import SettingVue from "../../../components/map/feature/toolbar/setting/Setting.vue";
import ControlMap from "../../../components/map/feature/map_control/ControlMap.vue";
// import HighlightRecordLayerPannel from "../../../components/map/feature/HighlightRecordLayerPannel.vue";
import RightClick from "../../../components/map/feature/show_location/RightClick.vue";
export default {
  provide: function () {
    return {
      searchead: textSearch,
      direct: data_direct,
    };
  },
  setup: function () {
    const publicLayerStore = usePublicLayerStore();
    const tileLayerStore = useTileLayerStore();
    provide("map", {
      ...toRefs(data),
    });
    // provide("searchead", {
    //   ...textSearch,
    // });
    // provide("direct", {
    //   ...data_direct,
    // });
    provide("draw-map", {
      ...methods_map,
    });
    provide("methods-head-search", {
      ...methodsSearchHead,
    });
    provide("methods-direct", {
      ...methods_direct,
    });

    return {
      ...toRefs(data),
      ...toRefs(textSearch),
      ...toRefs(data_direct),
      ...methodsSearchHead,
      ...methods_direct,
      ...methods_map,
      tileLayerStore,
      publicLayerStore,
    };
  },
  components: {
    MapIotLink,
    Header,
    Footer,
    // WidgetVr,
    Direct,
    DataLayer,
    DetailsDataLayer,
    DetailProjectView,
    ProjectView,
    // HighlightRecordLayerPannel,
    StyleLayer,
    Search,
    SetDateMapVue,
    ShowResultsTextSearchVue,
    StaticData,
    SettingVue,
    ControlMap,
    RightClick,
    ChuThichThem,
  },
  props: {
    slug: {},
    nameKCN: {},
    feature: {
      type: String,
      default: "",
    },
  },
  mounted: function () {
    this.setFeatureMapControl();
    // this.emitStyleLayer();
  },
  methods: {
    emitProjectView: function () {
      this.$refs.projectView.setView();
    },
    emitDriect: async function () {
      this.$refs.navDirect.setView();
      if (
        !this.origin?.lat ||
        !this.destination?.lat ||
        !this.origin?.lng ||
        !this.destination?.lng
      )
        return;
      this.$refs.navDirect.emitDriect(
        await this.Directing([this.origin, this.destination], this.mode)
      );
    },
    emitDataLayer: function () {
      this.$refs.dataLayer.setView();
    },
    emitDetailsLayer: function () {
      this.$refs.detailsLayer.setView();
    },
    emitDe: function () {
      console.log("emit data-e");
      this.$refs.DeDataChuThichThem.setView();
    },
    emitStyleLayer: function () {
      // Trường hợp sử dụng để lấy về bản đồ công khai
      console.log(this.slug);
      if (this.slug !== undefined) {
        this.$refs.styleLayer.setView(this.slug, this.$route.params.mapId);
      } else {
        this.$refs.styleLayer.setView();
      }
    },
    emitSearch: function () {
      // if (this.isSearchPlus) {
      //   this.$refs.searchPlus.setView();
      //   return;
      // }
      if (!this.search) {
        return;
      }
      this.$refs.showTextSearch.setView();
    },
    emitChangeTypeSearch: function () {
      this.$refs.searchPlus.setView();
    },
    emitSetDataMap: function () {
      this.$refs.setDateMap.handleToogle();
    },
    emitStaticData: function () {
      this.$refs.staticData.setView();
    },
    emitSetting: function () {
      this.$refs.setting.setView();
    },

    showContextMenu: function ($e) {
      this.$refs.contextRightClick.showContextMenu($e);
    },
    mapMoundted: async function () {
      const vm = this;
      this.$router.replace({
        query: { camera: await vm.handleChangeHeToaDo() },
      });
      this.map.addListener("idle", async (args) => {
        vm.location = args.location;
        vm.$router.replace({
          query: { camera: await vm.handleChangeHeToaDo() },
        });
      });
      if (!vm.$route.params.mapId) return;
      API()
        .get(
          `${location.pathname.split("/")[1]}/map/${vm.$route.params.mapId}/`
        )
        .then((res) => {
          if (res.base_map?.base) {
            methods_map.setMapType(
              res.base_map.base,
              document.getElementById("imgBaseMapType")
            );
            return;
          }
          methods_map.setMapType("roadmap");
        });
    },
    handleClickFMap: function () {
      if (this.tileLayerStore.getLayerDetailByLocation()) {
        this.emitDetailsLayer();
      }
    },
    setFeatureMapControl: function () {
      switch (this.feature) {
        case "direct":
          // this.emitDriect();
          this.$refs.navDirect.setView();
          break;
      }
    },
  },
  watch: {
    $route: async function (route) {
      if (route.query?.camera) return;
      this.setFeatureMapControl();
      const vm = this;
      setTimeout(async () => {
        vm.$router.replace({
          query: { camera: await vm.handleChangeHeToaDo() },
        });
      }, 300);
    },
  },
};
</script>
