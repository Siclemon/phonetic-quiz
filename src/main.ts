import type { Word, GameObject } from './types/interfaces.ts';
import { answerFeedback, updateButtonContent, showFirstMeanings, setupForm } from './ui/ui.ts';
import { getGameObject, isCorrect } from './game/game.ts';
import { showAnswers, clearAnswers } from './ui/answers.ts';
import { setupDialog } from './game/settings.ts';
import { fetchDictionary, fetchWordsLists } from './game/data.ts';

async function main() {
    const dictionary: Word[] = await fetchDictionary();
    const wordsList: string[][] = await fetchWordsLists();

    let gameObject: GameObject = getGameObject(dictionary, wordsList);

    const label = document.querySelector('label') as HTMLLabelElement;
    const input = document.getElementById('input') as HTMLInputElement;
    const btn = document.querySelector('button') as HTMLButtonElement;

    setupDialog();
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