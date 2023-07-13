import axios from "axios";

const TOKENUSER = JSON.parse(localStorage.getItem("auth"));

export const BASE_URL = "https://api-kcntest.gishub.vn";

export default axios.create({
  baseURL: BASE_URL + "/api",
  headers: {
    Authorization: `Bearer ${TOKENUSER}`,
  },
});
