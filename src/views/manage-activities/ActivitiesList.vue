<template>
    <Layout  :address="address" :items="address.details" chooseMenu="hoat-dong" :slug="props.slug">
        <b-card-body>
            <b-card>
                <div class="col-3 mb-3">
                    <SearchActivities :api-url='urlSearch' @get-search-data="handleSearch"/>
                </div>
                <div>
                    <table  class="table align-middle table-striped table-bordered" v-if="store.dataDetails.length">
                        <thead class="table-light text-dark text-center text-uppercase">
                            <tr >
                                <th>Tiêu đề</th>
                                <th>Mô tả</th>
                                <th>Loại hoạt động</th>
                                <th>Hình ảnh</th>
                                <th>Tệp tin</th>
                                <th>Ngày tạo</th>
                                <th>Ngày cập nhật</th>
                                <th>Người cập nhật</th>
                                <th>Người tạo</th>
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
                
                                        <li class="list-inline-item" @click="deleteActivity(item.id)">
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
            </b-card>
        </b-card-body>

    </Layout>
</template>

<script setup>
    import { defineProps, watch, toRef, computed, ref, onMounted } from 'vue';
    import { useFolderStore } from '../../state/folder'
    import { useActivitiesStore } from '../../state/activities'
    import Layout from '../../layouts/main.vue'
    import apiRequest from '../../helpers/api/activitiesApi'
    import SearchActivities from '../../components/manage-activities/SearchActivities.vue';
    const folderStore = useFolderStore();
    const store = useActivitiesStore();
    import { BASE_URL} from '../../helpers/api/axiosHttp';
    import { useRoute, useRouter } from 'vue-router';
    import Swal from 'sweetalert2';
    const router = useRouter();
    const route = useRoute();
    folderStore.getSlug();
    const inputVal = ref('');
    const searchData = ref([]);


    const handleSearch = (value) => {
        store.dataDetails = value.results;
    }

    const urlSearch = computed(() => {
        return  `${BASE_URL}/api/${folderStore.slug}/activity?id_record=${route.params.id}&`;
    });

    const props = defineProps({
    slug: {
      type: String,
      default: "sipm-base",
    },
    nameKCN: {
      type: String,
      default: "KHU CÔNG NGHIỆP",
    },
  });
  
     const address = ref({
        title: props.nameKCN,
        details: [{ name: "Quản lý hoạt động", to: `${props.slug}ManageActivities` }],
  });

    const deleteActivity = async (id) => {
        Swal.fire({
            title: 'Bạn có muốn xoá không?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Không',
            confirmButtonText: 'Đồng ý'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiRequest.deleteActivity(folderStore.slug, id);
                 if (response.status === 204) {
                    Swal.fire(
                        {
                            title: 'Đã xoá!',
                            icon: 'success'
                        }
                    );
                    store.viewDetailData(folderStore.slug, route.params.id);
                }
            }
        })
    }

    onMounted(() => {
        store.viewDetailData(folderStore.slug , route.params.id);
    })
    
</script>