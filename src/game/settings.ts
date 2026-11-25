import { setupOpening, setupClosing, fillSliderProgress, showFrequencies, createDialectsInputs } from "../ui/settings";
import { DIALECTS, retrievePreferredTags, retrieveSliderValues, saveFrequencies, saveInputValue, savePreferredTags } from "./data";

export function setupSettingsDialog(): void {
    const openButton = document.getElementById('open_settings') as HTMLButtonElement;
    const closeButton = document.getElementById('close_settings') as HTMLButtonElement;
    const isMobile = window.matchMedia("(max-width: 600px)").matches;

    let settingsDialog: HTMLDialogElement;
    if (isMobile) {
        settingsDialog = document.getElementById('mobile-settings') as HTMLDialogElement;
        const mobileDialogs = document.querySelectorAll('.mobile-setting-subdialog') as NodeListOf<HTMLDialogElement>;

        for (const dial of mobileDialogs) {
            const id = dial.id.split('-')[0];
            const btn = document.getElementById(`btn-${id}`) as HTMLButtonElement;
            setupOpening(dial, btn);
            const back = dial.querySelector('.settings__back') as HTMLButtonElement;
            setupClosing(dial, back, true);
        }
        setupPreferencesSettings()
    }
    else {
        settingsDialog = document.getElementById('desktop-settings') as HTMLDialogElement;
    }

    setupDifficultySettings();
    setupOpening(settingsDialog, openButton);
    setupClosing(settingsDialog, closeButton, isMobile);

    //remove automatic focus on close button when opening
    settingsDialog.focus();
    settingsDialog.blur();
}

function setupPreferencesSettings(): void {
    const inputs: HTMLInputElement[] = createDialectsInputs(DIALECTS);
    for (const input of inputs) {
        const preferredTags = retrievePreferredTags();
        input.checked = preferredTags.includes(input.id);

        input.addEventListener('click', () => {
            const tags: string[] = [];
            for (const input of inputs) {
                if (input.checked) tags.push(input.id);
            }
            savePreferredTags(tags);
        });
    }
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
    return arr.map((_x, i) => calcFrequency(i + 1, diff, spread));
}

function calcFrequency(x: number, center: number, width: number): number {
    const max = 1;
    const ret = max * (10 ** (-1 * (((x - center) / (width * 1.1))) ** 2));
    return +ret.toFixed(2);
}