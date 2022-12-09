const input = `30373
25512
65332
33549
35390`

const lines = input.split("\n")

const forestHeight = lines.length
const forestWidth = lines[0].length

const forest = new Map()
const border = new Map()

for (let y = 0; y < forestHeight; y++) {
	const line = lines[y]
	for (let x = 0; x < forestWidth; x++) {
		const height = line[x]
		forest.set(_(x, y), height)
		if (x === 0 || x === forestWidth - 1 || y === 0 || y === forestHeight - 1) {
			border.set(_(x, y), height)
		}
	}
}

print("forest", forest)

const look = (start, direction) => {
	const startHeight = forest.get(_(...start))

	const [dx, dy] = direction

	const height = startHeight
	let [x, y] = start
	let seenTrees = []

	while (true) {
		const next = [x + dx, y + dy]
		const nextHeight = forest.get(_(...next))

		if (nextHeight === undefined) {
			break
		}

		;[x, y] = next

		seenTrees.push(next)

		if (nextHeight >= height) {
			break
		}
	}

	return seenTrees
}

const directions = [
	[1, 0],
	[0, 1],
	[-1, 0],
	[0, -1],
]

const getScenicScore = (key) => {
	const [x, y] = JSON.parse(key)

	const scores = []

	for (const direction of directions) {
		const trees = look([x, y], direction)
		const score = trees.length
		scores.push(score)
	}

	return scores.reduce((a, b) => a * b, 1)
}

const scores = []
for (const tree of forest.keys()) {
	const score = getScenicScore(tree)
	scores.push(score)
}

Math.max(...scores).d
