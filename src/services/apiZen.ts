import axios from 'axios';

declare module 'axios' {
    export interface AxiosRequestConfig {
        baseURL?: string,
        token?: string,
    }
}

function getCookie(name:any) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {let res = parts.pop()?.split(';')?.shift(); return res;}else{return null}
}

const apiZen = axios.create({
    // baseURL: 'http://localhost:3333/',
    // baseURL: 'http://192.168.100.11:3333/',
    // baseURL: 'https://grbbackend.herokuapp.com/',
    baseURL: 'https://controlaccesszenith-server.onrender.com',
    // timeout: 1000,
    headers: {
        token: getCookie("token") || "",
        // id_usuario: getCookie("id") || ""
    }
});
console.log(getCookie("token"))
console.log(document.cookie)
apiZen.defaults.headers.common['token'] = getCookie("token") || "";

export default apiZen;