import EN from '../i18n/messges/en-us.json';
import HI from '../i18n/messges/hi-in.json';
import { LOCALES } from '../i18n/locale';
const message = {
    [LOCALES.ENGLISH]: EN,
    [LOCALES.HINDI]: HI
}

const defaultState = {
    locale: LOCALES.ENGLISH,
    message: message[LOCALES.ENGLISH]
};

export default function (state = defaultState, action) {
    switch (action.type) {
        case 'TOGGLE_LANGUAGE':
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}
