const input = `...`

const numbers = input.split("\n").map(n => parseInt(n))


for (let i = 0; i < numbers.length; i++) {
	const a = numbers[i]
	for (let j = i+1; j < numbers.length; j++) {
		const b = numbers[j]
		for (let k = j+1; k < numbers.length; k++) {
			const c = numbers[k]
			if (a + b + c === 2020) {
				print(a * b * c)
				break
			}
		}
	}
}
