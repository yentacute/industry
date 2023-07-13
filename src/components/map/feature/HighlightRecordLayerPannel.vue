<!-- <script>
import { usePublicLayerStore } from '../../../state/map_control/publicLayer';
import LayoutNavbar from './toolbar/LayoutNavbar.vue'
export default {
    props: [],
    setup: function () {
        const publicLayerStore = usePublicLayerStore();
        function closePannel() {
            publicLayerStore.isShowHighlightPannel = false
        }
        return { publicLayerStore, closePannel }
    },
    data() {
        return {

        }
    },
    components: { LayoutNavbar },
    mounted() {

    },
    methods: {

    }
}

</script>

<template>
    <div v-if="publicLayerStore.isShowHighlightPannel">
        <LayoutNavbar :z-index="3">
            <div class="card h-100">
                <div class="card-header py-2 mt-1">
                    <button type="button" class="btn-close float-end fs-12 ms-2" @click="{
                        publicLayerStore.destroyhighlightLayersOnMap();
                        closePannel()
                    }"></button>
                    <h6 class="card-title mb-0 ellipsis fs-14">Danh sách đối tượng nổi bật</h6>
                </div>
                <div class="card-body hover-overflowY-scroll">
                    <ul>
                        <li v-for="(item, index) in publicLayerStore.hightlightLayers" :key="index"
                            @click="publicLayerStore.zoomToHighlightLayer(item)"
                            class="form-check form-switch d-flex gap-3 align-items-center hover-bg"
                            style="line-height: 28px; border-radius: 4px">
                            <div class="w-100 d-flex align-items-center gap-2">
                                <!-- <input class="form-check-input" type="checkbox" role="switch" :id="item.id + 'layer'" /> -->
                                <label class="form-check-label ellipsis" :for="item.id + 'layer'">
                                    {{ item }}
                                </label>
                            </div>
                        </li>
                    </ul>
                    <p></p>
                    <div class="row col-12 justify-content-center m-0">
                        <button type="button" class="btn btn-danger" @click="{
                            publicLayerStore.destroyhighlightLayersOnMap();
                            closePannel()
                        }">Hủy xem đối tượng nổi bật</button>
                    </div>
                </div>
            </div>
        </LayoutNavbar>
    </div>
</template>
  

<style scoped>
.form-switch {
    padding-left: 0px !important;
}

.head-show {
    line-height: 38px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
}

.rotage {
    transform: rotate(180deg);
}

.nav-pc-mobie {
    left: 0px;
    top: calc(50% - 24px);
    transform: translateY(-50%);
    background: #fff;
    border-radius: 10px;
    margin-left: 8px;
}

.nav-pc-mobie .main-card {
    height: calc(100vh - 175px);
    width: 392px;
}

@media only screen and (max-width: 575px) {
    .nav-pc-mobie {
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0;
        transform: translateY(0);
    }

    .nav-pc-mobie .main-card {
        height: 100%;
        width: 100%;
    }
}
</style> -->
