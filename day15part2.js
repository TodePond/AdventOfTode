const input = `0,3,6`
const ns = input.split(",").map(n => n.as(Number))

const sightings = new Int32Array(30_000_000).fill(-1)

for (let i = 0; i < ns.length - 1; i++) {
	const n = ns[i]
	sightings[n] = i
}

sightings.d

let prev = ns.last
for (let t = ns.length - 1; t < 30_000_000 - 1; t++) {
	const prevSighting = sightings[prev]
	let diff = 0
	if (prevSighting !== -1) diff = t - prevSighting
	sightings[prev] = t
	prev = diff
	if (t % 100_000 === 0) print(t, prev)
}

print(prev)
