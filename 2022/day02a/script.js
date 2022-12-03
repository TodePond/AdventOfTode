const input = `A Y
B X
C Z`

const { Term } = MotherTode

const inputs = input.split("\n")

const terms = Term.hoist(({ move, rock, paper, scissors }) => {
	return {
		round: Term.emit(
			Term.list([move, Term.string(" "), move]),
			([them, _, you]) => {
				let result = ""
				if (them === you) {
					result = "draw"
				} else if (them === "rock" && you === "scissors") {
					result = "lose"
				} else if (them === "rock" && you === "paper") {
					result = "win"
				} else if (them === "paper" && you === "rock") {
					result = "lose"
				} else if (them === "paper" && you === "scissors") {
					result = "win"
				} else if (them === "scissors" && you === "rock") {
					result = "win"
				} else if (them === "scissors" && you === "paper") {
					result = "lose"
				}

				const json = { them, you, result }
				return JSON.stringify(json)
			},
		),

		move: Term.or([rock, paper, scissors]),

		rock: Term.emit(
			Term.or([Term.string("A"), Term.string("X")]),
			() => "rock",
		),

		paper: Term.emit(
			Term.or([Term.string("B"), Term.string("Y")]),
			() => "paper",
		),

		scissors: Term.emit(
			Term.or([Term.string("C"), Term.string("Z")]),
			() => "scissors",
		),
	}
})

const getScore = (results) => {
	let score = 0
	for (const result of results) {
		if (result.result === "win") {
			score += 6
		} else if (result.result === "draw") {
			score += 3
		}

		if (result.you === "rock") {
			score += 1
		} else if (result.you === "paper") {
			score += 2
		} else if (result.you === "scissors") {
			score += 3
		}
	}
	return score
}

const results = inputs.map((v) => JSON.parse(terms.round.translate(v)))
getScore(results).d
