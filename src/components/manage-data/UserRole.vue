<template>
  <div>
    <b-modal v-model="store.modalAddMember" hide-footer title="Thành viên" class="v-modal-custom" centered
      modal-class="zoomIn">
      <input type="text" class="form-control form-control border mb-2" v-model="searchUser" @keyup="searchUserFunc"
        placeholder="Tìm kiếm người dùng" />
      <div data-simplebar style="height: 225px">
        <div class="list-group list-group-flush">
          <div class="list-group-item d-flex align-items-center ps-0 cursor-pointer" v-for="member in store.userDatas"
            :key="member.id">
            <input class="form-check-input me-3" type="checkbox" :value="member.id" @click="chooseUser($event,member.id)"/>
            <div class="d-flex align-items-center">
              <div class="flex-shrink-0">
                <img alt class="avatar-xxs rounded-circle" :src="member.photo
                    ? member.photo
                    : BASE_URL + `/media/photos/avatar-1.jpg`
                  " />
              </div>
              <div class="flex-grow-1 ms-2 form-check-permissions">
                <span>{{ member.first_name }} {{ member.last_name }}</span>
                <div class="my-3">
                  <!-- Inline Checkbox -->
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" :id="`view_${member.id}`" value="0" @click="choosePermission($event, member.id)"/>
                    <label class="form-check-label" :for="`view-${member.id}`">Xem</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" :id="`add_${member.id}`" value="1" @click="choosePermission($event, member.id)"/>
                    <label class="form-check-label" :for="`add-${member.id}`">Thêm</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" :id="`edit_${member.id}`" value="2" @click="choosePermission($event, member.id)"/>
                    <label class="form-check-label" for="inlineCheckbox3">Sửa</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" :id="`delete_${member.id}`" value="3" @click="choosePermission($event, member.id)"/>
                    <label class="form-check-label" for="inlineCheckbox3">Xoá</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer v-modal-footer">
        <b-button type="button" variant="success" @click="submitData">Lưu</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useFolderStore } from "../../state/folder";
import apiRequest from "../../helpers/api/folderApi";
import { debounce } from "lodash";
import { BASE_URL } from "../../helpers/api/axiosHttp";
import { errorToast, successToast } from "../../helpers/api/toastStyle";
const store = useFolderStore();
const searchUser = ref("");
let memberRoles = {}
if (store.isLayer) {
  memberRoles = reactive({
        layer: '',
        data: []
    });
} else {
  memberRoles = reactive({
        folder: '',
        data: []
    });
}

const submitData = async() => {
  if (store.isLayer) {
    try {
      console.log(memberRoles);
      const response = await apiRequest.addLayerPermission(memberRoles);
      if(response.status === 200) {
        successToast('Thêm phân quyền thành công')
      } else {
        errorToast('Lỗi mời thử lại')
      }
      store.getListPermissionMember(memberRoles.layer);
      store.modalAddMember = false;
    } catch (error) {
      console.log(error);

    }
  } else {
    try {
      const response = await apiRequest.addFolderPermission(memberRoles);
      if(response.status === 200) {
        successToast('Thêm phân quyền thành công');
      } else {
        errorToast('Lỗi mời thử lại')
      }
      store.getListPermissionMember(memberRoles.folder);
      store.modalAddMember = false;
    } catch (error) {
      console.log(error);

    }
  }
}

const getUsers = async () => {
  try {
    const { data } = await apiRequest.get("/user/?all");
    store.userDatas = data.results;
  } catch (error) {
    console.log(error.response.data.detail);
  }
};

const searchUserFunc = debounce(async () => {
  const { data } = await apiRequest.get(
    `/user/?q=${searchUser.value}&type=search`
  );
  store.userDatas = data.results;
}, 500);

//set value when checked
const chooseUser = (event,id) => {
  let permissions = [];
  if(store.isLayer) {
    memberRoles.layer = store.modelId;
  } else {
    memberRoles.folder = store.currentFolder;
  }
  const currentEl = event.target;
  const formCheck = currentEl.closest('.list-group-item').querySelectorAll('.form-check-permissions .form-check-input');
  if (currentEl.checked) {
    formCheck.forEach(item => {
      item.setAttribute('checked', 'checked');
      permissions.push(parseInt(item.value))
    });
    console.log(memberRoles.data);
    memberRoles.data.push({
      user: id,
      permissions: permissions
    });
  } else {
    formCheck.forEach(item => {
      item.removeAttribute('checked');
      permissions = [];
    });
    const index = memberRoles.data.findIndex((member) => member.user === id);
    memberRoles.data.splice(index, 1);
  }
}

const choosePermission = (event, id) => {
  const currentEl = event.target;
  if (currentEl.checked) {
    memberRoles.data.forEach(item => {
      if(item.user === id) {
        item.permissions.push(parseInt(event.target.value))
      }
    })

  } else {
    memberRoles.data.forEach(item => {
      if(item.user === id) {
        item.permissions.indexOf(parseInt(event.target.value)) !== -1 && item.permissions.splice(item.permissions.indexOf(parseInt(event.target.value)), 1)
      }
    })
  }
}



const getListMember = async () => {
  if(store.isLayer) {
    try {
      const { data } = await apiRequest.get(`/permission-model-dynamic?layer=${store.modelId}`);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const { data } = await apiRequest.get(`/permission-folder?folder=${store.currentFolder}`);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
  store.modalAddMember = false;
};



onMounted(() => {
  getUsers();
});
</script>
