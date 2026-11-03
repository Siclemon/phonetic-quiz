interface Pronunciation {
    ipa: string;
    tags?: string[];
    note?: string[];
}

interface Word {
    word: string;
    pronunciations: Pronunciation[];
    meanings: string[];
}

interface GameObject {
    pronunciation: Pronunciation;
    words: Word[];
}

export type {
    Pronunciation,
    Word,
    GameObject,
}