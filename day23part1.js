
// state: current cup
// state: list
// remove three next cups (cw)
// choose destination cup (current - 1, ignoring picked up cups)
// place picked up cups after destination cup
// next cup becomes current cup

const input = "389125467".split("").map(n => n.as(Number))

const makeGame = (initial) => {
	return {cups: initial, current: 0}
}

const initGame = (game) => {
	const pre = HTML`<pre id="game"></pre>`
	document.body.appendChild(pre)
}

const drawGame = (game) => {
	const pre = $("#game")
	if (pre === null) throw new Error("Game not set up for drawing yet...")
	let text = ""
	for (const c in game.cups) {
		const cup = game.cups[c]
		if (c == game.current) text += `(${cup})`
		else text += " " + cup + " "
	}
	pre.innerHTML = text
}

const loop = (id, length) => {
	if (id >= length) return loop(id - length, length)
	if (id < 0) return loop(id + length, length)
	return id
}

const processGame = (game) => {
	
	const currentLabel = game.cups[game.current]
	const pickedIds = [
		loop(game.current + 1, game.cups.length),
		loop(game.current + 2, game.cups.length),
		loop(game.current + 3, game.cups.length),
	]
	
	const picked = pickedIds.map(id => game.cups[id])
	const unpicked = game.cups.filter((c) => !picked.includes(c))
	
	let desiredLabel = currentLabel
	let destination = -1
	while(destination === -1) {
		desiredLabel = loop(desiredLabel - 1, game.cups.length + 1)
		destination = unpicked.indexOf(desiredLabel)
	}
	
	const newCups = [...unpicked.slice(0, destination+1), ...picked, ...unpicked.slice(destination+1)]
	//print("Destination:", desiredLabel)
	game.cups = newCups
	
	const currentCurrent = game.cups.indexOf(currentLabel)
	game.current = currentCurrent
	game.current = loop(currentCurrent + 1, game.cups.length)
	
	
}

const getAnswer = (cups) => {
	const start = cups.indexOf(1)
	const answer = [...cups.slice(start+1), ...cups.slice(0, start)].join("")
	return answer
}

let t = 0
const tick = () => {
	if (t > 0) {
		processGame(game)
		print("After", t, "turns:", getAnswer(game.cups))
	}
	drawGame(game)
	t++
	setTimeout(tick, 100)
}

const game = makeGame(input)
initGame(game)

tick()
