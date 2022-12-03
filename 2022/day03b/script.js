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

const rucksacks = input.split("\n").map((v) => v.split(""))

// Rucksacks are grouped together in threes
const groups = rucksacks.reduce((acc, v, i) => {
	const groupIndex = Math.floor(i / 3)
	if (!acc[groupIndex]) acc[groupIndex] = []
	acc[groupIndex].push(v)
	return acc
}, [])

// Find any items that appear in all three containers
const duplicates = groups.map(([left, middle, right]) => {
	const leftSet = new Set(left)
	const middleSet = new Set(middle)
	const rightSet = new Set(right)
	const intersection = new Set([...leftSet].filter((x) => middleSet.has(x) && rightSet.has(x)))
	return [...intersection]
})

const priorities = duplicates.map((item) => PRIORITIES[item])
const sum = priorities.reduce((a, b) => a + b, 0)

print(duplicates, priorities, sum)
