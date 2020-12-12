const input = `35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`

const PREAMBLE_SIZE = 5

const numbers = input.split("\n").map(n => parseInt(n))

const isEntryValid = (id) => {
	const n = numbers[id]
	if (id < PREAMBLE_SIZE) return [true, n]
	const minId = id - PREAMBLE_SIZE
	for (let i = minId; i < id; i++) {
		const a = numbers[i]
		for (let j = i + 1; j < id; j++) {
			const b = numbers[j]
			if (a === b) continue
			if (a + b === n) return [true, n]
		}
	}
	return [false, n]
}

numbers.map((n, id) => isEntryValid(id)).filter(r => !r[0]).forEach(r => r.d)
