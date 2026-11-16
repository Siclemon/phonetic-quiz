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

export function loadingScreen(): void {
    const loadingDiv = document.getElementById('loading');
    const panels = document.querySelectorAll('.panel');
    
    loadingDiv?.classList.add('loaded');
    panels.forEach(panel => panel.classList.add('loaded'));
    setTimeout(() => {
        document.getElementById('loading')?.remove();
    }, 500);
}