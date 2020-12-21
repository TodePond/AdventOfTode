const input = `0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb`

const rules = input.split("\n\n")[0].split("\n")
const messages = input.split("\n\n")[1].split("\n")

MotherTode`
Language :: Expression >> (e) => MotherTode([e.output.d])
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
Message :: Rule0 EOF
`

rules.map(rule => TERM.Language(rule).output)
messages.map(message => TERM.Message(message.d).success.d).filter(v => v).length.d