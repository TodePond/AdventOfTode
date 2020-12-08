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
Content :: Number " " Bag >> ([n, _, bag]) => '[' + n.output + ', "' + bag.output + '"]'
Number :: /[0-9]/+
`

//TERM.Rule("light blue bags contain 1 light red bag, 2 light pink bags.").d

const bags = rules.map(rule => TERM.Language(rule).output).reduce((a, b) => ({...a, ...b}))

const getBagSize = (bag) => {
	let size = 1
	for (const [count, innerBagName] of bag) {
		const innerBag = bags[innerBagName]
		const innerBagSize = getBagSize(innerBag)
		size += innerBagSize * count
	}
	return size
}

print(getBagSize(bags["shiny gold"]) - 1)
