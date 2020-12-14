const input = `mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0`

const lines = input.split("\n")

MotherTode`
Language :: Expression
Expression :: MaskAssignment | MemoryAssignment
MaskAssignment :: "mask = " MaskLiteral
MaskLiteral (
	:: MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit MaskBit 
	>> (mask) => "[" + mask.map(b => b.output) + "]"
)
MaskBit :: "0" | "1" | "X" >> (n) => n.output === "X"? -1 : n.output.as(Number)
MemoryAssignment :: "mem[" Number "] = " Value
Number :: /[0-9]/+
Value :: Number >> (n) => "applyMask(" + n.output + ")"
`

let mask = []
let mem = []

const applyMask = (value) => {
	const v = value.toString(2).split("").map(n => n.as(Number))
	while (v.length < 36) v.unshift(0)
	for (let i = 0; i < mask.length; i++) {
		const m = mask[i]
		if (m === -1) continue
		v[i] = m
	}
	return parseInt(v.join(""), 2)
}

const setMem = (address, value) => {
	mem[address] = applyMask(value)
}

lines.map(line => TERM.Language(line).output.d).map(code => new Function(code)())
mem.reduce((a, b) => a + b).d
