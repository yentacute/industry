const ROUTERMAPCONTROL = [
  {
    path: "/ban-do",
    name: "MapControl",
    meta: {
      title: "Bản đồ",
    },
    component: () => import("../views/map/main_map/MapControl.vue"),
  },
  {
    path: "/ban-do/map-type/:typePOI",
    name: "MapViewTypePOI",
    meta: {
      title: "Bản đồ",
    },
    component: () => import("../views/map/main_map/MapControl.vue"),
  },
  {
    path: "/ban-do/data-layer",
    name: "MapDataLayer",
    meta: {
      title: "Bản đồ",
    },
    component: () => import("../views/map/main_map/MapControl.vue"),
  },
  {
    path: "/ban-do/setting",
    name: "MapSetting",
    meta: {
      title: "Bản đồ",
    },
    component: () => import("../views/map/main_map/MapControl.vue"),
  },
  {
    path: "/ban-do/direct",
    name: "MapDirect",
    meta: {
      title: "Bản đồ",
    },
    component: () => import("../views/map/main_map/MapControl.vue"),
    props: {
      feature: "direct",
    },
  },
  {
    path: "/ban-do/details-layer",
    name: "MapDetailsLayer",
    meta: {
      title: "Bản đồ",
    },
    component: () => import("../views/map/main_map/MapControl.vue"),
  },
  {
    path: "/ban-do/detail-project",
    name: "MapDetailProjectView",
    meta: {
      title: "Bản đồ",
    },
    component: () => import("../views/map/main_map/MapControl.vue"),
  },
  {
    path: "/ban-do/style-layer",
    name: "MapStyleLayer",
    meta: {
      title: "Bản đồ",
    },
    component: () => import("../views/map/main_map/MapControl.vue"),
  },
  {
    path: "/ban-do/show-de",
    name: "MapShowDe",
    meta: {
      title: "Bản đồ",
    },
    component: () => import("../views/map/main_map/MapControl.vue"),
  },
  {
    path: "/ban-do/search-plus",
    name: "MapSearchPlus",
    meta: {
      title: "Bản đồ",
    },
    component: () => import("../views/map/main_map/MapControl.vue"),
  },
  {
    path: "/ban-do/quick-search",
    name: "MapQuickSearch",
    meta: {
      title: "Bản đồ",
    },
    component: () => import("../views/map/main_map/MapControl.vue"),
  },
  {
    path: "/ban-do/show-text-search",
    name: "MapShowQickSearch",
    meta: {
      title: "Bản đồ",
    },
    component: () => import("../views/map/main_map/MapControl.vue"),
  },
  {
    path: "/ban-do/static-data",
    name: "MapStaticData",
    meta: {
      title: "Bản đồ",
    },
    component: () => import("../views/map/main_map/MapControl.vue"),
  },
  {
    path: "/ban-do/project-view",
    name: "MapProjectView",
    meta: {
      title: "Bản đồ",
    },
    component: () => import("../views/map/main_map/MapControl.vue"),
  },
  {
    path: "/ban-do/so-sanh-thong-tin",
    name: "MapCompareMap",
    meta: {
      title: "So sánh bản đồ",
    },
    component: () => import("../views/map/main_map/ComperaMap.vue"),
  },
];

export default ROUTERMAPCONTROL;
