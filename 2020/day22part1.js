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


const decks = inputs.map(i => i.split("\n").slice(1).map(n => n.as(Number)))
const CARD_COUNT = decks.reduce((a,b) => a.length+b.length)

print("My Starting Deck:", decks[0])
print("Crab's Starting Deck:", decks[1])

for (const i in decks) {
	const pre = HTML`<pre id="deck${i}"></pre>`
	document.body.appendChild(pre)
}

const draw = () => {
	for (const i in decks) {
		const id = `deck${i}`
		const pre = $(`#${id}`)
		const name = i == "0"? "Me" : "Crab"
		pre.innerHTML = `${name}: ${decks[i].join(", ")}`
	}
}

const process = () => {

	const cards = []
	for (const deck of decks) {
		const card = deck.shift()
		cards.push(card)
	}
	
	const winning = Math.max(...cards)
	const winner = cards.indexOf(winning)
	
	decks[winner].push(...cards.sort((a,b) => b-a))
	
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
const tick = () => {
	for (const deck of decks) {
		if (deck.length === CARD_COUNT) {
			print("Game over!")
			const score = getScore(deck)
			print("Winning Score:", score)
			return
		}
	}
	if (t > 0) process()
	draw()
	t++
	print("Turn", t)
	setTimeout(tick, 200)
}

tick()