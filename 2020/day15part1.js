const input = `0,3,6`
const ns = input.split(",").map(n => n.as(Number))

const getAge = (numbers, number) => {
	for (let i = numbers.length-1; i >= 0; i--) {
		const n = numbers[i]
		if (n === number) return numbers.length - i
	}
	return 0
}

for (let t = 0; t < 2020 - 1; t++) {
	if (t < ns.length-1) continue
	const curr = ns[t]
	const age = getAge(ns.slice(0, -1), curr)
	ns.push(age)
}

print(ns.last)