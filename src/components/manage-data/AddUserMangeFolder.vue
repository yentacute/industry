<template>
    <div v-if="store.errorMessage !== 'Không có quyền truy cập.'">
        <UserRole />
        <p class="mt-3">Thêm thành viên</p>
        <div class="col-2 mb-3 d-flex align-items-center">
            <div v-if="store.isInheritance && store.isLayer" class="hide" >
            </div>
            <div v-else class="avatar-xs me-3" @click="store.modalAddMember = !store.modalAddMember">
                <div class="avatar-title fs-16 rounded-circle bg-light border text-primary">+</div>
            </div>
            <div class="form-check form-switch form-switch-danger" v-if="store.isLayer">
                <input class="form-check-input" type="checkbox" role="switch" id="SwitchCheck1" @click="setPermissionAsParents($event)" :checked="store.isInheritance" />
                <label class="form-check-label" for="SwitchCheck1">Kế thừa</label>
            </div>
        </div>
        <table class="table align-middle table-striped table-bordered" v-if="store.userList && store.userList.length">
            <thead class="table-light text-dark text-center text-uppercase">
                <tr>
                    <th>Tên đăng nhập</th>
                    <th>Họ tên</th>
                    <th>Ảnh</th>
                    <th>Phân quyền</th>
                    <th v-if="store.isInheritance && store.isLayer" class="hide"></th>
                    <th v-else>Hành động</th>
                </tr>
            </thead>
            <tbody class="list form-check-all">
                <tr v-for="(item, index) in store.userList" :key="index" class="form__user-data">
                    <td>
                        {{ item.user.username }}
                    </td>
                    <td>
                        {{ item.user.last_name }} {{ item.user.first_name }}
                    </td>
                    <td>
                        <img :src="item.user.photo" alt="" width="80">
                    </td>
                    <td>
                        <p>
                            {{ getRoleName(item.permissions) }}
                        </p>
                        <div class="my-3 form-check-value hide">
                            <!-- Inline Checkbox -->
                            <div class="form-check form-check-inline">
                              <input class="form-check-input me-2" type="checkbox" value="0" @click="changePermission($event)"/>
                              <label class="form-check-label">Xem</label>
                            </div>
                            <div class="form-check form-check-inline">
                              <input class="form-check-input me-2" type="checkbox" value="1" @click="changePermission($event)"/>
                              <label class="form-check-label" >Thêm</label>
                            </div>
                            <div class="form-check form-check-inline">
                              <input class="form-check-input me-2" type="checkbox" value="2" @click="changePermission($event)"/>
                              <label class="form-check-label" for="inlineCheckbox3">Sửa</label>
                            </div>
                            <div class="form-check form-check-inline">
                              <input class="form-check-input me-2" type="checkbox" value="3" @click="changePermission($event)"/>
                              <label class="form-check-label" for="inlineCheckbox3">Xoá</label>
                            </div>
                          </div>
                    </td>
                    <td v-if="store.isInheritance && store.isLayer" class="hide">
                    </td>
                    <td v-else>
                        <div class="dropdown table__action-group text-center">
                            <button
                                class="btn btn-soft-secondary btn-sm dropdown" type="button" data-bs-toggle="dropdown"
                                aria-expanded="false"><i class="mdi mdi-dots-vertical"></i></button>
                            <ul class="dropdown-menu mb-0">
                                <li @click="deleteAllPermission(item.user.id)">
                                    <a class="dropdown-item" href="#" target="_self">
                                        <i class="ri-delete-bin-line align-bottom me-2 text-muted"></i>
                                         Xóa
                                    </a>
                                </li>
                                <li @click="deletePermissionRole($event, item.permissions)">
                                    <a class="dropdown-item" href="#" target="_self">
                                        <i class="ri-delete-bin-line align-bottom me-2 text-muted"></i>
                                         Chỉnh sửa
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="action-group hide">
                            <button class="btn btn-sm btn-success" @click="SaveChange($event, item.user.id)">Lưu</button>
                            <button class="btn btn-sm btn-danger mx-3" @click="CancelChange($event)">Huỷ</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, defineProps, onMounted, reactive } from 'vue'
import { useFolderStore } from '../../state/folder';
import { BASE_URL } from '../../helpers/api/axiosHttp';
import UserRole from './UserRole.vue';
import apiRequest from '../../helpers/api/folderApi'
import { errorToast, successToast } from '../../helpers/api/toastStyle';
const store = useFolderStore();
const choseRole = ref(false);
const permission = ref('');
const inheritantParent = ref(false);
const props = defineProps({
    isInheritance: Boolean
})

const getRoleName = (permission) => {
    const roleNames = [];
    for (const item of permission) {
        switch (item) {
            case 0:
                roleNames.push("Xem");
                break;
            case 1:
                roleNames.push("Thêm");
                break;
            case 2:
                roleNames.push("Sửa");
                break;
            case 3:
                roleNames.push("Xoá");
                break;
            default:
                break;
        }
    }
    return roleNames.join(", ");
}

const deletePermissionRole = (event, permissions) => {
    const formcheck = event.target.closest('.form__user-data');
    hideEdit(formcheck);
    formcheck.querySelectorAll('.form-check-input').forEach(el => {
        for(let permission of permissions) {
            console.log(permission);
            if(el.value == permission) {
                el.setAttribute('checked', 'checked')
            }
        }
    })
}

const hideEdit = (el) => {
    el.querySelector('.action-group').classList.remove('hide');
    el.querySelector('.table__action-group').classList.add('hide');
    el.querySelector('.form-check-value').classList.remove('hide');
    el.querySelector('.form-check-value').previousElementSibling.classList.add('hide');
}

const showEdit = (el) => {
    el.querySelector('.action-group').classList.add('hide');
    el.querySelector('.table__action-group').classList.remove('hide');
    el.querySelector('.form-check-value').classList.add('hide');
    el.querySelector('.form-check-value').previousElementSibling.classList.remove('hide');
}

const CancelChange = (event) => {
    const formcheck = event.target.closest('.form__user-data');
    showEdit(formcheck);
}

const SaveChange = async (event, userId) => {
    const formcheck = event.target.closest('.form__user-data');
    let permissionRemove = [];
    let permissionAddMore = [];
    formcheck.querySelectorAll('.form-check-input').forEach(item => {
        if(item.getAttribute('checked') == null) {
            permissionRemove.push(parseInt(item.value));
        } else {
            permissionAddMore.push(parseInt(item.value));
        }
    });
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
    if(store.isLayer && permissionAddMore.length > 0 ) {
        memberRoles.layer = store.modelId;
        memberRoles.data.push({
            user: userId,
            permissions: permissionAddMore
        })

        try {
            const response = await apiRequest.addLayerPermission(memberRoles);
            if(response.status === 200) {
                successToast('Chỉnh sửa thành công')
            } else {
                errorToast('Lỗi mời xem lại')
            }
            store.getListPermissionMember(memberRoles.layer);
            showEdit(formcheck);
        } catch (error) {
            console.log(error);
        }
       
    } else {
        memberRoles.folder = store.currentFolder;
        memberRoles.data.push({
            user: userId,
            permissions: permissionAddMore
        })
        try {
            const response = await apiRequest.addFolderPermission(memberRoles);
            if(response.status === 200) {
                successToast('Chỉnh sửa thành công')
            } else {
                errorToast('Lỗi mời xem lại')
            }
            console.log(memberRoles);
            store.getListPermissionMember(memberRoles.folder);
            showEdit(formcheck);
        } catch (error) {
            console.log(error);
        }
        
    }

    if(store.isLayer && permissionRemove.length >  0) {
        const newForm = new FormData();
        newForm.append('layer', store.modelId);
        newForm.append('user', userId);
        newForm.append('permissions', JSON.stringify(permissionRemove));
        newForm.append('type', 'DELETE');
        try {
            const response = await apiRequest.addLayerPermission(newForm);
            if(response.status === 200) {
                successToast('Chỉnh sửa thành công')
            } else {
                errorToast('Lỗi mời xem lại')
            }
            console.log(permissionRemove);
            store.getListPermissionMember(store.modelId);
            showEdit(formcheck);
        } catch (error) {
            console.log(error);
        }
       
    } else {
        const newForm = new FormData();
        newForm.append('folder', store.currentFolder);
        newForm.append('user', userId);
        newForm.append('permissions', JSON.stringify(permissionRemove));
        newForm.append('type', 'DELETE');
        try {
            const response = await apiRequest.addFolderPermission(newForm);
            if(response.status === 200) {
                successToast('Chỉnh sửa thành công')
            } else {
                errorToast('Lỗi mời xem lại')
            }
            console.log(permissionRemove);
            store.getListPermissionMember(store.currentFolder);
            showEdit(formcheck);
        } catch (error) {
            console.log(error);
        }
        
    }
}

const changePermission = (event) => {
    if(event.target.checked) {
        event.target.setAttribute('checked','checked')
    } else {
        event.target.removeAttribute('checked')
    }
}

const deleteAllPermission = async (userId) => {
    if(store.isLayer) {
        const newForm = new FormData();
        newForm.append('layer', store.modelId);
        newForm.append('user', userId);
        newForm.append('permissions', [0,1,2,3]);
        newForm.append('type', 'DELETE');
        try {
        const response = await apiRequest.addLayerPermission(newForm);
        if(response.status === 200) {
            successToast('Xoá thành công')
        } else {
            errorToast('Lỗi mời xem lại')
        }
        store.getListPermissionMember(store.modelId);
    } catch (error) {
        console.log(error);
    }
    } else {
        const newForm = new FormData();
        newForm.append('folder', store.currentFolder);
        newForm.append('user', userId);
        newForm.append('permissions', [0,1,2,3]);
        newForm.append('type', 'DELETE');
        try {
            const response = await apiRequest.addFolderPermission(newForm);
            if(response.status === 200) {
                successToast('Xoá thành công')
            } else {
                errorToast('Lỗi mời xem lại')
            }
            store.getListPermissionMember(store.currentFolder);
        } catch (error) {
            console.log(error);
        }
    }
}

const setPermissionAsParents = async(event) => {
    if(event.target.checked) {
        try {
            const response = await apiRequest.updateFile(store.modelId, store.slug, {
                inheritance_permissions: true
            });
            
            if(response.status === 200) {
                successToast('Kế thừa thư mục cha thành công');
                store.getDataStructure(store.modelId, store.slug);
            } else {
                errorToast('Lỗi mời xem lại')
            }
            
        } catch (error) {
            console.log(error);
        }
    } else {
        try {
            const response = await apiRequest.updateFile(store.modelId, store.slug, {
                inheritance_permissions: false
            });
            store.userList = [];

            if(response.status === 200) {
                successToast('Huỷ kế thừa thư mục cha thành công');
                store.getDataStructure(store.modelId, store.slug);
            } else {
                errorToast('Lỗi mời xem lại')
            }
        } catch (error) {
            console.log(error);
        }
    }
}


</script>