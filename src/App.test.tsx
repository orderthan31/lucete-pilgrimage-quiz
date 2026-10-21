import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './App';
import { fixture } from './test-fixture';
import { progressKey, readProgress, saveProgress } from './progress';
const start = () => {
  render(<App categories={fixture} />);
  fireEvent.click(screen.getAllByRole('button', { name: /퀴즈 만나기/ })[0]);
  fireEvent.click(screen.getByRole('button', { name: /첫 문제 시작하기/ }));
};
const reveal = () => fireEvent.click(screen.getByRole('button', { name: /정답 공개하기/ }));
describe('presenter flow', () => {
  it('renders the exact event identity and two entry cards', () => {
    render(<App categories={fixture} />);
    expect(screen.getByRole('heading', { name: '2026 루체테 성지순례' })).toBeTruthy();
    expect(screen.getByRole('button', { name: /성당 상식 퀴즈 만나기/ })).toBeTruthy();
    expect(screen.getAllByRole('button', { name: /퀴즈 만나기/ })).toHaveLength(2);
  });
  it('requires explicit reveal; advances and previous hides answers', () => {
    start();
    expect(screen.queryByText('공개 뒤에만 보이는 해설 1')).toBeNull();
    fireEvent.click(screen.getByText('둘째 보기'));
    expect(screen.queryByText('공개 뒤에만 보이는 해설 1')).toBeNull();
    reveal();
    expect(screen.getByText('공개 뒤에만 보이는 해설 1')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /다음 문제/ }));
    expect(screen.getByRole('heading', { name: '2번째 테스트 질문' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /이전 문제/ }));
    expect(screen.queryByText('공개 뒤에만 보이는 해설 1')).toBeNull();
  });
  it('never renders short answers or variants until reveal', () => {
    window.history.replaceState(null, '', '/quiz/saints/question/saints-3');
    render(<App categories={fixture} />);
    expect(screen.queryByText(/숨겨진 단답/)).toBeNull();
    expect(screen.queryByText(/허용 표현/)).toBeNull();
    expect(screen.queryByRole('textbox')).toBeNull();
    reveal(); expect(screen.getByRole('heading', { name: '정답 · 숨겨진 단답' })).toBeTruthy();
    expect(screen.getByText(/허용 표현/)).toBeTruthy();
  });
  it('refresh restores the same question unrevealed; home preserves resume', () => {
    window.history.replaceState(null, '', '/quiz/saints/question/saints-5');
    const app = render(<App categories={fixture} />);
    reveal(); app.unmount(); render(<App categories={fixture} />);
    expect(screen.getByRole('heading', { name: '5번째 테스트 질문' })).toBeTruthy();
    expect(screen.queryByText('공개 뒤에만 보이는 해설 5')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '처음으로' }));
    fireEvent.click(screen.getByRole('button', { name: /5번부터 이어가기/ }));
    fireEvent.click(screen.getByRole('button', { name: /5번부터 이어가기/ }));
    expect(screen.getByRole('heading', { name: '5번째 테스트 질문' })).toBeTruthy();
  });
  it('reset requires confirmation and only resets the current category', () => {
    saveProgress(fixture[1], 8); start(); reveal();
    fireEvent.click(screen.getByRole('button', { name: '다시 시작' }));
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: '취소' }));
    expect(screen.getByText('공개 뒤에만 보이는 해설 1')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '다시 시작' }));
    fireEvent.click(screen.getByRole('button', { name: '처음부터 시작' }));
    expect(screen.queryByText('공개 뒤에만 보이는 해설 1')).toBeNull();
    expect(readProgress(fixture[0])?.index).toBe(0);
    expect(readProgress(fixture[1])?.index).toBe(8);
  });
  it('keyboard reveal/advance ignores repeat, modifiers, controls and modal state', () => {
    start();
    fireEvent.keyDown(window, { key: ' ', repeat: true });
    fireEvent.keyDown(window, { key: 'ArrowRight', ctrlKey: true });
    fireEvent.keyDown(screen.getByRole('button', { name: /정답 공개하기/ }), { key: 'ArrowRight' });
    expect(screen.queryByText('공개 뒤에만 보이는 해설 1')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '문제 목록' }));
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.queryByText('공개 뒤에만 보이는 해설 1')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '문제 목록 닫기' }));
    fireEvent.keyDown(window, { key: ' ' });
    expect(screen.getByText('공개 뒤에만 보이는 해설 1')).toBeTruthy();
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByRole('heading', { name: '2번째 테스트 질문' })).toBeTruthy();
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByRole('heading', { name: '1번째 테스트 질문' })).toBeTruthy();
  });
  it('jumps explicitly, then finishes after the twentieth reveal', () => {
    start(); fireEvent.click(screen.getByRole('button', { name: '문제 목록' }));
    fireEvent.click(screen.getByRole('button', { name: '20번 문제' }));
    expect(screen.getByRole('heading', { name: '20번째 테스트 질문' })).toBeTruthy();
    reveal(); fireEvent.click(screen.getByRole('button', { name: /퀴즈 마치기/ }));
    expect(screen.getByRole('heading', { name: /함께해서 더 빛나는/ })).toBeTruthy();
    expect(readProgress(fixture[0])?.completed).toBe(true);
  });
  it('handles corrupt storage, blocked storage, unsupported fullscreen and unknown routes', () => {
    localStorage.setItem(progressKey('saints'), '{bad');
    start();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('denied'); });
    reveal(); fireEvent.click(screen.getByRole('button', { name: /다음 문제/ }));
    expect(screen.getByRole('status').textContent).toContain('저장할 수 없어요');
    fireEvent.click(screen.getByRole('button', { name: /전체 화면/ }));
    expect(screen.getByRole('status').textContent).toContain('전체 화면을 열 수 없어요');
    act(() => { window.history.pushState(null, '', '/quiz/unknown'); window.dispatchEvent(new PopStateEvent('popstate')); });
    expect(screen.getByRole('heading', { name: '이 페이지를 찾을 수 없어요.' })).toBeTruthy();
  });
  it('browser popstate hides an answer and restores the URL question', () => {
    start(); reveal();
    act(() => { window.history.replaceState(null, '', '/quiz/saints/question/saints-2'); window.dispatchEvent(new PopStateEvent('popstate')); });
    expect(screen.getByRole('heading', { name: '2번째 테스트 질문' })).toBeTruthy();
    expect(screen.queryByText(/공개 뒤에만 보이는/)).toBeNull();
  });
});
