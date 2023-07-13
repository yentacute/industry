<script>
import {layoutComputed} from "@/state/helpers";

import Vertical from "./vertical";
import Horizontal from "./horizontal";
import TwoColumns from "./twocolumn";
import Landing from "./landing/landing";
import Map from "./map/LayoutMap";

export default {
  props: {
    pageLayout: {
      type: String,
      default: "vertical",
    },
    isSticky: Boolean,
    isLight: Boolean,
    systemMenu: Boolean,
    address: {
      type: Object,
      default: function () {
        return {
          title: "",
          details: [],
        };
      },
    },
    items: {
      type: Array,
      default: () => {
        return [];
      },
    },
    slug: {
      type: String,
      default: "sipm-base",
    },
    chooseMenu: {
      type: String,
      default: "none",
    },
  },
  components: {
    Vertical,
    Horizontal,
    TwoColumns,
    Landing,
    Map,
  },
  data() {
    return {};
  },
  computed: {
    ...layoutComputed,
  },
  mounted() {
    document.documentElement.setAttribute("data-layout", this.pageLayout);
    document.documentElement.setAttribute("data-sidebar", "dark");
  },
};
</script>

<template>
  <div>
    <Vertical ref="vertical"
              v-if="pageLayout === 'vertical'"
              :layout="layoutType"
              :systemMenu="systemMenu"
              :address="address"
              :slug="slug" :items="items" :chooseMenu="chooseMenu"
    >
      <slot/>
    </Vertical>
    <Horizontal v-if="pageLayout === 'horizontal'" :layout="layoutType">
      <slot/>
    </Horizontal>
    <Landing
        v-if="pageLayout === 'landing'"
        :isSticky="isSticky"
        :isLight="isLight"
    >
      <slot/>
    </Landing>
    <TwoColumns v-if="pageLayout === 'twocolumn'" :layout="layoutType">
      <slot/>
    </TwoColumns>
    <Map v-if="pageLayout === 'map'">
      <slot/>
    </Map>
  </div>
</template>
