<template>
    <ModalCommon title="Tạo model copy" size="modal-xl" id-name="AddModalFormCopy">
        <div class="select__model">
            <vSelect :options="store.select2Options" placeholder="Mời chọn model" class="style-chooser" v-model="store.modelSelect"></vSelect>
          </div>
         
        <Form @submit="onSubmit" :initial-values="model"
            :validation-schema="schema">
            <div class="row align-items-center mb-3">
                <div class="col-2">
                    <Field name="modelname" type="text" class="form-control mb-3" v-model="model.modelname" placeholder="Tên model"/>
                    <ErrorMessage name="modelname" as="div" class="error-message"/>
                </div>
                <div class="col-2">
                    <Field name="name_display" type="text" class="form-control mb-3" v-model="model.name_display" placeholder="Tên hiển thị"/>
                    <ErrorMessage name="name_display" as="div" class="error-message"/>
                </div>
                <div class="col-auto">
                    <label for="use_uuid">use_uuid</label>
                    <input name="use_uuid" type="checkbox" class="form-check-input mx-2 mb-3" v-model="model.use_uuid"/>
                </div>
                <div class="col-auto">
                    <label for="use_object3d">use_object3d</label>
                    <input name="use_object3d" type="checkbox" class="form-check-input mx-2  mb-3" v-model="model.use_object3d"/>
                </div>
                <div class="col-3">
                    <input type="text" v-model="model.tags" class="form-control mb-3" placeholder="Tags">
                </div>
                <div>
                    <textarea name="description" class="form-control mb-3" v-model="model.description" placeholder="Miêu tả" rows="4" />
                </div>
            </div>

            <div class="dynamic-form row align-items-start" v-for="(item, index) in model.fields" :key="index">
                <div class="col-2">
                    <Field :id="`name_${index}`" :name="`fields[${index}].name`" v-if="specialDataType.includes(item.data_type)" type="text" v-model="item.name"  class="form-control" disabled/>
                    <Field :id="`name_${index}`" :name="`fields[${index}].name`"  v-else type="text" class="form-control mb-2" v-model="item.name" placeholder="Field name"/>
                    <ErrorMessage :name="`fields[${index}].name`" as="div"  class="error-message"/>
                    <ErrorMessage name="fields" as="div"  class="error-message"/>
                </div>

                <div class="col-2">
                    <Field :id="`data_type_${index}`"  :name="`fields[${index}].data_type`" class="form-select mb-2" as="select" v-model="item.data_type" @change="changeDataType(item)">
                        <option value="" disabled selected>Select your option</option>
                        <option value="character">Character</option>
                        <option value="text">Text</option>
                        <option value="integer">Integer</option>
                        <option value="float">Float</option>
                        <option value="boolean">Boolean</option>
                        <option value="date">Date</option>
                        <option value="point">Point</option>
                        <option value="linestring">Line</option>
                        <option value="polygon">Polygon</option>
                        <option value="multipolygon">Multipolygon</option>
                        <option value="json">Json</option>
                        <option value="foreignkey">ForeignKey</option>
                    </Field>
                    <ErrorMessage :name="`fields[${index}].data_type`" as="div" class="error-message"/>
                </div>

                <div class="col-2" v-if="item.data_type === 'character'">
                    <Field :name="`fields[${index}].max_length`" :id="`max_length${index}`" type="text" class="form-control mb-2" placeholder="Max length" v-model="item.max_length"/>
                    <ErrorMessage :name="`fields[${index}].max_length`"  as="div"  class="error-message" />
                </div>
            
                <div class="col-2">
                    <Field :name="`fields[${index}].verbose_name`" :id="`verbose_name_${index}`" type="text" v-model="item.verbose_name" class="form-control mb-2" placeholder="Verbose name"/>
                </div>

                <div class="col-auto form-check form-check-outline form-check-danger mt-2">
                    <label for="checkbox-null">Null</label>
                    <Field :name="`fields[${index}].null`" :id="`null_${index}`" type="checkbox" class="form-check-input mb-2" :value="true"
                    :unchecked-value="false" v-model="item.null"/>
                </div>

                <div class="col-auto form-check form-check-outline form-check-danger mt-2">
                    <label for="checkbox-blank">Blank</label>
                    <Field :name="`fields[${index}].blank`" :id="`blank_${index}`" type="checkbox" class="form-check-input mb-2" :value="true"
                    :unchecked-value="false" v-model="item.blank"/>
                </div>
                <div class="col-auto form-check form-check-outline form-check-danger mt-2">
                    <label for="">Unique</label>
                    <Field :name="`fields[${index}].unique`" :id="`unique_${index}`" type="checkbox" class="form-check-input mb-2" :value="true"
                    :unchecked-value="false" v-model="item.unique"/>
                </div>

                <div class="col-auto d-flex">
                    <b-button variant="outline-primary" class="add-new-field mx-2 mb-2" @click="addNewField"><i class="mdi mdi-plus"></i></b-button>
                    <b-button variant="outline-danger" class="add-new-field mx-2 mb-2" @click="removeField(index)"><i class="mdi mdi-minus"></i></b-button>
                </div>
            </div>
            <div class="modal-footer v-modal-footer">
                <b-button type="button" variant="light" data-bs-dismiss="modal">Close
                </b-button>
                <b-button type="submit" variant="primary">Lưu</b-button>
            </div>
        </Form>
    </ModalCommon>
</template>

<script setup>

    import { ref, reactive, onMounted, defineProps, watch } from 'vue';
    import { Field, Form, ErrorMessage, FieldArray } from 'vee-validate';
    import { useFolderStore } from '../../state/folder';
    import apiRequest from '../../helpers/api/folderApi';
    import apiModelRequest from '../../helpers/api/modelApi';
    import * as yup from 'yup';
    import vSelect from "vue-select";
    import ModalCommon from '../ModalCommon.vue';
    import "vue-select/dist/vue-select.css";
    
    

    //call store use pinia
    const store = useFolderStore();
    //define props 
    const props = defineProps({
        folderId: String
    });

  //define model variable like define in option data data() {...}
    const model = reactive(       
        {
            modelname:'',
            name_display: '',
            use_uuid: true,
            use_object3d: true,
            parent: props.folderId,
            description: null,
            tags: '',
            fields: [
                {
                    name: '',
                    data_type: '',
                    max_length: null,
                    null: false,
                    blank: false,
                    unique: false,
                    verbose_name: '',
                    default: null
                }
            ]
        } 
    );

    //submit form
    function onSubmit() {
        //convert max_length to number
        model.fields = model.fields.map(field => ({ ...field, max_length: +field.max_length }));
        store.submitDataFile(`${store.slug}/create-model`, model);
        store.closeModel();
    }

    //validate form 
    const schema = yup.object().shape({
        modelname: yup.string()
                        .required('Mời nhập tên model')
                        .matches(/^[A-Z][a-zA-Z]*$/, 'Tên model không bao gồm số, kỹ tự đặc biệt, Viết hoa chữ cái đầu')
                        .test('modelname', 'Tên model đã tồn tại', async function(value) {
                            if (!value) {
                                return true; // If value is empty, don't perform validation
                            }
                            const { data }  = await apiRequest.checkExistData(`/${store.slug}/check-exists?q=${value}`);
                            if(data.status === false) {
                                throw new yup.ValidationError('Tên model đã tồn tại', null, 'modelname');
                            }
                            return true; // Validation passed
                        }),
        fields: yup
                .array()
                .of(
                    yup.object().shape({
                        name: yup.string()
                                .when('geom', {
                                    is: (value) => value !== true,
                                    then:() =>  yup.string()
                                        .required('Mời nhập tên field')
                                        .notOneOf(['id', 'object3d'], 'Không được đặt tên này')
                                        .matches(/^[a-zA-Z_]+$/g, 'Tên model không bao gồm số, kỹ tự đặc biệt'),
                                    otherwise: yup.string().notRequired()
                                }),
                        data_type: yup.string().required('Mời chọn data type'),
                        max_length: yup.mixed().when('data_type', {
                            is: (value) => value === 'character',
                            then:() => yup.mixed().required('Mời nhập độ dài ký tự').typeError('Mời nhập số'),
                            otherwise: () => yup.number().notRequired()
                        })
                    })
                ).test('unique', 'Không được trùng tên', function (value) {
                        return value.every((field, index) => {
                        const currentFieldName = field.name;
                        const isUnique = value.slice(0, index).every((otherField) => {
                        return otherField.name !== currentFieldName;
                        });
                        return isUnique;
                    });
                })
    
    });
    //validate form 

    const specialDataType = ['point', 'linestring', 'polygon', 'multipolygon'];

    //change name is geom when data_type is character
    function changeDataType(item) {
        specialDataType.includes(item.data_type) ? item.name = 'geom': item.name = '';
    }

    // add new field 
    function addNewField() {
        model.fields.push({
                name: '',
                data_type: '',
                max_length: null,
                null: true,
                blank: true,
                unique: false,
                verbose_name: ''
            }
        )
    }
    //remove field in fields array
    function removeField(index) {
        model.fields.splice(index, 1)
    }

    watch(() => props.folderId, (newVal) => {
        model.parent = newVal
    });

    watch(() => store.modelSelect, async (newVal) => {
        if(newVal) {
            try {
                const { data } = await apiModelRequest.get(newVal.id, store.slug);
                model.description = data.description
                model.fields = data.construct.fields
            } catch (error) {
                console.log(error);
            }
        }
    })

    onMounted( () => {
        store.getAllModel();
        store.getSlug();
    })


</script>




