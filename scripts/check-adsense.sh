#!/usr/bin/env bash
# 배포된 사이트에 애드센스 스니펫이 제대로 들어갔는지 확인한다.
#
#   bash scripts/check-adsense.sh                      # https://myfloor.website 검사
#   bash scripts/check-adsense.sh http://localhost:3000
#
# 기대 결과: 콘텐츠 페이지는 전부 HEAD, /park·/nfc·/nfc/admin 은 전부 없음(정상).

BASE="${1:-https://myfloor.website}"
CLIENT="ca-pub-4773298245322018"
UA="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"

WITH_AD=(
  / /guide /install /faq /tips /about /privacy /terms
  /tips/find-car-in-parking-lot /tips/remember-parking-floor
  /tips/ev-charging-time /tips/nfc-tag-parking
  /tips/apartment-parking-conflict /tips/mechanical-parking-lot
  /tips/beginner-parking-tips /tips/parking-damage-prevention
  /tips/blackbox-parking-mode /tips/underground-parking-safety
)
NO_AD=(/park?floor=B3 /nfc?floor=B3 /nfc/admin)

fail=0

# $1=경로 → "HEAD" | "BODY" | "NONE" | "HTTP <code>"
probe() {
  local body code head_part
  body=$(curl -sS -L -m 25 -A "$UA" -w $'\n__CODE__%{http_code}' "$BASE$1" 2>/dev/null)
  code="${body##*__CODE__}"
  body="${body%$'\n'__CODE__*}"
  [ "$code" = "200" ] || { echo "HTTP $code"; return; }
  head_part="${body%%</head>*}"
  if [[ "$head_part" == *"adsbygoogle.js?client=$CLIENT"* ]]; then echo "HEAD"
  elif [[ "$body" == *"adsbygoogle.js?client=$CLIENT"* ]]; then echo "BODY"
  else echo "NONE"; fi
}

echo "대상: $BASE"
echo "클라이언트 ID: $CLIENT"
echo
printf '%-34s %-8s %s\n' "경로" "결과" "판정"
printf '%s\n' "----------------------------------------------------------------"

echo "[ 광고 스크립트가 있어야 하는 페이지 ]"
for p in "${WITH_AD[@]}"; do
  r=$(probe "$p")
  case "$r" in
    HEAD) v="정상" ;;
    BODY) v="실패 — head 밖에 있음"; fail=1 ;;
    NONE) v="실패 — 스니펫 없음";    fail=1 ;;
    *)    v="실패 — 페이지 응답 이상"; fail=1 ;;
  esac
  printf '%-34s %-8s %s\n' "$p" "$r" "$v"
done

echo
echo "[ 광고 스크립트가 없어야 하는 페이지 ]"
for p in "${NO_AD[@]}"; do
  r=$(probe "$p")
  case "$r" in
    NONE)        v="정상" ;;
    HEAD|BODY)   v="실패 — 여기엔 없어야 함"; fail=1 ;;
    *)           v="확인 필요 — 페이지 응답 이상" ;;
  esac
  printf '%-34s %-8s %s\n' "$p" "$r" "$v"
done

echo
echo "[ 연락처 노출 (전역 푸터) ]"
for p in / /about /privacy; do
  if curl -sS -L -m 20 -A "$UA" "$BASE$p" 2>/dev/null | grep -q "myfloor.website@gmail.com"; then
    printf '%-34s %-8s %s\n' "$p" "있음" "정상"
  else
    printf '%-34s %-8s %s\n' "$p" "없음" "실패 — 이메일 미노출"; fail=1
  fi
done

echo
echo "[ 애드센스 부가 파일 ]"
for f in /ads.txt /googleab2159f06e4bf07a.html /sitemap.xml /robots.txt; do
  c=$(curl -sS -L -o /dev/null -m 20 -w '%{http_code}' "$BASE$f" 2>/dev/null)
  [ "$c" = "200" ] || fail=1
  printf '%-34s %-8s %s\n' "$f" "$c" "$([ "$c" = 200 ] && echo 정상 || echo 실패)"
done

echo
if [ "$fail" -eq 0 ]; then
  echo "전부 통과. 재심사 요청해도 됩니다."
else
  echo "실패 항목이 있습니다. 배포가 아직 안 끝났을 수 있으니 몇 분 뒤 다시 실행해 보세요."
fi
exit "$fail"
