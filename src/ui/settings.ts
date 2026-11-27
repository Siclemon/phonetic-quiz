export function setupOpening(dialog: HTMLDialogElement, button: HTMLButtonElement): () => void {
    const openDialog = () => dialog.showModal();
    button.addEventListener('click', openDialog);
    return () => button.removeEventListener('click', openDialog);
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
    dialog.classList.add('fadeOut');
    Promise.allSettled(dialog.getAnimations().map(anim => anim.finished)).then(() => {
        dialog.classList.remove('fadeOut');
        dialog.close();
    });
}

export function showFrequencies(freqs: number[]): void {
    const bars = document.querySelectorAll('#difficulty__chart div') as NodeList;
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
    const id = tag.replaceAll(' ', '_');
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

export function moveContent(isMobile: boolean): void {
    if (isMobile) moveContentMobile();
    else moveContentDesktop();
}

function moveContentMobile(): void {
    const keys = ['difficulty', 'preferences'];
    for (const key of keys) {
        document.querySelector(`#dialog-${key} .header`)?.after(document.querySelector(`section.${key}`) as HTMLDivElement);
    }
}

function moveContentDesktop(): void {
    const destination = document.querySelector('#desktop-settings .dialog__container') as HTMLDivElement;
    const contentSections = document.querySelectorAll('section.dialog__content') as NodeListOf<HTMLDivElement>;
    for (const sect of contentSections) {
        destination.appendChild(sect);
    }
    if (![...contentSections].some(sect => [...sect.classList].includes('active'))) {
        document.querySelector('.difficulty')?.classList.add('active');
        document.getElementById('btn-difficulty-desktop')?.classList.add('active');
    }
}

export function setupDesktopTab(dial: HTMLDialogElement): void {
    const buttons = dial.querySelectorAll('.settings__btn') as NodeListOf<HTMLButtonElement>;
    const contents = document.querySelectorAll('section.dialog__content') as NodeListOf<HTMLDivElement>;
    buttons.forEach(btn => btn.addEventListener('click', () => {
        for (const sect of contents) {
            sect.classList.toggle('active', [...sect.classList].includes(btn.id.split('-')[1]));
        }
        for (const button of buttons) button.classList.toggle('active', button === btn);
    }));
}

export function setupMobileSubdialogs(): void {
    const mobileDialogs = document.querySelectorAll('.dialog--sub') as NodeListOf<HTMLDialogElement>;
    for (const dial of mobileDialogs) {
        const id = dial.id.split('-')[1];
        const btn = document.getElementById(`btn-${id}-mobile`) as HTMLButtonElement;
        setupOpening(dial, btn);
        const back = dial.querySelector('.settings__back') as HTMLButtonElement;
        setupClosing(dial, back, true);
    }
}