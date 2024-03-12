const fetchAbsolute = (fetch: any, baseUrl: any) => {
    return async (url: string, ...params: any) => {
        if (url.startsWith('/')) return await fetch(baseUrl + url, ...params)
        else return await fetch(url, ...params);
    }
}

let fetchAPI = fetchAbsolute(fetch, import.meta.env.VITE_API_URL);
export default fetchAPI;