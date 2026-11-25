import type { Pronunciation, Word, GameObject } from '../types/interfaces.ts';
import { retrieveFrequencies, retrievePreferredTags } from '../game/data.ts';

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
    const preferredTags: string[] = retrievePreferredTags();
    while (!wordObject) {
        const wordString = pickRandomWord(wordsList);
        wordObject = dictionary.find(w => w.word === wordString);
        if (preferredTags.length > 0 && !wordObject?.pronunciations.some(pron => pron.tags?.some(tag => preferredTags.includes(tag)) || (!pron.tags || pron.tags.length === 0) && preferredTags.includes('Untagged'))) wordObject = undefined;
    }
    return wordObject;
}

function pickRandomWord(wordsList: string[][]): string {
    const frequencies: number[] = retrieveFrequencies();
    const difficulty = weightedRandom(frequencies);
    return randomElement(wordsList[difficulty - 1]);
}

function selectPronunciation(word: Word): Pronunciation {
    const preferredTags: string[] = retrievePreferredTags();

    const preferredWords = word.pronunciations.filter(pron => pron.tags?.some(tag => preferredTags.includes(tag)));
    if (preferredWords.length) return randomElement(preferredWords);

    if (preferredTags.includes('Untagged')) {
        const noTags = word.pronunciations.filter(pron => !pron.tags || pron.tags.length === 0);
        if (noTags.length) return randomElement(noTags);
    }

    return randomElement(word.pronunciations);
}

function getHomophones(ipa: string, dictionary: Word[]): Word[] {
    const preferredTags: string[] = retrievePreferredTags();
    return dictionary.filter(w => w.pronunciations.some(pron => pron.ipa === ipa && (pron.tags?.some(tag => preferredTags.includes(tag)) || (!pron.tags || pron.tags.length === 0) && preferredTags.includes('Untagged'))));
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