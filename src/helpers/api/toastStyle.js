import {toast} from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export const successToast = (title) => {
    toast.success(title, {
        theme: 'colored',
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000
    });
}

export const errorToast = (title) => {
    toast.error(title, {
        theme: 'colored',
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000
    });
}

export const warningToast = (title) => {
    toast.warning(title, {
        theme: 'colored',
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000
    });
}