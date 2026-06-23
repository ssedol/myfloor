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

// 휴대폰 실루엣 (뒷면 태그용). cx,cy 중심, 높이 h, 회전 rot(도)
function phoneIcon(cx, cy, h, rot, color) {
  const w = h * 0.5;
  const rx = w * 0.2;
  const sw = w * 0.7, sh = h * 0.12; // 카메라바
  return `<g transform="rotate(${rot} ${cx} ${cy})">
    <rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${rx}" fill="${color}"/>
    <rect x="${cx - sw / 2}" y="${cy - h / 2 + h * 0.08}" width="${sw}" height="${sh}" rx="${sh / 2}" fill="#FFFFFF" opacity="0.85"/>
    <circle cx="${cx}" cy="${cy + h * 0.3}" r="${w * 0.12}" fill="#FFFFFF" opacity="0.85"/>
  </g>`;
}

// 접촉식 전파 아치 n개. (ax,ay)에서 우상향으로 퍼짐
function waves(ax, ay, color) {
  return [42, 74, 106]
    .map(
      (r) =>
        `<path d="M ${ax - r * 0.35} ${ay - r * 0.62} A ${r} ${r} 0 0 1 ${ax + r * 0.62} ${ay + r * 0.35}" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"/>`
    )
    .join("");
}

async function buildSvg(floor) {
  const url = `${SITE}/nfc?floor=${floor}&sig=${signFloor(floor)}`;
  const qrDataUrl = await QRCode.toDataURL(url, {
    margin: 1,
    width: 600,
    color: { dark: "#2E2620", light: "#FFFFFF" },
    errorCorrectionLevel: "M",
  });

  const cxL = 468; // 좌측 칼럼 중심 (NFC)
  const cxR = 1280; // 우측 칼럼 중심 (QR)
  const vy = 1500; // 시각요소 중심 y

  // NFC 부착영역: 점선 원 + 접촉식 아치 + 라벨, 우상단에 폰 태그 힌트
  const nfcR = 172;
  const nfcArcs = [50, 84, 118]
    .map(
      (r) =>
        `<path d="M ${cxL} ${vy - r * 0.7} A ${r} ${r} 0 0 1 ${cxL} ${vy + r * 0.7}" fill="none" stroke="${C.primaryDark}" stroke-width="15" stroke-linecap="round"/>`
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${C.bg}"/>

  <!-- 헤더 -->
  <text x="${CX}" y="180" text-anchor="middle" font-family="${FONT}" font-size="112" font-weight="800" fill="${C.primaryDark}">몇층</text>
  <text x="${CX}" y="258" text-anchor="middle" font-family="${FONT}" font-size="44" fill="${C.textSub}">주차한 층수, 한 번에 기억하세요</text>

  <!-- 층 배지 카드 -->
  <rect x="90" y="320" width="1568" height="440" rx="56" fill="${C.primary}"/>
  <text x="${CX}" y="445" text-anchor="middle" font-family="${FONT}" font-size="50" font-weight="600" fill="#FFFFFF" opacity="0.92">지금 여기는</text>
  <text x="${CX}" y="668" text-anchor="middle" font-family="${FONT}" font-size="240" font-weight="800" fill="#FFFFFF" letter-spacing="4">${esc(
    floor
  )}</text>
  <text x="${CX}" y="735" text-anchor="middle" font-family="${FONT}" font-size="46" font-weight="600" fill="#FFFFFF" opacity="0.92">주차구역</text>

  <!-- 안내 제목 -->
  <text x="${CX}" y="868" text-anchor="middle" font-family="${FONT}" font-size="54" font-weight="800" fill="${C.textMain}">차에서 내릴 때, 한 번만 태그하세요!</text>

  <!-- ===== 좌측: NFC ===== -->
  <rect x="90" y="930" width="756" height="1108" rx="48" fill="${C.surface}"/>
  <rect x="${cxL - 96}" y="980" width="192" height="58" rx="29" fill="${C.primary}"/>
  <text x="${cxL}" y="1019" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="800" fill="#FFFFFF">방법 1</text>
  <text x="${cxL}" y="1130" text-anchor="middle" font-family="${FONT}" font-size="52" font-weight="800" fill="${C.textMain}">폰을 갖다 대세요</text>
  <text x="${cxL}" y="1188" text-anchor="middle" font-family="${FONT}" font-size="34" fill="${C.textSub}">안드로이드 · NFC</text>

  <!-- NFC 스티커 부착 영역 (점선 원) -->
  <circle cx="${cxL}" cy="${vy}" r="${nfcR}" fill="#FFFFFF" stroke="${C.primary}" stroke-width="9" stroke-dasharray="26 22"/>
  ${nfcArcs}
  <circle cx="${cxL - 38}" cy="${vy}" r="17" fill="${C.primaryDark}"/>
  <text x="${cxL}" y="${vy + nfcR - 34}" text-anchor="middle" font-family="${FONT}" font-size="30" font-weight="700" fill="${C.textSub}">NFC 스티커</text>
  <!-- 폰 태그 힌트 (우상단) -->
  ${phoneIcon(cxL + 150, vy - 150, 150, 24, C.textMain)}
  ${waves(cxL + 70, vy - 78, C.primaryDark)}

  <text x="${cxL}" y="1758" text-anchor="middle" font-family="${FONT}" font-size="40" fill="${C.textMain}">원 안에 휴대폰 뒷면을</text>
  <text x="${cxL}" y="1812" text-anchor="middle" font-family="${FONT}" font-size="40" font-weight="700" fill="${C.textMain}">살짝 갖다 대세요</text>

  <!-- ===== 우측: QR ===== -->
  <rect x="902" y="930" width="756" height="1108" rx="48" fill="${C.surface}"/>
  <rect x="${cxR - 96}" y="980" width="192" height="58" rx="29" fill="${C.primaryDark}"/>
  <text x="${cxR}" y="1019" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="800" fill="#FFFFFF">방법 2</text>
  <text x="${cxR}" y="1130" text-anchor="middle" font-family="${FONT}" font-size="52" font-weight="800" fill="${C.textMain}">카메라로 찍으세요</text>
  <text x="${cxR}" y="1188" text-anchor="middle" font-family="${FONT}" font-size="34" fill="${C.textSub}">아이폰 · QR 스캔</text>

  <rect x="${cxR - 178}" y="${vy - 178}" width="356" height="356" rx="28" fill="#FFFFFF" stroke="${C.border}" stroke-width="4"/>
  <image href="${qrDataUrl}" x="${cxR - 150}" y="${vy - 150}" width="300" height="300"/>

  <text x="${cxR}" y="1758" text-anchor="middle" font-family="${FONT}" font-size="40" fill="${C.textMain}">폰 카메라 앱으로</text>
  <text x="${cxR}" y="1812" text-anchor="middle" font-family="${FONT}" font-size="40" font-weight="700" fill="${C.textMain}">QR을 비추세요</text>

  <!-- 결과 스트립 -->
  <rect x="90" y="2118" width="1568" height="122" rx="61" fill="${C.tint}"/>
  <text x="${CX}" y="2197" text-anchor="middle" font-family="${FONT}" font-size="50" font-weight="700" fill="${C.primaryDark}">→ ${esc(
    floor
  )} 주차구역이 자동으로 저장돼요</text>

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
