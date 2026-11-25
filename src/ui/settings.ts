export function setupOpening(dialog: HTMLDialogElement, button: HTMLButtonElement): void {
    button.addEventListener('click', () => dialog.showModal());
}

export function setupClosing(dialog: HTMLDialogElement, button: HTMLButtonElement, animation: boolean): void {
    button.addEventListener('click', () => {
        closeDialog(dialog, animation);
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

        if (!clickedInDialog) closeDialog(dialog, animation);
    });
}

function closeDialog(dialog: HTMLDialogElement, animation: boolean): void {
    if (!animation) {
        dialog.close();
        return;
    }
    console.log('cca')
    dialog.classList.add('fadeOut');
    Promise.allSettled(dialog.getAnimations().map(anim => anim.finished)).then(() => {
        dialog.classList.remove('fadeOut');
        dialog.close();
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

export function createDialectsInputs(dialects: string[]): HTMLInputElement[] {
    const list: HTMLInputElement[] = [];
    const containerDiv = document.getElementById('dialects-list') as HTMLDivElement;

    for (const tag of dialects) {
        list.push(createDialectInput(tag, containerDiv));
    }
    return list;
}

function createDialectInput(tag: string, container: HTMLDivElement): HTMLInputElement {
    const id = tag.replaceAll(' ','_');
    const label: HTMLLabelElement = document.createElement('label');
    label.htmlFor = id;
    label.textContent = tag;
    const input: HTMLInputElement = document.createElement('input');
    input.type = 'checkbox';
    input.id = id;
    label.appendChild(input);
    
    container.append(label);
    return input;
}