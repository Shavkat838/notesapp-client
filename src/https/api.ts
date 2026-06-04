import axios from "axios";




const APi_POST_URL="http://localhost:8080/api/notes"

const $api=axios.create({
    withCredentials:true,
    baseURL:APi_POST_URL
})


$api.interceptors.request.use(config =>{
    config.headers.Authorization=`Bearer ${localStorage.getItem('accessToken')}`
    return config
})


export default $api