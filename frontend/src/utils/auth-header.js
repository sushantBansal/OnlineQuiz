export const authHeader = token => {
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
}