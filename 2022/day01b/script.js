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

const terms = Term.hoist(
	({
		food,
		elf,
		addFood,
		topThreeElves,
		list,
		addWinners,
		total,
	}) => {
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
			list: Term.or([topThreeElves, elf]),
			topThreeElves: Term.emit(
				Term.list([
					Term.except(list, [topThreeElves]),
					Term.string("\n\n"),
					list,
				]),
				([a, _, b]) => {
					const aInt = parseInt(a)
					const others = b
						.split(",")
						.map((x) => parseInt(x))

					const topThree = [...others, aInt].sort(
						(a, b) => b - a,
					)

					return topThree.slice(0, 3).join(",")
				},
			),

			winners: Term.list([
				food,
				Term.string(","),
				food,
				Term.string(","),
				food,
			]),

			total: Term.or([addWinners, food]),
			addWinners: Term.emit(
				Term.list([
					Term.except(total, [addWinners]),
					Term.string(","),
					total,
				]),
				([a, _, b]) => parseInt(a) + parseInt(b),
			),
		}
	},
)

terms.food.translate(input).d
terms.elf.translate(input).d
terms.total.translate(terms.list.translate(input).d).d
