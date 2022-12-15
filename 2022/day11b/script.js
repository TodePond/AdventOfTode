const input = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`

const terms = Term.hoist(
	({
		monkey,
		newline,
		name,
		start,
		operation,
		test,
		ifTrue,
		ifFalse,
		number,
		numbers,
		variable,
		operator,
		value,
	}) => {
		return {
			monkey: Term.emit(
				Term.list([
					name,
					newline,
					start,
					newline,
					operation,
					newline,
					test,
					newline,
					ifTrue,
					newline,
					ifFalse,
				]),
				([name, , start, , operation, , test, , ifTrue, , ifFalse]) => ({
					number: name,
					items: start,
					operation,
					test,
					ifTrue,
					ifFalse,
					count: 0,
				}),
			),
			name: Term.emit(
				Term.list([Term.string("Monkey "), number, Term.string(":")]),
				([, n]) => n,
			),
			start: Term.emit(Term.list([Term.string("  Starting items: "), numbers]), ([, n]) => n),
			operation: Term.emit(
				Term.list([
					Term.string("  Operation: new = old "),
					operator,
					Term.string(" "),
					value,
				]),
				([, op, , n]) => new Function("old", `return old ${op} ${n}`),
			),
			test: Term.emit(
				Term.list([Term.string("  Test: divisible by "), number]),
				([, n]) => n,
			),
			ifTrue: Term.emit(
				Term.list([Term.string("    If true: throw to monkey "), number]),
				([, n]) => n,
			),
			ifFalse: Term.emit(
				Term.list([Term.string("    If false: throw to monkey "), number]),
				([, n]) => n,
			),
			numbers: Term.emit(
				Term.list([
					number,
					Term.emit(Term.maybe(Term.list([Term.string(", "), numbers])), ([, n]) => n),
				]),
				([n, ns]) =>
					ns ? [{ count: 0, remainder: n }, ...ns] : [{ count: 0, remainder: n }],
			),
			number: Term.emit(Term.regExp(/[0-9]+/), (v) => parseInt(v)),
			variable: Term.string("old"),
			operator: Term.or([Term.string("*"), Term.string("+")]),
			value: Term.or([number, variable]),
			newline: Term.string("\n"),
		}
	},
)

const inputs = input.split("\n\n")

const monkeys = inputs.map((v) => terms.monkey.translate(v))
print("monkeys", monkeys)

const doTest = (v, n) => {
	return v % n === 0
}

const doTurn = (index, testNumber) => {
	const monkey = monkeys[index]
	const { number, items, operation, test, ifTrue, ifFalse } = monkey
	const inspectedItems = items.map((v) => {
		const newVal = operation(v.count * testNumber + v.remainder) // % testNumber
		return {
			count: (v.count += Math.floor(newVal / testNumber)),
			remainder: newVal,
		}
	})
	const safeItems = inspectedItems.map((v) => ({
		count: v.count,
		remainder: Math.floor(v.remainder / 1),
	}))
	for (const item of safeItems) {
		monkey.count++
		if (doTest(item.remainder, test)) {
			throwItemTo(item, monkeys[ifTrue])
		} else {
			throwItemTo(item, monkeys[ifFalse])
		}
	}
	monkey.items = []
}

const throwItemTo = (item, monkey) => {
	monkey.items.push(item)
}

const doRound = (testNumber) => {
	for (let i = 0; i < monkeys.length; i++) {
		doTurn(i, testNumber)
	}
}

const showMonkeys = () => {
	for (let i = 0; i < monkeys.length; i++) {
		const monkey = monkeys[i]
		print(`Monkey ${i}: ${monkey.items.map((v) => v.remainder).join(", ")}`)
	}
}

const showMonkeyCounts = () => {
	for (let i = 0; i < monkeys.length; i++) {
		const monkey = monkeys[i]
		print(`Monkey ${i} count: ${monkey.count}`)
	}
}

const testNumber = monkeys.reduce((a, b) => a * b.test, 1)

showMonkeys()
for (let i = 0; i < 20; i++) {
	doRound(testNumber)
}
print("brrr")
showMonkeys()
showMonkeyCounts()

const sorted = monkeys.sort((a, b) => b.count - a.count)
print("sorted", sorted)

print("Done", sorted[0].count * sorted[1].count)
