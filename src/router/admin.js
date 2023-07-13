import API from "../helpers/api/useAxios";
import ManageAddMap from "../views/manage-data/ban-do/ManageAddMap.vue";
import ManageMap from "../views/manage-data/ban-do/map_manage.vue";

var ROUTERADMIN = [];
const setDefaultApp = (kcn, name = "KHU CÔNG NGHIỆP") => {
  return [
    {
      path: `/${kcn}/data-manage/map-styles`,
      name: `${kcn}ManageMapStylesPage`,
      meta: {
        title: "Quản lý styles",
        authRequired: true,
      },
      component: () => import("../views/manage-data/ban-do/ManageStyles.vue"),
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/data-manage/add-style`,
      name: `${kcn}ManageAddStyle`,
      meta: {
        title: "Thêm mới style",
        authRequired: true,
      },
      component: () => import("../views/manage-data/ban-do/ManageAddStyle.vue"),
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/data-manage/map-styles/:idStyle`,
      name: `${kcn}MapStylesDetails`,
      meta: {
        title: "Chi tiết styles",
        authRequired: true,
      },
      component: () => import("../views/manage-data/ban-do/ManageStyles.vue"),
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/data-manage/update-styles/:idStyle`,
      name: `${kcn}MapUpdateStyle`,
      meta: {
        title: "Chi tiết styles",
        authRequired: true,
        update: true,
      },
      component: () => import("../views/manage-data/ban-do/ManageAddStyle.vue"),
      props: { slug: kcn, nameKCN: name, update: true },
    },
    {
      path: `/${kcn}/data-manage/map`,
      name: `${kcn}ManageMapPage`,
      meta: {
        title: "Quản lý bản đồ",
        authRequired: true,
      },
      component: ManageMap,
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/data-manage/map/add-map`,
      name: `${kcn}ManageAddMap`,
      meta: {
        title: "Thêm mới bản đồ",
        authRequired: true,
      },
      component: ManageAddMap,
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/data-manage/map/:mapId`,
      name: `${kcn}MapDetails`,
      meta: {
        title: "Build bản đồ",
        authRequired: true,
      },
      component: () => import("../views/manage-data/ban-do/MapDetails.vue"),
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/ban-do-cong-khai/:mapId`,
      name: `${kcn}MapPublicDetails`,
      component: () => import("../views/map/main_map/MapControl.vue"),
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/data-manage/map/update-map/:mapId`,
      name: `${kcn}UpdateMap`,
      component: ManageAddMap,
      props: {
        update: true,
        slug: kcn,
        nameKCN: name,
      },
    },
    {
      path: `/${kcn}/system-manage/department`,
      name: `${kcn}ManageDepartmentPage`,
      meta: {
        title: "Quản lý đơn vị phòng ban",
        authRequired: true,
      },
      component: () =>
        import("../views/manage-system/department/department_manage.vue"),
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/system-manage/add-department`,
      name: `${kcn}AddDepartmentPage`,
      meta: {
        title: "Thêm mới đơn vị phòng ban",
        authRequired: true,
      },
      component: () =>
        import("../views/manage-system/department/add_update_department"),
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/system-manage/update-department/:id`,
      name: `${kcn}UpdateDepartmentPage`,
      meta: {
        title: "Cập nhật thông tin đơn vị phòng ban",
        authRequired: true,
      },
      component: () =>
        import("../views/manage-system/department/add_update_department"),
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/data-manage/data`,
      name: `${kcn}ManageDataPage`,
      meta: {
        title: "Quản lý dữ liệu",
        authRequired: true,
      },
      component: () => import("../views/manage-data/index.vue"),
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/manage-activities`,
      name: `${kcn}ManageActivities`,
      meta: {
        title: "Quản lý hoạt động",
        authRequired: true,
      },
      component: () => import("../views/manage-activities/index.vue"),
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/manage-activities/edit/:id/`,
      name: `${kcn}ManageActivitiesEdit`,
      meta: {
        title: "Chỉnh sửa hoạt động",
        authRequired: true,
      },
      component: () => import("../views/manage-activities/editActivities"),
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/manage-activities/list/:id`,
      name: `${kcn}ActivityDetail`,
      meta: {
        title: "Danh sách hoạt động",
        authRequired: true,
      },
      component: () => import("../views/manage-activities/ActivitiesList"),
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/manage-activity-type`,
      name: `${kcn}ManageActivitiesType`,
      meta: {
        title: "Quản lý loại hoạt động",
        authRequired: true,
      },
      component: () => import("../views/manage-activity-type/index.vue"),
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/manage-activity-type/add`,
      name: `${kcn}AddActivitiesType`,
      meta: {
        title: "Thêm mới loại hoạt động",
        authRequired: true,
      },
      component: () => import("../views/manage-activity-type/AddActivityType.vue"),
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/manage-activity-type/edit/:id/`,
      name: `${kcn}ManageActivitiesTypeEdit`,
      meta: {
        title: "Chỉnh sửa loại hoạt động",
        authRequired: true,
      },
      component: () => import("../views/manage-activity-type/EditActivityType"),
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/manage-activity-type/list/:id`,
      name: `${kcn}ActivityTypeDetail`,
      meta: {
        title: "Danh sách loại hoạt động",
        authRequired: true,
      },
      component: () => import("../views/manage-activity-type/ActivityTypeList"),
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/system-manage/plan`,
      name: `${kcn}ManagePlanPage`,
      meta: {
        title: "Quản lý kế hoạch",
        authRequired: true,
      },
      component: () => import("../views/manage-system/plan/PlanManage.vue"),
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/system-manage/add-plan`,
      name: `${kcn}AddPlanPage`,
      meta: {
        title: "Thêm kế hoạch",
        authRequired: true,
      },
      component: () => import("../views/manage-system/plan/AddPlanPage.vue"),
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/system-manage/scope-plan`,
      name: `${kcn}ManagePlanStylesPage`,
      meta: {
        title: "Quản lý kế hoạch",
        authRequired: true,
      },
      component: () => import("../views/manage-system/plan/TypePlanManage.vue"),
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/system-manage/type-plan`,
      name: `${kcn}ManageTypePlanPage`,
      meta: {
        title: "Quản lý kế hoạch",
        authRequired: true,
      },
      component: () =>
        import("../views/manage-system/plan/TypeOfPlanManage.vue"),
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/system-manage/feedback`,
      name: `${kcn}ManageFeedbackPage`,
      meta: {
        title: "Quản lý phản ánh",
        authRequired: true,
      },
      component: () => import("../views/manage-data/feed-back/feedback_manage"),
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/khai-thac-du-lieu`,
      name: `${kcn}MiningPage`,
      meta: {
        title: "Khai thác dữ liệu",
      },
      component: () => import("../views/portal/DataMiningPage.vue"),
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/khai-thac-du-lieu/:miningId`,
      name: `${kcn}MapMiningPage`,
      meta: {
        title: "Khai thác dữ liệu",
      },
      component: () => import("../views/map/main_map/MapControl.vue"),
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/khai-thac-du-lieu/folder/:folderId`,
      name: `${kcn}MapMiningFolderPage`,
      meta: {
        title: "Khai thác dữ liệu",
      },
      component: () => import("../views/map/main_map/MapControl.vue"),
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/system-manage/data-information`,
      name: `${kcn}ManageDataInformationPage`,
      meta: {
        title: "Quản lý trao đổi dữ liệu",
        authRequired: true,
      },
      component: () =>
        import("../views/manage-system/exchange/InformationData.vue"),
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/system-manage/exchange-information`,
      name: `${kcn}ManageExchangeDataPage`,
      meta: {
        title: "Quản lý trao đổi dữ liệu",
        authRequired: true,
      },
      component: () =>
        import("../views/manage-system/exchange/ExchangeData.vue"),
      props: { slug: kcn, nameKCN: name },
    },
    {
      path: `/${kcn}/system-manage/kcn-information`,
      name: `${kcn}ManageDataInformationKcnPage`,
      meta: {
        title: "Quản lý trao đổi dữ liệu",
        authRequired: true,
      },
      component: () =>
        import("../views/manage-system/exchange/InformationDataKcn.vue"),
      props: { slug: kcn, nameKCN: name },
    },
    // {
    //   path: `/${kcn}/system-manage/add-plan`,
    //   name: `${kcn}AddPlanPage`,
    //   meta: {
    //     title: "Thêm kế hoạch",
    //     authRequired: true,
    //   },
    //   component: () => import("../views/manage-system/plan/AddPlanPage.vue"),
    //   props: { slug: kcn, nameKCN: name },
    // },
    // {
    //   path: `/${kcn}/system-manage/scope-plan`,
    //   name: `${kcn}ManagePlanStylesPage`,
    //   meta: {
    //     title: "Quản lý kế hoạch",
    //     authRequired: true,
    //   },
    //   component: () => import("../views/manage-system/plan/TypePlanManage.vue"),
    //   props: { slug: kcn, nameKCN: name },
    // },
  ];
};

const setRouter = async () => {
  let respon = (await API().get("industrial-area")) ?? [];
    respon = [
      ...respon,
      {
        slug: "sipm-base",
      },
    ];
  respon.forEach((item) => {
    ROUTERADMIN = [...ROUTERADMIN, ...setDefaultApp(item.slug, item.name)];
  });
  return ROUTERADMIN;
};

export { setRouter, setDefaultApp };

export default ROUTERADMIN;
