const input = `1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`

const lines = input.split("\n")
const countLetter = (letter, string) => {
	let count = 0
	for (const char of string) {
		if (char === letter) count++
	}
	return count
}

MotherTode`
Language :: Entry
Entry (
	:: Count " " Letter ": " Password
	>> ([count, _, letter, c, password]) => (password.output[count.output.min - 1] === letter.output && password.output[count.output.max - 1] !== letter.output) || (password.output[count.output.max - 1] === letter.output && password.output[count.output.min - 1] !== letter.output)
)
Count (
	:: Number "-" Number
	>> ([min, _, max]) => ({min: min.output, max: max.output})
)
Number :: /[0-9]/+ >> (n) => parseInt(n.output)
Letter :: /[a-z]/
Password :: Letter+
`

lines.map(line => TERM.Language(line).output).d.filter(a => a).length.d


