const input = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`

const { Term } = MotherTode

const terms = Term.hoist(({ food, elf, addFood, maxElves, list }) => {
	return {
		food: Term.regExp(/[0-9]+/),
		elf: Term.or([addFood, food]),
		addFood: Term.emit(
			Term.list([
				Term.except(elf, [addFood]),
				Term.string("\n"),
				elf,
			]),
			([a, _, b]) => parseInt(a) + parseInt(b),
		),
		list: Term.or([maxElves, elf]),
		maxElves: Term.emit(
			Term.list([
				Term.except(list, [maxElves]),
				Term.string("\n\n"),
				list,
			]),
			([a, _, b]) => Math.max(parseInt(a), parseInt(b)),
		),
	}
})

terms.food.translate(input).d
terms.elf.translate(input).d
terms.list.translate(input).d
