# 🕵️‍♂️ DEDEKTİF // İnteraktif Polis Soruşturması & Adli Vaka Simülatörü

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![ReactFlow](https://img.shields.io/badge/@xyflow/react-12.11-FF0072?style=flat)](https://reactflow.dev/)
[![Howler.js](https://img.shields.io/badge/Howler.js-2.2-FF8800?style=flat)](https://howlerjs.com/)

**DEDEKTİF**, 90'lar sinematik polisiye ve *film-noir* atmosferinde geliştirilmiş interaktif bir cinayet ve adli vaka çözme simülasyonudur. Oyuncu; daktilolu dedektif masası, kırmızı iplerle delilleri birbirine bağladığı mantar pano, UV ışıklı kriminal laboratuvar incelemeleri, telsiz saha sevkiyatları ve resmi sorgu tutanakları aracılığıyla ipuçlarını birleştirerek adaleti sağlar.

---

## 📸 Ekran Görüntüleri ve Görsel Deneyim

* **Dedektif Masası:** Geniş açılı, masa lambalı, santral telefonlu ve açık vaka dosyalı interaktif merkez.
* **Mantar Pano:** Raptiyeler, kırmızı iplik bağlantıları, polaroid fotoğraflar ve sarı dedektif notları.
* **Adli Tıp & Kriminal Laboratuvar:** UV lamba ile gizli fosforlu izler, mikroskopik büyüteç ve ses kaydı transkriptleri.
* **Sorgu Odası:** Şüpheli profilleri, alibi kartları ve resmi onaylı emniyet sorgu tutanakları.

---

## 🌟 Temel Özellikler

### 1. 🗄️ Dinamik Dedektif Masası (`DeskView`)
- **İnteraktif Aydınlatma:** Yeşil bankacı masa lambasına tıklayarak açılıp kapatılabilen dinamik ışık ve gölge atmosferi.
- **Döner Santral Telefonu:** Soruşturma esnasında saha ekiplerinden veya ihbarcılardan gelen çalan telefonlar, santral rehberi ve sesli bildirimler.
- **Kaydırılabilir Geniş Tuval:** Mobil ve masaüstünde 16:9 sinematik geniş masa düzenini koruyan, yatay kaydırılabilir (pan) ergonomik masa yapısı.

### 2. 📌 Mantar Pano & Kırmızı İplik Motoru (`BoardView`)
- **React Flow Tabanlı Sonsuz Tuval:** `@xyflow/react` altyapısıyla delil fotoğrafları, kriminal raporlar ve dedektif post-it'leri.
- **Kırmızı İplerle Bağlantı Kurma:** İki raptiye arasına kırmızı ip çekerek deliller arasındaki mantıksal çelişkileri ve hipotezleri ortaya çıkarma.
- **Dedektif Not Sistemi:** Panoya sarı post-it notları ekleme; tek tıkla açılan büyüteçli modal üzerinden metin düzenleme ve silme.
- **Makas Modu:** Yanlış bağlanan ipleri tek tıkla kesme ve hipotezleri baştan oluşturma.
- **Figma / Miro Tarzı Navigasyon:** Mac Trackpad'de 2 parmakla serbest gezinme (Free Pan) ve 2 parmakla kıstırarak yakınlaşma/uzaklaşma (Pinch-to-Zoom).

### 3. 🔬 Kriminal Delil İnceleme (`InspectEvidenceModal`)
- **UV Işık Taraması:** Olay yeri delillerinde görünmeyen parmak izlerini, gizli kan/fosfor izlerini mor ışıkla tespit etme.
- **Büyüteç Modu:** Saat seri numaraları, imzalar ve mikroskobik çatlakları yakından okuma.
- **Ses Kaydı & Bant Transkripti:** Şüpheli ses kayıtlarının daktilo dökümlerini satır satır inceleme.

### 4. 🏢 Şüpheli Sorgu Odası (`InterrogationRoom`)
- **Resmi Zabıt Tutanağı:** İstanbul Emniyet Müdürlüğü Asayiş Şube standartlarında hazırlanmış resmi daktilo sorgu tutanağı.
- **Dallanan Soru-Cevap Ağacı:** Şüpheliye sorular sorarak alibisini sınama ve çelişkili ifadelerini tespit etme.
- **Mobil Sekmeli Düzen:** Mobilde *Profil & Biyografi* ve *Resmi Sorgu Tutanağı* arasında akıcı geçiş.

### 5. 📻 Telsiz Saha Sevkiyatı (`DispatchModal`)
- Şehirdeki kritik konumlara (rıhtım, otel, mezarlık, adli tıp) ekip yönlendirme.
- Görev tamamlandığında santral telefonu üzerinden dedektife yeni delil ulaştırma mekanizması.

### 6. ⚖️ Cumhuriyet Başsavcılığı Resmi İddianamesi (`AccusationModal`)
- Katil şüpheliyi, kullanılan cinayet aletini ve şüpheyi kesinleştiren ana delili seçerek davayı mahkemeye sunma.
- Doğru kombinasyonda zafer ekranı (`CaseClosedView`), hatalı suçlamada ise soruşturma cezası.

---

## 🛠️ Mimari ve Teknoloji Yığını

| Katman | Teknoloji / Kütüphane | Açıklama |
| :--- | :--- | :--- |
| **Çekirdek** | `React 19` + `TypeScript 5` + `Vite 8` | Yüksek performanslı, tam tip güvenli modern web uygulaması |
| **Pano & Ağ Grafı** | `@xyflow/react` (React Flow 12) | Düğümler, kenarlar (edges), serbest sürükleme ve zoom motoru |
| **State Yönetimi** | `Zustand 5` | Merkezi oyun durumu, vaka verileri, delil iğneleme ve ses yönetimi |
| **Stil & Tasarım** | `Tailwind CSS v4` + Özel Noir Utility'leri | `aged-paper`, `cork-surface`, `film-grain`, `lamp-lighting` |
| **Ses Motoru** | `Howler.js 2.2` | Daktilo, kağıt, raptiye, teyp, santral zili ve eureka efektleri |
| **İkon Seti** | `Lucide React` | UI ve araç seti ikonları |
| **Kod Kalitesi** | `Oxlint` | Ultra hızlı Rust tabanlı linter |

---

## 📂 Dizin Yapısı

```
adventurous-bardeen/
├── public/
│   ├── assets/              # Arka plan fotoğrafları, şüpheli portreleri, delil görselleri
│   └── cases/               # Vaka JSON dosyaları (case_104.json, case_305.json vb.)
├── src/
│   ├── components/
│   │   ├── board/
│   │   │   ├── CustomNodes.tsx     # Polaroid, Belge ve Post-it düğüm tasarımları
│   │   │   └── RedStringEdge.tsx   # Kırmızı iplik bağlantı çizgisi
│   │   ├── AccusationModal.tsx     # Resmi mahkeme iddianamesi
│   │   ├── BoardView.tsx           # Mantar pano ve delil yönetim tuvali
│   │   ├── CaseArchiveModal.tsx    # Vaka arşiv dolabı ve dosya seçici
│   │   ├── CaseClosedView.tsx      # Dava sonuç / Zafer ekranı
│   │   ├── CaseFileModal.tsx       # Çok sayfalı manila vaka klasörü
│   │   ├── DeskView.tsx            # Dedektif masası görünümü
│   │   ├── DispatchModal.tsx       # Telsiz ekip sevkiyat istasyonu
│   │   ├── HeaderNav.tsx           # Üst bar ve mobil alt navigasyon menüsü
│   │   ├── InspectEvidenceModal.tsx# UV ışıklı delil inceleme modalı
│   │   ├── InspectNoteModal.tsx    # Post-it dedektif notu düzenleme modalı
│   │   ├── InterrogationRoom.tsx   # Şüpheli sorgu odası ve ifade tutanağı
│   │   └── TimelineModal.tsx       # Cinayet gecesi zaman şeridi
│   ├── services/
│   │   └── audio.ts                # Web Audio / Howler ses kütüphanesi
│   ├── store/
│   │   └── gameStore.ts            # Zustand oyun mantığı ve veri akışı
│   ├── types/
│   │   └── case.ts                 # Vaka, delil, şüpheli ve çelişki TypeScript tipleri
│   ├── App.tsx                     # Ana uygulama bileşeni
│   ├── index.css                   # Tailwind 4 ve noir yazı tipi tanımları
│   └── main.tsx                    # React kök girişi
├── package.json
└── README.md
```

---

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

### Gereksinimler
- **Node.js**: v18.0 veya üzeri
- **npm** / **pnpm** / **yarn**

### 1. Bağımlılıkları Yükleyin
```bash
npm install
```

### 2. Geliştirici Sunucusunu Başlatın
```bash
npm run dev
```
Tarayıcınızda `http://localhost:5173` (veya Vite tarafından atanan port) adresini açın.

### 3. Derleme ve Tip Kontrolü
```bash
npm run build
```

### 4. Linter Kontrolü
```bash
npm run lint
```

---

## 📱 Mobil & Tablet Optimizasyonu

Uygulama, hem masaüstü tarayıcılarda hem de iOS & Android cihazlarda kusursuz çalışacak şekilde optimize edilmiştir:
- **Mobil Alt Navigasyon Çubuğu:** Masa, Pano, Sorgu, Zaman ve Telsiz arasında tek parmakla hızlı geçiş.
- **iOS Çentik & Safe Area:** `viewport-fit=cover` ve `safe-area-inset` tam desteği.
- **Dokunmatik Hareketler:** Çift parmakla panoyu yakınlaştırma (`Pinch-to-Zoom`), tek parmakla panoda gezinme ve tekil kart sürükleme.

---

## 📝 Yeni Vaka Ekleme Rehberi (Vaka Veri Şeması & Blueprint)

Uygulama **%100 dinamik ve modüler JSON vaka mimarisi** ile tasarlanmıştır. Kod tabanına dokunmadan, sadece `public/cases/` dizinine yeni bir `.json` dosyası ekleyerek dilediğiniz cinayet, soygun veya casusluk vakasını oluşturabilirsiniz.

---

### 🧱 Vaka JSON Temel Yapısı & Alan Rehberi

Bir vaka JSON dosyası (`case_XXX.json`) aşağıdaki 10 temel yapı taşından oluşur:

#### 1. 🏷️ Vaka Üst Bilgileri (Header & Metadata)
| Alan | Tip | Açıklama |
| :--- | :--- | :--- |
| `id` | `string` | Benzersiz vaka kimliği (örn: `"case_105"`) |
| `title` | `string` | Vakanın tam resmi başlığı (örn: `"Vaka #105: Gece Yarısı Ekspresi Cinayeti"`) |
| `subtitle` | `string` | Kısa sinematik alt başlık |
| `date` | `string` | Olayın gerçekleştiği tarih (örn: `"12 Ekim 1994"`) |
| `location` | `string` | Olay yeri ve şehir bilgisi |
| `summary` | `string` | Giriş özeti ve dedektif brifingi |

---

#### 2. 📁 `filePages` (Manila Vaka Dosyası Sayfaları)
Masadaki açık klasörde yer alan sayfaları tanımlar:
```json
"filePages": [
  {
    "pageNumber": 1,
    "title": "Olay Yeri İlk Müdahale Raporu",
    "classification": "GİZLİ // CİNAYET MASASI",
    "contentMarkdown": "Maktul Lord Croft, çalışma odasında saat 03:14'te ölü bulunmuştur...",
    "associatedEvidenceIds": ["evidence_pocket_watch", "evidence_toxin"]
  }
]
```

---

#### 3. 🔍 `evidences` (Kriminal & Saha Delilleri)
Panoya iğnelenebilen ve laboratuvarda incelenebilen tüm deliller:
```json
"evidences": [
  {
    "id": "evidence_pocket_watch",
    "title": "Kırık Köstekli Saat",
    "category": "object", // 'suspect' | 'victim' | 'forensic' | 'document' | 'audio' | 'object' | 'dispatch'
    "description": "Camı çatlamış, yelkovanı 03:14'te durmuş altın kaplama antika saat.",
    "sourceLocation": "Maktulün ceket cebi",
    "image": "/assets/pocket_watch.jpg",
    "officialDocumentNo": "T.C. İST-KRİMİNAL // DELİL-01",
    "hiddenClueUV": "Kordonun iç kısmında mor ışıkla parlayan lityum gresi izi bulundu.",
    "hiddenClueMagnifier": "Arka kapağında saat ustası V. Vance'in mikroskobik damgası yer alıyor.",
    "transcriptMarkdown": "Adli tıp balistik ve mekanizma inceleme raporu dökümü..."
  }
]
```

---

#### 4. 👥 `suspects` (Şüpheli Profilleri & Çapraz Sorgu Ağacı)
Sorgu odasındaki şüpheliler ve ifade ağaçları:
```json
"suspects": [
  {
    "id": "suspect_viktor",
    "name": "Viktor Vance",
    "age": 52,
    "role": "Usta Saat Tamircisi & Eski Ortak",
    "imageNormal": "/assets/viktor_vance.jpg",
    "imageInterrogation": "/assets/viktor_interrogation.jpg",
    "alibi": "Olay gecesi saat 02:00'den sabah 06:00'ya kadar atölyesinde çalıştığını iddia ediyor.",
    "motive": "Lord Croft'a 50.000$ antika borcu vardı ve iflasın eşiğindeydi.",
    "stressLevel": 30,
    "confessed": false,
    "confessionStage": "denial", // 'denial' | 'admitted_presence' | 'admitted_fight' | 'full_confession'
    "dialogueTree": [
      {
        "question": "Olay saatinde atölyenizde olduğunuzu kanıtlayabilir misiniz?",
        "tactic": "evidence", // 'good_cop' | 'bad_cop' | 'evidence'
        "response": "Rıhtımdaki atölyemde yalnızdım, kimse beni görmedi ama tezgahın başındaydım.",
        "stressDelta": 15
      }
    ]
  }
]
```

---

#### 5. 🧶 `contradictions` (Mantar Pano Kırmızı İplik Çelişkileri & Hipotezler)
İki delil kırmızı iplikle birbirine bağlandığında açığa çıkan hipotezler:
```json
"contradictions": [
  {
    "id": "contra_time_watch",
    "evidenceA": "evidence_pocket_watch",
    "evidenceB": "evidence_autopsy_report",
    "hypothesisTitle": "Zaman Çelişkisi & Sahte Alibi",
    "hypothesisText": "Saat 03:14'te durmuş olsa da, otopsi ölümün 01:30 civarında gerçekleştiğini kanıtlıyor. Saat kasten ayarlanmış!",
    "discovered": false
  }
]
```

---

#### 6. ⏱️ `timeline` (Kronoloji & Zaman Şeridi)
```json
"timeline": [
  {
    "id": "t1",
    "time": "01:30",
    "title": "Gerçek Ölüm Zamanı",
    "description": "Adli tıp biyokimya analizine göre zehir maktule bu saatte enjekte edildi.",
    "associatedEvidenceId": "evidence_autopsy_report",
    "isVerified": true
  }
]
```

---

#### 7. 📻 `dispatchMissions` (Telsiz Saha Ekipleri)
```json
"dispatchMissions": [
  {
    "id": "dispatch_harbor",
    "title": "Rıhtım Saat Atölyesi Olay Yeri Taraması",
    "targetLocation": "Karaköy Rıhtımı No:14",
    "team": "forensic", // 'forensic' | 'dive_team' | 'bank_audit' | 'patrol'
    "description": "Atölyede gizli kasa veya zehir kalıntısı aramak üzere OYİ ekibi sevk edin.",
    "durationSec": 8,
    "status": "available",
    "resultEvidenceId": "evidence_chemical_vial",
    "resultReport": "Tezgahın altındaki gizli bölmede boş bir toksin şişesi ele geçirildi."
  }
]
```

---

#### 8. ☎️ `directory` (Santral Telefon Rehberi)
```json
"directory": [
  {
    "id": "contact_lab",
    "name": "Kriminal Polis Laboratuvarı",
    "role": "Başuzman Dr. Arda",
    "status": "Hatta",
    "viewTarget": "desk"
  }
]
```

---

#### 9. ⚔️ `weapons` (Olası Cinayet Aletleri)
```json
"weapons": [
  {
    "id": "weapon_curare_toxin",
    "name": "Kürar Nörotoksini",
    "description": "Solunumu durduran, iz bırakmayan hızlı etkili zehir."
  }
]
```

---

#### 10. ⚖️ `solution` (Cumhuriyet Başsavcılığı Karar Anahtarı) & 📰 `newspaper`
```json
"solution": {
  "culpritId": "suspect_viktor",
  "murderWeaponId": "weapon_curare_toxin",
  "criticalEvidenceId": "evidence_chemical_vial",
  "keyMotive": "İflas tehdidi ve Lord Croft'un şantajı",
  "correctVerdictSummary": "Viktor Vance, maktule kürar toksini enjekte ettikten sonra saati 03:14'e kurarak sahte alibi oluşturmuştur."
},
"newspaper": {
  "newspaperName": "HÜRRİYET ASAYİŞ BASINI",
  "issueInfo": "14 EKİM 1994 // SAYI: 14820",
  "headline": "SAAT USTASININ KUSURSUZ PLANI ÇÖKTÜ!",
  "article": "Cinayet Büro dedektiflerinin mantar panodaki titiz delil analizi adaleti sağladı...",
  "commendationTitle": "İSTANBUL EMNİYET MÜDÜRLÜĞÜ ÜSTÜN HİZMET MADALYASI",
  "commendationBody": "Vakayı sıfır hata ile aydınlatan dedektife teşekkür belgesi takdim edilmiştir."
}
```

---

## 🌐 Uzaktan Canlı Vaka Yayınlama (GitHub OTA Entegrasyonu)

Oyun, web sitesini yeniden derlemeye (**rebuild/deploy**) gerek kalmadan doğrudan bağlı olduğu GitHub deposundan yeni vakaları anında çeker.

* **Bağlı Canlı Depo:** `https://github.com/joykurtdarknol-max/json`
* **Desteklenen Dallar:** `main` ve `master`

---

### 📥 1. Adım: Yeni Vaka Dosyasını GitHub'a Yükleyin
Oluşturduğunuz vaka JSON dosyasını (örneğin `case_105.json`) reponun ana dizinine veya `cases/` klasörüne yükleyin:
```
joykurtdarknol-max/json/
├── cases.json
├── case_105.json
└── case_202.json
```

---

### 📋 2. Adım: `cases.json` Liste Dosyasını Güncelleyin
Reponuzdaki `cases.json` dosyasına yeni vakanızın özet kartını ekleyin:

```json
[
  {
    "id": "case_105",
    "title": "Vaka #105: Gece Yarısı Ekspresi",
    "subtitle": "Yataklı Vagonda Gizemli Hesaplaşma",
    "date": "18 Kasım 1994",
    "location": "Sirkeci Garı / İstanbul",
    "difficulty": "Zor",
    "summary": "Doğu Ekspresi kompartımanında bulunan kilitli vagon cinayeti ve kayıp bir elmas...",
    "thumbnail": "/assets/pocket_watch.jpg",
    "isAvailable": true,
    "tag": "TREN // SİYANÜR",
    "filePath": "case_105.json"
  }
]
```

> [!TIP]
> **Görsel Seçimi:** `thumbnail` ve delil görsellerinde dilerseniz oyunun içindeki hazır görselleri (örn: `/assets/pocket_watch.jpg`, `/assets/bullet.jpg`, `/assets/toxin_vial.jpg`, `/assets/document.jpg`), dilerseniz doğrudan açık bir internet URL'sini kullanabilirsiniz.

---

### ⚡ 3. Adım: Canlıda Oynayın!
* GitHub'a `commit & push` yaptıktan sonra oyundaki **Vaka Arşivi (📁)** dolabını açın.
* Sağ üstte yeşil **"Canlı Eşitlendi"** rozeti belirecek ve yeni vakanız listede anında görünecektir.
* İnternet bağlantısı olmasa dahi yerel vakalar kesintisiz çalışmaya devam eder.

---

## ⚡ Yerel Vaka Geliştirme (Sıfır Manuel Konfigürasyon)
Lokal geliştirme ortamında çalışırken:
* `public/cases/` dizinine `case_XXX.json` formatında dosyanızı kaydettiğiniz anda Vite'ın otomatik modül tarayıcısı (`import.meta.glob`) dosyayı anında algılar ve arşiv dolabına ekler.

---

## 📄 Lisans

Bu proje kişisel gelişim ve eğlence amaçlı açık kaynaklı bir deneysel simülasyondur.
Tüm hakları saklıdır © 2026.


