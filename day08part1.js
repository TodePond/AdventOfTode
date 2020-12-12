const input = `nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`

const lines = input.split("\n")

MotherTode`
Language :: Instruction
Instruction :: Type " " Number >> ([t, _, n]) => ({type: t.output, number: n.output, done: false})
Type :: "nop" | "acc" | "jmp"
Number :: Sign Digit+ >> (n) => parseInt(n.output)
Digit :: /[0-9]/
Sign :: "+" | "-"
`

const instructions = lines.map(line => TERM.Language(line).output)

let accumulator = 0

const readInstruction = (position) => {
	const instruction = instructions[position]
	if (instruction.done) return accumulator
	instruction.done = true
	if (instruction.type === "nop") return readInstruction(position + 1)
	if (instruction.type === "jmp") return readInstruction(position + instruction.number)
	if (instruction.type === "acc") {
		accumulator += instruction.number
		return readInstruction(position + 1)
	}
	return false
}

readInstruction(0).d
