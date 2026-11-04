import { retrieveSliderValues, saveFrequencies, saveInputsValues } from "./data";

export function setupDialog(): void {
    const settingsDialog = document.getElementById('settings') as HTMLDialogElement;

    setupDifficultySettings();

    settingsDialog.showModal();
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
            saveInputsValues(diffSlider, spreadSlider);
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

function showFrequencies(freqs: number[]): void {
    const bars = document.querySelectorAll('#settings__freq__chart div') as NodeList;
    bars.forEach((bar, i) => (bar as HTMLElement).style.height = `${freqs[i] * 80}px`);
}
