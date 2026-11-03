# phonetic-quiz

Commandes:

`grep "\"ipa\"" raw-wiktextract-data.jsonl > dico.jsonl`

`grep "\"lang\": \"English\"" dico.jsonl > oui.jsonl`


`jq '.' en.jsonl > en.json`

`jq "[.[]? | {word: .word, meaning: .senses[]?.glosses, ipa: .sounds[]?.ipa}] | group_by(.word) | map({word: .[0].word, meanings: map(.meaning) | flatten | unique, ipa: map(.ipa) | unique | del(.[] | select(. == null or test(\".*-.*\")))})" en.json > dictionary.json`




# NON
(retire plein de mots)
`grep "\"lang_code\": \"en\"}" oui.jsonl > en.jsonl`





# oui

jq "[.[]? | {word: .word, meaning: .senses[]?.glosses, ipa: .sounds[]?.ipa}] | group_by(.word) | map({word: .[0].word, meanings: map(.meaning) | flatten | unique, ipa: map(.ipa) | unique | del(.[] | select(. == null or test(\".*-.*\")))})" yes.json > dictionary2.json

jq -s '.' oui.jsonl > yes.json


avec tags de prononciations
[.[]? | {word: .word, meaning: .senses[]?.glosses, pronunciations: .sounds[]?}] | group_by(.word) | map({word: .[0].word, meanings: map(.meaning) | flatten | unique, pronunciations: map(.pronunciations) | del(.[] | select(.ipa == null))})

[.[]? | {word: .word, meaning: .senses[]?.glosses, pronunciations: .sounds[]?}] | group_by(.word) | map({word: .[0].word, meanings: map(.meaning) | flatten | unique, pronunciations: map(.pronunciations) | del(.[] | select(.ipa == null)) | unique})

jq "[.[]? | {word: .word, meaning: .senses[]?.glosses, pronunciations: .sounds[]?}] | group_by(.word) | map({word: .[0].word, meanings: map(.meaning) | flatten | unique, pronunciations: map(.pronunciations) | del(.[] | select(.ipa == null or (.ipa | test(\".*-.*\")))) | unique})" yes.json > dicotags.json

2823314
2778811

def unique_unsorted:
reduce .[] as $x ([]; if any(.[]; . == $x) then . else . + [$x] end);
[.[]? | {word: .word, meaning: .senses[]?.glosses, pronunciations: .sounds[]?}] | group_by(.word) | map({word: .[0].word, meanings: map(.meaning) | flatten | unique_unsorted, pronunciations: map(.pronunciations) | del(.[] | select(.ipa == null or (.ipa | test(".*-.*")))) | unique_unsorted})

def unique_unsorted:
reduce .[] as $x ([]; if any(.[]; . == $x) then . else . + [$x] end);
[.[]? 
| {word: .word, meaning: .senses[]?.glosses, pronunciations: .sounds[]?}] 
| group_by(.word) 
| map({
    word: .[0].word, 
    meanings: map(.meaning) | flatten | unique_unsorted, 
    pronunciations: map(.pronunciations) | del(.[] | select(.ipa == null or (.ipa | test(".*-.*")))) | unique_unsorted})


---
regroupe les prononciations par ipa
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