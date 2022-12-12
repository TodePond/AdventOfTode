const input = `Monkey 0:
  Starting items: 74, 64, 74, 63, 53
  Operation: new = old * 7
  Test: divisible by 5
    If true: throw to monkey 1
    If false: throw to monkey 6

Monkey 1:
  Starting items: 69, 99, 95, 62
  Operation: new = old * old
  Test: divisible by 17
    If true: throw to monkey 2
    If false: throw to monkey 5

Monkey 2:
  Starting items: 59, 81
  Operation: new = old + 8
  Test: divisible by 7
    If true: throw to monkey 4
    If false: throw to monkey 3

Monkey 3:
  Starting items: 50, 67, 63, 57, 63, 83, 97
  Operation: new = old + 4
  Test: divisible by 13
    If true: throw to monkey 0
    If false: throw to monkey 7

Monkey 4:
  Starting items: 61, 94, 85, 52, 81, 90, 94, 70
  Operation: new = old + 3
  Test: divisible by 19
    If true: throw to monkey 7
    If false: throw to monkey 3

Monkey 5:
  Starting items: 69
  Operation: new = old + 5
  Test: divisible by 3
    If true: throw to monkey 4
    If false: throw to monkey 2

Monkey 6:
  Starting items: 54, 55, 58
  Operation: new = old + 7
  Test: divisible by 11
    If true: throw to monkey 1
    If false: throw to monkey 5

Monkey 7:
  Starting items: 79, 51, 83, 88, 93, 76
  Operation: new = old * 3
  Test: divisible by 2
    If true: throw to monkey 0
    If false: throw to monkey 6`

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
				([, n]) =>
					(v) =>
						v % n === 0,
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
				([n, ns]) => (ns ? [n, ...ns] : [n]),
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

const doTurn = (index) => {
	const monkey = monkeys[index]
	const { number, items, operation, test, ifTrue, ifFalse } = monkey
	const inspectedItems = items.map((v) => operation(v))
	const safeItems = inspectedItems.map((v) => Math.floor(v / 3))
	for (const item of safeItems) {
		monkey.count++
		if (test(item)) {
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

const doRound = () => {
	for (let i = 0; i < monkeys.length; i++) {
		doTurn(i)
	}
}

const showMonkeys = () => {
	for (let i = 0; i < monkeys.length; i++) {
		const monkey = monkeys[i]
		print(`Monkey ${i}: ${monkey.items.join(", ")}`)
	}
}

const showMonkeyCounts = () => {
	for (let i = 0; i < monkeys.length; i++) {
		const monkey = monkeys[i]
		print(`Monkey ${i} count: ${monkey.count}`)
	}
}

showMonkeys()
for (let i = 0; i < 20; i++) {
	doRound()
}
showMonkeys()
showMonkeyCounts()

print("Done", monkeys[0].count * monkeys.at(-1).count)
