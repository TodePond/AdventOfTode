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

let instructions = []
const resetInstructions = () => {
	instructions = lines.map(line => TERM.Language(line).output)
}
resetInstructions()

const readInstruction = (position = 0, accumulator = 0) => {
	const instruction = instructions[position]
	if (instruction === undefined) return ["TERMINATING", accumulator]
	if (instruction.done) return ["NON-TERMINATING", accumulator]
	instruction.done = true
	if (instruction.type === "nop") return readInstruction(position + 1, accumulator)
	if (instruction.type === "jmp") return readInstruction(position + instruction.number, accumulator)
	if (instruction.type === "acc") return readInstruction(position + 1, accumulator + instruction.number)
	return ["ERROR", accumulator]
}

const flippableIds = []
for (const key in instructions) {
	const i = parseInt(key)
	const instruction = instructions[i]
	if (instruction.type === "nop" || instruction.type === "jmp") {
		flippableIds.push(i)
	}
}

for (const id of flippableIds) {
	resetInstructions()
	const instruction = instructions[id]
	if (instruction.type === "nop") instruction.type = "jmp"
	else instruction.type = "nop"
	
	const result = readInstruction()
	if (result[0] === "TERMINATING") {
		print(result[1])
		break
	}
}

