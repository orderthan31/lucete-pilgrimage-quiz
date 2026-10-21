const categories = [
  { id: 'saints', title: '성인 퀴즈', description: '성인들의 삶과 신앙을 함께 알아보아요.' },
  { id: 'church', title: '성당 상식', description: '우리의 신앙생활과 성당 이야기를 나누어요.' },
] as const;

export default function App() {
  return (
    <main className="landing">
      <header className="hero">
        <p className="eyebrow">영통영덕성당 루체테</p>
        <h1>2026 루체테 성지순례</h1>
        <p className="destination">남양성모성지</p>
        <p className="welcome">함께 걷고, 함께 배우는 믿음의 여정</p>
      </header>
      <section aria-labelledby="categories-heading">
        <h2 id="categories-heading">함께 풀어볼 퀴즈</h2>
        <div className="category-grid">
          {categories.map((category) => (
            <article className="category-card" key={category.id} aria-labelledby={`${category.id}-title`}>
              <p className="question-count">20문항 · 준비 중</p>
              <h3 id={`${category.id}-title`}>{category.title}</h3>
              <p>{category.description}</p>
              <button type="button" disabled aria-label={`${category.title} 준비 중`}>
                준비 중
              </button>
            </article>
          ))}
        </div>
        <p className="status-note">퀴즈와 진행 화면을 준비하고 있어요. 곧 함께 만나요.</p>
      </section>
      <footer>2026 · 영통영덕성당 루체테</footer>
    </main>
  );
}
