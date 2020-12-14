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
MemoryAssignment :: "mem[" Address "] = " Value >> ([m, a, e, v]) => \`setMem(\${a.output}, \${v.output})\`
Number :: /[0-9]/+
Address :: Number
Value :: Number
`

let mask = []
let mem = []

const applyMask = (value) => {
	const v = value.toString(2).split("").map(n => n.as(Number))
	while (v.length < 36) v.unshift(0)
	for (let i = 0; i < mask.length; i++) {
		const m = mask[i]
		if (m === -1) v[i] = -1
		if (m ===  0) v[i] = v[i]
		if (m ===  1) v[i] = 1
	}
	const alts = getAlts(v)
	return alts.map(alt => parseInt(alt.join(""), 2))
}

const getAlts = (v) => {
	for (let i = 0; i < v.length; i++) {
		const b = v[i]
		if (b === -1) {
			const left = [...v.slice(0, i), 1, ...v.slice(i+1)]
			const right = [...v.slice(0, i), 0, ...v.slice(i+1)]
			return [...getAlts(left), ...getAlts(right)]
		}
	}
	return [v]
}

let sum = 0
const setMem = (address, value) => {
	const addresses = applyMask(address)
	addresses.forEach(a => {
		if (mem[a] !== undefined) {
			sum -= mem[a]
		}
		mem[a] = value
		sum += value
	})
}

lines.map(line => TERM.Language(line).output.d).map(code => new Function(code)())
//mem.reduce((a, b) => a + b).d

print(sum)
