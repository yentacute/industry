<script setup>
import { provide, toRef } from "vue";
import {
  data as data_direct,
  methos_change as methods_direct,
} from "@/state/map_control/direct";

provide("methods-direct", {
  ...methods_direct,
});

provide("direct", {
  origin: toRef(data_direct, "origin"),
  destination: toRef(data_direct, "destination"),
  mode: toRef(data_direct, "mode"),
  weighting: toRef(data_direct, "weighting"),
});
</script>

<template>
  <slot></slot>
</template>
