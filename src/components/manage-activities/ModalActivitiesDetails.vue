<template>
    <div class="row">
        <div class="col-3 mb-3">
            <Search :api-url='urlSearch' @get-search-value="handleSearch"/>
        </div>
        <div class="table-responsive">
            <table  class="table align-middle table-striped table-bordered" v-if="store.dataDetails.length">
                <thead class="table-light text-dark text-center text-uppercase">
                    <tr >
                        <th v-for="(value, key) in Object.keys(store.dataDetails[0])" :key="key" :class="{'hide': value === 'target' || value === 'id'}">
                            {{ value }}
                        </th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody class="list form-check-all">
                    <tr  v-for="(item, key) in store.dataDetails" :key="key">
                        <td class="text-right">
                            {{ item.title }}
                        </td>
                        <td class="text-right">
                            {{ item.description }}
                        </td>
                        <td class="text-right">
                            {{ item.activity_type.name }}
                        </td>
                        <td class="text-right">
                            <img :src="item.image" alt="" width="100">
                        </td>
                        <td class="text-right">
                            {{ String(item.file).slice(0,30) }}
                        </td>
                        <td class="text-right">
                            {{folderStore.formatDate(item.created_date)  }}
                        </td>
                        <td class="text-right">
                            {{ folderStore.formatDate(item.updated_date) }}
                        </td>
                        <td class="text-right">
                            {{ item.updated_by?.username }}
                        </td>
                        <td class="text-right">
                            {{ item.created_by?.username }}
                        </td>
                        <td>
                            <ul class="list-inline hstack gap-3 mb-0 justify-content-center">
                                <li class="list-inline-item">
                                    <router-link class="link-success fs-15" 
                                        :to="{ name: `${folderStore.slug}ManageActivitiesEdit`, params: { id: item.id }}">
                                        <i class="ri-edit-2-line"></i>
                                    </router-link>
                                </li>
        
                                <li class="list-inline-item" @click="store.deleteActivity(item.id)">
                                <b-link class="link-danger fs-15" v-b-tooltip.hover title="Xóa">
                                    <i class="ri-delete-bin-line"></i>
                                </b-link>
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else>
                <span>Không có dữ liệu</span>
            </div>
        </div>
        <div class="col-6">
        </div>
    </div>
</template>

<script setup>
    import { defineProps, watch, toRef, computed } from 'vue';
    import ModalCommon from '../ModalCommon.vue';
    import { useFolderStore } from '../../state/folder'
    import { useActivitiesStore } from '../../state/activities'
    import Spinner from '../Spinner.vue'
    import Search from '../Search.vue';
    const folderStore = useFolderStore();
    const store = useActivitiesStore();
    import { BASE_URL} from '../../helpers/api/axiosHttp';
    const urlSearch = BASE_URL + `/${folderStore.slug}/activity?type=search&q=dfdf`;
    const handleSearch = (value) => {
        console.log(value);
    }
</script>
