<script>
import { useStaticData3d } from '../../../../../../state/map_control/staticData';

export default {
    data: function () {
        return {
            fielObj: null,
            fileTexture: null
        };
    },
    setup: function () {
        const staticData3d = useStaticData3d()

        return { staticData3d };
    },
    components: {},
    mounted: function () { },
    methods: {
        handleObjFileChange(event) {
            this.fielObj = event.target.files[0];
        },
        handleTextureFileChange(event) {
            this.fileTexture = event.target.files[0];
        },
        handleUpload3dObject() {
            const formData = new FormData()
            formData.append('obj', this.fielObj)
            formData.append('texture', this.fileTexture)
            this.staticData3d.uploadStaticData(formData, this.name)
        }
    },
};
</script>

<template>
    <div>
        <!-- Readonly Input -->
        <div>
            <label for="name3dObject" class="form-label">Tên dữ liệu:</label>
            <input type="text" class="form-control" id="name3dObject" placeholder="Được dùng để quản lý" v-model="name">
        </div>
        <p></p>
        <div>
            <label for="file3dObject" class="form-label">Tệp tin Object (.obj):</label>
            <input class="form-control" id="file3dObject" type="file" accept=".obj" @change="handleObjFileChange">
        </div>
        <p></p>
        <div>
            <label for="file3dTexture" class="form-label">Tệp tin Texture (.png, .jpg):</label>
            <input class="form-control" id="file3dTexture" type="file" accept=".jpg,.png" @change="handleTextureFileChange">
        </div>
        <p></p>
        <button type="button" class="btn btn-secondary waves-effect waves-light w-100" @click="handleUpload3dObject">Tải
            lên</button>
    </div>
</template>