import type { Word, GameObject } from './interfaces.ts';

export function showAnswers(gameObject: GameObject) {
    for (const answer of gameObject.words)
        showAnswer(answer, gameObject.words.indexOf(answer));
    const header = document.querySelector('header.answers__header') as HTMLElement;
    header.textContent = gameObject.words.length + ' answer' + (gameObject.words.length > 1 ? 's' : '') + ':';
}

function showAnswer(word: Word, index: number) {
    const art = document.createElement('article') as HTMLElement;
    const header = art.appendChild(document.createElement('header') as HTMLElement);
    header.textContent = word.word;

    art.appendChild(createButtons(index));

    const olM = document.createElement('ol') as HTMLOListElement;
    for (const meaning of word.meanings) {
        const li = document.createElement('li') as HTMLLIElement;
        li.textContent = meaning;
        olM.appendChild(li);
    }
    olM.id = 'olM' + index;
    olM.classList = 'hidden';
    art.appendChild(olM);

    const olP = document.createElement('ol') as HTMLOListElement;
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
        olP.appendChild(li);
    }
    olP.id = 'olP' + index;
    olP.classList = 'hidden';
    art.appendChild(olP);

    document.querySelector('section')?.appendChild(art);
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
    const inp = document.createElement('input') as HTMLInputElement;
    inp.type = 'checkbox';
    inp.id = `${type}-${index}`;
    inp.addEventListener('click', () => showWordInfo(type, index));
    label.appendChild(inp);

    return label;
}

function showWordInfo(thing: string, index: number) {
    const other = thing === 'meaning' ? 'pronunciation' : 'meaning';
    const input = document.getElementById(thing + '-' + index) as HTMLInputElement;
    const otherInput = document.getElementById(other + '-' + index) as HTMLInputElement;
    if (otherInput.checked) {
        otherInput.checked = false;
        const otherList = document.getElementById('ol' + other[0].toUpperCase() + index) as HTMLOListElement;
        otherList.classList.toggle('hidden');
    };
    const list = document.getElementById('ol' + thing[0].toUpperCase() + index) as HTMLOListElement;
    list.classList.toggle('hidden');
}