const input = `939
7,13,x,x,59,x,31,19`

const buses = input.split("\n")[1].split(",").map((b, i) => [b.as(Number), i]).filter(e => !isNaN(e[0])).map(([b, i], n) => [b, i])

let t = 0
let dt = 1

let b = 0

while (true) {
	const bus = buses[b]
	const [id, offset] = bus
	if ((t+offset) % id === 0) {
		b++
		if (b >= buses.length) break
		dt *= id
	}
	t += dt
}

t.d