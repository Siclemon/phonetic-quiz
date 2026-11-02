import type { Pronunciation, Word, GameObject } from './interfaces.ts';

export async function getGameObject(data: Word[]) {

    // lent + trop de requêtes
    // const getRandomWordd = async (): Promise<string> => await fetch('https://random-word-api.herokuapp.com/word?diff=' + Math.floor(Math.random() * 3 + 1)).then(res => res.json()).then(async data => {
    //     return data[0];
    // });
    
    const getRandomWord = async (): Promise<string> => await fetch('./src/assets/english-words.json').then(res => res.json()).then(async data => {
        return data[Math.floor(Math.random() * data.length)];
    });
    
    // trop de mots à la con
    // const caca: Word[] =data;
    // const getRandomWord = async (): Promise<string> => await fetch('./src/assets/english-words.json').then(res => res.json()).then(async (data) => {
    //     return caca[Math.floor(Math.random() * caca.length)].word;
    // });

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

    const getHomophones = (ipa: string): Word[] => {
        return data.filter(w => w.pronunciations.some(pron => pron.ipa === ipa));
    };

    const word = await Promise.any(Array.from({ length: 10 }, () => getWord()));
    const pronunciation = selectPronunciation(word);
    const homophones = getHomophones(pronunciation.ipa);

    const ret: GameObject = {
        pronunciation: pronunciation,
        words: homophones,
    };
    return ret;
}