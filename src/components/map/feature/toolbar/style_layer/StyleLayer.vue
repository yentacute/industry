<!-- Mỗi một chức năng sẽ viết riêng theo component 
Phần này được đặt trong MapControl -->

<script>
import { ref } from "vue";
import LayoutNavbar from "../LayoutNavbar.vue";
import ZIndexState from "../../../../../utils/zIndexState.js";
import DataLayer from "../data_layer/DataLayer.vue";
import DEDataLayer from "./DEDataLayer.vue";
import DADataLayer from "./DADataLayer.vue";
import { usePublicLayerStore } from "../../../../../state/map_control/publicLayer";
import { useCommonStore } from "../../../../../state/common";
import { warningToast } from "../../../../../helpers/api/toastStyle";
import ShowModalDetail from "../data_layer/ShowModalDetail.vue";
import { useRoute } from "vue-router";
import { useSharingStore } from "../../../../../state/map_control/sharing";
import { useHandleMapLoadStore } from "../../../../../state/map_control/handleMapLoad"

export default {
  setup() {
    const publicLayerStore = usePublicLayerStore();
    const zIndexState = new ZIndexState("style-layer");
    const { zIndex } = zIndexState.getState();
    const route = useRoute();

    function setItem(name, classIcon, active = false, component) {
      return {
        name: name,
        icon: classIcon,
        active: active,
        component: component,
      };
    }

    const MENU = ref([
      setItem(
        "Lớp bản đồ",
        "ri-stack-line",
        true,
        // (DataLayer,
        // {
        //   ref: "dataLayerRef",
        //   props: { componentStyleLayer: true },
        // })
        <DataLayer componentStyleLayer />
      ),
      setItem("Chú giải", "ri-price-tag-3-fill", false, DEDataLayer),
      setItem("Lọc dữ liệu", "ri-bar-chart-box-line", false, DADataLayer),
    ]);

    // const deleteMenuItem = (itemName) => {
    //   const index = MENU.value.findIndex((item) => item.name === itemName);
    //   if (index !== -1) {
    //     MENU.value.splice(index, 1);
    //   }
    // };

    // if (route.params.miningId !== undefined || route.params.folderId) deleteMenuItem("Lọc dữ liệu");

    const onClickChangeMenu = function (_index) {
      MENU.value.forEach(function (item, index) {
        item.active = _index === index;
      });
    };

    return { zIndex, MENU, onClickChangeMenu, publicLayerStore };
  },
  data: function () {
    return {
      show: true,
      sharingStore: useSharingStore(),
      handleLoadMapStore: useHandleMapLoadStore(),
      handleMining: {
        isMining: false,
        mingId: "",
        folderMiningId: false,
        foldId: "",
      },
    };
  },
  components: {
    LayoutNavbar,
    DataLayer,
    DADataLayer,
    DEDataLayer,
    ShowModalDetail,
  },
  mounted: function () {
    const params = new URLSearchParams(window.location.search);
    const sharingParam = params.get('sharing');
    if (sharingParam) {
      const decryption = this.sharingStore.getDecryptionSharingObject(sharingParam)
      this.handleLoadMapStore.set(decryption)
      if (this.handleLoadMapStore.sharingLoadObject.type == "layer") {
        this.$parent.emitDetailsLayer()
      }
      else if (this.handleLoadMapStore.sharingLoadObject.type == "project") {
        this.$parent.emitProjectView()
        // Mở cái detail của project
      }
    }

    // Trường hợp sử dụng bản đồ với mục đích khai thác dữ liệu
    if (this.$route.params.miningId !== undefined) {
      this.handleMining.isMining = true;
      this.handleMining.mingId = this.$route.params.miningId;
    }
    // Trường hợp sử dụng bản đồ với mục đích khai thác dữ liệu folder
    if (this.$route.params.folderId !== undefined) {
      this.handleMining.folderMiningId = true;
      this.handleMining.foldId = this.$route.params.folderId;
    }
    if (this.handleMining.isMining) {
      //  Lấy về dữ liệu layer
      this.publicLayerStore.getLayerMiningData(null, this.handleMining.mingId);
    }
    else if (this.handleMining.folderMiningId) {
      //  Lấy về dữ liệu folder
      this.publicLayerStore.getLayerMiningFolder(null, this.handleMining.foldId);
    }
    else {
      // Không có slug tức là lấy về mapMain của KCN
      const slugKCN = location.pathname.split('/')[1]
      const mapId = this.$route.params.mapId
      // MVB right here will check
      if (slugKCN == null || slugKCN == 'ban-do') {
          this.publicLayerStore.getAllLayersPublic(
            "kcn-song-cong-2",
            "ed7823ad-4a91-4cdd-8ef8-9c0a55646df1"
          );
        } else if (slugKCN !== null && mapId == null) {
          this.publicLayerStore.getIndustrialBySlug(slugKCN);
        } else {
          this.publicLayerStore.getAllLayersPublic(slugKCN, mapId);
        }
    }
  },
  methods: {
    setView: function (slugKCN = null, mapId = null) {
      if (this.handleMining.isMining) {
        this.publicLayerStore.getLayerMiningData(null, this.handleMining.mingId);
      }
      else if (this.handleMining.folderMiningId) {
        this.publicLayerStore.getLayerMiningFolder(null, this.handleMining.foldId);
      }
      else {
        // Không có slug tức là lấy về mapMain của KCN
        if (slugKCN == null) {
          this.publicLayerStore.getAllLayersPublic(
            "kcn-song-cong-2",
            "ed7823ad-4a91-4cdd-8ef8-9c0a55646df1"
          );
        } else if (slugKCN !== null && mapId == null) {
          this.publicLayerStore.getIndustrialBySlug("slugKCN");
        } else {
          this.publicLayerStore.getAllLayersPublic(slugKCN, mapId);
        }
      }
      this.show = true;
      this.$router.replace({ name: "MapStyleLayer" });
    },
    handleClose: function () {
      this.show = false;
      this.$router.replace("/ban-do");
      this.$refs.component.forEach((component) => {
        component.handleClose();
      });
    },
  },
};
</script>

<template>
  <div v-if="show">
    <LayoutNavbar :z-index="zIndex">
      <div class="card h-100">
        <div class="card-header py-2 mt-1">
          <button type="button" class="btn-close float-end fs-12 ms-2" @click="handleClose"></button>
          <h6 class="card-title mb-0 ellipsis fs-14">Thông tin bản đồ</h6>
        </div>
        <div class="card-body px-0 h-100">
          <div class="d-flex justify-content-between align-items-center" style="line-height: 28px">
            <div v-for="(item, index) in MENU" :key="index" :title="item.name"
              :class="{ 'border-bottom-ridge': item.active }" :style="{ width: `${100 / MENU.length}%` }"
              @click="onClickChangeMenu(index)"
              class="d-flex justify-content-center align-items-center gap-2 cursor-pointer mx-1">
              <i :class="item.icon" class="text-primary"></i>
              <span v-if="MENU.length < 4" class="ellipsis">{{
                item.name
              }}</span>
            </div>
          </div>
          <div class="mt-2 h-100 px-2 overflow-auto" style="padding-bottom: 62px;">
            <template v-for="(item, index) in MENU">
              <component :key="index" ref="component" v-if="item.active" :is="item.component" />
            </template>
          </div>
        </div>
      </div>
    </LayoutNavbar>
  </div>
  <ShowModalDetail></ShowModalDetail>
</template>
