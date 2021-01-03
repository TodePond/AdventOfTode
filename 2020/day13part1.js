const input = `939
7,13,x,x,59,x,31,19`

const departTime = input.split("\n")[0].as(Number)
const buses = input.split("\n")[1].split(",").filter(b => b !== "x").map(b => b.as(Number))

const waits = buses.map(b => b - (departTime % b))
let min = Infinity
let bus = undefined
for (let i = 0; i < waits.length; i++) {
	const wait = waits[i]
	if (wait < min) {
		min = wait
		bus = buses[i]
	}
}

print(bus * min)