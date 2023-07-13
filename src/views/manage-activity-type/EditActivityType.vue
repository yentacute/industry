<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import Layout from "../../layouts/main.vue";
import apiRequest from "../../helpers/api/activitiesApi";
import { useRoute, useRouter } from "vue-router";
import { errorToast, successToast } from "../../helpers/api/toastStyle";
import { useFolderStore } from "../../state/folder";
const store = useFolderStore();
store.getSlug();
const activityType = reactive({});

const route = useRoute();
const router = useRouter();

const getData = async() => {
    try {
        const { data } = await apiRequest.getActivityTypeId(store.slug, route.params.id);
        activityType.name = data.name;
        activityType.description = data.description;
    } catch (error) {
        console.log(error);
    }
}

const handleSubmit = async () => {
    const newForm = new FormData()
    newForm.append('name', activityType.name);
    newForm.append('description', activityType.description);
    try {
        const response = await apiRequest.editActivityType(store.slug, route.params.id, newForm);
        if(response.status === 200) {
            successToast('Chỉnh sửa thành công');
            router.push(`/${store.slug}/manage-activity-type`)
        } else {
            errorToast('Lỗi mời xem lại')
        }
    } catch (error) {
        console.log(error);
    }
}

onMounted(() => {
    getData();
})

</script>

<template>
  <Layout :items="items" :address="address" chooseMenu="hoat-dong">
    <div class="page-main__content" ref="containerContent">
      <form id="user-manage">
        <b-card no-body>
          <b-card-header class="d-flex">
            <h5 class="card-title flex-grow-1">
                Cập nhật loại hoạt động
            </h5>
            <router-link :to="{ name: `${store.slug}ManageActivitiesType` }" type="button" v-b-tooltip.hover title="Đóng"
              class="flex-shrink-0 btn btn-ghost-primary btn-close flex-shrink-0"></router-link>
          </b-card-header>
          <b-card-body>
            <b-row class="g-3">
                <b-col class="mb-3">
                    <label for="fnameInput" class="form-label mb-1">Tên loại hoạt động <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="fnameInput" placeholder="Nhập tên loại hoạt động"
                        name="name" v-model="activityType.name" />
                    </b-col>
            </b-row>
            <b-row class="g-3">
                <b-col>
                    <label for="lnameInput" class="form-label mb-1">Mô tả</label>
                    <textarea name="" id="" cols="30" rows="10" class="form-control" placeholder="Nhập mô tả"  v-model="activityType.description" ></textarea>
                </b-col>
            </b-row>
          </b-card-body>
          <b-card-footer>
            <div class="hstack gap-2">
              <b-button variant="danger" type="reset">Hủy</b-button>
              <b-button variant="success" type="submit" @click.prevent="handleSubmit">Lưu
              </b-button>
            </div>
          </b-card-footer>
        </b-card>
      </form>
    </div>
  </Layout>
</template>
