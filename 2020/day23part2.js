
// state: current cup
// state: list
// remove three next cups (cw)
// choose destination cup (current - 1, ignoring picked up cups)
// place picked up cups after destination cup
// next cup becomes current cup

const input = "389125467".split("").map(n => n.as(Number))

for (let i = 10; i <= 1_000_000; i++) {
	input.push(i)
}

const makeNode = (value, next, prev) => {
	return {value, next, prev}
}


const bigMap = []

const makeLoopedLinkedList = (list) => {
	const nodes = []
	
	for (let i = 0; i < list.length; i++) {
		const v = list[i]
		const node = makeNode(v)
		nodes.push(node)
		bigMap[v] = node
	}
	
	for (let i = 0; i < list.length; i++) {
		const next = nodes[loop(i+1, list.length)]
		const prev = nodes[loop(i-1, list.length)]
		nodes[i].next = next
		nodes[i].prev = prev
	}
	
	return nodes
}

const makeGame = (initial) => {

	const cups = makeLoopedLinkedList(initial)
	return cups[0]
}

const initGame = (game) => {
	const pre = HTML`<pre id="game"></pre>`
	document.body.appendChild(pre)
}

const at = (self, offset) => {
	if (offset > 0) {
		let node = self
		for (let i = 0; i < offset; i++) {
			node = node.next
		}
		return node
	}
}

const find = (start, value) => {
	let node = start.next
	while (node !== start) {
		if (node.value === value) return node
		node = node.next
	}
	return false
}

const findDestination = (value) => {
	if (value <= 0) return findDestination(input.length)
	const node = bigMap[value]
	if (node.picked) return findDestination(value - 1)
	return node
}

const loop = (id, length) => {
	if (id >= length) return loop(id - length, length)
	if (id < 0) return loop(id + length, length)
	return id
}

const getList = (start = one) => {
	let node = start.next
	let text = "" //start.value.as(String)
	while (node !== start) {
		text += node.value
		node = node.next
	}
	return text
}

const processGame = (current) => {
	
	const pickedStart = current.next
	const pickedMiddle = pickedStart.next
	const pickedEnd = pickedMiddle.next
	const afterPicked = pickedEnd.next
	
	pickedStart.picked = true
	pickedMiddle.picked = true
	pickedEnd.picked = true
	
	// Reattach current
	current.next = afterPicked
	
	const destination = findDestination(current.value - 1)
	const afterDestination = destination.next
	destination.next = pickedStart
	pickedEnd.next = afterDestination
	
	pickedStart.picked = false
	pickedMiddle.picked = false
	pickedEnd.picked = false
	
	return current.next
	
}

let t = 0
const JOB_COUNT = 10000
const TARGET = 10
const tick = () => {
	for (let j = 0; j < JOB_COUNT; j++) {
		if (t > 0) {
			current = processGame(current)
			if (t % 100_000 === 0) print("Turn", t/*, ":", getList()*/)
			if (t === 10 || t === 100 || t === 1_000_000 || t === 10_000_000) {
				print(`Answer at ${t}:`, one.next.value * one.next.next.value)
				//print(`List at ${t}:`, getList())
				if (t === 10_000_000) return
			}
		}
		t++
	}
	setTimeout(tick, 0)
}

const game = makeGame(input)

const one = find(game, 1)

let current = game
initGame(game)

tick()
