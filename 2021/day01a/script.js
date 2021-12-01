const input = `199
200
208
210
200
207
240
269
260
263`

on.load(() => {
	
	const heights = input.split("\n").map(n => parseInt(n))
	
	show = Show.start()
	show.interval = 1000 / 60
	show.overload = 5
	
	let i = 0
	let phase = 0
	let increaseCount = 0
	
	show.tick = () => {
		if (phase === 0 || phase === 1) {
			if (i >= heights.length) {
				i = 0
				phase++
			}
			const height = heights[i]
			const difference = height - heights[i-1]
			const width = show.canvas.width / heights.length

			show.context.fillStyle = Colour.White
			if (phase === 1) show.context.fillStyle = Colour.Blue
			
			if (phase === 0 || difference > 0) {
				if (phase === 1) increaseCount++
				show.context.fillRect(i * width, 0, width, (3000 - height) * 0.25)
			}
			i++
		}
		if (phase === 2) {
			print(increaseCount)
			phase++
		}
	}
	
	
})