<script>
import { useStaticData2d } from '../../../../../../state/map_control/staticData';

export default {
    data: function () {
        return {
            showChangeObject: false,

        };
    },
    setup: function () {
        const staticData2d = useStaticData2d()
        const zoomTo2dObject = (object2d) => {
            console.log(object2d)
            staticData2d.zoomTo2dObject(object2d)
        }

        const removeFeatureShow = (object2d) => {
            staticData2d.remove2dObject(object2d)
        }

        const toggleShowFeature = (object2d) => {
            if (object2d.is_active) {
                console.log(object2d)
                // Add Feature
                staticData2d.addFeatureShow(object2d)
            }
            else {
                // Remove feature
                staticData2d.removeFeatureShow(object2d)
            }
        }
        return {
            staticData2d,
            zoomTo2dObject,
            toggleShowFeature,
            removeFeatureShow
        };
    },
    props: {
        obj: {

        }
    },
    components: {},
    mounted: function () {
    },
    methods: {
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
                <input class="form-check-input" type="checkbox" role="switch" v-model="obj.is_active"
                    @change="toggleShowFeature(obj)" :id="'objecSwitch' + obj.id"/>
                <label class="form-check-label ellipsis" :for="'objecSwitch' + obj.id">
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
                        <li class="cursor-pointer" @click="zoomTo2dObject(obj)"><a on-click="javascript:void(0)"
                                class="dropdown-item" target="_self"><i class="mdi mdi-map-search-outline"></i>
                                Phóng tới
                            </a>
                        </li>
                        <li class="cursor-pointer" @click="toggleShowChanegObject()"><a on-click="javascript:void(0)"
                                class="dropdown-item" target="_self"><i class="ri-edit-2-line"></i>
                                Chỉnh sửa
                            </a>
                        </li>
                        <li class="cursor-pointer" @click="removeFeatureShow(obj)"><a on-click="javascript:void(0)"
                                class="dropdown-item text-danger" target="_self"><i class="ri-delete-bin-line"></i>
                                Gỡ lớp đối tượng
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="w-100" v-if="showChangeObject">
            <span>Độ trong suốt (opacity): </span>
            <input type="range" class="form-range" min="0" max="1" step="0.1" @change="changeOpacityObject">
        </div>
    </li>
</template>

<style scoped></style>