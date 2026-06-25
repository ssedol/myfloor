"use client";

import { useState } from "react";

const FAQS = [
  {
    group: "사용 방법",
    items: [
      {
        q: "처음에 어떻게 시작하나요?",
        a: "상단의 차량 추가 버튼을 눌러 차량 이름을 등록하세요. 이후 주차할 때마다 층수를 탭해 저장하면 됩니다. 저장된 층수는 앱을 닫아도 유지됩니다.",
      },
      {
        q: "가족과 주차 위치를 공유하려면?",
        a: "층수가 저장된 카드 우측 상단의 공유 버튼을 탭하세요. 카카오톡 등으로 링크를 보내면, 받은 사람이 링크를 열 때 해당 층수가 자동으로 저장됩니다. 계정 가입 없이 공유됩니다.",
      },
    ],
  },
  {
    group: "설치 및 설정",
    items: [
      {
        q: "홈 화면에 아이콘을 추가하려면?",
        a: "아이폰은 Safari에서 myfloor.website 접속 → 하단 공유 버튼 → 홈 화면에 추가. 안드로이드는 Chrome에서 접속 → 우측 상단 메뉴(⋮) → 홈 화면에 추가를 선택하세요. 자세한 안내는 myfloor.website/guide 를 참고하세요.",
      },
      {
        q: "데이터가 사라졌어요",
        a: "주차 정보는 접속한 브라우저에 저장됩니다. 카카오톡·인스타그램 등 내부 브라우저로 링크를 열면 기기의 일반 브라우저와 저장 공간이 달라 데이터가 보이지 않을 수 있습니다. 브라우저를 바꾸거나 앱을 재설치해도 데이터가 사라질 수 있습니다.",
        highlight: "📲 홈 화면에 설치하거나 Safari·Chrome으로 직접 접속해야 데이터가 안전하게 유지돼요. 내부 브라우저 사용은 피해주세요.",
      },
    ],
  },
  {
    group: "기타",
    items: [
      {
        q: "차량은 몇 대까지 등록할 수 있나요?",
        a: "최대 3대까지 등록할 수 있습니다. 가족 구성원의 차량을 모두 등록해 각각의 주차 층수를 관리할 수 있습니다.",
      },
      {
        q: "아이폰과 안드로이드 모두 사용할 수 있나요?",
        a: "네, 스마트폰 기종에 상관없이 사용 가능합니다. Safari(아이폰) 또는 Chrome(안드로이드)에서 myfloor.website 에 접속하면 됩니다.",
      },
      {
        q: "기능 추가 요청이나 버그 문의는 어디서 하나요?",
        a: "카카오톡 오픈채팅으로 문의해 주세요 → open.kakao.com/o/sj3lSPAi",
        link: "https://open.kakao.com/o/sj3lSPAi",
        linkLabel: "오픈채팅 바로가기",
      },
      {
        q: "아파트 층별 NFC·QR 설치 문의는 어디서 하나요?",
        a: "입주민 또는 관리사무소에서 층별 NFC·QR 설치를 원하시면 카카오톡 오픈채팅으로 문의해 주세요.",
        link: "https://open.kakao.com/o/sj3lSPAi",
        linkLabel: "설치 문의하기",
      },
    ],
  },
];

function FaqItem({ q, a, link, linkLabel, highlight }: { q: string; a: string; link?: string; linkLabel?: string; highlight?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-surface rounded-2xl overflow-hidden mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-3.5 flex justify-between items-center gap-3 active:opacity-70 transition-opacity"
      >
        <span className="text-main text-sm font-semibold">{q}</span>
        <span className={`text-primary text-lg font-light flex-shrink-0 transition-transform ${open ? "rotate-45" : ""}`}>﹢</span>
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-sub text-sm leading-relaxed">{a}</p>
          {highlight && (
            <div className="mt-2.5 px-3 py-2.5 bg-primary/10 border border-primary/30 rounded-xl">
              <p className="text-primary-dark text-xs font-semibold leading-relaxed">{highlight}</p>
            </div>
          )}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl active:opacity-70"
            >
              {linkLabel}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function FaqSection() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-2 pb-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-center gap-2 py-2 text-sub text-xs font-medium active:opacity-70 transition-opacity"
      >
        이용 안내 및 자주 묻는 질문
        <span className={`text-[10px] transition-transform ${open ? "rotate-180" : ""}`}>▼</span>
      </button>

      {open && (
        <div className="mt-4">
          {FAQS.map(({ group, items }) => (
            <div key={group} className="mb-4">
              <p className="text-sub text-xs font-bold tracking-widest mb-2 px-1">{group}</p>
              {items.map((item) => (
                <FaqItem key={item.q} {...item} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
