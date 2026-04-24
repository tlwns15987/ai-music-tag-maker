"use client";

import { useMemo, useState } from "react";

const moods = [
  { label: "공부용", tags: ["study", "calm", "mellow", "soft"] },
  { label: "작업용", tags: ["focus", "calm", "ambient", "minimal"] },
  { label: "잔잔함", tags: ["calm", "soft", "mellow", "ambient"] },
  { label: "밤공부", tags: ["night", "calm", "mellow", "soft"] },
  { label: "감성적", tags: ["emotional", "mellow", "soft", "warm"] },
  { label: "밝게", tags: ["bright", "soft", "warm", "mellow"] },
  { label: "몽환적", tags: ["dreamy", "ambient", "soft", "mellow"] },
  { label: "수면용", tags: ["sleep", "calm", "ambient", "soft"] }
];

const genres = [
  { label: "Instrumental", tags: ["instrumental"] },
  { label: "Piano", tags: ["piano"] },
  { label: "Ambient", tags: ["ambient"] },
  { label: "Chill", tags: ["chill"] },
  { label: "J-pop", tags: ["J-pop", "pop"] },
  { label: "Anime", tags: ["anime"] },
  { label: "Cinematic", tags: ["cinematic"] },
  { label: "Lofi", tags: ["lofi"] }
];

const replacements = {
  cafe: ["mellow", "warm", "chill"],
  relaxing: ["calm", "soft", "mellow"],
  rain: ["ambient", "soft", "night"],
  peaceful: ["calm", "soft", "mellow"],
  vocal: ["instrumental"],
  vocals: ["instrumental"],
  voice: ["instrumental"],
  vocalist: ["instrumental"],
  drum: ["soft", "minimal"],
  drums: ["soft", "minimal"]
};

const defaultInvalid =
  "cafe, relaxing, rain, peaceful, vocal, vocals, voice, vocalist, drum, drums";

function uniqueTags(tags) {
  const seen = new Set();

  return tags
    .map((tag) => tag.trim())
    .filter(Boolean)
    .filter((tag) => {
      const key = tag.toLowerCase();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
}

function cleanTags(tags, invalidText) {
  const invalidTags = invalidText
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  const invalidSet = new Set(invalidTags);
  const output = [];

  tags.forEach((tag) => {
    const key = tag.toLowerCase();

    if (invalidSet.has(key)) {
      output.push(...(replacements[key] || []));
    } else {
      output.push(tag);
    }
  });

  return uniqueTags(output).slice(0, 8);
}

function makeStylePrompt(tags) {
  const lower = tags.map((tag) => tag.toLowerCase());

  const parts = [];

  if (lower.includes("j-pop") || lower.includes("pop")) {
    parts.push("Calm instrumental pop BGM");
  } else {
    parts.push("Calm instrumental BGM");
  }

  if (lower.includes("piano")) {
    parts.push("gentle piano melody");
  }

  if (lower.includes("ambient")) {
    parts.push("soft ambient texture");
  }

  if (lower.includes("cinematic")) {
    parts.push("subtle cinematic atmosphere");
  }

  parts.push("slow to mid tempo");
  parts.push("mellow and unobtrusive mood");

  if (lower.includes("study")) {
    parts.push("suitable for studying and working");
  }

  return parts.join(", ");
}

function makeYoutubeTitle(tags) {
  const lower = tags.map((tag) => tag.toLowerCase());

  if (lower.includes("j-pop") || lower.includes("anime")) {
    return "静かな勉強BGM | Calm Study Music";
  }

  return "조용한 공부 BGM | Calm Instrumental Study Music";
}

export default function Home() {
  const [selectedMoods, setSelectedMoods] = useState(["공부용", "잔잔함"]);
  const [selectedGenres, setSelectedGenres] = useState([
    "Instrumental",
    "Piano",
    "Ambient"
  ]);
  const [invalidText, setInvalidText] = useState(defaultInvalid);
  const [copied, setCopied] = useState("");

  const rawTags = useMemo(() => {
    const moodTags = moods
      .filter((item) => selectedMoods.includes(item.label))
      .flatMap((item) => item.tags);

    const genreTags = genres
      .filter((item) => selectedGenres.includes(item.label))
      .flatMap((item) => item.tags);

    return uniqueTags([...genreTags, ...moodTags]);
  }, [selectedMoods, selectedGenres]);

  const finalTags = useMemo(() => {
    return cleanTags(rawTags, invalidText);
  }, [rawTags, invalidText]);

  const stylePrompt = useMemo(() => {
    return makeStylePrompt(finalTags);
  }, [finalTags]);

  const youtubeTitle = useMemo(() => {
    return makeYoutubeTitle(finalTags);
  }, [finalTags]);

  const invalidTags = useMemo(() => {
    return invalidText
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }, [invalidText]);

  function toggle(value, state, setState) {
    if (state.includes(value)) {
      setState(state.filter((item) => item !== value));
    } else {
      setState([...state, value]);
    }
  }

  async function copy(label, text) {
    await navigator.clipboard.writeText(text);
    setCopied(label);

    setTimeout(() => {
      setCopied("");
    }, 1200);
  }

  function reset() {
    setSelectedMoods(["공부용", "잔잔함"]);
    setSelectedGenres(["Instrumental", "Piano", "Ambient"]);
    setInvalidText(defaultInvalid);
  }

  return (
    <main className="container">
      <div className="badge">AI Music Tag Maker</div>

      <h1>AI 음악 태그 생성기</h1>

      <p>
        분위기와 장르를 선택하면 AI 음악 사이트에 넣기 좋은 태그와 스타일
        설명을 자동으로 만들어줍니다. 무효 태그는 제외하고 비슷한 태그로
        대체합니다.
      </p>

      <div className="grid">
        <section>
          <div className="card">
            <h2>분위기 선택</h2>
            <div className="buttons">
              {moods.map((item) => (
                <button
                  key={item.label}
                  className={
                    selectedMoods.includes(item.label)
                      ? "choice active-blue"
                      : "choice"
                  }
                  onClick={() =>
                    toggle(item.label, selectedMoods, setSelectedMoods)
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <br />

          <div className="card">
            <h2>장르 / 사운드 선택</h2>
            <div className="buttons">
              {genres.map((item) => (
                <button
                  key={item.label}
                  className={
                    selectedGenres.includes(item.label)
                      ? "choice active-purple"
                      : "choice"
                  }
                  onClick={() =>
                    toggle(item.label, selectedGenres, setSelectedGenres)
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <br />

          <div className="card">
            <div className="row">
              <h2>무효 태그 입력</h2>
              <button className="reset" onClick={reset}>
                초기화
              </button>
            </div>

            <p>
              무효 처리되는 태그를 쉼표로 입력하세요. 예: cafe, relaxing,
              rain, peaceful
            </p>

            <textarea
              value={invalidText}
              onChange={(event) => setInvalidText(event.target.value)}
            />

            <div className="invalid-list">
              {invalidTags.map((tag) => (
                <span className="invalid-tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section>
          <OutputBox
            title="복사용 태그"
            text={finalTags.join(", ")}
            copied={copied === "tags"}
            onCopy={() => copy("tags", finalTags.join(", "))}
          />

          <br />

          <OutputBox
            title="스타일 설명"
            text={stylePrompt}
            copied={copied === "style"}
            onCopy={() => copy("style", stylePrompt)}
          />

          <br />

          <OutputBox
            title="유튜브 제목 예시"
            text={youtubeTitle}
            copied={copied === "title"}
            onCopy={() => copy("title", youtubeTitle)}
          />

          <p className="footer-note">
            원본 후보 태그: {rawTags.join(", ")}
          </p>
        </section>
      </div>
    </main>
  );
}

function OutputBox({ title, text, copied, onCopy }) {
  return (
    <div className="card">
      <div className="row">
        <h2>{title}</h2>
        <button className="copy" onClick={onCopy}>
          {copied ? "복사됨" : "복사"}
        </button>
      </div>

      <div className="output">{text}</div>
    </div>
  );
}
