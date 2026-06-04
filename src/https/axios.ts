import axios from "axios"

const API_URL="http://localhost:8080/api/notes"
export const $api=axios.create({
    withCredentials:true,
    baseURL:API_URL,
})


const API_AUTH_URL="http://localhost:8080/api/users"
export const $authApi=axios.create({
    withCredentials:true,
    baseURL:API_AUTH_URL
})