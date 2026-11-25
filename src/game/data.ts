import type { Word } from "../types/interfaces";
import { calcFrequenciesArray } from "./settings";

export async function fetchDictionary(): Promise<Word[]> {
    return await fetch('/phonetic-quiz/dictionary.json').then(res => res.json());
}

export async function fetchWordsLists(): Promise<string[][]> {
    const ret: Promise<any>[] = [];
    for (let i = 1; i < 9; i++) {
        ret.push(fetch(`/phonetic-quiz/english-words-${i}.json`).then(res => res.json()));
    }
    return Promise.all(ret);
}

export function retrieveSliderValues(diffSlider: HTMLInputElement, spreadSlider: HTMLInputElement) {
    diffSlider.value = window.localStorage.getItem(diffSlider.id) ?? '2';
    spreadSlider.value = window.localStorage.getItem(spreadSlider.id) ?? '5';
}

export function saveInputValue(input: HTMLInputElement) {
    window.localStorage.setItem(input.id, input.value);
}

export function saveFrequencies(frequencies: number[]): void {
    window.localStorage.setItem('frequencies', JSON.stringify(frequencies));
}

export function retrieveFrequencies(): number[] {
    return JSON.parse(window.localStorage.getItem('frequencies') ?? 'null') || calcFrequenciesArray(2, 5);
}

export const DIALECTS: string[] = ['Received-Pronunciation', 'General-American', 'UK', 'US', 'Standard', 'Canada', 'Australia', 'British', 'Southern', 'New-Zealand', 'Ireland', 'Scotland', 'Wales', 'Northern-Ireland', 'Untagged'];

export function savePreferredTags(tags: string[]): void {
    window.localStorage.setItem('preferredTags', JSON.stringify(tags));
}

export function retrievePreferredTags(): string[] {
    const data = JSON.parse(window.localStorage.getItem('preferredTags') ?? 'null');
    if (data && data.length) return data;
    const DEFAULT_DIALECTS: string[] = ['Received-Pronunciation', 'General-American', 'UK', 'US', 'Untagged'];
    savePreferredTags(DEFAULT_DIALECTS);
    return DEFAULT_DIALECTS;
}