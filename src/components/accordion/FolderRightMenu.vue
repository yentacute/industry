<template>
    <ul v-if="store.showRightmenu" class="folder__right-menu">
        <li class="folder__right-item" @click="store.editFolderName(props.currentElId, $event)">
            Đổi tên
        </li>
        <li class="folder__right-item" @click="store.deleteFolder(props.currentElId, props.currentType)">
            Xoá
        </li>
        <li class="folder__right-item" @click="store.pinFolder(props.currentElId)">
            Ghim
        </li>
        <li class="folder__right-item" @click="store.deleteFolder(props.currentElId)">
            Đánh dấu
        </li>
        <li class="folder__right-item" @click="showPopupUser">
            Phân quyền
        </li>
    </ul>
</template>

<script setup>
    import { defineProps } from 'vue';
    import { useFolderStore } from '../../state/folder';
    import apiRequest from '../../helpers/api/folderApi';
    
    const store = useFolderStore();
    const props = defineProps({
        currentElId: String,
        currentType: String
    });

    const showPopupUser = () => {
        console.log(store.modalAddMember);
        store.modalAddMember = !store.modalAddMember

    }

</script>