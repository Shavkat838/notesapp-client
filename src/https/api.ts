
import axios from "axios";
import { toast } from "sonner";





const APi_POST_URL=`${import.meta.env.VITE_API_URL}/notes`

const $api=axios.create({
    withCredentials:true,
    baseURL:APi_POST_URL
})
$api.interceptors.request.use(config =>{
    config.headers.Authorization=`Bearer ${localStorage.getItem('accessToken')}`
    return config
})


$api.interceptors.response.use(config=>{
    return config
},async (error)=>{
    const originalRequest=error.config


    if(error.response.status===401&&error.config&&!error.config.isRetry){
        originalRequest.isRetry=true

        try {
            const {data}=await axios.post(`${import.meta.env.VITE_API_URL}/users/refresh`,{},{withCredentials:true})
            localStorage.setItem("accessToken",data.accessToken)
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return $api(originalRequest)
        } catch (error) {
        // @ts-expect-error write error type
        toast.error(error?.response?.data.message)
        localStorage.removeItem("accessToken")
        window.location.href="/auth"
        }
    }
    throw error
})

export default $api