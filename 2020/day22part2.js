const input = `Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10`

const inputs = input.split("\n\n")

const games = []

const makeGame = (decks) => {
	const game = {decks, history: [], cards: [], CARD_COUNT: (decks[0].length + decks[1].length)}
	//recordHistory(game.history, decks)
	return game
}

const recordHistory = (history, decks) => {
	const hString = decks.map(v => v.join(".")).join(",")
	history.pushUnique(hString)
}

const decks = inputs.map(i => i.split("\n").slice(1).map(n => n.as(Number)))
games.push(makeGame(decks))

print("My Starting Deck:", decks[0])
print("Crab's Starting Deck:", decks[1])

const style = HTML`<style>
	pre {
		margin: 0px;
	}
</style>`
document.head.appendChild(style)

const initGameDisplay = (g) => {
	const game = games[g]
	const {decks} = game
	for (const i in decks) {
		const pre = HTML`<pre id="game${g}deck${i}"></pre>`
		document.body.appendChild(pre)
	}
	document.body.appendChild(HTML`<br>`)
}

const draw = () => {
	for (const g in games) {
		const game = games[g]
		const {decks} = game
		for (const i in decks) {
			const id = `game${g}deck${i}`
			let pre = $(`#${id}`)
			if (pre === null) {
				initGameDisplay(g)
				pre = $(`#${id}`)
			}
			const name = i == "0"? "Me" : "Crab"
			pre.innerHTML = `${name}: ${decks[i].join(", ")}`
		}
	}
	
	const maxGame = games.length
	let g = maxGame
	while (true) {
		const id = `game${g}deck${0}`
		let pre = $(`#${id}`)
		if (pre === null) break
		pre.innerHTML = ""
		const id1 = `game${g}deck${1}`
		let pre1 = $(`#${id1}`)
		pre1.innerHTML = ""
		g++
	}
	
}

const isInHistory = (history, decks) => {
	const dString = decks.map(v => v.join(".")).join(",")
	for (const hString of history) {
		if (dString === hString) return true
	}
	return false
}

let v = 0
const verifyDecks = (decks) => {
	const track = {}
	for (const p in decks) {
		const deck = decks[p]
		for (const c in deck) {
			const card = deck[c]
			if (card === "R") continue
			if (track[card] !== undefined) {
				print(v, card, decks)
				throw new Error(`Duplicate card found!`)
				return false
			}
			track[card] = true
		}
	}
	v++
	
	return true
}

const process = () => {
	
	const game = games.last
	const {history, decks, cards} = game
	if (cards.length > 0) {
		const winner = game.subWinner
		if (winner === undefined) throw new Error("No record of sub-game winner...")
		const loser = winner === "0"? 1 : 0
		const winnerName = winner === "0"? "Me" : "Crab"
		verifyDecks(decks)
		if (winner === loser) throw new Error("Winner can't be loser")
		if (cards[winner] === cards[loser]) {
			print(cards)
			print(winner, loser)
			throw new Error("Winning card can't be losing card")
		}
		decks[winner].push(...[cards[winner], cards[loser]])
		verifyDecks(decks)
		cards.length = 0
		return
	}
	
	// Historic Victory
	if (isInHistory(history, decks)) {
		const winner = 0
		const loser = 1
		decks[winner] = ["R"].repeated(game.CARD_COUNT)
		//decks[winner].push(...[cards[winner], cards[loser]])
		//decks[winner].push(...decks[loser])
		decks[loser].length = 0
		cards.length = 0
		//print("INFINITE RECURSION! Crab Loses")
		return
	}
	recordHistory(history, decks)
	
	for (const deck of decks) {
		const card = deck.shift()
		cards.push(card)
	}
	
	// Traditional Victory
	if (cards[0] > decks[0].length || cards[1] > decks[1].length) {
		const winning = Math.max(...cards)
		const winner = cards.indexOf(winning)
		const loser = winner === 0? 1 : 0
		const winnerName = winner === 0? "Me" : "Crab"
		//print(`${winnerName} Win: HIGH CARD`)
		decks[winner].push(...[cards[winner], cards[loser]])
		cards.length = 0
		return
	}
	
	// Sub-game
	const subDecks = decks.map((d,i) => d.slice(0, cards[i]))
	//;(subDecks[0].length + subDecks[1].length).d
	const subGame = makeGame(subDecks)
	games.push(subGame)
	//print("Sub-Game", games.length-1, "Started")
	return
	
}

const getScore = (deck) => {
	let score = 0
	for (let i = deck.length-1; i >= 0; i--) {
		const m = deck.length - i
		const c = deck[i]
		score += m * c
	}
	return score
}

let t = 0
const JOB_COUNT = 1
const tick = () => {

	for (let j = 0; j < JOB_COUNT; j++) {
		const game = games.last
		const {decks} = game

		for (const p in decks) {
			const deck = decks[p]
			if (deck.length === game.CARD_COUNT) {
				const winner = p
				draw()
				games.pop()
				if (games.length === 0) {
					print("Game over!")
					const score = getScore(deck)
					print("Winning Score:", score)
					return
				}
				else {
					games.last.subWinner = p
					const winnerName = p === "0"? "Me" : "Crab"
					//print("Sub-Game", games.length, "Finished! Winner:", winnerName)
				}
			}
		}
		if (t > 0) process()
		//print("Turn", t)
		t++
	}
	
	draw()
	setTimeout(tick, 100)
}

draw()
tick()
//on.keydown(tick)


