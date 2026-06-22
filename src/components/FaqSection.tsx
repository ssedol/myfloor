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
        q: "NFC 스티커는 어떻게 사용하나요?",
        a: "NFC 스티커를 각 주차 층수 입구에 부착하고, 스마트폰을 태그하면 해당 층수가 자동으로 저장됩니다. 별도 앱 실행 없이도 태그만으로 층수가 기록됩니다.",
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
        a: "주차 정보는 기기 내 브라우저에 저장됩니다. 브라우저 데이터를 초기화하거나 다른 기기에서 접속하면 기존 데이터가 보이지 않을 수 있습니다. 중요한 정보는 공유 기능으로 백업해두세요.",
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
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
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
        <p className="px-4 pb-4 text-sub text-sm leading-relaxed">{a}</p>
      )}
    </div>
  );
}

export default function FaqSection() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-2 pb-8">
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
