const input = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`

const pairs = input.split("\n")

const { Term } = MotherTode

const terms = Term.hoist(({ pair, sections, section }) => {
	return {
		pair: Term.emit(Term.list([sections, Term.string(","), sections]), ([a, _, b]) => {
			if (a.start >= b.start && a.end <= b.end) return true
			if (b.start >= a.start && b.end <= a.end) return true
			return false
		}),
		sections: Term.emit(Term.list([section, Term.string("-"), section]), ([start, _, end]) => {
			const result = {
				start: parseInt(start),
				end: parseInt(end),
			}
			return result
		}),
		section: Term.regExp(/[0-9]+/),
	}
})

pairs.map((pair) => terms.pair.translate(pair)).filter((v) => v).length.d
