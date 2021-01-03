const input = `2x3x4
1x1x10`

const lines = input.split("\n")
const dimensions = lines.map(line => line.split("x").map(n => n.as(Number)))

const getPaperArea = ([l, w, h]) => {
	const [lw, lh, wh] = [l*w, l*h, w*h]
	const smallest = Math.min(lw, lh, wh)
	return 2*lw + 2*lh + 2*wh + smallest	
}

const getRibbonLength = ([l, w, h]) => {
	let biggest = Math.max(l, w, h)
	const smallest = [l, w, h].filter(v => {
		const result = v !== biggest
		if (!result) biggest = Infinity
		return result
	})
	const volume = l*w*h
	const total = smallest[0]*2 + smallest[1]*2 + volume
	return total
}

let paperTotal = 0
let ribbonTotal = 0
for (const [l, w, h] of dimensions) {
	paperTotal += getPaperArea([l, w, h])
	ribbonTotal += getRibbonLength([l, w, h])
}

print("Wrapping Paper Area:", paperTotal)
print("Ribbon Length:", ribbonTotal)
