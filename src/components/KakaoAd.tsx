"use client";

interface Props {
  unit: string;
  width: number;
  height: number;
}

export default function KakaoAd({ unit, width, height }: Props) {
  return (
    <div className="w-full">
      <ins
        className="kakao_ad_area"
        style={{ display: "none", width: "100%" }}
        data-ad-unit={unit}
        data-ad-width={String(width)}
        data-ad-height={String(height)}
      />
    </div>
  );
}
