<script setup>
import { provide, ref, defineProps, onMounted, onUnmounted, toRefs } from "vue";
import { data, methods_map } from "../../../state/map_control/data_map.js";
import Layout from "../../../layouts/main.vue";
import MapIotLink from "../../../components/map/MapIotLink.vue";
import SideBar from "./components/map-details/SideBar.vue";
import API from "../../../helpers/api/useAxios.js";
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

//khi map khỏi tạo hoàn tất có thể set lại map
const setMapType = () => {
  API()
    .get(`${props.slug}/map/${window.location.pathname.split("/").pop()}/`)
    .then((res) => {
      if (res.base_map?.base) {
        methods_map.setMapType(res.base_map.base);
        return;
      }
      methods_map.setMapType("roadmap");
    });
};

provide("map", {
  ...toRefs(data),
});
provide("draw-map", {
  ...methods_map,
});

const layout = ref(null);
onMounted(() => {
  document.documentElement.setAttribute("data-sidebar", "light");
  layout.value.$refs.vertical.setComponentsNavbar(SideBar);
});

const address = ref({
  title: props.nameKCN,
  details: [
    {
      name: "Quản lý bản đồ",
      to: `${props.slug}ManageMapPage`,
    },
    {
      name: "Xây dựng bản đồ",
      to: `${props.slug}MapDetails`,
    },
  ],
});
</script>

<template>
  <Layout
    ref="layout"
    :items="address.details"
    :address="address"
    :slug="props.slug"
  >
  </Layout>
  <div class="position-fixed" style="inset: 0; z-index: 1">
    <MapIotLink @map-moundted="setMapType"></MapIotLink>
  </div>
</template>
