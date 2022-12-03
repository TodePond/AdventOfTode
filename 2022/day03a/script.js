const input = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`

const ITEMS = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
const PRIORITIES = {}
for (let i = 0; i < ITEMS.length; i++) {
	const item = ITEMS[i]
	PRIORITIES[item] = i
}

// Rucksacks are made up of two equal length containers
const rucksacks = input.split("\n").map((line) => {
	const container = line.split("")
	const left = container.slice(0, container.length / 2)
	const right = container.slice(container.length / 2)
	return [left, right]
})

// Find any items that appear in both containers
const duplicates = rucksacks
	.map(([left, right]) => {
		const leftSet = new Set(left)
		const rightSet = new Set(right)
		const intersection = new Set([...leftSet].filter((x) => rightSet.has(x)))
		return [...intersection]
	})
	.flat(Infinity)

const priorities = duplicates.map((item) => PRIORITIES[item])
const sum = priorities.reduce((a, b) => a + b, 0)

print(duplicates, priorities, sum)
