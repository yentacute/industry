<template>
  <div style="height: 0; width: 0; max-width: 0; max-height: 0; z-index: -1">
    <div class="position-fixed" style="inset: 0; z-index: -1">
      <MapIotLink
        @map-moundted="mapMoundted"
        @click.prevent="($e) => showViewBuilding($e)"
        @contextmenu.prevent="($e) => showContextMenu($e)"
      ></MapIotLink>
    </div>
    <DirectProvider>
      <MapBuildingProvider>
        <ViewBuilding @direct="emitDriect" ref="dotBuilding"></ViewBuilding>
        <DetailsMapBuilding></DetailsMapBuilding>
      </MapBuildingProvider>
      <Direct ref="navDirect" check-route></Direct>
      <SearchProvider>
        <Head></Head>
        <ListCompany ref="listCompanyR"> </ListCompany>
      </SearchProvider>
      <RightClick @direct="emitDriect" ref="contextRightClick"></RightClick>
    </DirectProvider>
    <Control></Control>
  </div>
</template>

<script>
import { provide, toRefs } from "vue";
import { methods_map, data } from "../../../state/map_control/data_map";
import MapIotLink from "../../../components/map/MapIotLink.vue";
import SearchProvider from "../../../state/map_portal/SearchProvider.vue";
import MapBuildingProvider from "../../../state/map_portal/MapBuildingProvider.vue";
import DirectProvider from "../../../state/map_portal/DirectProvider.vue";
import ViewBuilding from "../../../components/map/feature/view_dot_map/ViewBuilding.vue";
import Head from "./components/header/Head.vue";
import ListCompany from "./components/siderbar/ListCompany.vue";
import DetailsMapBuilding from "./components/siderbar/DetailsMapBuilding.vue";
import Control from "./components/right-bottom-control/Control.vue";
import Direct from "../../../components/map/feature/toolbar/driect/Direct.vue";
import RightClick from "../../../components/map/feature/show_location/RightClick.vue";
import { data as data_direct } from "@/state/map_control/direct";
export default {
  components: {
    MapIotLink,
    ViewBuilding,
    Head,
    ListCompany,
    Control,
    SearchProvider,
    MapBuildingProvider,
    DirectProvider,
    DetailsMapBuilding,
    Direct,
    RightClick,
  },
  setup: function () {
    provide("map", {
      ...toRefs(data),
    });
    provide("draw-map", {
      ...methods_map,
    });
    return { ...data_direct };
  },
  methods: {
    showViewBuilding: function ($e) {
      this.$refs.dotBuilding.handleSetView($e);
    },
    mapMoundted: function () {},
    handleShowListCompany: function () {
      this.$refs.listCompanyR.setView();
    },
    handleShowCompabyDetail: function (company) {
      this.$refs.listCompanyR.handleClickViewCompany(company);
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
    showContextMenu: function ($e) {
      this.$refs.contextRightClick.showContextMenu($e);
    },
  },
};
</script>
