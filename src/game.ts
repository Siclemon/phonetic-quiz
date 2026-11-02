import type { Pronunciation, Word, GameObject } from './interfaces.ts';

export function getGameObject(dictionary: Word[], wordsList: string[]): GameObject {

    const word = getWord(dictionary, wordsList);
    const pronunciation = selectPronunciation(word);
    const homophones = getHomophones(pronunciation.ipa, dictionary);

    const ret: GameObject = {
        pronunciation: pronunciation,
        words: homophones,
    };
    return ret;
}

function getWord(dictionary: Word[], wordsList: string[]): Word {
    let wordObject: Word | undefined;
    while (!wordObject) {
        const wordString = pickRandomWord(wordsList);
        wordObject = dictionary.find(w => w.word === wordString);
    }
    return wordObject;
};

function pickRandomWord(wordsList: string[]): string {
    return wordsList[Math.floor(Math.random() * wordsList.length)];
}

function selectPronunciation(w: Word): Pronunciation {
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

function getHomophones(ipa: string, dictionary: Word[]): Word[] {
    return dictionary.filter(w => w.pronunciations.some(pron => pron.ipa === ipa));
};