<script>
import { ref } from 'vue';
import { useStaticData2d } from '../../../../../../state/map_control/staticData';

export default {
    data: function () {
        return {
            name: "",
            file2dObject: null
        };
    },
    setup: function () {
        const staticData2d = useStaticData2d()

        return { staticData2d };
    },
    components: {},
    mounted: function () { },
    methods: {
        handleFileChange: function (event) {
            this.file2dObject = event.target.files[0];
        },
        handleUpload2dObject: function () {
            const formData = new FormData()
            formData.append('file', this.file2dObject)
            this.staticData2d.uploadStaticData(formData, this.name)
        }
    },
};
</script>

<template>
    <div>
        <!-- Readonly Input -->
        <div>
            <label for="name2dObject" class="form-label">Tên dữ liệu:</label>
            <input type="text" class="form-control" id="name2dObject" placeholder="Được dùng để quản lý" v-model="name">
        </div>
        <p></p>
        <div>
            <label for="file2dObject" class="form-label">Tệp tin 2d (.geojson, .zip):</label>
            <input class="form-control" id="file2dObject" type="file" accept=".zip,.geojson" @change="handleFileChange">
        </div>
        <p></p>
        <button type="button" class="btn btn-secondary waves-effect waves-light w-100" @click="handleUpload2dObject">Tải lên</button>
    </div>
</template>