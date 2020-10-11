import moment, { duration } from 'moment';



export const getCountDownTime = duration => {
    return moment.utc(moment.duration(duration, 'm').asMilliseconds()).format("HH[h]:mm[m]:ss[s]")
}