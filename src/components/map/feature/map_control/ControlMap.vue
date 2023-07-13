<script setup>
import LayoutControl from "./LayoutControl.vue";
import MapTypesVue from "./MapTypes.vue";
import GetLocationMe from "./GetLocationMe.vue";
import Estimate from "./estimate/Estimate.vue";
import FullScreen from "./FullScreen.vue";
import GetLocationClick from "./GetLocationClick.vue";
</script>
<template>
  <LayoutControl>
    <Estimate></Estimate>
    <GetLocationClick></GetLocationClick>
    <FullScreen></FullScreen>
    <GetLocationMe></GetLocationMe>
    <MapTypesVue></MapTypesVue>
  </LayoutControl>
</template>
