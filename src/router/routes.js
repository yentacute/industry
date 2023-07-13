import ROUTERMAPCONTROL from "./map_control.js";

export default [
    ...ROUTERMAPCONTROL,
    //portal
    {
        path: "/",
        name: "HomePage",
        meta: {
            title: "Trang chủ",
        },
        component: () => import("../views/portal/HomePage.vue"),
    },
    {
        path: "/ban-do/khu-cong-nghiep",
        name: "MapPortalNew",
        meta: {
            title: "Bản đồ công khai",
        },
        component: () => import("../views/map/map_portal/MapPortal.vue"),
    },
    {
        path: "/gioi-thieu",
        name: "IntroducePage",
        meta: {
            title: "Giới thiệu",
        },
        component: () => import("../views/portal/IntroducePage.vue"),
    },
    {
        path: "/map-demo",
        name: "MapPage",
        meta: {
            title: "Bản đồ Draft",
        },
        component: () => import("../views/map/main_map/MapMain.vue"),
    },
    {
        path: "/khu-cong-nghiep",
        name: "IndustrialListPage",
        meta: {
            title: "Khu công nghiệp",
        },
        component: () => import("../views/portal/IndustrialListPage"),
    },
    {
        path: "/lien-he",
        name: "ContactPage",
        meta: {
            title: "Liên hệ",
        },
        component: () => import("../views/portal/ContactPage.vue"),
    },
    {
        path: "/chinh-sach",
        name: "PolicyPage",
        meta: {
            title: "Chính sách bảo mật",
        },
        component: () => import("../views/portal/PrivacyPolicy"),
    },
    {
        path: "/dieu-khoan",
        name: "TermPage",
        meta: {
            title: "Điều khoản sử dụng",
        },
        component: () => import("../views/portal/TermPage"),
    },
    {
        path: "/huong-dan",
        name: "HowToUsePage",
        meta: {
            title: "Hướng dẫn sử dụng",
        },
        component: () => import("../views/portal/HuongDanSuDung"),
    },
    {
        path: "/apps",
        name: "AppsPage",
        meta: {
            title: "Ứng dụng",
        },
        component: () => import("../views/portal/AppListPage"),
    },
    {
        path: "/lab/apps",
        name: "LabAppsPage",
        meta: {
            title: "Ứng dụng",
        },
        component: () => import("../views/portal/lab/LabAppListPage"),
    },

    //account
    {
        path: "/login",
        name: "LoginPage",
        meta: {
            title: "Đăng nhập",
        },
        component: () => import("../views/auth/signin/cover"),
    },
    {
        path: "/register",
        name: "RegisterPage",
        meta: {
            title: "Đăng ký",
            authRequired: true,
        },
        component: () => import("../views/auth/signup/cover"),
    },
    {
        path: "/forgot-password",
        name: "ForgetPasswordPage",
        meta: {
            title: "Quên mật khẩu",
            authRequired: true,
        },
        component: () => import("../views/auth/reset/cover"),
    },
    {
        path: "/change-password",
        name: "ChangePasswordPage",
        meta: {
            title: "Đổi mật khẩu",
            authRequired: true,
        },
        component: () => import("../views/auth/create/cover"),
    },
    {
        path: "/profile",
        name: "ProfilePage",
        meta: {title: "Thông tin cá nhân", authRequired: true},
        component: () => import("../views/pages/profile/simple"),
    },
    {
        path: "/profile-update",
        name: "ProfileUpdatePage",
        meta: {title: "Cập nhật thông tin cá nhân", authRequired: true},
        component: () => import("../views/pages/profile/setting"),
    },
    {
        path: "/system-manage/user",
        name: "ManageUserPage",
        meta: {
            title: "Quản lý người dùng",
            authRequired: true,
        },
        component: () => import("../views/manage-system/user/user_manage"),
        props: true
    },
    {
        path: "/system-manage/add-user",
        name: "AddUserPage",
        meta: {
            title: "Thêm mới người dùng",
            authRequired: true,
        },
        component: () => import("../views/manage-system/user/add_update_user"),
    },
    {
        path: "/system-manage/update-user/:id",
        name: "UpdateUserPage",
        meta: {
            title: "Cập nhật thông tin người dùng",
            authRequired: true,
        },
        component: () => import("../views/manage-system/user/add_update_user"),
    },
    {
        path: "/system-manage/role",
        name: "ManageRolePage",
        meta: {
            title: "Quản lý phân quyền người dùng",
            authRequired: true,
        },
        component: () => import("../views/manage-system/role/role_manage"),
    },
    {
        path: "/system-manage/add-role",
        name: "AddRolePage",
        meta: {
            title: "Thêm mới phân quyền",
            authRequired: true,
        },
        component: () => import("../views/manage-system/role/add_update_role"),
    },
    {
        path: "/system-manage/update-role/:id",
        name: "UpdateRolePage",
        meta: {
            title: "Cập nhật thông tin phân quyền",
            authRequired: true,
        },
        component: () => import("../views/manage-system/role/add_update_role"),
    },

    {
        path: "/system-manage/industrial",
        name: "ManageIndustrialPage",
        meta: {
            title: "Quản lý khu công nghiệp",
            authRequired: true,
        },
        component: () =>
            import("../views/manage-system/industrial/industrial_manage"),
    },
    {
        path: "/system-manage/department-manage",
        name: "ManageDepartmentManagePage",
        meta: {
            title: "Quản lý phòng ban quản lý",
            authRequired: true,
        },
        component: () =>
            import("../views/manage-system/department/phongban_quanly_manage"),
    },
    {
        path: "/system-manage/add-department-manage",
        name: "AddDepartmentManagePage",
        meta: {
            title: "Thêm mới phòng ban quản lý",
            authRequired: true,
        },
        component: () =>
            import("../views/manage-system/department/add_update_phongban_quanly"),
    },
    {
        path: "/system-manage/update-department-manage/:id",
        name: "UpdateDepartmentManagePage",
        meta: {
            title: "Cập nhật thông tin phòng ban quản lý",
            authRequired: true,
        },
        component: () =>
            import("../views/manage-system/department/add_update_phongban_quanly"),
    },

    {
        path: "/system-manage/boundary/:item",
        name: "ManageBoundaryPage",
        component: () => import("../views/manage-system/boundary/boundary_manage"),
    },

    {
        path: "/system/log",
        name: "LogAuthPage",
        meta: {
            title: "Nhật ký hoạt động",
            authRequired: true,
        },
        component: () => import("../views/manage-system/system/systemlog"),
    },
    {
        path: "/system/activity",
        name: "ActivityAuthPage",
        meta: {
            title: "Nhật ký thao tác",
            authRequired: true,
        },
        component: () => import("../views/manage-system/system/activity_log"),
    },
    {
        path: "/system/setting",
        name: "SettingPage",
        meta: {
            title: "Cấu hình hệ thống",
            authRequired: true,
        },
        component: () => import("../views/manage-system/system/setting_system"),
    },
    {
        path: "/data-manage/object-3d",
        name: "ManageObjectPage",
        meta: {
            title: "Quản lý đối tượng 3D",
            authRequired: true,
        },
        component: () => import("../views/manage-data/object-3d/object_3d_manage"),
        props: true
    },
    {
        path: "/data-manage/add-object-3d",
        name: "AddObjectPage",
        meta: {
            title: "Thêm mới đối tượng 3D",
            authRequired: true,
        },
        component: () => import("../views/manage-data/object-3d/add_update_3d_object"),
        props: true
    },
    {
        path: "/system-manage/notification",
        name: "ManageNotificationPage",
        meta: {
            title: "Quản lý thông báo",
            authRequired: true,
        },
        component: () => import("../views/manage-system/notification/notification_manage"),
        props: true
    },
    {
        path: "/system-manage/model-notification",
        name: "ManageModelNotificationPage",
        meta: {
            title: "Quản lý mẫu thông báo",
            authRequired: true,
        },
        component: () => import("../views/manage-system/model_notify/manage.vue"),
        props: true
    },
    {
        path: "/system-manage/subscriber",
        name: "ManageSubscriberPage",
        meta: {
            title: "Quản lý đăng ký",
            authRequired: true,
        },
        component: () => import("../views/manage-system/notification/NotificationSubscriber"),
        props: true
    },
    {
        path: "/data-manage/update-object-3d/:id",
        name: "UpdateObjectPage",
        meta: {
            title: "Cập nhật đối tượng 3D",
            authRequired: true,
        },
        component: () => import("../views/manage-data/object-3d/add_update_3d_object"),
        props: true
    },
    {
        path: "/system/api-service",
        name: "APIServicePage",
        meta: {
            title: "Dịch vụ API",
            authRequired: true,
        },
        component: () => import("../views/manage-system/api-service"),
        props: true
    },

    //theme
];
