import { axiosWrapper } from "./axiosWrapper"

export const verifyToken = (redirectURL) => {
    const refreshToken = localStorage.getItem("refresh_token")

    const dataJSON = {
      refresh_token : refreshToken
    }

    axiosWrapper.post("/newtoken", dataJSON)
    .then(response => {
      localStorage.setItem("jwt", response.data["token"])
      window.location = redirectURL
    }).catch(error =>{
      if (error.response.data.error === "renewRefreshToken") {
        localStorage.removeItem("session_active")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user_id")
        localStorage.setItem("jwt", "")
        localStorage.removeItem("user_email")
        window.location = "/login"
      }
    })
}
