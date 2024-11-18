import Constants from 'expo-constants';

const api_key = Constants.expoConfig.extra.apiKey;
const apiUrl = `https://pixabay.com/api/?key=${api_key}`;

const formatUrl = (params) => {
    let url = apiUrl + "&per_page=20&safesearch=false&editors_choice=false";
    if (!params) {
        return url;
    }
    let paramsKeys = Object.keys(params);
    paramsKeys.map((key) => {
        let value = key == "q" ? encodeURIComponent(params[key]) : params[key];
        url += `&${key}=${value}`;
    });
    return url;
}

export const apiCall = async (params) => {
    try {
        const response = await fetch(formatUrl(params));
        const data = await response.json();
        return { success: true, data: data }
    }
    catch (e) {
        console.log("Got an error ", e.message);
        return { success: false, message: e.message };
    }
}