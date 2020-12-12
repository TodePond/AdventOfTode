const input = `28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`

const adapters = input.split("\n").map(a => a.as(Number)).sort((a, b) => a - b)

const DIFF_MIN = 1
const DIFF_MAX = 3
const PHONE_OFFSET = 3
const PHONE_JOLTAGE = Math.max(...adapters) + PHONE_OFFSET

const countOffsets = () => {
	let ones = 0
	let threes = 0

	const pluggedAdapters = [0, ...adapters, PHONE_JOLTAGE]
	
	for (let i = 0; i < pluggedAdapters.length; i++) {
		const curr = pluggedAdapters[i]
		const prev = pluggedAdapters[i-1]
		const diff = curr - prev
		if (diff === 1) ones++
		if (diff === 3) threes++
	}
	return [ones, threes]
}

const [o, t] = countOffsets()
print(o * t)