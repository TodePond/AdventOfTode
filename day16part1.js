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
Rule :: Name ": " Range " or " Range >> ([name, _, left, or, right]) => \`({\${name.output}: [\${left.output}, \${right.output}]})\`
Name :: /[a-z]/+
Range :: Number "-" Number >> ([left, _, right]) => \`[\${left.output}, \${right.output}]\`
Number :: /[0-9]/+ >> (n) => n.output.as(Number)
`

const limits = rules.map(rule => TERM.Language(rule).output).reduce((a, b) => ({...a, ...b}))

const isInLimits = (field) => {
	for (const [[lmin, lmax], [rmin, rmax]] of limits) {
		if (field >= lmin && field <= lmax) return true
		if (field >= rmin && field <= rmax) return true
	}
	return false
}

let tally = 0
for (const field of fields) {
	if (!isInLimits(field)) {
		tally += field
	}
}

print(tally)