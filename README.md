# phonetic-quiz

Quiz de phonétique en anglais.

Une prononciation est affichée, il faut deviné à quel mot elle correspond.

### Features :
- priorisation des prononciations britanniques et nord-américaines
- accepte tous les homophones
- affichage des définitions et de toutes les prononciations des réponses acceptées
- réglage de difficulté, en fonction de la fréquence d'usage des mots

## Commandes de création du dictionnaire :

À partir des données de Wiktionary : https://kaikki.org/dictionary/rawdata.html.

### Garde uniquement les entrées avec un champ 'ipa' :

```shell
grep "\"ipa\"" raw-wiktextract-data.jsonl > dico.jsonl
```

### Garde les mots anglais : 
```shell
grep "\"lang\": \"English\"" dico.jsonl > oui.jsonl
```

### jsonl vers json :
```shell
jq -s '.' oui.jsonl > yes.json
```


### Formattage complet du dictionnaire :
Format :
```json
[{
    "word": "mot",
    "meanings": [
        "def 1",
        "def 2"
    ],
    "pronunciations" : [
        {
            "ipa": "/ipa/",
            "tags": "Received Pronunciation",
            "note": "rare"
        }
    ]}
]
```
Commande (dans un ficheir dicobuilder.jq) :
```
def unique_unsorted:
reduce .[] as $x ([]; if any(.[]; . == $x) then . else . + [$x] end);

[.[]? 
| {word: .word, meaning: .senses[]?.glosses, pronunciations: .sounds[]?}] 
| group_by(.word) 
| map({
    word: .[0].word, 
    meanings: map(.meaning) | flatten | unique_unsorted, 
    pronunciations: map(.pronunciations) | del(.[] | select(.ipa == null or (.ipa | test(".*-.*")))) | unique_unsorted
        | group_by(.ipa) 
        | map({
            ipa: .[0].ipa, 
            tags: map(.tags // []) | flatten,
            note: map(.note // []) | flatten})
    })
```
Utiliser la commande :
```shell
jq -f dicobuilder.jq yes.json > dictionary.json
```