<script>
import { useStaticData3d } from '../../../../../../state/map_control/staticData';

export default {
    data: function () {
        return {
            showMenuMore: false,
            isShow3dObj: false,
            showChangeObject: false,
        };
    },
    setup: function () {
        const staticData3d = useStaticData3d()
        return { staticData3d };
    },
    props: {
        obj: {

        }
    },
    components: {},
    mounted: function () {
        this.staticData3d.loadDataFromLocalStorage()
    },
    methods: {
        toggleShowObject: function (event, obj) {
            if (event.target.checked) {
                this.staticData3d.add3dObjectToShow(obj)
            }
            else {
                this.staticData3d.removeShow3dObject(obj)
            }
        },
        remove3dObject: function (obj) {
            this.staticData3d.remove3dObject(obj)
        },
        zoomTo3dObject: function (obj) {
            this.staticData3d.zoomTo3dObject(obj)
        },
        toggleShowChanegObject() {
            this.showChangeObject = !this.showChangeObject
        }

    },
};
</script>

<template>
    <li :key="obj" style="line-height: 28px; border-radius: 4px">
        <div class="form-check form-switch d-flex gap-3 align-items-center hover-bg">
            <div class="w-100 d-flex align-items-center gap-2">
                <input class="form-check-input" type="checkbox" role="switch"
                    @change="($event) => toggleShowObject($event, obj)" :id="'obj-3d-' + obj.id" />
                <label class="form-check-label ellipsis" :for="'obj-3d-' + obj.id">
                    {{ obj.name }}
                </label>
            </div>
            <div class="position-relative d-flex align-items-center justify-content-center" style="width: 48px">
                <i class="ri-information-line text-muted fs-16 align-middle me-1 cursor-pointer"></i>
                <div class="dropdown"><button class="btn btn-soft-secondary btn-sm dropdown" type="button"
                        data-bs-toggle="dropdown" aria-expanded="false"><i
                            class="ri-more-2-fill text-muted fs-16 align-middle me-1 cursor-pointer"></i></button>
                    <ul class="dropdown-menu dropdown-menu-end" data-popper-placement="bottom-end"
                        style="position: absolute; inset: 0px 0px auto auto; margin: 0px; transform: translate(0px, 29px);">
                        <li class="cursor-pointer" @click="zoomTo3dObject(obj)"><a on-click="javascript:void(0)"
                                class="dropdown-item" target="_self"><i
                                    class="mdi mdi-map-search-outline text-muted fs-16 align-middle me-1"></i>
                                Phóng tới
                            </a>
                        </li>
                        <li class="cursor-pointer" @click="toggleShowChanegObject()"><a on-click="javascript:void(0)"
                                class="dropdown-item" target="_self"><i
                                    class="ri-edit-2-line align-bottom me-2 text-muted"></i>
                                Chỉnh sửa
                            </a>
                        </li>
                        <li class="cursor-pointer" @click="remove3dObject(obj)"><a on-click="javascript:void(0)"
                                class="dropdown-item text-danger" target="_self"><i class="ri-delete-bin-line"></i>
                                Gỡ lớp đối tượng
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="w-100 mt-2 d-flex gap-3 justify-content-between align-items-center" v-if="showChangeObject">
            <div class="w-50 ">
                <span>Vĩ độ (lat): </span>
                <div class="d-flex gap-2 justify-content-between align-items-center">
                    <input type="number" class="form-control" v-model="obj.building.position.lat">
                    <div class="d-flex flex-column align-items-center justify-content-center" style="height: 37.5px;">
                        <i class="text-primary mdi mdi-arrow-up-drop-circle fs-14 cursor-pointer"
                            @click="staticData3d.change3dObjectShow(obj, obj.building.position.lat + 0.000001)"></i>
                        <i class="text-primary mdi mdi-arrow-down-drop-circle fs-14 cursor-pointer"
                            @click="staticData3d.change3dObjectShow(obj, obj.building.position.lat - 0.000001)"></i>
                    </div>
                </div>
            </div>
            <div class="w-50 ">
                <span>Kinh độ (lng): </span>
                <div class="d-flex gap-2 justify-content-between align-items-center">
                    <input type="number" class="form-control" v-model="obj.building.position.lng">
                    <div class="d-flex flex-column align-items-center justify-content-center" style="height: 37.5px;">
                        <i class="text-primary mdi mdi-arrow-up-drop-circle fs-14 cursor-pointer"
                            @click="staticData3d.change3dObjectShow(obj, null, obj.building.position.lng + 0.000001, null, null)"></i>
                        <i class="text-primary mdi mdi-arrow-down-drop-circle fs-14 cursor-pointer"
                            @click="staticData3d.change3dObjectShow(obj, null, obj.building.position.lng - 0.000001, null, null)"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-100 mt-2 d-flex gap-3 justify-content-between align-items-center"  v-if="showChangeObject">
            <div class="w-50 ">
                <span>Tỉ lệ (scale): </span>
                <div class="d-flex gap-2 justify-content-between align-items-center">
                    <input type="number" class="form-control" v-model="obj.building.scale">
                    <div class="d-flex flex-column align-items-center justify-content-center" style="height: 37.5px;">
                        <i class="text-primary mdi mdi-arrow-up-drop-circle fs-14 cursor-pointer"
                            @click="staticData3d.change3dObjectShow(obj, null, null, obj.building.scale + 0.01, null)"></i>
                        <i class="text-primary mdi mdi-arrow-down-drop-circle fs-14 cursor-pointer"
                            @click="staticData3d.change3dObjectShow(obj, null, null, obj.building.scale - 0.01, null)"></i>
                    </div>
                </div>
            </div>
            <div class="w-50 ">
                <span>Nghiêng (bearing): </span>
                <div class="d-flex gap-2 justify-content-between align-items-center">
                    <input type="number" class="form-control" v-model="obj.building.bearing">
                    <div class="d-flex flex-column align-items-center justify-content-center" style="height: 37.5px;">
                        <i class="text-primary mdi mdi-arrow-up-drop-circle fs-14 cursor-pointer"
                            @click="staticData3d.change3dObjectShow(obj, null, null, null, obj.building.bearing + 0.01)"></i>
                        <i class="text-primary mdi mdi-arrow-down-drop-circle fs-14 cursor-pointer"
                            @click="staticData3d.change3dObjectShow(obj, null, null, null, obj.building.bearing - 0.01)"></i>
                    </div>
                </div>
            </div>
        </div>
        <p></p>
    </li>
</template>

<style scoped></style>