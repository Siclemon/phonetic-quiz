async function main() {
    const data: Word[] = await fetch('./src/assets/dicotags.json').then(res => res.json());

    const getGameObject = async () => {

        const getRandomWord = async (): Promise<string> => await fetch('https://random-word-api.herokuapp.com/word?diff=' + Math.floor(Math.random() * 3 + 1)).then(res => res.json()).then(async data => {
            return data[0];
        });

        const getWord = async (): Promise<Word> => {
            let wordObject: Word | undefined;
            while (!wordObject) {
                const wordString = await getRandomWord();
                wordObject = data.find(w => w.word === wordString);
            }
            return wordObject;
        };

        const selectPronunciation = (w: Word): Pronunciation => {
            const mainTags = ['UK', 'US', 'General-American', 'Received-Pronunciation', 'Standard'];
            const secondarytags = ['Canada', 'Australia', 'British', 'Southern', 'New-Zealand', 'Ireland', 'Scotland', 'Wales', 'Northern-Ireland'];

            const randomElement = (arr: Pronunciation[]) => { return arr[Math.floor(Math.random() * arr.length)] };

            const wordMainPronunciations = w.pronunciations.filter(pron => pron.tags?.some(tag => mainTags.includes(tag)));
            if (wordMainPronunciations.length) return randomElement(wordMainPronunciations);

            const wordOtherPronunciations = w.pronunciations.filter(pron => pron.tags?.some(tag => secondarytags.includes(tag)) && !wordMainPronunciations.includes(pron));
            if (wordOtherPronunciations.length) return randomElement(wordOtherPronunciations);

            const noTags = w.pronunciations.filter(pron => !pron.tags);
            if (noTags.length) return randomElement(noTags);

            return randomElement(w.pronunciations);
        };

        const getHomophones = (ipa: string) => {
            const list: Word[] = [];
            for (const w of data)
                for (const pron of w.pronunciations)
                    if (pron.ipa == ipa && !list.includes(w)) list.push(w);
            return list;
        };

        const word = await Promise.any([getWord(), getWord(), getWord(), getWord(), getWord(), getWord(), getWord(), getWord(), getWord(), getWord()]);
        const pronunciation = selectPronunciation(word);
        const homophones = getHomophones(pronunciation.ipa);

        const ret: GameObject = {
            pronunciation: pronunciation,
            words: homophones,
        };
        return ret;
    }

    const gameObject: GameObject = await getGameObject();
    console.log(gameObject);

    const dom = {
        label: document.querySelector('label') as HTMLLabelElement,
        input: document.getElementById('input') as HTMLInputElement,
        btn: document.querySelector('button') as HTMLButtonElement,
    };

    dom.label.textContent = gameObject.pronunciation.ipa;

    dom.btn.addEventListener('click', e => {
        e.preventDefault();
        const input = dom.input.value.trim();
        if (gameObject.words.some(w => w.word == input)) alert('gg')
    });
    dom.input.value = '';
    dom.input.focus();
}

//========Calcul nombre de tags========
// const tags = {};
// for (const w of data)
//     if (w.pronunciations[0])
//         for (const pro of w.pronunciations)
//             if (pro.tags)
//                 for (const tag of pro.tags) {
//                     if (!tags[tag]) tags[tag] = 0;
//                     tags[tag]++;
//                 }
// console.log(tags)

main();

interface Pronunciation {
    ipa: string;
    tags?: string[];
    note?: string[];
}

interface Word {
    word: string;
    pronunciations: Pronunciation[];
    meanings: string[];
}

interface GameObject {
    pronunciation: Pronunciation;
    words: Word[];
}
