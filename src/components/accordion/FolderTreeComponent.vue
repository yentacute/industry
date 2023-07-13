<script>
import apiRequest from '../../helpers/api/folderApi';
import { useFolderStore } from '../../state/folder';
import axios from "axios";
import FolderRightMenu from './FolderRightMenu.vue';
import { reloadLayerOnMoveMap} from '../../components/manage-data/TabDetailsClassData.vue'
const store = useFolderStore();
export default{
  name: 'TreeItem', // necessary for self-reference
  components: {
    FolderRightMenu
  },
  props: {
    model: Object
  },
  data() {
    return {
      isOpen: false,
      isDown: true,
      editName: this.model.name || this.model.name_display,
      activeElement: null
    }
  },
  computed: {
    editAction() {
      return store.editAction;
    }
  },
  methods: {
    getDetailChild(child, event) {
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
      this.$emit('get-detail-child', child, event);
    },
    
    toggleIcon(event) {
      const currentEl = event.currentTarget;
      currentEl.classList.toggle('is-open');

      if(currentEl.classList.contains('is-open')) {
          currentEl.querySelector('.chavron').classList.remove('mdi-chevron-right');
          currentEl.querySelector('.chavron').classList.add('mdi-chevron-down');
      } else {
        currentEl.querySelector('.chavron').classList.remove('mdi-chevron-down');
        currentEl.querySelector('.chavron').classList.add('mdi-chevron-right');
      }
    },

    startDrag(event, model) {
      store.startDrag(event, model)
    },
    onDrop(event, model) {
      store.onDrop(event, model);
    },

    showRightMenu(event, id, type) {
      store.showRightMenu(event, id, type)
    },
    
    editChangeFolder(id, name) {
      store.changeNameFolder(id, name)
    },

    editChangeFile(id, name) {
      store.changeNameFile(id, name)
    },
    openDataDetails(id, dataModel) {
      store.isLayer = true;
      if(!event.currentTarget.classList.contains('active')) {
        document.querySelectorAll('.item-folder a.active').forEach(item => {
          item.classList.remove('active')
        })
        event.currentTarget.classList.add('active');
      }

      setTimeout(() => {
        document.querySelectorAll('.nav__menu--bar-tabs .nav-item .nav-link').forEach(item => {
          if(item.classList.contains('active')) {
              item.classList.remove('active')
          }
          document.querySelector('[data-type="general"]').click();
        })
      }, 1000);
   
      store.memberListChoose = [];
      store.checkedMembers = [];
      store.modelId = id;
      store.openDataDetails = true;
      store.currentModelUrl = dataModel + 'export-excel/'
      store.searchModelUrl = dataModel;
    },
  },

}
</script>

<template>
   <li> 
      <b-button block href="#" 
                v-b-toggle="'accordion-' + model.id" variant="white" 
                draggable @dragstart="startDrag($event, model)"  
                @drop="onDrop($event, model)" 
                @dragover.prevent
                @dragenter.prevent 
                @click="model.type == 'folder' ? getDetailChild(model, $event) : openDataDetails(model.id, model.data_model)"  
                @contextmenu="showRightMenu($event, model.id, model.type)"
                :data-type="model.type"
                class="btn-folder">
            <div class="title" @click="model.children && model.children.length? toggleIcon($event) : null">
                <i v-if="model.children && model.children.length" class="mdi mdi-chevron-right chavron"></i>
                <i :class="model.type == 'folder'?  'mdi mdi-folder' : 'ri-table-line fs-16 align-middle text-info'"></i>
                <input type="text" v-model="editName" :class="`update-name-${model.id}`" class="input-name" @keyup.enter="model.type === 'folder'? editChangeFolder(model.id, editName) : editChangeFile(model.id, editName)"  ref="inputField">
                <span>{{model.name ? model.name : model.name_display}}</span>
            </div>
      </b-button>
      <b-collapse class="sub-folder" :id="'accordion-' + model.id" :accordion="'accordion-' + model.id" role="tabpanel">
        <TreeItem
          v-for="child in model.children"
          :model="child" :key="child.id"
          :class="{'no-child' : child.type !== 'folder'|| (child.children && child.children.length === 0)}"
          @get-detail-child="getDetailChild"
          :data-type="child.type"
          >
        </TreeItem>
      </b-collapse>
  </li>
</template>