# Starkon Template

Starkon Template, modern React uygulamaları için tasarlanmış kapsamlı bir component kütüphanesidir. Radix UI tabanlı, erişilebilir ve özelleştirilebilir komponentler sunar.

## Kurulum

```bash
npx create-starkon-template my-project
cd my-project
npm install
npm run dev
```

```bash
starkon-template/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Korumalı rotalar grubu
│   │   │   ├── components/    # Bileşenler showcase sayfası
│   │   │   ├── dashboard/     # Ana kontrol paneli
│   │   │   ├── settings/      # Kullanıcı ayarları
│   │   │   └── layout.tsx     # Auth layout bileşeni
│   │   ├── auth/              # Authentication sayfaları
│   │   │   └── login/         # Giriş sayfası
│   │   ├── globals.css        # Global stil tanımları
│   │   ├── layout.tsx         # Kök layout bileşeni
│   │   └── page.tsx           # Ana sayfa
│   ├── components/            # Component kütüphanesi
│   │   ├── core/              # Temel UI bileşenleri
│   │   │   ├── Accordion/     # Genişletilebilir içerik
│   │   │   ├── AlertDialog/   # Uyarı diyalogları
│   │   │   ├── Avatar/        # Kullanıcı avatarları
│   │   │   ├── Badge/         # Durum etiketleri
│   │   │   ├── Button/        # Etkileşimli butonlar
│   │   │   ├── Card/          # İçerik kartları
│   │   │   ├── Checkbox/      # Seçim kutuları
│   │   │   ├── CommandMenu/   # Komut menüsü
│   │   │   ├── DataTable/     # Gelişmiş veri tablosu
│   │   │   ├── Dialog/        # Modal diyaloglar
│   │   │   ├── Dropdown/      # Açılır menüler
│   │   │   ├── Input/         # Metin giriş alanları
│   │   │   ├── Label/         # Form etiketleri
│   │   │   ├── Loading/       # Yükleme animasyonları
│   │   │   ├── Popover/       # Açılır içerik kutuları
│   │   │   ├── Select/        # Seçim dropdownları
│   │   │   ├── Separator/     # Ayırıcı çizgiler
│   │   │   ├── Skeleton/      # Yükleme placeholderları
│   │   │   ├── Slider/        # Değer seçici kaydırıcılar
│   │   │   ├── Switch/        # Açma/kapama düğmeleri
│   │   │   ├── Tabs/          # Sekme navigasyonu
│   │   │   ├── Textarea/      # Çok satırlı metin alanları
│   │   │   ├── Toast/         # Bildirim mesajları
│   │   │   └── Tooltip/       # Yardım ipuçları
│   │   ├── forms/             # Form bileşenleri
│   │   │   └── auth/          # Authentication formları
│   │   └── ui/                # Özel UI bileşenleri
│   │       ├── ComponentDemo/ # Bileşen demo wrapper
│   │       ├── ErrorBoundary/ # Hata yakalama
│   │       ├── FileUpload/    # Dosya yükleme
│   │       ├── LanguageToggle/# Dil değiştirici
│   │       ├── PageHeader/    # Sayfa başlığı
│   │       ├── ThemeToggle/   # Tema değiştirici
│   │       └── ToastContainer/# Toast yöneticisi
│   ├── data/                  # Statik veri dosyaları
│   │   └── componentDemoData.tsx # Demo component verileri
│   ├── hooks/                 # Özel React hook'ları
│   │   ├── useAuth.ts         # Authentication yönetimi
│   │   ├── useDropdownPortal.ts # Dropdown portal yönetimi
│   │   ├── useDropdownState.ts  # Dropdown durumu
│   │   ├── useForm.ts         # Form yönetimi (Zod entegrasyonu)
│   │   ├── useLocalStorage.ts # LocalStorage hook'u
│   │   ├── useLocale.ts       # Çoklu dil desteği
│   │   ├── useScrollbarCompensation.ts # Scrollbar telafisi
│   │   ├── useTheme.ts        # Tema yönetimi
│   │   └── useTokenManager.ts # Token yönetimi
│   ├── lib/                   # Yardımcı kütüphaneler
│   │   ├── locale-utils.ts    # Dil yardımcıları
│   │   ├── utils.ts           # Genel yardımcı fonksiyonlar
│   │   └── validations/       # Form validasyon şemaları
│   │       └── auth.ts        # Authentication validasyonları
│   ├── locales/               # Çoklu dil desteği
│   │   ├── en/                # İngilizce çeviriler
│   │   ├── tr/                # Türkçe çeviriler
│   │   └── index.ts           # i18n yapılandırması
│   ├── providers/             # React context sağlayıcıları
│   │   ├── AuthProvider.tsx   # Authentication context
│   │   ├── ClientProviders.tsx# Client-side provider wrapper
│   │   └── TokenManagerProvider.tsx # Token yönetim context
│   ├── services/              # API ve servis katmanları
│   │   ├── apiService.ts      # Ana API servisi
│   │   ├── apiSlice.ts        # RTK Query API slice
│   │   ├── authService.ts     # Authentication servisleri
│   │   ├── constants.ts       # API sabitleri
│   │   ├── tokenManager.ts    # Token yönetim servisi
│   │   └── utils.ts           # Servis yardımcıları
│   ├── store/                 # Redux Toolkit store
│   │   ├── slices/            # Redux slice'ları
│   │   │   ├── langSlice.ts   # Dil durumu
│   │   │   ├── loadingSlice.ts# Yükleme durumu
│   │   │   ├── themeSlice.ts  # Tema durumu
│   │   │   ├── toastSlice.ts  # Toast bildirimleri
│   │   │   └── userSlice.ts   # Kullanıcı durumu
│   │   ├── index.ts           # Store yapılandırması
│   │   └── types.ts           # Store tip tanımları
│   ├── types/                 # TypeScript tip tanımları
│   │   └── index.ts           # Genel tip tanımları
│   ├── utils/                 # Yardımcı fonksiyonlar
│   │   └── security.ts        # Güvenlik yardımcıları
│   ├── index.ts               # Ana export dosyası
│   └── middleware.ts          # Next.js middleware
├── public/                    # Statik dosyalar
│   ├── favicon.svg            # Site ikonu
│   ├── robots.txt             # Robot yönergeleri
│   └── site.webmanifest       # PWA manifest
├── next.config.mjs            # Next.js yapılandırması
├── tailwind.config.mjs        # Tailwind CSS yapılandırması
├── postcss.config.mjs         # PostCSS yapılandırması
├── tsconfig.json              # TypeScript yapılandırması
├── package.json               # Proje bağımlılıkları
└── README.md                  # Bu dosya
```

## Özellikler

### Temel Bileşenler

- **Button**: 5 farklı varyant, 4 boyut seçeneği, loading durumu
- **Input**: Çeşitli varyantlar, ikon desteği, validasyon entegrasyonu
- **Card**: Esnek içerik kartları, hover efektleri
- **Dialog**: Modal diyaloglar, erişilebilir tasarım
- **Select**: Özelleştirilebilir dropdown seçiciler
- **DataTable**: Sıralama, filtreleme, sayfalama desteği

### Form Yönetimi

- **React Hook Form** entegrasyonu
- **Zod** validasyon şemaları
- Çoklu dil form hata mesajları
- Otomatik form durumu yönetimi

### Çoklu Dil Desteği

- Türkçe ve İngilizce dil desteği
- **i18next** entegrasyonu
- Otomatik dil algılama
- Cookie tabanlı dil tercihi

### Tema Sistemi

- Açık/koyu tema desteği
- Sistem tercihi algılama
- CSS custom properties ile renk yönetimi
- Smooth tema geçişleri

### State Yönetimi

- **Redux Toolkit** ile merkezi state
- **Redux Persist** ile kalıcı veri
- Optimistic UI güncellemeleri
- Real-time bildirim sistemi

### Authentication

- JWT token yönetimi
- Otomatik token yenileme
- Korumalı rota sistemi
- Middleware tabanlı yetkilendirme

### Geliştirici Deneyimi

- **TypeScript** ile tip güvenliği
- **ESLint** ve **Prettier** entegrasyonu
- Storybook benzeri component showcase
- Kapsamlı JSDoc dokümantasyonu

## Kullanılan Teknolojiler

### Frontend Framework

- **Next.js 15** - React framework
- **React 18** - UI kütüphanesi
- **TypeScript** - Tip güvenliği

### UI/UX

- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI primitives
- **Lucide React** - İkon kütüphanesi
- **Framer Motion** - Animasyon kütüphanesi

### State Management

- **Redux Toolkit** - State yönetimi
- **React Redux** - React-Redux bağlantısı
- **Redux Persist** - State kalıcılığı

### Form Yönetimi

- **React Hook Form** - Form yönetimi
- **Zod** - Schema validation
- **@hookform/resolvers** - Zod entegrasyonu

### Çoklu Dil

- **i18next** - Uluslararasılaştırma
- **react-i18next** - React entegrasyonu
- **i18next-browser-languagedetector** - Dil algılama

### API Yönetimi

- **RTK Query** - Data fetching
- **Axios** - HTTP client

### Development Tools

- **ESLint** - Kod kalitesi
- **Prettier** - Kod formatlaması
- **PostCSS** - CSS işleme

## Başlangıç

### Gereksinimler

- Node.js 18.0.0 veya üzeri
- npm, yarn veya pnpm

# Kurulum ve Çalıştırma

## Projeyi oluştur

```bash
npx create-starkon-template my-app
cd my-app

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

`Tarayıcıda http://localhost:3000 adresini aç`
```

## Build ve Deploy

```bash
# Production build
npm run build

# Production sunucusunu başlat
npm start

# Kod kalitesi kontrolü
npm run lint

# TypeScript kontrolleri
npm run type-check

# Kod formatlaması
npm run prettier
```

# Sayfalar

```bash
### Ana Sayfalar

-   `/` - Landing page
-   `/dashboard` - Kullanıcı dashboard'u (korumalı)
-   `/components` - Component showcase (korumalı)
-   `/settings` - Kullanıcı ayarları (korumalı)

### Authentication

-   `/auth/login` - Giriş sayfası
```

## Demo Kullanıcıları

```bash
Admin: admin@example.com / Admin123!
User: user@example.com / User123!
Demo: demo@example.com / Demo123!
```

## Component Showcase

```bash
Component showcase sayfası (`/components`) tüm mevcut bileşenleri interaktif olarak sunar:

-   Gerçek zamanlı preview
-   Kod örnekleri
-   Props dokümantasyonu
-   Kullanım senaryoları
-   Filtreleme ve arama
```

## Özelleştirme

### Tema Özelleştirme

`tailwind.config.mjs` dosyasında renk paleti ve tasarım sistemini özelleştirebilirsiniz:

```bash
// Özel renkler tanımlama
colors: {
  primary: {
    50: 'hsl(var(--primary-50))',
    // ... diğer tonlar
  }
}
```

### Yeni Dil Ekleme

1.  `src/locales/` altında yeni dil klasörü oluşturun
2.  `translation.json` dosyasını çevirin
3.  `src/lib/locale-utils.ts` dosyasında dili SUPPORTED_LOCALES'a ekleyin

### Yeni Component Ekleme

1.  `src/components/core/` altında component klasörü oluşturun
2.  Component'i geliştirin
3.  `src/index.ts` dosyasından export edin
4.  `src/data/componentDemoData.tsx` dosyasına demo ekleyin

## API Entegrasyonu

Proje mock authentication kullanır, ancak gerçek API entegrasyonu için:

1.  `src/config/api.ts` dosyasında API URL'lerini güncelleyin
2.  `src/services/apiSlice.ts` dosyasında endpoint'leri tanımlayın
3.  Authentication logic'ini `src/hooks/useAuth.ts` dosyasında güncelleyin

## Deployment

### Vercel (Önerilen)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# out/ klasörünü Netlify'a yükleyin
```

### Docker

```bash
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Katkıda Bulunma

1.  Fork yapın
2.  Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3.  Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4.  Branch'inizi push edin (`git push origin feature/amazing-feature`)
5.  Pull Request oluşturun

## Lisans

MIT License - detaylar için [LICENSE](LICENSE) dosyasına bakın.

## İletişim

- GitHub: [zzafergok/starkon-template](https://github.com/zzafergok/starkon-template)
- Website: [starkon.website](https://starkon.website)
