const input = `A Y
B X
C Z`

const { Term } = MotherTode

const inputs = input.split("\n")

const terms = Term.hoist(
	({ move, rock, paper, scissors, outcome, lose, win, draw }) => {
		return {
			round: Term.emit(
				Term.list([move, Term.string(" "), outcome]),
				([them, _, outcome]) => {
					let you = ""

					if (outcome === "draw") {
						you = them
					}

					if (outcome === "win") {
						if (them === "rock") {
							you = "paper"
						} else if (them === "paper") {
							you = "scissors"
						} else if (them === "scissors") {
							you = "rock"
						}
					}

					if (outcome === "lose") {
						if (them === "rock") {
							you = "scissors"
						} else if (them === "paper") {
							you = "rock"
						} else if (them === "scissors") {
							you = "paper"
						}
					}

					const json = { them, you, outcome }
					return JSON.stringify(json)
				},
			),

			move: Term.or([rock, paper, scissors]),

			rock: Term.emit(Term.string("A"), () => "rock"),
			paper: Term.emit(Term.string("B"), () => "paper"),
			scissors: Term.emit(Term.string("C"), () => "scissors"),

			outcome: Term.or([lose, draw, win]),
			lose: Term.emit(Term.string("X"), () => "lose"),
			draw: Term.emit(Term.string("Y"), () => "draw"),
			win: Term.emit(Term.string("Z"), () => "win"),
		}
	},
)

const getScore = (results) => {
	let score = 0
	for (const result of results) {
		if (result.outcome === "win") {
			score += 6
		} else if (result.outcome === "draw") {
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
