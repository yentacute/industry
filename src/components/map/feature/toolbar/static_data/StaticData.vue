<!-- Mỗi một chức năng sẽ viết riêng theo component 
Phần này được đặt trong MapControl -->

<script>
import ZIndexState from "../../../../../utils/zIndexState.js";
import LayoutNavbar from "../LayoutNavbar.vue";
import UploadStaticData2d from "./static_data_2d/UploadStaticData2d.vue";
import UploadStaticData3d from "./static_data_3d/UploadStaticData3d.vue";
import DataReference from "./data_reference/DataReference.vue";
export default {
    data: function () {
        return {
            show: false,
        };
    },
    setup() {
        const zIndexState = new ZIndexState("static-data");
        const { zIndex } = zIndexState.getState();
        return { zIndex };
    },
    components: { LayoutNavbar, UploadStaticData2d, UploadStaticData3d, DataReference },
    mounted: function () { },
    methods: {
        setView: function () {
            console.log("SETVIEW OKE!")
            this.$router.replace({ name: "MapStaticData" })
            this.show = true;
        },
        handleClose: function () {
            this.show = false;
            this.$router.replace("/ban-do");
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
                    <h6 class="card-title mb-0 ellipsis fs-14">Dữ liệu tĩnh</h6>
                </div>
                <div class="card-body hover-overflowY-scroll pt-1">
                    <DataReference></DataReference>
                    <UploadStaticData2d></UploadStaticData2d>
                    <UploadStaticData3d></UploadStaticData3d>
                </div>
            </div>
        </LayoutNavbar>
    </div>
</template>
