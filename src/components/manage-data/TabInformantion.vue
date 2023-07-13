<template>
    <div class="tab-pane active" id="general" role="tabpanel">
        <form action="">
            <div class="mb-2 info__tab">
                <label for="basiInput" class="form-label">Tên dữ liệu</label>
                <input type="text" class="form-control" id="basiInput" v-model="store.nameDisplay" v-if="store.editInfo"/>
                <p v-else>{{store.nameDisplay}}</p>
            </div>
            <div class="mb-2 info__tab">
                <label for="description" class="form-label">Mô tả</label>
                <textarea class="form-control" id="description" rows="3" v-model="store.description" v-if="store.editInfo"></textarea>
                <p v-else>{{store.description}}</p>
            </div>
            <div class="mb-2 info__tab">
            <label for="tags" class="form-label">Tags</label>
            <input type="text" class="form-control" id="tags" v-model="store.tags" v-if="store.editInfo"/>
            <p v-else>{{store.tags}}</p>
            </div>
            <div class="mb-2 info__tab" v-if="store.editInfo">
            <b-button class="btn bnt-success" @click="updateInfor">Lưu</b-button>
            </div>
        </form>
    </div>
</template>

<script setup>
    import { reactive } from 'vue';
    import { useFolderStore } from '../../state/folder';
    import apiRequest from '../../helpers/api/folderApi';
    import { successToast, errorToast } from '../../helpers/api/toastStyle'
    const store = useFolderStore();
    store.getSlug();

    const updateInfor = async () => {
        const newForm = new FormData();
        newForm.append('name_display', store.nameDisplay);
        newForm.append('description', store.description);
        newForm.append('tags', store.tags);
        try {
            const response = await apiRequest.updateFile(store.modelId, store.slug, newForm);
            if(response.status === 200) {
                successToast('Cập nhật thành công');
                store.editInfo = false;
            } else {
                errorToast('Cập nhật thất bại');
                store.editInfo = false;
            }
        } catch (error) {
            console.log(error);
            if(error.response.status === 403) {
                errorToast('Bạn không có quyền');
            }
        }
        

    }
</script>