import { useEffect, useRef, useState } from 'react';
import { categories as defaultCategories, contentUnavailable } from './data/content';
import type { Category } from './data/types';
import { readProgress, saveProgress } from './progress';

function StageBackground() {
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query?.matches ?? false);
    query?.addEventListener('change', update);
    return () => query?.removeEventListener('change', update);
  }, []);
  const url = import.meta.env.VITE_HERO_VIDEO_URL || '/media/namyang-background.mp4';
  const poster = import.meta.env.VITE_HERO_POSTER_URL || '/media/namyang-poster.webp';
  useEffect(() => {
    const media = video.current;
    let active = true;
    if (!media) return;
    if (paused || reduced || failed) media.pause();
    else {
      try { media.play()?.catch(() => { if (active) setPaused(true); }); }
      catch { setPaused(true); }
    }
    return () => { active = false; };
  }, [paused, reduced, failed, url]);
  return <>
    <div className="stage-backdrop" style={{ backgroundImage: `url("${poster}")` }} aria-hidden="true">
      <video ref={video} className={`stage-video${failed ? ' is-failed' : ''}`} src={url} poster={poster} muted loop playsInline autoPlay={!reduced} preload={reduced ? 'none' : 'metadata'} onError={() => setFailed(true)} />
    </div>
    <div className="stage-dim" aria-hidden="true" />
    {!reduced && !failed && <button className="media-control" onClick={() => setPaused(!paused)} aria-label={paused ? '배경 영상 재생' : '배경 영상 일시정지'} aria-pressed={!paused}><span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span></button>}
  </>;
}

export default function App({ categories = defaultCategories }: { categories?: Category[] }) {
  const [path, setPath] = useState(window.location.pathname);
  const [revealed, setRevealed] = useState(false);
  const [notice, setNotice] = useState('');
  const [fullscreen, setFullscreen] = useState(!!document.fullscreenElement);
  const [modal, setModal] = useState<'overview' | 'reset' | 'help' | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const answerHeading = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const segments = path.split('/').filter(Boolean);
  const category = segments[0] === 'quiz' ? categories.find(c => c.id === segments[1]) : undefined;
  const index = category && segments[2] === 'question' ? category.questions.findIndex(q => q.id === segments[3]) : -1;
  const question = category?.questions[index];
  const isHome = path === '/';
  const isIntro = !!category && segments.length === 2;
  const isQuestion = !!question && segments.length === 4;
  const isComplete = !!category && segments[2] === 'complete' && segments.length === 3;
  const saved = category ? readProgress(category) : null;
  const navigate = (next: string, replace = false) => {
    if (replace) window.history.replaceState(null, '', next); else window.history.pushState(null, '', next);
    setPath(next); setRevealed(false); setModal(null);
  };
  const questionPath = (c: Category, n: number) => `/quiz/${c.id}/question/${c.questions[n].id}`;
  const persist = (c: Category, n: number, completed = false) => {
    if (!saveProgress(c, n, completed)) setNotice('이 브라우저에서는 진행 위치를 저장할 수 없어요. 창을 닫거나 새로고침하면 위치가 사라질 수 있어요.');
  };
  const goQuestion = (c: Category, n: number) => { persist(c, n); navigate(questionPath(c, n)); };
  const reveal = () => setRevealed(true);
  const advance = () => {
    if (!category || !isQuestion) return;
    if (!revealed) reveal();
    else if (index < category.questions.length - 1) goQuestion(category, index + 1);
    else { persist(category, index, true); navigate(`/quiz/${category.id}/complete`); }
  };
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else throw new Error('unsupported');
    } catch { setNotice('전체 화면을 열 수 없어요. 브라우저 메뉴의 전체 화면 기능을 사용해 주세요.'); }
  };
  useEffect(() => {
    const back = () => { setPath(window.location.pathname); setRevealed(false); setModal(null); };
    const full = () => setFullscreen(!!document.fullscreenElement);
    window.addEventListener('popstate', back); document.addEventListener('fullscreenchange', full);
    return () => { window.removeEventListener('popstate', back); document.removeEventListener('fullscreenchange', full); };
  }, []);
  useEffect(() => {
    heading.current?.focus();
    window.scrollTo?.(0, 0);
    if (category && isQuestion) persist(category, index);
    // Route changes always restore an unrevealed question, never answer state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);
  useEffect(() => { if (revealed) answerHeading.current?.focus(); }, [revealed]);
  useEffect(() => {
    if (modal) { opener.current = document.activeElement as HTMLElement; dialog.current?.showModal(); }
    else if (dialog.current?.open) { dialog.current.close(); opener.current?.focus(); }
  }, [modal]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || modal || (target instanceof Element && target.closest('button, a, input, select, textarea, summary, [contenteditable]:not([contenteditable="false"]), [role="button"]'))) return;
      if (event.key.toLowerCase() === 'f') { event.preventDefault(); void toggleFullscreen(); }
      else if (isQuestion && (event.key === ' ' || event.key === 'ArrowRight')) { event.preventDefault(); advance(); }
      else if (isQuestion && event.key === 'ArrowLeft' && index > 0 && category) { event.preventDefault(); goQuestion(category, index - 1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return <div className={`stage ${isHome ? 'stage-home' : ''}`}>
    <StageBackground />
    <a className="skip-link" href="#main">본문으로 건너뛰기</a>
    <div className="stage-tools" aria-label="진행 도구">
      {!isHome && <button className="quiet" onClick={() => navigate('/')}>처음으로</button>}
      <button className="quiet" onClick={() => setModal('help')}>도움말</button>
      <button className="quiet" onClick={() => void toggleFullscreen()} aria-pressed={fullscreen}>{fullscreen ? '전체 화면 종료' : '전체 화면'} <span aria-hidden="true">⛶</span></button>
    </div>
    {notice && <div role="status" className="notice">{notice}<button onClick={() => setNotice('')} aria-label="안내 닫기">×</button></div>}
    <main id="main" className="stage-main">
      {isHome ? <section className="scene welcome-scene">
        <div className="welcome-content">
          <img className="event-logo" src={import.meta.env.VITE_LOGO_URL || '/brand/lucete-profile.png'} alt="영통영덕성당 루체테 CI" />
          <p className="organizer">영통영덕성당 루체테</p>
          <h1 ref={heading} tabIndex={-1}>2026 루체테 성지순례</h1>
          <p className="destination">남양성모성지</p>
          <div className="start-choices" aria-label="퀴즈 선택">
            {(['saints', 'church'] as const).map(id => {
              const c = categories.find(item => item.id === id);
              const title = c?.title || (id === 'saints' ? '성인 퀴즈' : '성당 상식 퀴즈');
              return <button className="start-choice" key={id} disabled={!c} aria-label={title} onClick={() => c && navigate(`/quiz/${c.id}`)}>
                <strong>{title}</strong>
                <span aria-hidden="true">→</span>
              </button>;
            })}
          </div>
          {!categories.length && <p role="status">{contentUnavailable}</p>}
        </div>
      </section> : isIntro && category ? <section className="scene ready-scene">
        <h1 ref={heading} tabIndex={-1}>{category.title}</h1>
        <div className="actions">
          <button className="primary" onClick={() => goQuestion(category, saved && !saved.completed ? saved.index : 0)}>시작</button>
          {saved && !saved.completed && <button className="secondary" onClick={() => setModal('reset')}>처음부터</button>}
        </div>
      </section> : isQuestion && category && question ? <section className={`scene question-scene ${revealed ? 'is-revealed' : ''}`}>
        <div className="question-meta"><span>{category.title}</span><span><strong>{String(index + 1).padStart(2, '0')}</strong> / {category.questions.length}</span></div>
        <div className="progress-track" role="progressbar" aria-label="현재 문제 위치" aria-valuemin={1} aria-valuemax={category.questions.length} aria-valuenow={index + 1}><span style={{ width: `${((index + 1) / category.questions.length) * 100}%` }} /></div>
        <div className="question-body" key={`${question.id}-${revealed}`}>
          <h1 className="question-title" ref={heading} tabIndex={-1}>{question.question}</h1>
          {!revealed && question.type !== 'short-answer' && <ol className={`choices ${question.type === 'ox' ? 'ox-choices' : ''}`} aria-label="보기">
            {question.choices?.map((choice, n) => <li key={choice}>{question.type === 'multiple-choice' && <span className="choice-number">{n + 1}</span>}<span>{choice}</span></li>)}
          </ol>}
          {revealed && <section className="answer" aria-labelledby="answer-heading">
            <h2 id="answer-heading" ref={answerHeading} tabIndex={-1}>정답 · {question.answer}</h2>
            <div className="answer-reading" tabIndex={0} role="region" aria-label="정답 해설">
              {question.type === 'short-answer' && question.acceptedAnswers && <p className="accepted">인정 답안: {question.acceptedAnswers.join(' / ')}</p>}
              <p className="explanation">{question.explanation}</p>
              <details><summary>출처</summary><ul>{question.sources.map(s => <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a></li>)}</ul></details>
            </div>
          </section>}
        </div>
        <div className="presenter-actions">
          <button className="secondary" disabled={index === 0} onClick={() => goQuestion(category, index - 1)}>← 이전 문제</button>
          <div className="question-tools"><button className="quiet" onClick={() => setModal('overview')}>문제 목록</button><button className="quiet" onClick={() => setModal('reset')}>다시 시작</button></div>
          <button className="primary" onClick={advance}>{!revealed ? '정답 공개' : index === category.questions.length - 1 ? '종료' : '다음 문제'}</button>
        </div>
        <p className="sr-only" aria-live="polite">{revealed ? '정답과 해설을 공개했습니다.' : `${index + 1}번 문제. 정답은 아직 공개되지 않았습니다.`}</p>
      </section> : isComplete && category ? <section className="scene completion-scene">
        <p className="scene-kicker">{category.title}</p>
        <h1 ref={heading} tabIndex={-1}>퀴즈 종료</h1>
        <div className="actions"><button className="primary" onClick={() => navigate(`/quiz/${category.id === 'saints' ? 'church' : 'saints'}`)}>다른 퀴즈</button><button className="secondary" onClick={() => navigate('/')}>처음으로</button><button className="quiet" onClick={() => setModal('reset')}>다시 시작</button></div>
      </section> : <section className="scene ready-scene"><h1 ref={heading} tabIndex={-1}>이 페이지를 찾을 수 없어요.</h1><button className="primary" onClick={() => navigate('/')}>처음으로</button></section>}
    </main>
    <dialog ref={dialog} aria-labelledby="dialog-title" onCancel={() => setModal(null)} onClose={() => setModal(null)}>
      {modal === 'overview' && category ? <>
        <div className="dialog-heading"><h2 id="dialog-title">문제 바로가기</h2><button className="quiet" onClick={() => setModal(null)} aria-label="문제 목록 닫기">닫기 ×</button></div>
        <div className="question-grid">{category.questions.map((q, n) => <button key={q.id} aria-label={`${n + 1}번 문제`} aria-current={index === n ? 'step' : undefined} onClick={() => goQuestion(category, n)}>{String(n + 1).padStart(2, '0')}</button>)}</div>
      </> : modal === 'reset' && category ? <>
        <h2 id="dialog-title">처음부터 시작할까요?</h2><p>현재 퀴즈의 진행 위치가 초기화됩니다.</p>
        <div className="actions"><button className="secondary" autoFocus onClick={() => setModal(null)}>취소</button><button className="primary" onClick={() => goQuestion(category, 0)}>처음부터 시작</button></div>
      </> : modal === 'help' ? <>
        <div className="dialog-heading"><h2 id="dialog-title">조작법</h2><button className="quiet" onClick={() => setModal(null)}>닫기 ×</button></div>
        <ul className="help-list"><li>Space / → : 정답 공개 · 다음 문제</li><li>← : 이전 문제</li><li>F : 전체 화면</li></ul>
        <a className="media-credit" href="/media/credits.html" target="_blank" rel="noreferrer">사진 출처</a>
      </> : null}
    </dialog>
  </div>;
}
