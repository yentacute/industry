import { defineStore } from 'pinia';
import { ref, reactive  } from 'vue';
import apiRequest from '../helpers/api/folderApi';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import Swal from "sweetalert2";
import { successToast, errorToast } from '../helpers/api/toastStyle'
import XLSX from "xlsx"
import { data, methods_map } from '../../src/state/map_control/data_map';
import { fitBounds } from '../../src/common/map/function_map';
import { warningToast } from '../../src/helpers/api/toastStyle';
import { map, pick, transform } from 'lodash';


export const useFolderStore = defineStore('folder', () => {
    const listFolders = ref([]);
    const listPinFolders = ref([])
    const primaryFolder = ref([]);
    const folderId = ref();
    const modelId = ref('');
    const currentFolder = ref('');
    const clickToAddFolder = ref(false);
    const currentId = ref()
    const viewMode = ref(false);
    const modalDatabase = ref(false);
    const modalDatabaseCopy = ref(false);
    const showRightmenu = ref(false);
    const editAction = ref(false);
    const openDataDetails = ref(false);
    const dataStructure = ref({});
    const tableData = ref([]);
    const apiDatabase = ref('');
    const databaseArr = ref([]);
    const listName = ref({});
    const addNewBtn = ref(false);
    const importModel = ref(false)
    const isLoading = ref(false);
    const currentType = ref('');
    const totalPages = ref(1);
    const totalObject = ref(0);
    const currentPage = ref(1);
    const pageSize = ref(10)
    const currentPageNumber = ref(1)
    const wmsInfo = ref({})
    const layerOverlays = ref([])
    const currentModelUrl = ref('');
    const searchModelUrl = ref('');
    const modelData = ref([]);
    const select2Options = ref([]);
    const modelSelect = ref('');
    const tags = ref('');
    const description = ref('');
    const nameDisplay = ref('');
    const isInfoTab = ref(true);
    const editInfo = ref(false)
    const slug = ref('');
    const isHasOjbect3D = ref(false);
    const formDataInput = ref({});
    const layerDataId = ref(null)
    const memberListChoose = ref([])
    const checkedMembers = ref([])
    const modalAddMember = ref(false)
    const dataPath = ref('');
    const allowSetRoles = ref(false);
    const isLayer = ref(false);
    const userList = ref([]);
    const currentUser= ref({});
    const allowAdd = ref(false);
    const allowEdit = ref(false);
    const allowDelete = ref(false);
    const allowView = ref(false);
    const userDatas = ref([])
    const errorGetUser = ref(false)
    const errorMessage = ref('');
    const errorDelete = ref(null);
    const isInheritance = ref(false);
    const currentUserRole = ref('')
    


    const getListPermissionMember = async (id, isInheritance) => {
        if(isLayer.value) {
            if(isInheritance) {
                try {
                    const { data } = await apiRequest.get(`/permission-folder?folder=${id}`);
                    userList.value = data;
                    if(data.msg) {
                        errorMessage.value = data.msg;
                    }
                  } catch (error) {
                    console.log(error);
                  }
            } else {
                try {
                    const { data } = await apiRequest.get(`/permission-model-dynamic?layer=${id}`);
                    userList.value = data;
                    if(data.msg) {
                        errorMessage.value = data.msg
                    }
                  } catch (error) {
                    console.log(error);
                  }
            }

        } else {
          try {
            const { data } = await apiRequest.get(`/permission-folder?folder=${id}`);
            userList.value = data;
            if(data.msg) {
                errorMessage.value = data.msg
            }
          } catch (error) {
            console.log(error);
          }
        }
      };


      const getCurrentUserData = async () => {
        const { data } = await apiRequest.get('/user/current-user/');
        currentUser.value = data;
      }
      
    
    const getSlug = () =>{
        const url = window.location.pathname;
        slug.value =  url.split('/')[1];
    }

    const getAllFolder = async () => {
        try {
            const { data } = await apiRequest.getAll(slug.value);
            listFolders.value = data;
        } catch (error) {
            console.log(error)
        }
    }

    const getAllModel = async() => {
        try {
            const { data } = await apiRequest.get(`/${slug.value}/layer/?all`);
            if(data.results !== undefined) {
                modelData.value = data.results;
                const getDataOptions = modelData.value.map(item => {
                    return transform(pick(item, ['id', 'name_display']), (result, value, key) => {
                      if (key === 'id') {
                        result.id = value;
                      } else if (key === 'name_display') {
                        result.label = value;
                      }
                    }, {})
                  });
                select2Options.value = getDataOptions;
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    const submitDataFile = async (url, form) => {
        try {
            const response = await apiRequest.createModel(url, form);
            if (response.status === 201) {
                successToast('Thêm thành công')
                getAllFolder();
            } else {
                errorToast('Lỗi mời xem lại');
            }
        } catch (error) {
            if(error.response.status === 403) {
                errorToast('Bạn không có quyền thêm trong thư mục này.')
            }
            console.log(error);
        }
       
    }

    const onDrop = async (event, item) => {
        const dragId = event.dataTransfer.getData("startDragId");
        const parentId = {
            parent: item.id
        }

        const { data } = await apiRequest.get(`/${slug.value}/folder/${dragId}/`);

        const childrenItems = data.children;
        const foundMatch = childrenItems.some(function (child) {
            return child.id === item.id;
        });

        if (foundMatch) {
            errorToast('Không được di chuyển');
            return false; // return false if a match was found
        }
        const res = await apiRequest.updateFolder(dragId,slug.value, parentId);
        if (res.status == 200) {
            const { data } = await apiRequest.get(`/${slug.value}/folder/${item.id}/`);
            primaryFolder.value = data.children;
            getAllFolder();
        }

    }

    const startDrag = (event, item) => {
        event.dataTransfer.setData("startDragId", item.id);
    }

    const editFolderName = (id, event) => {
        event.preventDefault();
        const currentEl = document.querySelector(`.update-name-${id}`);
        currentEl.style.display = 'inline-block';
        currentEl.select();
        currentEl.nextElementSibling.style.display = 'none'
        showRightmenu.value = false;
    }

    const changeNameFolder = async (id, nameData) => {
        try {
            const response = await apiRequest.updateFolder(id, slug.value, {
                name: nameData,
            });
            if (response.status === 200) {
                successToast('Sửa thành công')
                getAllFolder();
                const currentEl = document.querySelector(`.update-name-${id}`);
                currentEl.style.display = 'none';
                currentEl.nextElementSibling.style.display = 'inline-block'
    
            } else {
                errorToast('Lỗi mời xem lại');
            }
        } catch (error) {
            if(error.response.status === 403) {
                errorToast('Bạn không có quyền sửa thư mục');
            }
        }
       
    }

    const changeNameFile = async (id, nameData) => {
        try {
            const response = await apiRequest.updateFile(id, slug.value,{
                name_display: nameData,
            });
            if (response.status === 200) {
                successToast('Sửa thành công')
                getAllFolder();
                const currentEl = document.querySelector(`.update-name-${id}`);
                currentEl.style.display = 'none';
                currentEl.nextElementSibling.style.display = 'inline-block'
    
            } else {
                errorToast('Lỗi mời xem lại')
            }
        } catch (error) {
            if(error.response.status === 403) {
                errorToast('Bạn không có quyền sửa lớp dữ liệu');
            }
        }
       
    }

    const deleteFolder = (id, type) => {
        // const response
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
                if (type === 'folder') {
                    try {
                        const response = await apiRequest.removeFolder(id, slug.value);
                        if (response.status === 204) {
                            Swal.fire(
                                {
                                    title: 'Đã xoá!',
                                    icon: 'success'
                                }
    
                            );
                            getAllFolder();
                        } else {
                            Swal.fire({
                                title: 'Lỗi kiểm tra lại !',
                                icon: 'error'
                            }
                            )
                        }
                    } catch (error) {
                        if(error.response.status === 400) {
                            errorToast('Bạn không có quyền xoá thư mục')
                        }
                    }
                   
                } else {
                    try {
                        const response = await apiRequest.removeFile(id, slug.value);
                        if (response.status === 204) {
                            Swal.fire(
                                {
                                    title: 'Đã xoá!',
                                    icon: 'success'
                                }
    
                            );
                            getAllFolder();
                        } else {
                            Swal.fire({
                                title: 'Lỗi kiểm tra lại !',
                                icon: 'error'
                            }
                            )
                        }
                    } catch (error) {
                        errorToast('Bạn không có quyền xoá Lớp dữ liệu')
                    }
                   
                }

            }
        })
    };

    const showRightMenu = (event, id, type) => {
        event.preventDefault();
        showRightmenu.value = true;
        currentId.value = id;
        currentType.value = type;
        setTimeout(() => {
            const rightMenu = document.querySelector('.folder__right-menu');
            rightMenu.style.display = 'block';
            rightMenu.style.left = event.x + 'px';
            rightMenu.style.top = event.y + 'px';
        }, 100);

    };

    const getAllPin = async () => {
        const { data } = await apiRequest.getAllPin();
    }

    //pin folder

    const pinFolder = async (id) => {
        const response = await apiRequest.pin(id);
        if (response.status === 201) {
            toast.success('Đã ghim', {
                autoClose: 2000,
                position: toast.POSITION.TOP_CENTER,
            })
        }
    };

    const openDataClassDetails = () => {
        openDataDetails.value = true
    }

    const getDatabase = async (url) => {
        try {
            const { data } = await apiRequest.get(url);
            // isInheritance
            databaseArr.value = data.results;
            listName.value = data.results[0]
            totalObject.value = data.total_objects;
            totalPages.value = data.total_pages;
            pageSize.value = data.page_size;
            currentPage.value = data.current_page_number;
        } catch (error) {
            console.log(error);
        }

    }

    const exportExcel = async (url) => {
        try {
            const { data } = await apiRequest.exportExcel(url);
            const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
            const fileUrl = URL.createObjectURL(blob);
            const fileLink = document.createElement('a');
            fileLink.href = fileUrl;
            fileLink.setAttribute('download', 'data.xlsx');
            document.body.appendChild(fileLink);
            fileLink.click();
        } catch (error) {
            console.error(error);
        }
    }

    const importExcel = async(url, dataImport) => {
        try {
            const response = await apiRequest.post(url, dataImport);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    const exportGeoJson = async(url) => {
        try {
            const { data } = await apiRequest.get(url);
            const blob = new Blob([JSON.stringify(data)], { type:'application/json'});
            const fileUrl = URL.createObjectURL(blob);
            const fileLink = document.createElement('a');
            fileLink.href = fileUrl;
            fileLink.setAttribute('download', 'geojsonFile.geojson');
            document.body.appendChild(fileLink);
            fileLink.click();
        } catch (error) {
            console.error(error);
            if(error.response.status === 400) {
                errorToast('Không thể xuất ra geoJson do dữ liệu không sử dụng trường không gian nào.')
            }
        }
    }
    const exportShapeFile = async(url) => {
        try {
            const { data } = await apiRequest.exportShapeFile(url);
            const blob = new Blob([data]);
            const fileUrl = URL.createObjectURL(blob);
            const fileLink = document.createElement('a');
            fileLink.href = fileUrl;
            fileLink.setAttribute('download', 'shapeFile.zip');
            document.body.appendChild(fileLink);
            fileLink.click();
        } catch (error) {
            console.error(error);
            if(error.response.status === 400) {
                errorToast('Không thể xuất ra shapefile do dữ liệu không sử dụng trường không gian nào.')
            }
        }
        
    }

    /**
     * [reloadLayerOnMoveMap Load lại lớp dữ liệu (Tạm thời fix do map4d lỗi)]
     * @return bool
     */
    const reloadLayerOnMoveMap = () => {
        resetTileOverlayers();
        loadLayerOverlay();
    }

    /**
     * [resetOverlayers xóa hết các tile overlayers trên bản đồ]
     * @return None
     */
    const resetTileOverlayers = () => {
        // Xóa tất cả các overlayers trên bản đồ và add lại từ đầu
        layerOverlays.value.forEach(overlay => {
            overlay.setMap(null)
        })

        layerOverlays.value = []
    }

    /**
     * [loadLayerOverlay wms layer của lớp dữ liệu hiện tại lên bản đồ]
     * @return None
     */
    const loadLayerOverlay = (firstLoad = false) => {
        let bbox = wmsInfo.value["bbox"]
        let layerName = wmsInfo.value["layer"]
        let workspaceName = wmsInfo.value["workspace"]
        let wmsUrl = 'https://mapservice.gishub.vn/geoserver/wms'
        console.log(bbox)
        resetTileOverlayers();

        // Kiểm tra các bbox ? layer có dữ liệu và bbox đúng
        if (isValidWmsBbox(bbox)) {
            const listBounds = [[bbox['maxx'], bbox['maxy']], [bbox['minx'], bbox['miny']]]

            // Khi click vào tab bản đổ cần đợi tab bản đồ được hiện lên rồi mới fitbounds tới bbox của layer
            // Nếu không sẽ gặp lỗi không fitbound đúng vị trí hoặc lỗi map

            // Load lần đầu khi click vào tab Bản đồ | Làm thêm trường hợp khi click vào layer khác (site bar nhưng đang ở tab bản đồ)
            // Nếu không sẽ bị reload vô tận do sự kiện lắng nghe idle của Map4d
            if (firstLoad)
                delay(450).then(() => fitBounds(listBounds, data.map))

            // Khi fitbounds map có animation trong khoảng 1s cho nên cần đợi map animation xong thì mới add overlayer
            // Nếu add trong lúc map đang animation tới vị trí fitbound sẽ bị call wms (thay đổi vị trí) => lag web
            delay(1000).then(() => {
                let overlay = methods_map.overlayTile(layerName, workspaceName, wmsUrl)
                // Gán overlay vào danh sách để quản lý
                layerOverlays.value.push(overlay)
            })


        }
        else {
            warningToast("Vui lòng cập nhật lại bbox của dữ liệu!")
        }

    }

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    /**
     * [isValidWmsBbox description]
     * @param wmsbbox {"maxx": 101, "maxy": 20, "minx": 100, "miny": 19.7}
     * @return bool
     */
    function isValidWmsBbox(wmsbbox) {
        try {
            let maxx = wmsbbox["maxx"]
            let maxy = wmsbbox["maxy"]
            let minx = wmsbbox["minx"]
            let miny = wmsbbox["miny"]

            if (!(isValidLatitude(maxy) || isValidLatitude(miny)))
                return false
            if (!(isValidLongtitude(maxx) || isValidLongtitude(minx)))
                return false

            return true
        }
        catch {
            return false
        }

    }

    function isValidLatitude(lat) {
        if (-90 <= lat && lat <= 90)
            return true
        return false
    }

    function isValidLongtitude(lng) {
        if (-180 <= lng && lng <= 180)
            return true
        return false
    }

    const addNewField = async(url, data) => {
        try {
            const response = await apiRequest.post(url, data);
            if(response.status === 200) {
                Swal.fire(
                    {
                        title: 'Thêm thành công',
                        icon: 'success'
                    }
                );
                addNewBtn.value = false;
                getDatabase(apiDatabase.value);
    
            }
        } catch (error) {
            console.log(error);
            if(error.response.status === 403) {
                errorToast('Bạn không có quyền');
            }
        }
      
    };
    const addPositionMap = async(url, data) => {
        const response = await apiRequest.post(url, data);
        if(response.status === 200) {
            console.log(1232);
            // Swal.fire(
            //     {
            //         title: 'Thêm thành công',
            //         icon: 'success'
            //     }
            // );
            // addNewBtn.value = false;
            // getDatabase(apiDatabase.value);

        }
    };

    const closeModel = () => {
        document.querySelectorAll('.modal-close').forEach(el => {
            el.dispatchEvent(new Event('click'))
        })
    }

    const getFieldType = (dataType) => {
        switch (dataType) {
            case 'text':
            case 'character':
            case 'float':
                return 'text';
            case 'geometry':
            case 'point':
            case 'linestring':
            case 'polygon':
            case 'multipolygon':
            case 'json':
                return 'textarea';
            case 'boolean':
                return 'checkbox';
            case 'date':
                return 'date';
            default:
                return 'text';
        }
    };


    //format date

    const formatDate = (date) => {
        const event = new Date(date);
        return event.toLocaleString('vi-VN',  { hour12: true });
    }

    const getDataStructure = async (id, slug) => {
        const {data} = await apiRequest.get(`/${slug}/layer/${id}/`);
        isInheritance.value = data.inheritance_permissions;
        dataStructure.value = data;
        dataPath.value = data.path;
        tableData.value = data.construct.fields;
        nameDisplay.value = data.name_display;
        tags.value = data.tags;
        description.value = data.description;
        apiDatabase.value = data?.data_model;
        wmsInfo.value= data?.wms_info
      
        tableData.value.forEach(item => {
          if (item.name === 'geom') {
            map.geomType = item.data_type;
          }
      
          if (item.name === 'object3d') {
            isHasOjbect3D.value = true;
          } else {
            isHasOjbect3D.value = false;
          }
        });

        if(data.inheritance_permissions) {
            getListPermissionMember(currentFolder.value, data.inheritance_permissions);
        } else {
            getListPermissionMember(id, data.inheritance_permissions);

        }

      };
      

    return {
        listFolders,
        primaryFolder,
        folderId,
        getAllFolder,
        currentFolder,
        modalDatabase,
        submitDataFile,
        onDrop,
        startDrag,
        viewMode,
        currentId,
        showRightmenu,
        editFolderName,
        editAction,
        changeNameFolder,
        changeNameFile,
        deleteFolder,
        showRightMenu,
        pinFolder,
        openDataClassDetails,
        openDataDetails,
        modelId,
        dataStructure,
        tableData,
        apiDatabase,
        databaseArr,
        listName,
        addNewBtn,
        getDatabase,
        importModel,
        isLoading,
        totalPages,
        totalObject,
        currentPage,
        pageSize,
        currentPageNumber,
        currentType,
        wmsInfo,
        layerOverlays,
        exportExcel,
        currentModelUrl,
        searchModelUrl,
        reloadLayerOnMoveMap,
        resetTileOverlayers,
        loadLayerOverlay,
        addNewField,addPositionMap,
        modalDatabaseCopy,
        getAllModel,
        modelData,
        select2Options,
        modelSelect,
        tags,
        description,
        isInfoTab,
        editInfo,
        nameDisplay,
        importExcel,
        exportGeoJson,
        exportShapeFile,
        closeModel,
        getSlug,
        slug,
        isHasOjbect3D,
        getFieldType,
        formDataInput,
        layerDataId,
        formatDate,
        memberListChoose,
        checkedMembers,
        modalAddMember,
        dataPath,
        allowSetRoles,
        isLayer,
        getListPermissionMember,
        userList,
        currentUser,
        getCurrentUserData,
        allowAdd,
        allowEdit,
        allowDelete,
        allowView,
        userDatas,
        errorGetUser,
        errorMessage,
        errorDelete,
        getDataStructure,
        isInheritance,
        currentUserRole
    }
})