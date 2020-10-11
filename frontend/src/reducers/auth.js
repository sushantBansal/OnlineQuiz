import { ACTIONS } from "../actions/type";

const defaultState = {
    token: null,
    loggedIn: false
};

export default function (state = defaultState, action) {
    switch (action.type) {
        case ACTIONS.USER_LOGGED_IN:
            return {
                ...state,
                ...action.payload,
                loggedIn: true
            };
        case ACTIONS.USER_LOGGED_OUT:
            return {
                ...state,
                ...action.payload,
                loggedIn: false,
                tempToken: state.token,
                token: null
            };
        default:
            return state;
    }
}
