const input = `class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12`

const [rulesInput, myTicketInput, nearbyTicketsInput] = input.split("\n\n")
const rules = rulesInput.split("\n")
const myTicket = myTicketInput.split("\n")[1]
const nearbyTickets = nearbyTicketsInput.split("\n").slice(1)
const tickets = [myTicket, ...nearbyTickets]
const fieldsInput = tickets.join(",")
const fields = fieldsInput.split(",").map(n => n.as(Number))

MotherTode`
Language :: Rule >> (r) => new Function("return " + r.output)()
Rule :: Name ": " Range " or " Range >> ([name, _, left, or, right]) => \`({["\${name.output}"]: [\${left.output}, \${right.output}]})\`
Name :: /[a-z ]/+
Range :: Number "-" Number >> ([left, _, right]) => \`[\${left.output}, \${right.output}]\`
Number :: /[0-9]/+ >> (n) => n.output.as(Number)
`

const limits = rules.map(rule => TERM.Language(rule).output).reduce((a, b) => ({...a, ...b}))

const isInLimit = (value, limitName) => {
	const limit = limits[limitName]
	const [[lmin, lmax], [rmin, rmax]] = limit
	if (value >= lmin && value <= lmax) return true
	if (value >= rmin && value <= rmax) return true
	return false
}

const isInLimits = (field) => {
	for (const [[lmin, lmax], [rmin, rmax]] of limits) {
		if (field >= lmin && field <= lmax) return true
		if (field >= rmin && field <= rmax) return true
	}
	return false
}

const ts = tickets.map(ticket => ticket.split(",").map(n => n.as(Number)))
const valids = ts.filter(t => t.every(f => isInLimits(f)))

const result = Object.keys(limits).map(k => ({[k]: true})).reduce((a, b) => ({...a, ...b}))
const results = rules.map(() => ({...result}))

for (const ticket of valids) {
	for (let i = 0; i < ticket.length; i++) {
		const value = ticket[i]
		for (const limitName in limits) {
			if (!isInLimit(value, limitName)) {
				results[i][limitName] = false
			}
		}
	}
}

const isSolved = () => {
	for (const result of results) {
		const score = Object.values(result).filter(a => a).length
		if (score > 1) return false
		if (score === 0) throw new Error("uh oh")
	}
	return true
}

print(results)

while (!isSolved()) {
	for (const result of results) {
		const score = Object.values(result).filter(a => a).length
		if (score === 1) {
			const winner = Object.entries(result).filter(e => e[1])[0][0]
			for (const r of results) {
				if (r !== result) r[winner] = false
			}
			print(results)
			continue
		}
	}
}

const answer = results.map(r => Object.entries(r).filter(e => e[1])[0][0]).d

let tally = 1
for (let i = 0; i < answer.length; i++) {
	const a = answer[i]
	if (a.slice(0, "departure".length) === "departure") {
		tally *= myTicket.split(",")[i].as(Number)
	}
}

tally.d
