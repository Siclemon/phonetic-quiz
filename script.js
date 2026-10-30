async function main() {
    const data = await fetch('./dicotags.json').then(res => res.json());

    const getGameObject = async () => {

        const getRandomWord = async () => await fetch('https://random-word-api.herokuapp.com/word?diff=' + Math.floor(Math.random() * 3 + 1)).then(res => res.json()).then(async data => {
            return data[0];
        });

        const searchWord = searchedWord => {
            for (const w of data) {
                if (w.word == searchedWord) return w;
            }
        };

        const getWordObject = async () => {
            let wordObject;
            while (!wordObject) {
                const wordString = await getRandomWord();
                wordObject = searchWord(wordString);
                // if (!wordObject) console.log(wordString)
            }
            return wordObject;
        };

        const selectPronunciation = w => {
            const mainTags = ['UK', 'US', 'General-American', 'Received-Pronunciation', 'Standard'];
            const secondarytags = ['Canada', 'Australia', 'British', 'Southern', 'New-Zealand', 'Ireland', 'Scotland', 'Wales', 'Northern-Ireland'];

            const randomElement = arr => { return arr[Math.floor(Math.random() * arr.length)] };

            const wordMainPronunciations = w.pronunciations.filter(pron => pron.tags?.some(tag => mainTags.includes(tag)));
            if (wordMainPronunciations.length) return randomElement(wordMainPronunciations);

            const wordOtherPronunciations = w.pronunciations.filter(pron => pron.tags?.some(tag => secondarytags.includes(tag)) && !wordMainPronunciations.includes(pron));
            if (wordOtherPronunciations.length) return randomElement(wordOtherPronunciations);

            const noTags = w.pronunciations.filter(pron => !pron.tags);
            return randomElement(noTags);
        };

        const getHomophones = ipa => {
            const list = [];
            for (const w of data)
                for (const pron of w.pronunciations)
                    if (pron.ipa == ipa && !list.includes(w)) list.push(w); //or w.word? (only the word or are the meanings needed?)
            return list;
        };

        const word = await Promise.any([getWordObject(), getWordObject(), getWordObject(), getWordObject(), getWordObject(), getWordObject(), getWordObject(), getWordObject(), getWordObject(), getWordObject()]);
        const pronunciation = selectPronunciation(word);
        const homophones = getHomophones(pronunciation.ipa);

        const ret = {};
        ret.pronunciation = pronunciation;
        ret.words = homophones;
        return ret;
    }

    const gameObject = await getGameObject();
    console.log(gameObject);

    const dom = {
        label: document.querySelector('label'),
        input: document.getElementById('input'),
        btn: document.querySelector('button'),
    };

    dom.label.textContent = gameObject.pronunciation.ipa;

    dom.btn.addEventListener('click', e => {
        e.preventDefault();
        const input = dom.input.value.trim();
        if (gameObject.words.some(w => w.word == input)) alert('gg')
    });
dom.input.value='';
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

blood 