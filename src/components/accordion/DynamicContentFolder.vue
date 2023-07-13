<template>
    <div v-if="!store.viewMode">
        <li  class="item-folder" v-for="item in props.folderData" :key="item.id" draggable="true" @dragstart="store.startDrag($event, item)"  @drop="store.onDrop($event, item)" @dragover.prevent
            @dragenter.prevent  @click="item.type==='folder' ? getDetailFolder(item) : openDataDetails(item.id, item.data_model)" @contextmenu="store.showRightMenu($event, item.id)" :data-type="item.type">
            <div class="title" v-if="item.name || item.name_display">
                <i :class="item.type == 'folder'?  'mdi mdi-folder' : 'ri-table-line fs-16 align-middle text-info'"></i>
                <input type="text" v-model="editName" :class="`update-name-${item.id}`" class="input-name" @keyup.enter="item.type === 'folder'? store.changeNameFolder(item.id, editName) : store.changeNameFile(item.id, editName)"  ref="inputField">
                <span>{{item.name ? item.name : item.name_display}}</span>
            </div>

            <div class="date-create" v-if="item.created_date">
                {{ store.formatDate(item.created_date) }}
            </div>
            <div class="type-folder" v-if="item.type">
                <span v-if="item.type === 'data-dynamic'">Lớp dữ liệu</span>
                <span v-else>Folder</span>
            </div>
        </li> 
    </div>
    <div v-else>
        <li class="item-folder" v-for="item in props.folderData" :key="item.id" draggable="true" @dragstart="store.startDrag($event, item)"  @drop="store.onDrop($event, item)" @dragover.prevent
            @dragenter.prevent  @click="item.type==='folder' ? getDetailFolder(item) : openDataDetails(item.id, item.data_model)" :data-type="item.type">
            <div class="title" v-if="item.name || item.name_display">
                <i :class="item.type == 'folder'?  'mdi mdi-folder' : 'ri-table-line fs-16 align-middle text-info'"></i>
                <input type="text" v-model="editName" :class="`update-name-${item.id}`" class="input-name" @keyup.enter="item.type === 'folder'? editChangeFolder(item.id, editName) : editChangeFile(item.id, editName)"  ref="inputField">
                <span>{{item.name ? item.name : item.name_display}}</span>
            </div>
        </li>
    </div>
    
</template>

<script setup>
    import { defineEmits, defineProps, onMounted, ref } from 'vue';
    import { useFolderStore } from '../../state/folder';

    const store = useFolderStore();
    //define props
    const props = defineProps({
        folderData: {
            type: [Array],
            required: true
        }
    });

    function openDataDetails(id, dataModel) {
        store.isLayer = true;
      if(!event.currentTarget.classList.contains('active')) {
        document.querySelectorAll('.item-folder a.active').forEach(item => {
          item.classList.remove('active')
        })
        event.currentTarget.classList.add('active');
      }
      store.memberListChoose = [];
      store.checkedMembers = [];
      store.modelId = id;
      store.openDataDetails = true;
      store.currentModelUrl = dataModel + 'export-excel/'
      store.searchModelUrl = dataModel;
    }
    const editName = ref('');

    //define emit
    const emit = defineEmits(['update-folder-data']);

    //pass emit function to parent
    function getDetailFolder(child) {
        store.dataPath = child.path;
      store.allowSetRoles = true;
      store.isLayer = false;
      store.getListPermissionMember(child.id);
      // store.currentFolder = child.id
      if(!event.currentTarget.classList.contains('active')) {
        document.querySelectorAll('.item-folder a.active').forEach(item => {
          item.classList.remove('active')
        })
        event.currentTarget.classList.add('active');
      }
      store.openDataDetails = false;
      store.memberListChoose = [];
      store.checkedMembers = []
      emit('update-folder-data', child.children);
    }

</script>