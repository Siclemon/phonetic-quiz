import { setupOpening, setupClosing, fillSliderProgress, showFrequencies, createDialectsInputs, moveContent, setupDesktopTab, setupMobileSubdialogs } from "../ui/settings";
import { DIALECTS, retrievePreferredTags, retrieveSliderValues, saveFrequencies, saveInputValue, savePreferredTags } from "./data";

export function setupSettingsDialog(): void {
    const isMobile = window.matchMedia("(max-width: 600px)");

    const openButton = document.getElementById('open_settings') as HTMLButtonElement;

    const settingsMobile: HTMLDialogElement = document.getElementById('mobile-settings') as HTMLDialogElement;
    const settingsDesktop: HTMLDialogElement = document.getElementById('desktop-settings') as HTMLDialogElement;

    const closeButtonMobile = document.getElementById('mobile-settings-close') as HTMLButtonElement;
    const closeButtonDesktop = document.getElementById('desktop-settings-close') as HTMLButtonElement;

    setupMobileSubdialogs();
    setupDesktopTab(settingsDesktop);

    let removeOpening: () => void;

    isMobile.addEventListener('change', () => {
        // updateDevice(isMobile.matches)
        if (removeOpening) removeOpening();
        if (isMobile.matches) {
            removeOpening = setupOpening(settingsMobile, openButton);
        }
        else {
            removeOpening = setupOpening(settingsDesktop, openButton);
        }
        moveContent(isMobile.matches)
    });
    isMobile.dispatchEvent(new Event('change'));

    setupDifficultySettings();
    setupPreferencesSettings();
    setupClosing(settingsMobile, closeButtonMobile, isMobile.matches);
    setupClosing(settingsDesktop, closeButtonDesktop, isMobile.matches);

    //remove automatic focus on close button when opening
    // settingsDialog.focus();
    // settingsDialog.blur();
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

function setupDifficultySettings(): void {
    const diffSlider = document.getElementById('peak__input') as HTMLInputElement;
    const spreadSlider = document.getElementById('variety__input') as HTMLInputElement;

    retrieveSliderValues(diffSlider, spreadSlider);

    [diffSlider, spreadSlider].forEach(slider => {
        slider.addEventListener('input', e => {
            const target: HTMLInputElement = e.target as HTMLInputElement;
            const id = target.id.slice(0, -7);
            const output: HTMLOutputElement = document.getElementById(`${id}__output`) as HTMLOutputElement;
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