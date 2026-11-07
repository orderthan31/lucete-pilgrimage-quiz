import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';
import { fixture } from './test-fixture';
import { progressKey } from './progress';

const hintFixture = () => {
  const data = structuredClone(fixture);
  Object.assign(data[0].questions[0], { hint: { kind: 'eliminate', eliminatedIndices: [0, 3] } });
  Object.assign(data[0].questions[2], { hint: { kind: 'text', text: '이름의 첫 글자를 떠올려 보세요.' } });
  Object.assign(data[0].questions[5], { hint: { kind: 'options', choices: ['후보 하나', '숨겨진 단답', '후보 셋'] } });
  return data;
};
const open = (number: number) => {
  window.history.replaceState(null, '', `/quiz/saints/question/saints-${number}`);
  return render(<App categories={hintFixture()} />);
};
const revealHint = () => fireEvent.click(screen.getByRole('button', { name: '힌트 보기' }));
const revealAnswer = () => fireEvent.click(screen.getByRole('button', { name: '정답 공개' }));

describe('optional presenter hints', () => {
  it('starts with the hint hidden, eliminates only two wrong choices on demand, and can hide it again', () => {
    const { container } = open(1);
    const button = screen.getByRole('button', { name: '힌트 보기' });
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(container.querySelectorAll('.is-eliminated')).toHaveLength(0);
    expect(screen.queryByText('제외')).toBeNull();
    revealHint();
    expect(screen.getByRole('button', { name: '힌트 숨기기' }).getAttribute('aria-expanded')).toBe('true');
    expect(container.querySelectorAll('.is-eliminated')).toHaveLength(2);
    const choices = within(screen.getByRole('list', { name: '보기' })).getAllByRole('listitem');
    expect(choices).toHaveLength(5);
    expect(choices[0].classList.contains('is-eliminated')).toBe(true);
    expect(choices[3].classList.contains('is-eliminated')).toBe(true);
    expect(choices[1].classList.contains('is-eliminated')).toBe(false);
    expect(screen.queryByRole('heading', { name: /^정답 ·/ })).toBeNull();
    expect(screen.queryByText('공개 뒤에만 보이는 해설 1')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '힌트 숨기기' }));
    expect(container.querySelectorAll('.is-eliminated')).toHaveLength(0);
  });
  it('does not expose short-answer hints or accepted variants before the presenter requests them', () => {
    open(3);
    expect(screen.queryByText('이름의 첫 글자를 떠올려 보세요.')).toBeNull();
    expect(screen.queryByText(/숨겨진 단답|허용 표현/)).toBeNull();
    revealHint();
    expect(screen.getByRole('region', { name: '힌트' }).textContent).toContain('이름의 첫 글자를 떠올려 보세요.');
    expect(screen.queryByText(/숨겨진 단답|허용 표현/)).toBeNull();
    expect(screen.queryByRole('textbox')).toBeNull();
    revealAnswer();
    expect(screen.queryByRole('region', { name: '힌트' })).toBeNull();
    expect(screen.queryByRole('button', { name: /힌트/ })).toBeNull();
    expect(screen.getByRole('heading', { name: '정답 · 숨겨진 단답' })).toBeTruthy();
  });
  it('offers neutral spoken-answer candidates only after the hint, without selecting or grading', () => {
    const { container } = open(6);
    expect(screen.queryByText('후보 하나')).toBeNull();
    expect(screen.queryByText('숨겨진 단답')).toBeNull();
    revealHint();
    const hint = screen.getByRole('region', { name: '힌트' });
    expect(within(hint).getAllByRole('listitem')).toHaveLength(3);
    expect(within(hint).queryByRole('button')).toBeNull();
    expect(container.querySelector('.hint-options .is-correct')).toBeNull();
    expect(screen.queryByRole('heading', { name: /^정답 ·/ })).toBeNull();
    expect(screen.queryByText(/공개 뒤에만 보이는|허용 표현/)).toBeNull();
    fireEvent.click(within(hint).getByText('숨겨진 단답'));
    expect(screen.queryByRole('heading', { name: /^정답 ·/ })).toBeNull();
    revealAnswer();
    expect(screen.getByText('공개 뒤에만 보이는 해설 6')).toBeTruthy();
  });
  it('supports direct answer reveal without first opening the hint', () => {
    open(3);
    revealAnswer();
    expect(screen.getByRole('heading', { name: '정답 · 숨겨진 단답' })).toBeTruthy();
    expect(screen.queryByText('이름의 첫 글자를 떠올려 보세요.')).toBeNull();
  });
  it('does not offer irrelevant hint controls on OX and unhinted questions', () => {
    open(2);
    expect(screen.queryByRole('button', { name: /힌트/ })).toBeNull();
    revealAnswer();
    fireEvent.click(screen.getByRole('button', { name: '다음 문제' }));
    expect(screen.getByRole('button', { name: '힌트 보기' })).toBeTruthy();
  });
  it('resets the hint on explicit same-question jumps, previous navigation, popstate and refresh', () => {
    const app = open(3);
    revealHint();
    fireEvent.click(screen.getByRole('button', { name: '문제 목록' }));
    fireEvent.click(screen.getByRole('button', { name: '3번 문제' }));
    expect(screen.queryByText('이름의 첫 글자를 떠올려 보세요.')).toBeNull();
    revealHint(); revealAnswer();
    fireEvent.click(screen.getByRole('button', { name: '다음 문제' }));
    fireEvent.click(screen.getByRole('button', { name: /이전 문제/ }));
    expect(screen.getByRole('button', { name: '힌트 보기' })).toBeTruthy();
    revealHint();
    act(() => window.dispatchEvent(new PopStateEvent('popstate')));
    expect(screen.getByRole('button', { name: '힌트 보기' })).toBeTruthy();
    revealHint(); app.unmount();
    render(<App categories={hintFixture()} />);
    expect(screen.queryByText('이름의 첫 글자를 떠올려 보세요.')).toBeNull();
  });
  it('does not save hint/answer state or advance the question when opening a hint', () => {
    open(3);
    const before = localStorage.getItem(progressKey('saints'));
    const path = window.location.pathname;
    revealHint();
    expect(window.location.pathname).toBe(path);
    expect(localStorage.getItem(progressKey('saints'))).toBe(before);
    expect(screen.getByRole('button', { name: '정답 공개' })).toBeTruthy();
    fireEvent.keyDown(window, { key: ' ' });
    expect(screen.getByRole('heading', { name: '정답 · 숨겨진 단답' })).toBeTruthy();
  });
});
