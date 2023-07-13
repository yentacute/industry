<template>
    <div>
        <h4 class="mb-3 d-flex fz-14 fw-600 ">Bảng dữ liệu</h4>
        <div>
            <table class="table align-middle table-striped table-bordered">
                <thead class="table-light text-dark text-center text-uppercase">
                    <tr>
                        <th>STT</th>
                        <th v-for="(data, key) in  store.tableData" class="table__data-name" data-sort="currency_name"
                            scope="col" :key="key" :data-type="data.data_type" :data-name="data.name" ref="fieldName"
                            :class="{ 'hide': data.name === 'geom' || data.name === 'id' }">
                            {{ data.name }}
                        </th>

                        <th scope="col">Hành động</th>
                    </tr>
                </thead>
                <tbody class="list form-check-all">
                    <tr v-for="(item, index) in store.databaseArr" :key="index" class="table__data-view" id="my-table"
                        v-if="store && store.databaseArr && store.databaseArr.length">
                        <td>
                            {{ index + 1 }}
                        </td>
                        <td v-for="(value, key) of item" :key="key" class="table__data-info">
                            <input type="text" v-if="key !== 'id' && key !== 'geom'" :id="key"
                                :value="value" @input="editDataInput[key] = $event.target.value" />
                            <span v-if="key !== 'id' && key !== 'geom'"
                                class="table__data-field-name">
                                {{ value }}
                            </span>
                        </td>
                        <td>
                            <div class="dropdown text-center">
                                <button class="btn btn-soft-secondary btn-sm dropdown" type="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="mdi mdi-dots-vertical"></i>
                                </button>
                                <ul class="dropdown-menu mb-0 ">
                                    <li @click="getRecordId(Object.values(item)[0])">
                                        <b-link class="dropdown-item"
                                            data-bs-toggle="modal" data-bs-target="#modalAddNewActivities">
                                            <i class="ri-eye-line"></i>
                                            Thêm mới
                                        </b-link>
                                    </li>
                                    <li>
                                        <router-link class="dropdown-item" :to="{ name: `${store.slug}ActivityDetail`, params: { id: Object.values(item)[0] }}">
                                            <i class="mdi mdi-cube-scan"></i>
                                            Xem chi tiết
                                        </router-link>
                                    </li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                    <tr v-else>
                        <span>Không có dữ liệu</span>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="d-flex justify-content-end mt-3" v-if="store.totalObject > 10">
            <div class="pagination-wrap hstack gap-2">
                <Pagination :page-size="store.pageSize" :total="store.totalObject" :callback="pageChanged"></Pagination>
            </div>
        </div>
        <ModalActivities/>
        <!-- <ModalActivitiesDetails/> -->
    </div>
</template>

<script setup>
import { defineProps, onMounted, ref, reactive, computed, watch, inject } from 'vue';
import { useFolderStore } from '../../state/folder';
import apiRequest from '../../helpers/api/folderApi';
import apiActivities from '../../helpers/api/activitiesApi'
import Swal from 'sweetalert2';
import { successToast, errorToast } from '../../helpers/api/toastStyle';
import Pagination from '../../components/Pagination.vue'
import ModalCommon from '../ModalCommon.vue';
import ModalActivities from './ModalActivities.vue';
import { useActivitiesStore} from '../../state/activities'
import ModalActivitiesDetails from './ModalActivitiesDetails.vue';
import { useRouter } from 'vue-router';
const activitiesStore = useActivitiesStore();
const store = useFolderStore();
const editDataInput = reactive({});
const handleDraw = ref(null);
const fieldName = ref();

const router = useRouter();

const getRecordId = (id) => {
    activitiesStore.recordId = id;
}

async function pageChanged(page) {
  try {
    const { data } = await apiRequest.get(store.apiDatabase + `?page=${page}`);
    store.databaseArr = data.results;
  } catch (error) {
    console.log(error);
  }
}

store.getSlug();


onMounted(() => {
})
</script>