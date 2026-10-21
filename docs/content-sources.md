# 루체테 퀴즈 — 문항 근거와 진행자 검토 안내

## 범위와 사용 전 확인

- 성인 퀴즈 20문항, 성당 상식 퀴즈 20문항. 각 범주는 5지선다 10개, OX 5개, 주관식 5개로 구성했다. 이 비율은 조정 가능한 초기 구성이다.
- 청년회 공동 화면에서 문제·정답·해설을 함께 보는 진행용 콘텐츠다. 점수, 답안 입력, 자동 채점을 전제로 하지 않는다. `acceptedAnswers`는 진행자가 참고할 수 있는 표현 예시이며, 실제 답변의 의미를 판단하는 기준을 대신하지 않는다.
- **행사 전 담당 진행자가 질문·선택지·정답·해설을 모두 검토해야 한다. 필요하면 본당 사제나 교리 담당자에게 검토를 요청한다. 이 자료는 주교·사제의 승인이나 교회의 공식 출판 인가를 받았다고 주장하지 않는다.**
- 한국어 질문과 설명은 아래 자료를 바탕으로 직접 작성한 요약이다. 영어 문헌의 한국어 표현은 공인 번역문 인용이 아니다. 영어 성경 인용을 한국천주교주교회의 공식 번역문처럼 제시하지 않았다.
- 성인 호칭은 인물을 존중하는 표기이며, 확인하지 않은 축일·수호 분야·직접 발언·현재 교황 정보는 문항에 넣지 않았다. 토마스 아퀴나스의 도미니코회 소속 단서도 사용하지 않았다.
- 난도는 진행 편의를 위한 편집 판단이다: 쉬움 27개, 보통 11개, 어려움 2개. 종교 지식이나 신앙의 깊이를 평가하는 등급이 아니다.

## 실제 자료 취득 및 한계

- 최종 문항이 참조하는 서로 다른 13개 URL은 이번 작업에서 모두 HTTP 200으로 본문을 직접 취득했다. 페이지 제목·본문과 문항별 핵심 구절을 확인했다. 모든 문항의 근거 구절 40개가 취득 본문에 실제 포함되는지도 코드로 검사했다.
- 사용 자료는 교황청 문헌 11개, 교황청 소통부 Vatican News 1개, 천주교 수원교구 1개다. 아래 출처 목록은 실제 취득된 URL에서 생성했다. 번호가 연속되지 않는 것은 취득에 실패한 후보를 제외했기 때문이다.
- USCCB 성경 장별 페이지는 직접 요청에서 HTTP 403을 반환했다. 일부 검색 결과에 본문이 나타났으나 최종 근거로 채택하지 않았다. 해당 문항은 본문 취득에 성공한 교황청의 성경 해설로 대체했다.
- CBCK 교리서 안내 페이지는 열렸으나 이 경로에서 문항에 필요한 개별 항목의 전체 본문을 확보하지 못했다. 따라서 CBCK 개별 교리 항목을 직접 확인했다고 표시하지 않고, 교황청 「가톨릭 교회 교리서 요약」의 항 번호를 명시했다.
- 앞선 작업에서 남양성모성지 자체 사이트는 429로 제한되었다는 인계가 있어 재요청하지 않았다. 남양 문항은 수원교구 공식 성지 소개 본문을 근거로 삼았다. 미사 시간·교통편 등 변동 정보는 출제하지 않았다.
- Vatican News 한국 순교 성인 소개는 김대건의 최초 한국인 사제 신분과 정하상의 평신도 신분에 한해서 사용했다. 페이지의 다른 연대·통계까지 검증한 것으로 보아서는 안 된다.
- 최종 40문항의 핵심 정답에 미확인 사실을 남기지는 않았다. 다만 한국어 용어, 청년회 대상 난도, 현장 답변 인정 범위에 대한 진행자 검토는 남아 있다. URL의 장기 가용성은 보장하지 않는다.

## 문항별 주장 → 근거

각 행은 질문의 정답과 해설이 기대는 핵심 사실을 요약한다. OX의 거짓 문장은 아래 근거와 반대되므로 X다. 객관식 오답은 해당 질문 조건을 충족하지 않는 선택지다.

| ID | 정답 | 검증한 핵심 주장 | 본문 위치 | 출처 |
|---|---|---|---|---|
| saints-01 | 성 김대건 안드레아 | 김대건을 한국인 최초의 사제로 명시한다. | The priest | [3] |
| saints-02 | 성 프란치스코 | 작은형제회 창립자와 가난의 영성을 설명한다. | 작은형제회 창립·가난의 영성 | [4] |
| saints-03 | 성녀 클라라 | 클라라가 첫 동료들과 산 다미아노에 정착했고 가난을 실천했다고 설명한다. | 산 다미아노 공동체 | [5] |
| saints-04 | 아기 예수의 성녀 데레사 | 데레사의 영성을 신뢰와 사랑의 작은 길이라고 설명한다. | little way of trust and love | [6] |
| saints-05 | 성 아우구스티노 | 고백록을 아우구스티노의 영적 자서전으로 설명한다. | Confessions | [7] |
| saints-06 | 성 베네딕토 | 베네딕토의 규칙서와 기도·실천의 관계를 설명한다. | Rule | [8] |
| saints-07 | 성 마태오 | 마태 9,9의 세관과 마태오의 부르심을 직접 설명한다. | 마태 9,9 해설 | [13] |
| saints-08 | 성 토마스 | 토마스의 주님·하느님 고백을 인용하고 해설한다. | 요한 20,27-29 해설 | [14] |
| saints-09 | 성 바오로 | 다마스쿠스 길의 사건을 바오로의 삶을 변화시킨 그리스도와의 만남으로 설명한다. | 다마스쿠스에서의 회심 | [17] |
| saints-10 | 어부 | 베드로와 안드레아를 어부로 소개한다. | 베드로의 가족과 생업 | [15] |
| saints-11 | O | 정하상 바오로를 평신도 사도로 소개한다. | The lay apostle | [3] |
| saints-12 | O | 리지외의 가르멜 입회와 가르멜 수녀가 된 사실을 설명한다. | Carmel of Lisieux / Carmelite | [6] |
| saints-13 | X | 기도가 행동으로 표현되어야 하며 일상의 의무를 놓치지 않았다고 설명한다. | 기도와 일상의 의무 | [8] |
| saints-14 | X | 클라라가 귀족 신분과 부를 포기했다고 명시한다. | 귀족 신분과 재산의 포기 | [5] |
| saints-15 | O | 안드레아를 시몬의 형제로 명시한다. | Andrew, the brother of Simon | [15] |
| saints-16 | 모니카 | 모니카를 아우구스티노의 어머니이며 성녀로 소개한다. | 어머니 Monica | [7] |
| saints-17 | 암브로시오 | 아우구스티노가 밀라노 대성당에서 암브로시오에게 세례를 받았다고 명시한다. | 밀라노의 세례 | [7] |
| saints-18 | 요셉 | 예수님의 나자렛 생활과 양부 요셉, 마리아에 대한 순종을 설명한다. | 104항 | [1] |
| saints-19 | 마리아 막달레나 | 마리아 막달레나를 부활하신 주님의 증인이며 소식을 전한 이로 설명한다. | 요한 20,1.11-18 해설 | [16] |
| saints-20 | 세례자 요한 | 예수님이 공생활 시작에 요르단강에서 세례자 요한에게 세례를 받았다고 설명한다. | 254항 | [1] |
| church-01 | 7가지 | 일곱 성사의 수와 이름을 열거한다. | 224항 | [1] |
| church-02 | 물 | 세례의 핵심 예식인 물과 삼위일체의 이름을 설명한다. | 256항 | [1] |
| church-03 | 세례·견진·성체 | 그리스도교 입문이 세례·견진·성체성사로 이루어진다고 설명한다. | 251항 | [1] |
| church-04 | 말씀 전례와 성찬 전례 | 말씀 전례와 성찬 전례를 하나의 예배를 이루는 두 주요 부분으로 설명한다. | 277항 | [1] |
| church-05 | 밀로 만든 빵과 포도로 만든 포도주 | 성체성사에 필요한 요소를 wheat bread와 grape wine으로 명시한다. | 279항 | [1] |
| church-06 | 사도들과 나누신 최후의 만찬 | 성목요일 최후의 만찬에서 성체성사를 제정하셨다고 설명한다. | 272-273항 | [1] |
| church-07 | 주님 부활 대축일 | 부활절을 연중 전례의 절정이자 feast of feasts라고 설명한다. | 241항 | [1] |
| church-08 | 삼위일체 | 삼위일체의 세 위격과 하느님의 단일성을 설명한다. | 44·48항 | [1] |
| church-09 | 성모 마리아 | 남양성모성지가 성모 마리아께 봉헌된 순교성지라고 명시한다. | 성지 소개 첫 문단 | [2] |
| church-10 | 주님의 기도 | Our Father가 예수님께서 직접 가르쳐 주신 기도라서 Lord’s Prayer라고 불린다고 설명한다. | 580항 | [1] |
| church-11 | X | 마리아 공경과 삼위일체 하느님께만 드리는 흠숭을 구별한다. | 198항 | [1] |
| church-12 | O | 세례·견진·성품의 인호와 일생에 한 번 받는 성사라는 점을 명시한다. | 227항 | [1] |
| church-13 | O | 성체 안의 참되고 실제적이며 실체적인 현존을 설명한다. | 282항 | [1] |
| church-14 | X | 질병이나 노령으로 죽음의 위험에 놓이기 시작할 때 받을 수 있다고 명시한다. | 316항 | [1] |
| church-15 | X | 새 계약의 예배는 특정 장소에만 매이지 않으며 공동체 모임 장소의 필요성도 설명한다. | 244항 | [1] |
| church-16 | 감실 | 감실에 보존된 성체를 찾아 흠숭할 것을 권고한다. | 286항 | [1] |
| church-17 | 아멘 | 마지막 Amen을 so be it으로 설명하며 기도에 대한 동의라고 풀이한다. | 598항 | [1] |
| church-18 | 고해성사 | 세례 후 회개를 위한 화해의 성사와 회개자의 행위·사제의 사죄를 설명한다. | 296-297·302항 | [1] |
| church-19 | 대림 시기 | 그리스도 오심을 기다린 시간을 해마다 대림 시기의 전례로 되살린다고 설명한다. | 102항 | [1] |
| church-20 | 견진성사 | 견진이 세례 은총을 확고히 하며 성령의 특별한 부어 주심과 증언의 힘을 준다고 설명한다. | 266·268항 | [1] |

## Sources

### [1] 교황청 「가톨릭 교회 교리서 요약」
- URL: https://www.vatican.va/archive/compendium_ccc/documents/archive_2005_compendium-ccc_en.html
- 취득: 직접 HTTP GET 200, 본문 확인.
- 본문 확인용 짧은 구절: “There are seven sacraments”

### [2] 천주교 수원교구 남양성모성지 소개
- URL: https://www.casuwon.or.kr/holyland/intro/12
- 취득: 직접 HTTP GET 200, 본문 확인.
- 본문 확인용 짧은 구절: “성모 마리아께 봉헌되고”

### [3] Vatican News 한국 순교 성인 소개
- URL: https://www.vaticannews.va/en/saints/09/20/sts--andrew-kim-taegon--paul--chong-hasang-and-companions--korea.html
- 취득: 직접 HTTP GET 200, 본문 확인.
- 본문 확인용 짧은 구절: “the first native Korean priest”

### [4] 교황청 일반 알현: 아시시의 성 프란치스코 (2010-01-27)
- URL: https://www.vatican.va/content/benedict-xvi/en/audiences/2010/documents/hf_ben-xvi_aud_20100127.html
- 취득: 직접 HTTP GET 200, 본문 확인.
- 본문 확인용 짧은 구절: “Orders of Friars Minor”

### [5] 교황청 일반 알현: 아시시의 성녀 클라라 (2010-09-15)
- URL: https://www.vatican.va/content/benedict-xvi/en/audiences/2010/documents/hf_ben-xvi_aud_20100915.html
- 취득: 직접 HTTP GET 200, 본문 확인.
- 본문 확인용 짧은 구절: “Clare settled with her first companions”

### [6] 교황청 일반 알현: 아기 예수의 성녀 데레사 (2011-04-06)
- URL: https://www.vatican.va/content/benedict-xvi/en/audiences/2011/documents/hf_ben-xvi_aud_20110406.html
- 취득: 직접 HTTP GET 200, 본문 확인.
- 본문 확인용 짧은 구절: “little way of trust and love”

### [7] 교황청 일반 알현: 성 아우구스티노 (2008-01-09)
- URL: https://www.vatican.va/content/benedict-xvi/en/audiences/2008/documents/hf_ben-xvi_aud_20080109.html
- 취득: 직접 HTTP GET 200, 본문 확인.
- 본문 확인용 짧은 구절: “Monica, a fervent Christian”

### [8] 교황청 일반 알현: 성 베네딕토 (2008-04-09)
- URL: https://www.vatican.va/content/benedict-xvi/en/audiences/2008/documents/hf_ben-xvi_aud_20080409.html
- 취득: 직접 HTTP GET 200, 본문 확인.
- 본문 확인용 짧은 구절: “duties of daily life”

### [13] 교황청 일반 알현: 성 마태오 (2006-08-30)
- URL: https://www.vatican.va/content/benedict-xvi/en/audiences/2006/documents/hf_ben-xvi_aud_20060830.html
- 취득: 직접 HTTP GET 200, 본문 확인.
- 본문 확인용 짧은 구절: “sitting at the tax office”

### [14] 교황청 일반 알현: 성 토마스 사도 (2006-09-27)
- URL: https://www.vatican.va/content/benedict-xvi/en/audiences/2006/documents/hf_ben-xvi_aud_20060927.html
- 취득: 직접 HTTP GET 200, 본문 확인.
- 본문 확인용 짧은 구절: “My Lord and my God!”

### [15] 교황청 일반 알현: 성 베드로 (2006-05-17)
- URL: https://www.vatican.va/content/benedict-xvi/en/audiences/2006/documents/hf_ben-xvi_aud_20060517.html
- 취득: 직접 HTTP GET 200, 본문 확인.
- 본문 확인용 짧은 구절: “Andrew, the brother of Simon”

### [16] 교황청 일반 알현: 복음을 섬긴 여성들 (2007-02-14)
- URL: https://www.vatican.va/content/benedict-xvi/en/audiences/2007/documents/hf_ben-xvi_aud_20070214.html
- 취득: 직접 HTTP GET 200, 본문 확인.
- 본문 확인용 짧은 구절: “first witness and herald of the Risen One”

### [17] 교황청 일반 알현: 성 바오로의 회심 (2008-09-03)
- URL: https://www.vatican.va/content/benedict-xvi/en/audiences/2008/documents/hf_ben-xvi_aud_20080903.html
- 취득: 직접 HTTP GET 200, 본문 확인.
- 본문 확인용 짧은 구절: “road to Damascus”

## 프로그램 검증 결과

작성 후 저장된 JSON을 다시 파싱하여 다음을 확인한다. 아래 검증 코드는 표준 라이브러리만 사용하며 저장된 데이터를 검사할 때 그대로 실행할 수 있다. 원문 구절 포함 여부는 작성 세션에서 직접 취득한 본문과 대조하여 별도 확인했다.

- 범주 2개 / 문항 40개 / 고유 문항 ID 40개 / 정규화한 중복 질문 0개.
- 각 범주: `multiple-choice` 10개 / `ox` 5개 / `short-answer` 5개.
- 5지선다 선택지 5개와 정규화 기준 선택지 고유성, 정답 인덱스 0–4, 정답 문자열 일치.
- OX 선택지는 정확히 `["O", "X"]`, 인덱스와 정답 일치.
- 주관식은 `answerIndex`와 `choices`가 없고, 모든 `acceptedAnswers`에 대표 정답 포함.
- 필수·허용 필드, 난도 열거형, 출처 객체 구조, HTTPS 공식 도메인 및 본문 취득 URL 일치.
- 각 문항의 근거 행과 출처 번호 존재, 서로 다른 출처 URL 13개, 원문 근거 구절 40/40 일치.

```python
import json, re, unicodedata
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

root = Path("/home/hg121500/dev/lucete-pilgrimage-quiz")
data = json.loads((root / "src/data/quizzes.json").read_text())
doc = (root / "docs/content-sources.md").read_text()
norm = lambda x: re.sub(r"[^\w]", "", unicodedata.normalize("NFKC", x).casefold())
assert [(c["id"], c["title"]) for c in data] == [
    ("saints", "성인 퀴즈"), ("church", "성당 상식 퀴즈")]
required = {"id", "type", "question", "answer", "explanation", "sources", "difficulty"}
allowed = required | {"choices", "answerIndex", "acceptedAnswers"}
ids, prompts, urls = set(), set(), set()
for c in data:
    assert set(c) == {"id", "title", "description", "questions"}
    assert c["description"].strip() and len(c["questions"]) == 20
    assert Counter(q["type"] for q in c["questions"]) == {
        "multiple-choice": 10, "ox": 5, "short-answer": 5}
    for i, q in enumerate(c["questions"], 1):
        assert required <= set(q) <= allowed
        assert q["id"] == f"{c['id']}-{i:02}" and q["id"] not in ids
        ids.add(q["id"])
        assert norm(q["question"]) not in prompts
        prompts.add(norm(q["question"]))
        assert all(isinstance(q[k], str) and q[k].strip()
                   for k in ("question", "answer", "explanation"))
        assert q["difficulty"] in {"easy", "medium", "hard"}
        if q["type"] == "short-answer":
            assert "answerIndex" not in q and "choices" not in q
            assert isinstance(q["acceptedAnswers"], list)
            assert q["answer"] in q["acceptedAnswers"]
            assert all(isinstance(a, str) and a.strip() for a in q["acceptedAnswers"])
        else:
            assert q["type"] in {"multiple-choice", "ox"}
            assert "acceptedAnswers" not in q
            opts = q["choices"]
            assert len(opts) == (5 if q["type"] == "multiple-choice" else 2)
            assert all(isinstance(a, str) and a.strip() for a in opts)
            assert len(set(map(norm, opts))) == len(opts)
            idx = q["answerIndex"]
            assert type(idx) is int and 0 <= idx < len(opts)
            assert q["answer"] == opts[idx]
            if q["type"] == "ox":
                assert opts == ["O", "X"]
        assert isinstance(q["sources"], list) and q["sources"]
        for s in q["sources"]:
            assert set(s) == {"label", "url"} and s["label"].strip()
            u = urlparse(s["url"])
            assert u.scheme == "https" and u.netloc in {
                "www.vatican.va", "www.vaticannews.va", "www.casuwon.or.kr"}
            assert s["url"] in doc
            urls.add(s["url"])
        assert f"| {q['id']} |" in doc
assert len(ids) == len(prompts) == 40 and len(urls) == 13
print("PASS: 40 questions; 20 per category; 10/5/5 each; 13 source URLs")
```
