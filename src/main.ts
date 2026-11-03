import type { Word, GameObject } from './types/interfaces.ts';
import { answerFeedback, updateButtonContent, showFirstMeanings, setupForm } from './ui/ui.ts';
import { getGameObject, isCorrect } from './game.ts';
import { showAnswers, clearAnswers } from './ui/answers.ts';

async function main() {
    const dictionary: Word[] = await fetch('./src/assets/dicotags.json').then(res => res.json());
    const wordsList: string[] = await fetch('./src/assets/english-words.json').then(res => res.json());

    let gameObject: GameObject = getGameObject(dictionary, wordsList);

    const label = document.querySelector('label') as HTMLLabelElement;
    const input = document.getElementById('input') as HTMLInputElement;
    const btn = document.querySelector('button') as HTMLButtonElement;


    setupForm(gameObject, input, label);

    let guessing: boolean = true;

    btn.addEventListener('click', e => {
        e.preventDefault();

        if (guessing) {
            const correct: boolean = isCorrect(gameObject, input.value);
            answerFeedback(correct, input);
            showAnswers(gameObject);
            showFirstMeanings();
            gameObject = getGameObject(dictionary, wordsList);
        } else {
            setupForm(gameObject, input, label);
            clearAnswers();
        }

        guessing = !guessing;
        updateButtonContent(guessing, btn);
    });
}


main();