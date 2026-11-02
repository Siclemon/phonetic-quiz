import type { Pronunciation, Word, GameObject } from './interfaces.ts';
import { showAnswers } from './dom.ts';
import { getGameObject } from './game.ts';

async function main() {
    const data: Word[] = await fetch('./src/assets/dicotags.json').then(res => res.json());
    const gameObjects: GameObject[] = await Promise.all(Array.from({ length: 2 }, () => getGameObject(data)));
    console.log(gameObjects)
    
    const dom = {
        label: document.querySelector('label') as HTMLLabelElement,
        input: document.getElementById('input') as HTMLInputElement,
        btn: document.querySelector('button') as HTMLButtonElement,
    };

    setupForm(gameObjects[0], dom.input, dom.label);

    let btn: boolean = true;
    
    dom.btn.addEventListener('click', async e => {
        e.preventDefault();

        if (btn) {
            const input = dom.input.value.trim().toLowerCase();
            if (gameObjects[0].words.some(w => w.word === input)) dom.input.style.borderColor = 'green';
            else dom.input.style.borderColor = 'red';
            showAnswers(gameObjects[0]);
            document.getElementById('meaning-0')?.click();
            gameObjects.shift();
            gameObjects.push(await getGameObject(data));
            dom.btn.textContent = "➡️";
            
        } else {
            setupForm(gameObjects[0], dom.input, dom.label);
            document.querySelectorAll('article').forEach(art => art.remove());
            document.querySelector('header.answers__header')!.textContent = '';
            dom.btn.textContent = "🪶";
        }

        btn = !btn;
    });
}

function setupForm(gameObject: GameObject, input: HTMLInputElement, label: HTMLLabelElement) {
    input.value = '';
    input.focus();
    label.textContent = gameObject.pronunciation.ipa;
}

main();