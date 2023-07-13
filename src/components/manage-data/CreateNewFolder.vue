<template>
    <Form @submit="onSubmit(folderData)"
    :validation-schema="schema">
        <div class="new-folder-form">
            <div class="form-group">
                <i class="mdi mdi-folder"></i>
                <Field name="name" type="text" v-model="folderData.name" class="new-folder-name" />
            </div>
            <ErrorMessage name="name" as="div" class="error-message"/>
        </div>
    </Form>
</template>

<script setup>
    import { ref, reactive, onMounted, nextTick   } from 'vue';
    import { useFolderStore } from '../../state/folder';
    import apiRequest from '../../helpers/api/folderApi';
    import { Field, ErrorMessage, Form } from 'vee-validate';
    import * as Yup from 'yup';
import { errorToast } from '../../helpers/api/toastStyle';

    const store = useFolderStore();
    const folderData = reactive({
        name: 'New Folder',
        parent: store.currentFolder,
        tags: [],
        public: true
    });

    const selectInputValue  = () => {
        const selectInput = document.querySelector('.new-folder-name');
        selectInput.select();
    }

    const schema = Yup.object().shape({
        name: Yup.string().required().test('name', 'Tên đã tồn tại', async function(value) {
                            if (!value) {
                                return true; // If value is empty, don't perform validation
                            }
                            const { data }  = await apiRequest.checkExistData(`/${store.slug}/folder?q=${value}&all`);
                            if(data.length) {
                                throw new Yup.ValidationError('Tên đã tồn tại', null, 'name');
                            }
                            return true; // Validation passed
                        }),
    });

    async function onSubmit(folderData) {
      try {
            const { data } = await apiRequest.create(store.slug,folderData);
            store.primaryFolder.push(data)
            store.clickToAddFolder = false;
            folderData.name = 'New Folder';
            store.getAllFolder();
        } catch (error) {
            if(error.response.status === 403) {
                errorToast('Bạn không có quyền tạo thư mục trong thư mục này');
                document.querySelector('.new-folder-form ').style.display = 'none';
            }

        }
    }

    
    onMounted(() => {
        selectInputValue();
    });

</script>