import axios from "axios"

const REAPI = axios.create({
    baseURL: 'https://exe201-hedgfudpdahubgh9.southeastasia-01.azurewebsites.net/',
    timeout: 40000,
    headers: {
      "Content-Type": "application/json"
    }
  })
  REAPI.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (!(config.data instanceof FormData)) {
            config.headers.Accept = 'application/json';
            config.headers['Content-Type'] = 'application/json';
        } else {
            // Khi sử dụng FormData, trình duyệt tự động thiết lập Content-Type
            delete config.headers['Content-Type'];
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// busAPI.interceptors.response.use(
// 	(response) => response.data,
// 	(error) => {
// 		if (error.response.status === 401) {
// 			/* empty */
// 		}
// 		return Promise.reject(error)
// 	},
// )
export default REAPI