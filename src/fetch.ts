import Cookies from "js-cookie";

const fetchAbsolute = (fetch: any, baseUrl: any) => {
  return async (url: string, ...params: any) => {
    const defaultOptions = {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
      },
    };

    const [input, options = {}] = params;
    const finalOptions = { ...defaultOptions, ...options };

    if (url.startsWith('/')) {
      return await fetch(baseUrl + url, { ...finalOptions, ...input });
    } else {
      return await fetch(url, { ...finalOptions, ...input });
    }
  }
}

let fetchAPI = fetchAbsolute(fetch, import.meta.env.VITE_API_URL);
export default fetchAPI;
