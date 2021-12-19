// OOPS I accidentally overwrote this file with the beginnings of part 2
// TODO: get part 1 from a previous commit and put it in this file

input = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`

const lines = input.split("\n")
const patterns = lines.map(line => line.split("|")[0].split(" ").slice(0, -1))
const outputs = lines.map(line => line.split("|")[1].split(" ").slice(1))
const entries = patterns.map((pattern, i) => ({pattern, output: outputs[i]}))

const NUMBER = [
	"abcefg",
	"cf",
	"acdeg",
	"acdfg",
	"bcdf",
	"abdfg",
	"abdefg",
	"acf",
	"abcdefg",
	"abcdfg",
]

// Possible wirings for each number (in each entry)
const wirings = []
for (const entry of entries) {
	wirings.push(["abcdefg"].repeat(10))
}

const state = {
	entry: 0,
}

on.load(() => {
	const show = Show.start()
	const {context, canvas} = show

	show.tick = () => {

		const entry = entries[state.entry]
		const {pattern, output} = entry

		

	}
})