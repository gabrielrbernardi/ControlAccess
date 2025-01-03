import axios from 'axios';

declare module 'axios' {
    export interface AxiosRequestConfig {
        baseURL?: string,
    }
}

const api = axios.create({
    baseURL: 'https://api.github.com/',
    // headers: {'Authorization': `token ${process.env.REACT_APP_GITHUB_API}`}
    // baseURL: 'http://192.168.100.11:3333'
    // baseURL: 'http://ec2-3-88-186-254.compute-1.amazonaws.com:3333'
});

export default api;