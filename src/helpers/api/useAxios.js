import axios from "axios";
import axiosHttp from "./axiosHttp.js";

const API = () => {
  const call = async (url) => {
    try {
      const reponsive = await axios.get(`${url}`);
      console.log(reponsive);
      const data = await reponsive.data;
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const get = async (url) => {
    try {
      const reponsive = await axiosHttp.get(`${url}`);
      const data = await reponsive.data;
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const remove = async (url) => {
    try {
      const reponsive = await axiosHttp.delete(`${url}`);
      console.log(reponsive);
      const data = await reponsive.data;
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const post = async (url, dataPost) => {
    try {
      const reponsive = await axiosHttp.post(`${url}`, dataPost);
      const data = await reponsive.data;
      return data;
    } catch (err) {
      console.log(err);
      return err;
    }
  };
  const patch = async (url, dataPost) => {
    try {
      const reponsive = await axiosHttp.patch(`${url}`, dataPost);
      const data = await reponsive.data;
      return data;
    } catch (err) {
      console.log(err);
    }
  };
  return { get, remove, post, call, patch };
};

export default API;
