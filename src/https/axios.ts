import axios from "axios"

const API_AUTH_URL=`${import.meta.env.VITE_API_URL}/users`
export const $authApi=axios.create({
    withCredentials:true,
    baseURL:API_AUTH_URL
})