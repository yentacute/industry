<script>
import { ref } from 'vue';
import { successToast, errorToast } from '../../../../../helpers/api/toastStyle';
import apiRequest from '../../../../../helpers/api/folderApi'
import { useActivityStore } from "../../../../../state/map_control/publicLayer.js"
export default {
    props: {
    },
    data: function () {
        return {
        }
    },
    setup: function () {
        const activityStore = useActivityStore()
        return { activityStore };
    },
    components: {},
    mounted: function () {
        this.activityStore.getObjectActivity()
    },
    methods: {
        toggleActivityModal: function () {
            this.$emit('toggleActivityModal')
        }
    },
};
</script>

<template>
    <div class="modal fade bs-example-modal-lg show" tabindex="-1" aria-labelledby="myLargeModalLabel"
        style="display: block;" aria-modal="true" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="myLargeModalLabel">Xem chi tiết hoạt động của đối tượng</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                        @click="toggleActivityModal()"></button>
                </div>
                <div class="modal-body">
                    <div class="table-responsive">
                        <table class="table align-middle table-striped table-bordered" v-if="activityStore.dataDetails.length">
                            <thead class="table-light text-dark text-center text-uppercase">
                                <tr>
                                    <th> Tiêu đề </th>
                                    <th> Mô tả </th>
                                    <th> Hoạt động </th>
                                    <th> Hình ảnh </th>
                                    <th> Tệp tin </th>
                                    <th> Ngày tạo </th>
                                    <th> Ngày cập nhật </th>
                                </tr>
                            </thead>
                            <tbody class="list form-check-all">
                                <tr v-for="(item, key) in activityStore.dataDetails" :key="key">
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
                                        {{ String(item.file).slice(0, 30) }}
                                    </td>
                                    <td class="text-right">
                                        {{ item.created_date.split('T')[0] }}
                                    </td>
                                    <td class="text-right">
                                        {{ item.updated_date.split('T')[0] }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-else>
                            <span>Không có dữ liệu</span>
                        </div>
                    </div>
                </div>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</template>

