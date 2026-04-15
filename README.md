# Blockchain Diplom va Sertifikat Tekshiruv Tizimi

Bu loyiha talaba diplomlari, sertifikatlari va onlayn kurs natijalarini blockchain asosida ro'yxatdan o'tkazish, tekshirish va ulashish uchun tayyorlangan browser-based Web3 tizimidir.

## Asosiy imkoniyatlar

- Diplom yoki sertifikatni blockchain'da yaratish
- Hujjat haqiqiyligini `recordId + hash` orqali tekshirish
- Talaba yozuvlarini markazsiz reyestrda saqlash
- Onlayn kurs natijalarini ham xuddi shu tizimga yozish
- Talaba yozuvlarini boshqa universitet yoki ish beruvchi bilan ulashish
- Barcha yozuvlarni yagona blockchain registrda yuritish

## Texnologiyalar

- `Solidity`
- `Hardhat`
- `React + Vite`
- `ethers.js`
- `MetaMask`
- `GitHub Actions`

## Local run

### 1. Kutubxonalarni o'rnatish

```bash
npm install
```

### 2. Local blockchain ishga tushirish

```bash
npx hardhat node
```

### 3. Smart contract deploy qilish

Yangi terminalda:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

Konsolda chiqqan contract address'ni `.env` ichiga yozing:

```env
VITE_CONTRACT_ADDRESS=0x...
```

### 4. Frontendni ishga tushirish

```bash
npm run dev
```

Brauzerda:

```text
http://localhost:5173
```

## VS Code orqali run qilish

1. `npm install` ni bir marta ishlating
2. VS Code ichida `F5` bosing
3. `Launch Chrome against localhost` ni tanlang
4. VS Code dev serverni ishga tushiradi va brauzerni ochadi

## MetaMask sozlash

- `Localhost 8545` tarmog'ini qo'shing
- Hardhat node chiqargan private keylardan birini import qiling
- Deploy bo'lgan contract address'ni `.env` ga yozing

## Testnet deploy

`.env` ichiga:

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your-key
PRIVATE_KEY=your_private_key
VITE_CONTRACT_ADDRESS=0xDeployedAddress
```

So'ng:

```bash
npm run deploy:sepolia
```

## Free hosting

Frontend uchun bepul platformalar:

- `Vercel`
- `Netlify`
- `Cloudflare Pages`
- `GitHub Pages`

Build command:

```bash
npm run build
```

Output folder:

```bash
dist
```

## GitHub Pages deploy

Repository ichiga GitHub Actions workflow qo'shilgan:

- `.github/workflows/deploy-pages.yml`
- `vite.config.js`

Ishlatish uchun:

1. GitHub repository `Settings > Pages` bo'limiga kiring
2. `Source` sifatida `GitHub Actions` ni tanlang
3. `Settings > Secrets and variables > Actions > Variables` ga kiring
4. `VITE_CONTRACT_ADDRESS` nomli variable yarating
5. `main` branchga push qiling

GitHub Pages URL odatda:

```text
https://jasurbekorinboyev403-hash.github.io/Diplom-ma-lumotlarini-tekshiruvchi/
```

## Vercel yoki Netlify deploy

1. Loyihani GitHub'ga push qiling
2. Vercel yoki Netlify'da repo'ni ulang
3. `VITE_CONTRACT_ADDRESS` environment variable'ni kiriting
4. Deploy qiling

## GitHub'ga yuklash

```bash
git init
git add .
git commit -m "Initial blockchain diploma verifier"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

## Browser ishlash tartibi

1. MetaMask'ni ulang
2. Diplom yoki sertifikat ma'lumotini kiriting
3. `Blockchain'da yaratish` tugmasini bosing
4. Chiqqan hash orqali yozuvni keyin tekshiring
5. Talaba yozuvlarini qidiring
6. Kerak bo'lsa boshqa wallet manziliga yozuvni ulashing

## Eslatma

Bu loyiha to'liq ishlaydigan demo/prototip. Production uchun IPFS upload, foydalanuvchi rollari, PDF hash generatsiyasi va indexer qo'shish tavsiya qilinadi.
