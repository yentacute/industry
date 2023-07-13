import API from "../helpers/api/useAxios"

export const getSystemApps = async () => {
    let data = []
    await API()
        .get("/user/application-system")
        .then((res) => {
            data = res
        })
    return data
}

export const getIndustrialApps = async (kcn) => {
    let data = []
    await API()
        .get(`/${kcn}/application`)
        .then((res) => {
            data = res
        })
    return data
}