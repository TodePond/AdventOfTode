const input = `)())())`

let floor = 0
for (const c of input) {
	if (c === "(") floor++
	if (c === ")") floor--
}

print("Floor Number:", floor)
