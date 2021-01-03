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

const plugAdapters = () => [0, ...adapters, PHONE_JOLTAGE]
const as = plugAdapters()

// Get all diffs
const offsets = []
for (let i = 0; i < as.length; i++) {
	const curr = as[i]
	const next1 = as[i+1]
	const next2 = as[i+2]
	const next3 = as[i+3]
	const diffs = [next1 - curr, next2 - curr, next3 - curr]
	offsets.push(diffs)
}

// Get scores
const scores = []
for (let i = 0; i < as.length; i++) {
	const diffs = offsets[i]
	let score = 0
	for (const diff of diffs) {
		if (diff >= 1 && diff <= 3) score++
		else break
	}
	scores.push(score)
}

// Get routes
const routes = []
for (let i = as.length-1; i >= 0; i--) {
	let route = 0
	const score = scores[i]
	if (score === 0) route = 1
	for (let j = 1; j <= score; j++) {
		route += routes[i+j]
	}
	routes[i] = route
}

print(routes[0])