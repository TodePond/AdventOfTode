const input = `42: 9 14 | 10 1
9: 14 27 | 1 26
10: 23 14 | 28 1
1: "a"
11: 42 31
5: 1 14 | 15 1
19: 14 1 | 14 14
12: 24 14 | 19 1
16: 15 1 | 14 14
31: 14 17 | 1 13
6: 14 14 | 1 14
2: 1 24 | 14 4
0: 8 11
13: 14 3 | 1 12
15: 1 | 14
17: 14 2 | 1 7
23: 25 1 | 22 14
28: 16 1
4: 1 1
20: 14 14 | 1 15
3: 5 14 | 16 1
27: 1 6 | 14 18
14: "b"
21: 14 1 | 1 14
25: 1 1 | 1 14
22: 14 14
8: 42
26: 14 22 | 1 20
18: 15 15
7: 14 5 | 1 21
24: 14 1

abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
bbabbbbaabaabba
babbbbaabbbbbabbbbbbaabaaabaaa
aaabbbbbbaaaabaababaabababbabaaabbababababaaa
bbbbbbbaaaabbbbaaabbabaaa
bbbababbbbaaaaaaaabbababaaababaabab
ababaaaaaabaaab
ababaaaaabbbaba
baabbaaaabbaaaababbaababb
abbbbabbbbaaaababbbbbbaaaababb
aaaaabbaabaaaaababaa
aaaabbaaaabbaaa
aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
babaaabbbaaabaababbaabababaaab
aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba`

const rules = input.split("\n\n")[0].split("\n")
const messages = input.split("\n\n")[1].split("\n")

MotherTode`
Language :: Expression >> (e) => e.output
Expression :: Rule
Rule (
	:: ID ": " Pattern
	>> ([id, _, pattern]) => \`\${id.output} :: \${pattern.output}\`
)
ID :: /[0-9]/+ >> (n) => "Rule" + n.output
Pattern :: Or | Terms | Character | ID
Character :: '"' Letter '"'
Letter :: "a" | "b"
Terms :: Pattern except Terms " " Pattern
Or (
	:: Pattern except Or " | " Pattern
	>> ([left, _, right]) => \`(\${left.output}) | (\${right.output})\`
)
`

const source = rules.map(rule => TERM.Language(rule).output).reduce((a, b) => a+"\n"+b)
//throw new Error("stop!")

const lines = source.split("\n").filter(l => l.length > 0)

lines.push("Message :: Rule0")

const zeroLines = ["Rule0 :: 'hi'"]

const MAX_DEPTH_8 = 6
const MAX_DEPTH_11 = 6
let t = 1
for (let i = 1; i <= MAX_DEPTH_8; i++) {
	for (let j = 1; j <= MAX_DEPTH_11; j++) {
		zeroLines[t] = `Rule0_${t} :: Rule8_${i} Rule11_${j}`
		zeroLines[0] += ` | (Rule0_${t} EOF)`
		t++
	}
}

for (let i = 1; i <= MAX_DEPTH_8; i++) {
	zeroLines.push(`Rule8_${i} :: ${["Rule" + 42].repeated(i).join(" ")}`)
}

for (let j = 1; j <= MAX_DEPTH_11; j++) {
	zeroLines.push(`Rule11_${j} :: ${["Rule" + 42].repeated(j).join(" ")} ${["Rule" + 31].repeated(j).join(" ")}`)
}

lines.push(...zeroLines)

lines.map(l => MotherTode([l.d]))


let tally = 0
for (const message of messages) {
	const result = TERM.Message(message).success
	print(result, message)
	if (result) tally++
}

print("Valid messages: ", tally)
