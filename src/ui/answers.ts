import type { Word, GameObject } from '../types/interfaces.ts';

export function showAnswers(gameObject: GameObject) {
    for (const answer of gameObject.words)
        showAnswer(answer, gameObject.words.indexOf(answer));
    const header = document.querySelector('header.answers__header') as HTMLElement;
    header.textContent = `${gameObject.words.length} answer${gameObject.words.length > 1 ? 's' : ''}:`;
}

function showAnswer(word: Word, index: number) {
    const art = document.createElement('article') as HTMLElement;
    art.classList.add('paper');
    const header = art.appendChild(document.createElement('header') as HTMLElement);
    header.textContent = word.word;

    art.appendChild(createButtons(index));
    art.appendChild(createMeaningsList(word, index));
    art.appendChild(createPronunciationsList(word, index));

    document.querySelector('section')?.appendChild(art);
}

function createMeaningsList(word: Word, index: number): HTMLOListElement {
    const ol = document.createElement('ol') as HTMLOListElement;
    for (const meaning of word.meanings) {
        const li = document.createElement('li') as HTMLLIElement;
        li.textContent = meaning;
        ol.appendChild(li);
    }
    ol.id = `olM${index}`;
    ol.classList = 'hidden';
    return ol;
}

function createPronunciationsList(word: Word, index: number) {
    const ol = document.createElement('ol') as HTMLOListElement;
    for (const pron of word.pronunciations) {
        const li = document.createElement('li') as HTMLLIElement;
        const lidiv = document.createElement('div') as HTMLElement;
        const ipa = document.createElement('span') as HTMLSpanElement;
        ipa.textContent = pron.ipa;
        lidiv.appendChild(ipa);
        if (pron.tags)
            for (const tag of pron.tags) {
                const tagSpan = document.createElement('span') as HTMLSpanElement;
                tagSpan.classList = 'tag';
                tagSpan.textContent = tag;
                lidiv.appendChild(tagSpan);
            }
        li.appendChild(lidiv)
        ol.appendChild(li);
    }
    ol.id = `olP${index}`;
    ol.classList = 'hidden';
    return ol;
}

function createButtons(index: number): HTMLElement {
    const div = document.createElement('div');
    div.classList.add('buttons');

    div.appendChild(createButton('meaning', index));
    div.appendChild(createButton('pronunciation', index));

    return div;
}

function createButton(type: string, index: number): HTMLLabelElement {
    const label = document.createElement('label') as HTMLLabelElement;
    label.htmlFor = `${type}-${index}`;
    label.textContent = type;
    label.classList.add('paper');
    const inp = document.createElement('input') as HTMLInputElement;
    inp.type = 'checkbox';
    inp.id = `${type}-${index}`;
    inp.addEventListener('click', () => showWordInfo(type, index));
    label.appendChild(inp);

    return label;
}

function showWordInfo(thing: string, index: number) {
    const other = thing === 'meaning' ? 'pronunciation' : 'meaning';
    // const input = document.getElementById(thing + '-' + index) as HTMLInputElement;
    const otherInput = document.getElementById(other + '-' + index) as HTMLInputElement;
    if (otherInput.checked) {
        otherInput.checked = false;
        const otherList = document.getElementById(`ol${other[0].toUpperCase()}${index}`) as HTMLOListElement;
        otherList.classList.toggle('hidden');
    };
    const list = document.getElementById(`ol${thing[0].toUpperCase()}${index}`) as HTMLOListElement;
    list.classList.toggle('hidden');
}

export function clearAnswers(): void {
    document.querySelectorAll('article').forEach(art => art.remove());
    document.querySelector('header.answers__header')!.textContent = '';
}
