async function main() {
    const data = await fetch('./dictionary.json').then(res => res.json());
    const size = data.length;

    // const word = data[randomInt(0, size)];

    // console.log(word.ipa);

    const getRandomWord = async () => await fetch('https://random-word-api.herokuapp.com/word?diff=' + Math.floor(Math.random() * 4 + 1)).then(res => res.json()).then(async data => {
        return data[0];
    });

    const searchWord = async () => {
        const searchedWord = await getRandomWord();
        for (const w of data) {
            if (w.word == searchedWord) return w;
        }
    }

    let word;
    while (!word) {
        word = await searchWord();
        console.log('bjr')
    }


    console.log(word);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

main();