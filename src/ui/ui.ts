import type { GameObject } from "../types/interfaces";

export function answerFeedback(correct: boolean, input: HTMLInputElement): void {
    input.classList = 'form__input ' + (correct ? 'correct' : 'incorrect');
}

export function updateButtonContent(guessing: boolean, btn: HTMLButtonElement): void {
    btn.textContent = guessing ? '🪶' : '➡️';
}

export function showFirstMeanings(): void {
    document.getElementById('meaning-0')?.click();
}

export function setupForm(gameObject: GameObject, input: HTMLInputElement, label: HTMLLabelElement) {
    input.value = '';
    input.focus();
    label.textContent = gameObject.pronunciation.ipa;
}