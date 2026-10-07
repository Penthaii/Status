import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
});

api.interceptors.response.use(
    null,
    function (error) {
        let message = "Beklenmeyen bir hata oluştu.";

        if (error.response) {
            const detail = error.response.data?.detail;

            if (Array.isArray(detail)) {

                message = detail
                    .map(function (d) {
                        const field = Array.isArray(d.loc) ? d.loc[d.loc.length - 1] : "alan";
                        return `${field}: ${d.msg}`;
                    })
                    .join(" | ");
            } else if (typeof detail === "string") {

                message = detail;
            } else {
                message = `Sunucu hatası: ${error.response.status}`;
            }
        } else if (error.request) {

            message = "Sunucuya ulaşılamıyor. Backend'in çalıştığından emin olun.";
        }

        console.error("API hatası:", message, error);

        error.message = message;
        return Promise.reject(error);




    }
);

export default api;
