// 주차 NFC/QR 안내 전단지 생성기
// 사용법: node scripts/gen-flyer.js [층...]   예) node scripts/gen-flyer.js B2
//        node scripts/gen-flyer.js all        모든 층 일괄 생성
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const sharp = require("sharp");
const { PDFDocument } = require("pdf-lib");

const SITE = "https://myfloor.website";
const OUT = path.join(__dirname, "..", "flyers");

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

async function buildSvg(floor) {
  const url = `${SITE}/nfc?floor=${floor}`;
  const qrDataUrl = await QRCode.toDataURL(url, {
    margin: 1,
    width: 560,
    color: { dark: "#2E2620", light: "#FFFFFF" },
    errorCorrectionLevel: "M",
  });

  // 접촉식(NFC) 아이콘: 우측으로 열린 동심 아치 + 점
  const nfcCx = 245, nfcCy = 1262;
  const arcs = [70, 115, 160]
    .map(
      (r) =>
        `<path d="M ${nfcCx} ${nfcCy - r * 0.72} A ${r} ${r} 0 0 1 ${nfcCx} ${
          nfcCy + r * 0.72
        }" fill="none" stroke="${C.primaryDark}" stroke-width="16" stroke-linecap="round"/>`
    )
    .join("");
  const nfcDot = `<circle cx="${nfcCx - 18}" cy="${nfcCy}" r="20" fill="${C.primaryDark}"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${C.bg}"/>

  <!-- 헤더 -->
  <text x="${CX}" y="225" text-anchor="middle" font-family="${FONT}" font-size="120" font-weight="800" fill="${C.primaryDark}">몇층</text>
  <text x="${CX}" y="312" text-anchor="middle" font-family="${FONT}" font-size="46" fill="${C.textSub}">주차한 층수, 한 번에 기억하세요</text>

  <!-- 층 배지 카드 -->
  <rect x="130" y="380" width="1488" height="560" rx="64" fill="${C.primary}"/>
  <text x="${CX}" y="520" text-anchor="middle" font-family="${FONT}" font-size="54" font-weight="600" fill="#FFFFFF" opacity="0.92">지금 여기는</text>
  <text x="${CX}" y="800" text-anchor="middle" font-family="${FONT}" font-size="320" font-weight="800" fill="#FFFFFF" letter-spacing="4">${esc(
    floor
  )}</text>
  <text x="${CX}" y="895" text-anchor="middle" font-family="${FONT}" font-size="50" font-weight="600" fill="#FFFFFF" opacity="0.92">주차구역</text>

  <!-- 안내 제목 -->
  <text x="${CX}" y="1075" text-anchor="middle" font-family="${FONT}" font-size="58" font-weight="800" fill="${C.textMain}">차에서 내릴 때 한 번만!</text>

  <!-- 방법 A: 안드로이드 NFC -->
  <rect x="130" y="1140" width="1488" height="300" rx="52" fill="${C.surface}"/>
  ${arcs}${nfcDot}
  <text x="470" y="1252" font-family="${FONT}" font-size="56" font-weight="800" fill="${C.textMain}">안드로이드 · NFC</text>
  <text x="470" y="1330" font-family="${FONT}" font-size="44" fill="${C.textSub}">스티커에 휴대폰 뒷면을 갖다 대세요</text>

  <!-- 방법 B: 아이폰 QR -->
  <rect x="130" y="1480" width="1488" height="730" rx="52" fill="${C.surface}"/>
  <text x="${CX}" y="1585" text-anchor="middle" font-family="${FONT}" font-size="56" font-weight="800" fill="${C.textMain}">아이폰 · QR 스캔</text>
  <text x="${CX}" y="1655" text-anchor="middle" font-family="${FONT}" font-size="44" fill="${C.textSub}">카메라 앱으로 아래 QR을 비추세요</text>
  <rect x="${CX - 300}" y="1690" width="600" height="480" rx="32" fill="#FFFFFF"/>
  <image href="${qrDataUrl}" x="${CX - 240}" y="1700" width="460" height="460"/>

  <!-- 결과 스트립 -->
  <rect x="130" y="2255" width="1488" height="118" rx="59" fill="${C.tint}"/>
  <text x="${CX}" y="2332" text-anchor="middle" font-family="${FONT}" font-size="52" font-weight="700" fill="${C.primaryDark}">→ ${esc(
    floor
  )} 주차구역이 자동으로 저장돼요</text>

  <!-- 푸터 -->
  <text x="${CX}" y="2440" text-anchor="middle" font-family="${FONT}" font-size="40" fill="${C.textSub}">처음이신가요?  myfloor.website 에서 차량을 먼저 등록하세요</text>
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
