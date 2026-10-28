# phonetic-quiz

Commandes:

`grep "\"ipa\"" raw-wiktextract-data.jsonl > dico.jsonl`

`grep "\"lang\": \"English\"" dico.jsonl > oui.jsonl`

`grep "\"lang_code\": \"en\"}" oui.jsonl > en.jsonl`

`jq '.' en.jsonl > en.json`

`jq "[.[]? | {word: .word, meaning: .senses[]?.glosses, ipa: .sounds[]?.ipa}] | group_by(.word) | map({word: .[0].word, meanings: map(.meaning) | flatten | unique, ipa: map(.ipa) | unique | del(.[] | select(. == null or test(\".*-.*\")))})" en.json > dictionary.json`