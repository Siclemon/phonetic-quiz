import { setupOpening, setupClosing, fillSliderProgress, showFrequencies } from "../ui/settings";
import { retrieveSliderValues, saveFrequencies, saveInputValue } from "./data";

export function setupDialog(): void {
    const settingsDialog = document.getElementById('settings') as HTMLDialogElement;

    setupDifficultySettings();
    setupOpening(settingsDialog);
    setupClosing(settingsDialog);

    //remove automatic focus on close button when opening
    settingsDialog.focus();
    settingsDialog.blur();
}

function setupDifficultySettings() {
    const diffSlider = document.getElementById('settings__diff') as HTMLInputElement;
    const spreadSlider = document.getElementById('settings__spread') as HTMLInputElement;

    retrieveSliderValues(diffSlider, spreadSlider);

    [diffSlider, spreadSlider].forEach(slider => {
        slider.addEventListener('input', e => {
            const target: HTMLInputElement = e.target as HTMLInputElement;
            const output: HTMLOutputElement = document.getElementById(`${target.id}__output`) as HTMLOutputElement;
            output.value = target.value;

            updateFrequencies(+diffSlider.value, +spreadSlider.value);
            saveInputValue(slider);
            fillSliderProgress(slider);
        });
        slider.dispatchEvent(new Event('input'));
    });
}

function updateFrequencies(diff: number, spread: number): void {
    const frequencies = calcFrequenciesArray(diff, spread);
    showFrequencies(frequencies);
    saveFrequencies(frequencies);
}

export function calcFrequenciesArray(diff: number, spread: number): number[] {
    const arr = [0, 0, 0, 0, 0, 0, 0, 0];
    return arr.map((x, i) => calcFrequency(i + 1, diff, spread));
}

function calcFrequency(x: number, center: number, width: number): number {
    const max = 1;
    const ret = max * (10 ** (-1 * (((x - center) / (width * 1.1))) ** 2));
    return +ret.toFixed(2);
}