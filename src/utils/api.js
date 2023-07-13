import http from "../helpers/api/axiosHttp"


/**
 * [get ]
 * path = /intersects
 * => Real path = http_base_path + path
 * http_base_path = base_url + '/api'
 * base_url = 'https://api-kcntest.gishub.vn'
 * Example: path = /kcn-song-cong-2/toanha 
 * => https://api-kcntest.gishub.vn/kcn-song-cong-2/toanha 
 * @return response from server
 */
const get = (path) => {
    return http.get(path);
}


/**
 * [post]
 * path = /intersects
 * data = FormData | JSON | ..., etc
 * => Real path = http_base_path + path
 * http_base_path = base_url + '/api'
 * base_url = 'https://api-kcntest.gishub.vn'
 * Example: path = /kcn-song-cong-2/toanha
 *          data = FormData 
 * => https://api-kcntest.gishub.vn/kcn-song-cong-2/toanha 
 * @return response from server
 */
const post = (path, data) => {
    return http.post(path, data);
}


export default { get, post }