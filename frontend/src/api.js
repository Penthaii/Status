import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

// Duruma özel, kullanıcıya gösterilecek varsayılan mesajlar
const STATUS_MESSAGES = {
    401: "Oturum açmanız gerekiyor.",
    403: "Bu işlem için yetkiniz yok.",
    404: "İstenen kayıt bulunamadı.",
};

api.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
});




api.interceptors.response.use(
    null,
    function (error) {
        let message = "Beklenmeyen bir hata oluştu.";

        if (error.response) {
            const status = error.response.status;
            const detail = error.response.data?.detail;

            if (status === 401 || status === 403) {

                message = STATUS_MESSAGES[status];
            } else if (status === 404) {

                message = typeof detail === "string" ? detail : STATUS_MESSAGES[404];
            } else if (Array.isArray(detail)) {
                message = detail
                    .map(function (d) {
                        const field = Array.isArray(d.loc) ? d.loc[d.loc.length - 1] : "alan";
                        return `${field}: ${d.msg}`;
                    })
                    .join(" | ");
            } else if (typeof detail === "string") {
                message = detail;
            } else {
                message = `Sunucu hatası: ${status}`;
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
