const input = `2x3x4
1x1x10`

const lines = input.split("\n")
const dimensions = lines.map(line => line.split("x").map(n => n.as(Number)))

const getPaperArea = ([l, w, h]) => {
	const [lw, lh, wh] = [l*w, l*h, w*h]
	const smallest = Math.min(lw, lh, wh)
	return 2*lw + 2*lh + 2*wh + smallest
	
}

let total = 0
for (const [l, w, h] of dimensions) {
	total += getPaperArea([l, w, h])
}

print("Wrapping Paper Needed:", total)
