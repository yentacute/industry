<script setup>
import { provide, reactive, toRef } from "vue";

const building = reactive({
  id: null,
  details: {},
});

const NavDetailsBuilding = reactive({
  show: false,
});

const ShareBuilding = reactive({
  show: false,
});

provide("map-building", building);
provide("details-bulding", {
  show: toRef(NavDetailsBuilding, "show"),
  detailsMap4D: toRef(building, "details"),
});
provide("share-bulding", {
  show: toRef(ShareBuilding, "show"),
  detailsMap4D: toRef(building, "details"),
});
</script>

<template>
  <slot></slot>
</template>
