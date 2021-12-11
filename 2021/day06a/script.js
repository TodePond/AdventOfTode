
input = `3,4,1,1,5,1,3,1,1,3,5,1,1,5,3,2,4,2,2,2,1,1,1,1,5,1,1,1,1,1,3,1,1,5,4,1,1,1,4,1,1,1,1,2,3,2,5,1,5,1,2,1,1,1,4,1,1,1,1,3,1,1,3,1,1,1,1,1,1,2,3,4,2,1,3,1,1,2,1,1,2,1,5,2,1,1,1,1,1,1,4,1,1,1,1,5,1,4,1,1,1,3,3,1,3,1,3,1,4,1,1,1,1,1,4,5,1,1,3,2,2,5,5,4,3,1,2,1,1,1,4,1,3,4,1,1,1,1,2,1,1,3,2,1,1,1,1,1,4,1,1,1,4,4,5,2,1,1,1,1,1,2,4,2,1,1,1,2,1,1,2,1,5,1,5,2,5,5,1,1,3,1,4,1,1,1,1,1,1,1,4,1,1,4,1,1,1,1,1,2,1,2,1,1,1,5,1,1,3,5,1,1,5,5,3,5,3,4,1,1,1,3,1,1,3,1,1,1,1,1,1,5,1,3,1,5,1,1,4,1,3,1,1,1,2,1,1,1,2,1,5,1,1,1,1,4,1,3,2,3,4,1,3,5,3,4,1,4,4,4,1,3,2,4,1,4,1,1,2,1,3,1,5,5,1,5,1,1,1,5,2,1,2,3,1,4,3,3,4,3`

const fish = new Map(input.split(",").map((n, i) => [i, parseInt(n)]))

const state = {
	fish,
	days: 0,
}

const grow = (fish) => {
	const size = fish.size
	for (let i = 0; i < size; i++) {
		let number = fish.get(i)
		number--
		if (number < 0) {
			number = 6
			fish.set(fish.size, 8)
		}
		fish.set(i, number)
	}
}

on.load(() => {

	const show = Show.start({scale: 0.95, interval: 1000 / 30, paused: true})
	const {context, canvas} = show
	canvas.style["image-rendering"] = "pixelated"

	show.tick = () => {

		if (state.finished) return

		if (state.days === 80) {
			print(state.fish.size)
			state.finished = true
			return
		}

		grow(state.fish)
		state.days++

		context.clearRect(0, 0, canvas.width, canvas.height)
		const rowCount = Math.round(Math.sqrt(fish.size))
		const columnCount = Math.round(fish.size / Math.sqrt(fish.size))
		
		const width = canvas.width / rowCount * 1
		const height = canvas.height / columnCount * 1

		for (const [i, f] of fish) {

			let [r, g, b] = Colour.Cyan
			r = (r/8 * f)
			g = (g/8 * f)
			
			const y = Math.floor(i / columnCount) * height
			const x = (i % columnCount) * width

			context.fillStyle = `rgb(${r}, ${g}, ${b})`
			context.fillRect(x, y, width, height)

		}
	}


})