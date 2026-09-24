/**
 * 구조화 데이터(JSON-LD)를 `<script type="application/ld+json">` 으로 렌더한다.
 *
 * Next.js 문서 권장대로 next/script 가 아닌 네이티브 script 태그를 쓰고,
 * XSS 를 막기 위해 `<` 를 유니코드 이스케이프로 치환한다.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
