const input = `...`

MotherTode`
Language (
	:: Expression
	>> ([exp]) => exp.output.length
)
Expression :: People | Person
People (
	:: Person "\n" Expression
	>> ([left, _, right]) => left.output.filter(l => right.output.includes(l))
)
Person (
	:: Answer+
	>> ([answers]) => answers.child.reduce((a, b) => [...a, ...b.output], [])
)
Answer :: /[a-z]/
`

const groups = input.split("\n\n")
groups.map(group => TERM.Language(group).output).reduce((a, b) => a + b).d
