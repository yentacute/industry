<script>
import ShowListStaticData3d from './ShowListStaticData3d.vue';
import HandleUpload3d from './HandleUpload3d.vue'

export default {
    data: function () {
        return {
            show: false,
        };
    },
    setup: function () {
        return {};
    },
    components: { ShowListStaticData3d, HandleUpload3d },
    mounted: function () { },
    methods: {
        handleClickToggleShow: function () {
            this.show = !this.show
        }
    },
};
</script>

<template>
    <div class="w-100">
        <div class="card h-100" style="margin-bottom: 12px; border: 1px solid #299cdb">
            <div :class="{ 'text-bg-light': !show }" class="card-head px-2 head-show text-bg-primary"
                @click="handleClickToggleShow">
                <h6 :class="{ 'text-white': show }" class="card-title mb-0 ellipsis fs-14">
                    Thêm Dữ Liệu 3D
                </h6>
                <i class="ri-arrow-down-s-line fs-18" style="transition: all linear 0.3s" :class="{ rotage: !show }"></i>
            </div>
            <div class="card-body" v-if="show">
                <details open>
                    <summary>Tải lên dữ liệu</summary>
                    <HandleUpload3d></HandleUpload3d>
                </details>
                <p></p>
                <ShowListStaticData3d></ShowListStaticData3d>    
            </div>
        </div>
    </div>
</template>
<style scoped>
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
</style>
