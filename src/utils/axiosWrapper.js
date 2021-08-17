import axios from "axios"

// todo: should be https eventually
var URL = "http://localhost:8080"

export const axiosWrapper = axios.create({baseURL: URL})
export const config = {
    headers: {
        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8;application/json; multipart/form-data',
        'Authorization': localStorage.getItem("jwt")
    }
}
