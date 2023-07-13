<script>
import { useStaticData3d } from '../../../../../../state/map_control/staticData';
import ShowDetail3dObject from './ShowDetail3dObject.vue';

export default {
    data: function () {
        return {
            showMenuMore: false,
        };
    },
    setup: function () {
        const staticData3d = useStaticData3d()
        function removeObj(obj) {

        }
        return { staticData3d, removeObj };
    },
    components: { ShowDetail3dObject },
    mounted: function () {
        this.staticData3d.loadDataFromLocalStorage()
    },
    methods: {
        handleClickToggleShow: function () {
            this.show = !this.show
        },
        toggleShowMenuMore: function () {
            this.showMenuMore = !this.showMenuMore
        }
    },
};
</script>

<template>
    <div>
        <div>
            <label class="form-label">Danh sách dữ liệu 3D</label>
        </div>
        <div>
            <ul v-if="staticData3d.listData3dObject.length">
                <ShowDetail3dObject v-for="obj in staticData3d.listData3dObject" :obj="obj"></ShowDetail3dObject>
            </ul>
            <div v-else>
                Chưa có dữ liệu nào được tải lên!
            </div>
        </div>
    </div>
</template>

<style scoped></style>