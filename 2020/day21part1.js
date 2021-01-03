const input = `mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)`

const lines = input.split("\n")

MotherTode`
Language :: Food >> (f) => JS([f])
Food :: Recipe " " AllergyInfo >> ([r, _, a]) => "[[" + r + "], " + a + "]"
Recipe :: Ingredients | Ingredient
Ingredient :: Word
Ingredients :: Ingredient " " Recipe >> ([l, _, r]) => l + ", " + r
AllergyInfo :: "(contains " AllergyList ")" >> ([l, a, r]) => "[" + a + "]"
AllergyList :: Allergies | Allergy
Allergy :: Word
Allergies :: Allergy ", " AllergyList
Word :: /[a-z]/+ >> (w) => '"' + w + '"'
`
const foods = lines.map(f => TERM.Language(f).output)

const allergies = {}
const initialIngredients = []

for (const [is, as] of foods) {
	for (const a of as) {
		if (allergies[a] === undefined) allergies[a] = []
		allergies[a].push(is)
		initialIngredients.pushUnique(...is)
	}
}

const eliminateIngredients = (a) => {

	const allergy = allergies[a]
	const tally = {}

	for (const ps of allergy) {
		for (const p of ps) {
			if (tally[p] === undefined) tally[p] = 0
			tally[p]++
		}
	}
	
	for (const t in tally) {
		const score = tally[t]
		if (score < allergy.length) {
			print("Reject", t, "from", a)
			for (const i in allergy) {
				const ps = allergy[i]
				allergy[i] = ps.filter(v => v !== t)
			}
			
		}
	}
	
}

const remainingIngredients = []

for (const a in allergies) {
	eliminateIngredients(a)
}

for (const al of allergies) {
	for (const ps of al) {
		remainingIngredients.pushUnique(...ps)
	}
}

const rejectedIngredients = initialIngredients.filter(i => !remainingIngredients.includes(i))

print("Initial Ingredients:", initialIngredients)
print("Rejected Ingredients:", rejectedIngredients)
print("Remaining Ingredients:", remainingIngredients)

let rejectTally = 0
for (const i of rejectedIngredients) {
	for (const [is] of foods) {
		if (is.includes(i)) rejectTally++
	}
}

print("Rejected ingredients appear", rejectTally, "times")


/*
for (const a in allergies) {
	const al = allergies[a]
	print(a, al)
}
*/