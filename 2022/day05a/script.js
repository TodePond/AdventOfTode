const input = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`

const { Term } = MotherTode

const [head, tail] = input.split("\n\n")
const instructions = tail.split("\n")
const layers = head.split("\n").slice(0, -1)

const Instruction = Term.hoist(({ move, from, to, number, instruction }) => {
	return {
		move: Term.string("move "),
		from: Term.string(" from "),
		to: Term.string(" to "),
		number: Term.emit(Term.regExp(/[0-9]+/), (v) => parseInt(v) - 1),

		instruction: Term.emit(Term.list([move, number, from, number, to, number]), ([m, count, f, start, t, end]) => ({
			count,
			start,
			end,
		})),
	}
})

const Arrangement = Term.hoist(({ gap, cell, empty, crate, row, rowTail }) => {
	return {
		gap: Term.string(" "),
		cell: Term.or([crate, empty]),
		empty: Term.emit(Term.string("   "), () => ""),
		crate: Term.emit(
			Term.list([Term.string("["), Term.regExp(/[A-Z]/), Term.string("]")]),
			([_, letter]) => letter,
		),

		row: Term.emit(Term.list([cell, Term.maybe(rowTail)]), ([first, rest]) => {
			return [first, ...(rest || [])]
		}),

		rowTail: Term.emit(Term.list([gap, row]), ([_, rest]) => rest),
	}
})

const movements = instructions.map((v) => Instruction.instruction.translate(v)).d
const rows = layers.map((v) => Arrangement.row.translate(v))

const startingColumns = rows[0].map((_, i) =>
	rows
		.map((row) => row[i])
		.reverse()
		.filter((v) => v !== ""),
).d

const applyMovement = (columns, movement) => {
	const { start, end, count } = movement

	const startColumn = columns[start]
	const endColumn = columns[end]

	const selectedCrates = startColumn.slice(-count)
	const remainingCrates = startColumn.slice(0, count)

	const newStartColumn = remainingCrates
	const newEndColumn = [...endColumn, ...selectedCrates]

	const newColumns = [...columns] //todo: clone better
	newColumns[start] = newStartColumn
	newColumns[end] = newEndColumn

	return newColumns
}

const applyMovements = (columns, movements) => {
	let newColumns = [...columns]
	for (const movement of movements) {
		newColumns = applyMovement(newColumns, movement)
	}
	return newColumns
}

applyMovements(startingColumns, movements).d
