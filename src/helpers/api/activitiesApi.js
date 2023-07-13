import http from './axiosHttp'

const getType = (slug) => {
    return http.get(`/${slug}/activity-type/?all`)
}

const post = (slug, data) => {
    return http.post(`/${slug}/activity/`, data)
}

const getData = (slug, id) => {
    return http.get(`/${slug}/activity/?id_record=${id}`)
}

const deleteActivity = (slug, id) => {
    return http.delete(`/${slug}/activity/${id}/`)
}

const editData = (slug, id, data) => {
    return http.patch(`/${slug}/activity/${id}/`, data)
}

const getDataWithId = (slug, id) => {
    return http.get(`/${slug}/activity/${id}/`)
}

//activity type
const deleteActivityType = (slug, id) => {
    return http.delete(`/${slug}/activity-type/${id}/`)
}
const getActivityTypeId = (slug, id) => {
    return http.get(`/${slug}/activity-type/${id}/`)
}
const editActivityType = (slug, id, data) => {
    return http.patch(`/${slug}/activity-type/${id}/`, data)
}

const postActivityType = (slug, data) => {
    return http.post(`/${slug}/activity-type/`, data)
}
export default {
    getType,
    post,
    getData,
    deleteActivity,
    editData,
    getDataWithId,
    deleteActivityType,
    getActivityTypeId,
    editActivityType,
    postActivityType
}