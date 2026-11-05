export function setupOpening(dialog: HTMLDialogElement): void {
    document.getElementById('open_settings')?.addEventListener('click', () => dialog.showModal());
}

export function setupClosing(dialog: HTMLDialogElement): void {
    const btn = document.getElementById('settings__close_button') as HTMLButtonElement;
    btn.addEventListener('click', () => {
        dialog.close();
    });
    dialog.addEventListener('click', e => {
        if (e.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();

        const clickedInDialog = (
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom &&
            e.clientX >= rect.left &&
            e.clientX <= rect.right
        );

        if (!clickedInDialog) dialog.close();
    });
}

export function showFrequencies(freqs: number[]): void {
    const bars = document.querySelectorAll('#settings__freq__chart div') as NodeList;
    bars.forEach((bar, i) => (bar as HTMLElement).style.height = `${freqs[i] * 80}px`);
}

export function fillSliderProgress(slider: HTMLInputElement): void {
    const min = slider.min === '' ? 0 : +slider.min;
    const max = slider.max === '' ? 100 : +slider.max;
    slider.style.setProperty('--range-progress', (+slider.value - min) / (max - min) + '');
}