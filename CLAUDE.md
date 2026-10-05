@C:/Users/tetik/.claude/genel-kurallar.md

# BackendProject — Proje Kuralları

## Proje ve Teknoloji Yığını
- **Proje özeti:** Giriş gerektiren sayfaları olan bir not uygulaması. FastAPI backend + React frontend.
- **Durum:** Veritabanını SQLite'tan (`my_db.db`) PostgreSQL'e taşıyoruz. Bağlantı adresi `.env` içindeki `DATABASE_URL`'de (`postgresql://` formatı).
- **Backend:** Python 3.11+, FastAPI, SQLAlchemy 2.0 (**senkron**), PostgreSQL. Alembic ve Pytest henüz kurulmadı.
- **Frontend:** React + Vite (`frontend/` klasörü), lint için oxlint.

## Komutlar
- Sanal ortam (Windows): `venv\Scripts\activate`
- Backend çalıştırma: `uvicorn main:app --reload`
- Frontend: `cd frontend` → `npm install` → `npm run dev` (diğer script'ler için `frontend/package.json`'a bak)
- Test: `pytest` (`tests/` klasörü henüz yok; ilk test yazılırken oluştur)
- `requirements.txt` henüz yok. Paket eklenmesi gerektiğinde önce bunu oluşturmayı öner.

## Mevcut Yapı
```
BackendProject/
├── main.py        # FastAPI uygulaması ve route'lar
├── database.py    # DB bağlantısı
├── models.py      # SQLAlchemy modelleri
├── schemas.py     # Pydantic şemaları
├── my_db.db       # Eski SQLite veritabanı (yedek)
├── venv/
└── frontend/      # React + Vite (src/api.js, src/components/ ...)
```

## Hedef Mimari (Kademeli Geçiş)
Backend zamanla şu yapıya taşınacak:
```
app/
├── main.py         # Uygulama girişi
├── api/            # Route'lar: sadece HTTP (isteği al, cevabı dön). İş mantığı yok.
├── services/       # İş mantığı. DB'ye doğrudan dokunmaz, repository'leri çağırır.
├── repositories/   # Veritabanı erişimi. Tüm SQLAlchemy sorguları burada.
├── models/         # Sadece SQLAlchemy modelleri.
├── schemas/        # Sadece Pydantic şemaları.
└── core/           # Ayarlar (.env okuma), DB bağlantısı, get_db (Depends ile enjeksiyon).
```
- Bu yapıya **tek seferde geçme**. Ben istediğimde plan sun ve onayımla adım adım taşı. Geçiş bitene kadar mevcut kodu çalışır halde tut.
- Taşıma tamamlanınca bu dosyadaki komutları (`uvicorn app.main:app --reload`) ve "Mevcut Yapı" bölümünü güncellemeyi öner.
- **Bağımlılık yönü:** `api → services → repositories → models`. Pydantic şemaları `api` ve `services` arasında kullanılır; repository'ler SQLAlchemy modelleriyle çalışır.

## Backend Kuralları
- **Route'lar:** DB çağrıları senkron olduğu için route fonksiyonlarını `def` olarak yaz (`async def` kullanma). Böylece FastAPI bunları ayrı thread'de çalıştırır ve sunucu bloklanmaz.
- **Tipler:** Her yerde type hint kullan.
- **Hata yönetimi:** İş mantığı anlamlı custom exception fırlatır (örn. `NoteNotFoundError`); route katmanı bunu `HTTPException`'a çevirir. `HTTPException`'ı iş mantığı içinde kullanma.
- **SQL:** Her zaman SQLAlchemy'nin parametreli sorgularını kullan; f-string ile sorgu kurma.

## Frontend Kuralları
- Backend'e yapılan tüm istekler `src/api.js` üzerinden geçsin; component içinde doğrudan `fetch` yazma.
- Fonksiyonel component ve hook kullan. Bir component tek bir iş yapsın; büyürse alt component'lere böl.

## Veritabanı ve Migration
- `my_db.db` dosyasını silme veya üzerine yazma (PostgreSQL geçişi bitene kadar yedek olarak duracak).
- Alembic kurulduktan sonra: model değiştiğinde migration oluştur (`alembic revision --autogenerate -m "mesaj"`), uygulamadan önce bana göster. Şemayı elle değiştirme.

## Test Stratejisi
- Yeni fonksiyon/servis yazdığında `tests/` altına test ekle.
- **Birim testleri:** İş mantığını test ederken veritabanı erişimini **mock'la**.
- **Entegrasyon testleri:** Sadece **ayrı bir test veritabanı** (`TEST_DATABASE_URL`) kullan. Geliştirme veritabanına asla bağlanma.