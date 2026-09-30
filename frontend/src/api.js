import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

// REQUEST interceptor: istek backend'e gitmeden önce çalışır.
// Görevi: localStorage'daki token'ı Authorization başlığına eklemek.
api.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
});

// RESPONSE interceptor: backend'den hata cevabı gelince, bileşene ulaşmadan önce çalışır.
// Görevi: backend'in gönderdiği hata mesajını (detail) bileşenlerin okuyabileceği err.message'a koymak.
// Mesajı backend belirler, burada sabit mesaj tutulmaz.
api.interceptors.response.use(
    null,
    function (error) {
        let message = "Beklenmeyen bir hata oluştu.";

        if (error.response) {
            const detail = error.response.data?.detail;

            if (Array.isArray(detail)) {
                // 422: FastAPI doğrulama hataları liste olarak gelir
                message = detail
                    .map(function (d) {
                        const field = Array.isArray(d.loc) ? d.loc[d.loc.length - 1] : "alan";
                        return `${field}: ${d.msg}`;
                    })
                    .join(" | ");
            } else if (typeof detail === "string") {
                // HTTPException(detail="...") ile gelen mesaj
                message = detail;
            } else {
                message = `Sunucu hatası: ${error.response.status}`;
            }
        } else if (error.request) {
            // Cevap hiç gelmedi: mesajı backend veremez, frontend yazar
            message = "Sunucuya ulaşılamıyor. Backend'in çalıştığından emin olun.";
        }

        console.error("API hatası:", message, error);

        error.message = message;
        return Promise.reject(error);
    }
);

export default api;
