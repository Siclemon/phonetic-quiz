import type { Pronunciation, Word, GameObject } from '../types/interfaces.ts';
import { retrieveFrequencies } from '../game/data.ts';

export function getGameObject(dictionary: Word[], wordsList: string[][]): GameObject {

    const word = getWord(dictionary, wordsList);
    const pronunciation = selectPronunciation(word);
    const homophones = getHomophones(pronunciation.ipa, dictionary);

    const obj: GameObject = {
        pronunciation: pronunciation,
        words: homophones,
    };
    return obj;
}

function getWord(dictionary: Word[], wordsList: string[][]): Word {
    let wordObject: Word | undefined;
    while (!wordObject) {
        const wordString = pickRandomWord(wordsList);
        wordObject = dictionary.find(w => w.word === wordString);
    }
    return wordObject;
}

function pickRandomWord(wordsList: string[][]): string {
    const frequencies: number[] = retrieveFrequencies();
    const difficulty = weightedRandom(frequencies);
    console.log(difficulty)
    return randomElement(wordsList[difficulty - 1]);
}

function selectPronunciation(w: Word): Pronunciation {
    const mainTags = ['UK', 'US', 'General-American', 'Received-Pronunciation', 'Standard'];
    const secondarytags = ['Canada', 'Australia', 'British', 'Southern', 'New-Zealand', 'Ireland', 'Scotland', 'Wales', 'Northern-Ireland'];

    const wordMainPronunciations = w.pronunciations.filter(pron => pron.tags?.some(tag => mainTags.includes(tag)));
    if (wordMainPronunciations.length) return randomElement(wordMainPronunciations);

    const wordOtherPronunciations = w.pronunciations.filter(pron => pron.tags?.some(tag => secondarytags.includes(tag)) && !wordMainPronunciations.includes(pron));
    if (wordOtherPronunciations.length) return randomElement(wordOtherPronunciations);

    const noTags = w.pronunciations.filter(pron => !pron.tags);
    if (noTags.length) return randomElement(noTags);

    return randomElement(w.pronunciations);
}

function getHomophones(ipa: string, dictionary: Word[]): Word[] {
    return dictionary.filter(w => w.pronunciations.some(pron => pron.ipa === ipa));
}

export function randomElement<T>(arr: T[]) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function weightedRandom(frequencies: number[]): number {
    const arr = frequencies.flatMap((freq, i) => Array.from({ length: freq * 100 }, () => i + 1));
    return randomElement(arr);
}

export function isCorrect(gameObject: GameObject, input: string): boolean {
    input = input.trim().toLowerCase();
    return gameObject.words.some(w => w.word === input);
}