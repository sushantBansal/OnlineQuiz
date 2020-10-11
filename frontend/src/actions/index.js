import { ACTIONS } from "./type"
import Axios from "axios"
export const API_URL = 'http://localhost:5000/api/v1'
export const toggleLanguage = (locale) => ({
    type: 'TOGGLE_LANGUAGE',
    payload: locale
})

export const login = (data) => {
    return {
        type: ACTIONS.USER_LOGGED_IN,
        payload: data
    }
}

export const logout = data => ({
    type: ACTIONS.USER_LOGGED_OUT,
    payload: data
})