async function main() {
    const data = await fetch('./dicotags.json').then(res => res.json());
    const size = data.length;

    // const word = data[randomInt(0, size)];

    // console.log(word.ipa);

    const getRandomWord = async () => await fetch('https://random-word-api.herokuapp.com/word?diff=' + Math.floor(Math.random() * 3 + 1)).then(res => res.json()).then(async data => {
        return data[0];
    });

    const searchWord = (searchedWord) => {
        for (const w of data) {
            if (w.word == searchedWord) return w;
        }
    };

    const getWord = async () => {
        let wordObject;
        while (!wordObject) {
            const wordString = await getRandomWord();
            wordObject = searchWord(wordString);
            // if (!wordObject) console.log(wordString)
        }
        return wordObject;
    };

    const getHomophones = (ipa) => {
        const list = [];
        for (const w of data) {
            if (w.pronunciations[0] && w.pronunciations[0].ipa == ipa) list.push(w.word);
        }
        return list;
    };

    const word = await Promise.any([getWord(), getWord(), getWord(), getWord(), getWord()]);

    console.log(word);

    console.time()
    console.log(getHomophones(word.pronunciations[0].ipa))
    console.timeEnd();

    const tags = {};
    for (const w of data)
        if (w.pronunciations[0])
            for (const pro of w.pronunciations)
                if (pro.tags)
                    for (const tag of pro.tags) {
                        if (!tags[tag]) tags[tag] = 0;
                        tags[tag]++;
                    }

    console.log(tags)
}

// UK, US, "General-American", "Received-Pronunciation", Canada, Australia, British


function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

main();