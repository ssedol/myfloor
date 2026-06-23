// 주차 NFC/QR 안내 전단지 생성기
// 사용법: node scripts/gen-flyer.js [층...]   예) node scripts/gen-flyer.js B2
//        node scripts/gen-flyer.js all        모든 층 일괄 생성
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const QRCode = require("qrcode");
const sharp = require("sharp");
const { PDFDocument } = require("pdf-lib");

const SITE = "https://myfloor.website";
const OUT = path.join(__dirname, "..", "flyers");

// .env.local에서 NFC_TAG_SECRET 로드 (서버 검증과 동일 키로 서명)
(function loadEnv() {
  if (process.env.NFC_TAG_SECRET) return;
  try {
    const env = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
    const m = env.match(/^NFC_TAG_SECRET=(.+)$/m);
    if (m) process.env.NFC_TAG_SECRET = m[1].trim();
  } catch {}
})();

const SECRET = process.env.NFC_TAG_SECRET;
if (!SECRET) {
  console.error("NFC_TAG_SECRET이 없습니다 (.env.local 확인). 서명 없이 만들면 서버에서 거부됩니다.");
  process.exit(1);
}

// 서버 src/lib/tagToken.ts의 signFloor와 동일한 로직
function signFloor(floor) {
  return crypto.createHmac("sha256", SECRET).update(floor).digest("base64url").slice(0, 16);
}

// 브랜드 컬러 (apartment.ts theme)
const C = {
  bg: "#F5F3EF",
  surface: "#ECEAE4",
  primary: "#9BC72E",
  primaryDark: "#7EA024",
  textMain: "#40342E",
  textSub: "#8B7B72",
  border: "#D5CEC6",
  tint: "#EBF3D7",
};
const FONT = "Malgun Gothic, 'Apple SD Gothic Neo', sans-serif";

// A5 300DPI
const W = 1748;
const H = 2480;
const CX = W / 2;

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// NFC 일러스트: 폰 + 신호파 + 스티커 영역
// cx: 칼럼 중심 x, topY: 일러스트 시작 y
function nfcIllustration(cx, topY) {
  const phoneCy = topY + 100;   // 폰 중심 y
  const waveY   = topY + 218;   // 신호파 기준선 y
  const stY     = topY + 232;   // 스티커 영역 상단 y
  const stW = 256, stH = 110;

  // 폰 (세로 세움, 앞면, -10° 약간 기울임)
  const phone = `
    <g transform="rotate(-10, ${cx}, ${phoneCy})">
      <rect x="${cx-42}" y="${phoneCy-84}" width="84" height="168" rx="16" fill="${C.textMain}"/>
      <rect x="${cx-34}" y="${phoneCy-72}" width="68" height="132" rx="9" fill="white" opacity="0.07"/>
      <rect x="${cx-21}" y="${phoneCy-80}" width="42" height="10" rx="5" fill="#2C2420"/>
      <circle cx="${cx+18}" cy="${phoneCy-75}" r="4" fill="#40342E" opacity="0.6"/>
      <rect x="${cx-17}" y="${phoneCy+64}" width="34" height="6" rx="3" fill="white" opacity="0.38"/>
    </g>`;

  // 신호파 3개 (아래→위로 퍼지는 ∩ 아치, 결제 단말기 NFC 아이콘 스타일)
  const signalArcs = [52, 84, 116].map((r, i) =>
    `<path d="M ${cx-r} ${waveY} A ${r} ${r} 0 0 1 ${cx+r} ${waveY}"
      fill="none" stroke="${C.primary}" stroke-width="14" stroke-linecap="round"
      opacity="${1 - i * 0.3}"/>`
  ).join("");

  // NFC 스티커 영역 (점선 원)
  const r = 68;
  const sCy = stY + r;
  const sticker = `
    <circle cx="${cx}" cy="${sCy}" r="${r}"
      fill="white" stroke="${C.primary}" stroke-width="9" stroke-dasharray="20 16"/>
    <rect x="${cx-20}" y="${sCy-19}" width="40" height="38" rx="6"
      fill="none" stroke="${C.primaryDark}" stroke-width="5" opacity="0.55"/>
    <line x1="${cx-20}" y1="${sCy}" x2="${cx+20}" y2="${sCy}"
      stroke="${C.primaryDark}" stroke-width="3.5" opacity="0.4"/>
    <line x1="${cx}" y1="${sCy-19}" x2="${cx}" y2="${sCy+19}"
      stroke="${C.primaryDark}" stroke-width="3.5" opacity="0.4"/>
    <text x="${cx}" y="${sCy + r + 44}" text-anchor="middle"
      font-family="${FONT}" font-size="34" font-weight="700" fill="${C.primaryDark}">NFC 스티커</text>`;

  return phone + signalArcs + sticker;
}

async function buildSvg(floor) {
  const url = `${SITE}/nfc?floor=${floor}&sig=${signFloor(floor)}`;
  const qrDataUrl = await QRCode.toDataURL(url, {
    margin: 1,
    width: 600,
    color: { dark: "#2E2620", light: "#FFFFFF" },
    errorCorrectionLevel: "M",
  });

  const cxL = 468;  // 좌측 칼럼 중심 (NFC)
  const cxR = 1280; // 우측 칼럼 중심 (QR)
  const qrCy = 1490; // QR 이미지 중심 y

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${C.bg}"/>

  <!-- 헤더 -->
  <text x="${CX}" y="180" text-anchor="middle" font-family="${FONT}" font-size="112" font-weight="800" fill="${C.primaryDark}">몇층</text>
  <text x="${CX}" y="258" text-anchor="middle" font-family="${FONT}" font-size="44" fill="${C.textSub}">주차한 층수, 한 번에 기억하세요</text>

  <!-- 층 배지 카드 -->
  <rect x="90" y="320" width="1568" height="440" rx="56" fill="${C.primary}"/>
  <text x="${CX}" y="445" text-anchor="middle" font-family="${FONT}" font-size="50" font-weight="600" fill="#FFFFFF" opacity="0.92">지금 여기는</text>
  <text x="${CX}" y="668" text-anchor="middle" font-family="${FONT}" font-size="240" font-weight="800" fill="#FFFFFF" letter-spacing="4">${esc(floor)}</text>
  <text x="${CX}" y="735" text-anchor="middle" font-family="${FONT}" font-size="46" font-weight="600" fill="#FFFFFF" opacity="0.92">주차구역</text>

  <!-- 안내 제목 -->
  <text x="${CX}" y="868" text-anchor="middle" font-family="${FONT}" font-size="54" font-weight="800" fill="${C.textMain}">차에서 내릴 때, 한 번만 태그하세요!</text>

  <!-- ===== 좌측: NFC ===== -->
  <rect x="90" y="930" width="756" height="1108" rx="48" fill="${C.surface}"/>
  <rect x="${cxL-96}" y="980" width="192" height="58" rx="29" fill="${C.primary}"/>
  <text x="${cxL}" y="1019" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="800" fill="#FFFFFF">방법 1</text>
  <text x="${cxL}" y="1118" text-anchor="middle" font-family="${FONT}" font-size="52" font-weight="800" fill="${C.textMain}">폰을 갖다 대세요</text>
  <text x="${cxL}" y="1172" text-anchor="middle" font-family="${FONT}" font-size="34" fill="${C.textSub}">안드로이드 · NFC</text>

  ${nfcIllustration(cxL, 1214)}

  <text x="${cxL}" y="1772" text-anchor="middle" font-family="${FONT}" font-size="40" fill="${C.textMain}">휴대폰 뒷면을 스티커에</text>
  <text x="${cxL}" y="1826" text-anchor="middle" font-family="${FONT}" font-size="40" font-weight="700" fill="${C.textMain}">살짝 갖다 대세요</text>

  <!-- ===== 우측: QR ===== -->
  <rect x="902" y="930" width="756" height="1108" rx="48" fill="${C.surface}"/>
  <rect x="${cxR-96}" y="980" width="192" height="58" rx="29" fill="${C.primaryDark}"/>
  <text x="${cxR}" y="1019" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="800" fill="#FFFFFF">방법 2</text>
  <text x="${cxR}" y="1118" text-anchor="middle" font-family="${FONT}" font-size="52" font-weight="800" fill="${C.textMain}">카메라로 찍으세요</text>
  <text x="${cxR}" y="1172" text-anchor="middle" font-family="${FONT}" font-size="34" fill="${C.textSub}">아이폰 · QR 스캔</text>

  <!-- QR 코드 -->
  <rect x="${cxR-196}" y="${qrCy-196}" width="392" height="392" rx="32" fill="#FFFFFF" stroke="${C.border}" stroke-width="4"/>
  <image href="${qrDataUrl}" x="${cxR-166}" y="${qrCy-166}" width="332" height="332"/>

  <!-- 카메라 조준 모서리 장식 -->
  <path d="M ${cxR-196} ${qrCy-140} L ${cxR-196} ${qrCy-196} L ${cxR-140} ${qrCy-196}" fill="none" stroke="${C.primaryDark}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M ${cxR+140} ${qrCy-196} L ${cxR+196} ${qrCy-196} L ${cxR+196} ${qrCy-140}" fill="none" stroke="${C.primaryDark}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M ${cxR-196} ${qrCy+140} L ${cxR-196} ${qrCy+196} L ${cxR-140} ${qrCy+196}" fill="none" stroke="${C.primaryDark}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M ${cxR+140} ${qrCy+196} L ${cxR+196} ${qrCy+196} L ${cxR+196} ${qrCy+140}" fill="none" stroke="${C.primaryDark}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>

  <text x="${cxR}" y="1772" text-anchor="middle" font-family="${FONT}" font-size="40" fill="${C.textMain}">폰 카메라 앱으로</text>
  <text x="${cxR}" y="1826" text-anchor="middle" font-family="${FONT}" font-size="40" font-weight="700" fill="${C.textMain}">QR을 비추세요</text>

  <!-- 결과 스트립 -->
  <rect x="90" y="2118" width="1568" height="122" rx="61" fill="${C.tint}"/>
  <text x="${CX}" y="2197" text-anchor="middle" font-family="${FONT}" font-size="50" font-weight="700" fill="${C.primaryDark}">→ ${esc(floor)} 주차구역이 자동으로 저장돼요</text>

  <!-- 푸터 -->
  <text x="${CX}" y="2400" text-anchor="middle" font-family="${FONT}" font-size="38" fill="${C.textSub}">처음이신가요?  myfloor.website 에서 차량을 먼저 등록하세요</text>
</svg>`;
}

async function genOne(floor) {
  const svg = await buildSvg(floor);
  const pngPath = path.join(OUT, `flyer-${floor}.png`);
  const pdfPath = path.join(OUT, `flyer-${floor}.pdf`);

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  fs.writeFileSync(pngPath, png);

  // PDF (A5)
  const pdf = await PDFDocument.create();
  const A5 = [419.528, 595.276]; // 148 x 210 mm in pt
  const page = pdf.addPage(A5);
  const img = await pdf.embedPng(png);
  page.drawImage(img, { x: 0, y: 0, width: A5[0], height: A5[1] });
  fs.writeFileSync(pdfPath, await pdf.save());

  console.log(`✓ ${floor}: flyer-${floor}.png, flyer-${floor}.pdf`);
}

async function main() {
  const args = process.argv.slice(2);
  let floors = args;
  if (args.length === 0) floors = ["B2"];
  if (args[0] === "all") {
    const cfg = fs.readFileSync(
      path.join(__dirname, "..", "src", "config", "apartment.ts"),
      "utf8"
    );
    const grab = (key) =>
      (cfg.match(new RegExp(`${key}:\\s*\\[([^\\]]*)\\]`))?.[1] || "")
        .match(/"([^"]+)"/g)
        ?.map((s) => s.replace(/"/g, "")) || [];
    floors = [...grab("undergroundFloors"), ...grab("aboveFloors")];
  }
  fs.mkdirSync(OUT, { recursive: true });
  for (const f of floors) await genOne(f);
  console.log(`\n완료 → ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
