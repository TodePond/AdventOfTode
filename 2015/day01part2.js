const input = `()())`

let floor = 0
for (const c in input) {
	const char = input[c]
	if (char === "(") floor++
	if (char === ")") floor--
	if (floor === -1) print("Basement at character number", c.as(Number)+1)
}
