const input = `...`

const rules = input.split("\n")


MotherTode`
Language :: Rule >> (r) => new Function("return " + r.output)()
Rule :: Bag " contain " Insides "." >> ([b, _, i]) => '{["' + b.output + '"]: ' + i.output + "}"
Bag :: Colour " bag" "s"? >> ([colour]) => colour.output
Colour :: Word " " Word
Word :: /[a-z]/+
Insides :: Nothing | Something >> (c) => "[" + c.output + "]"
Nothing :: "no other bags" >> () => ""
Something :: Contents | Content
Contents :: Content ", " Something >> ([a, _, b]) => a.output + ', ' + b.output
Content :: Number " " Bag >> ([n, _, bag]) => '"' + bag.output + '"'
Number :: /[0-9]/+
`

const bags = rules.map(rule => TERM.Language(rule).output).reduce((a, b) => ({...a, ...b}))

const isBagHelpful = (bag) => {
	for (const content of bag) {
		if (content === "shiny gold") return true
		if (isBagHelpful(bags[content])) return true
	}
	return false	
}

let tally = 0
for (const bagName in bags) {
	if (bagName === "shiny gold") continue
	if (isBagHelpful(bags[bagName])) tally++
}

print(tally)
