const input = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`

const lines = input.split("\n")

const terms = Term.hoist(({ line, number, addx, noop }) => {
	return {
		line: Term.or([noop, addx]),
		noop: Term.emit(Term.string("noop"), () => _({ type: "noop" })),
		addx: Term.emit(Term.list([Term.string("addx "), number]), ([addx, v]) => {
			return _([
				{
					type: "addingx",
				},
				{
					type: "addx",
					value: parseInt(v),
				},
			])
		}),
		number: Term.list([Term.maybe(Term.string("-")), Term.regExp(/[0-9]+/)]),
	}
})

const commands = lines.map((line) => JSON.parse(terms.line.translate(line))[0]).flat().d

const runCommands = (commands) => {
	const scores = []

	let x = 1
	let c = 1
	for (const command of commands) {
		if (command.type == "addx") {
			x += command.value
		}
		c++
		if ((c - 20) % 40 === 0) {
			scores.push(x * c)
		}
	}
	return scores.reduce((a, b) => a + b, 0)
}

runCommands(commands).d
