import type { Word } from "../types/interfaces";
import { calcFrequenciesArray } from "./settings";

export async function fetchDictionary(): Promise<Word[]> {
    return await fetch('/phonetic-quiz/dictionary.json').then(res => res.json());
}

export async function fetchWordsLists(): Promise<string[][]> {
    const ret: string[][] = [];
    for (let i = 1; i < 9; i++) {
        await fetch(`/phonetic-quiz/english-words-${i}.json`).then(res => res.json()).then(data => ret.push(data));
    }
    return ret;
}

export function retrieveSliderValues(diffSlider: HTMLInputElement, spreadSlider: HTMLInputElement) {
    diffSlider.value = window.localStorage.getItem(diffSlider.id) ?? '2';
    spreadSlider.value = window.localStorage.getItem(spreadSlider.id) ?? '5';
}

export function saveInputsValues(...inputs: HTMLInputElement[]) {
    inputs.forEach(input => {
        window.localStorage.setItem(input.id, input.value);
    });
}

export function saveFrequencies(frequencies: number[]): void {
    window.localStorage.setItem('frequencies', JSON.stringify(frequencies));
}

export function retrieveFrequencies(): number[] {
    return JSON.parse(window.localStorage.getItem('frequencies') ?? 'null') || calcFrequenciesArray(2, 5);
}