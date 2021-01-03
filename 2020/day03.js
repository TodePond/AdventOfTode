const input = `..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#`

const lines = input.split("\n")
const WIDTH = lines[0].length
const HEIGHT = lines.length

const loopX = (x) => {
	while (x >= WIDTH) {
		x -= WIDTH
	}
	return x
}

const slopes = [
	[1, 1],
	[3, 1],
	[5, 1],
	[7, 1],
	[1, 2],
]

const counts = []

for (const slope of slopes) {
	
	let treeCount = 0
	let x = 0
	
	for (let y = 0; y < 323; y += slope[1]) {
		const line = lines[y]
		const loopedX = loopX(x)
		const char = line[loopedX]
		if (char === "#") treeCount++
		x += slope[0]
	}
	
	counts.push(treeCount)
}

counts.reduce((a, b) => a * b).d




