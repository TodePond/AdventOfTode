
input = `3,4,1,1,5,1,3,1,1,3,5,1,1,5,3,2,4,2,2,2,1,1,1,1,5,1,1,1,1,1,3,1,1,5,4,1,1,1,4,1,1,1,1,2,3,2,5,1,5,1,2,1,1,1,4,1,1,1,1,3,1,1,3,1,1,1,1,1,1,2,3,4,2,1,3,1,1,2,1,1,2,1,5,2,1,1,1,1,1,1,4,1,1,1,1,5,1,4,1,1,1,3,3,1,3,1,3,1,4,1,1,1,1,1,4,5,1,1,3,2,2,5,5,4,3,1,2,1,1,1,4,1,3,4,1,1,1,1,2,1,1,3,2,1,1,1,1,1,4,1,1,1,4,4,5,2,1,1,1,1,1,2,4,2,1,1,1,2,1,1,2,1,5,1,5,2,5,5,1,1,3,1,4,1,1,1,1,1,1,1,4,1,1,4,1,1,1,1,1,2,1,2,1,1,1,5,1,1,3,5,1,1,5,5,3,5,3,4,1,1,1,3,1,1,3,1,1,1,1,1,1,5,1,3,1,5,1,1,4,1,3,1,1,1,2,1,1,1,2,1,5,1,1,1,1,4,1,3,2,3,4,1,3,5,3,4,1,4,4,4,1,3,2,4,1,4,1,1,2,1,3,1,5,5,1,5,1,1,1,5,2,1,2,3,1,4,3,3,4,3`

const ages = input.split(",").map((n) => parseInt(n)).d

const state = {
	fish: [0].repeat(9),
	days: 0,
}

for (const age of ages) {
	state.fish[age]++
}
state.fish.d

const grow = (fish) => {
	const newFish = [0].repeat(9)
	for (let age = 0; age < fish.length; age++) {
		const count = fish[age]
		if (age === 0) {
			newFish[8] += count
			newFish[6] += count
		}
		else {
			newFish[age-1] += count
		}
	}
	return newFish
}

on.load(() => {

	const show = Show.start({scale: 0.95, interval: 1000 / 40, paused: true})
	const {context, canvas} = show

	show.tick = () => {

		if (state.finished) return
		if (state.days === 256) {
			const totalFish = state.fish.reduce((a, b) => a + b)
			print(totalFish)
			state.finished = true
			return
		}

		state.fish = grow(state.fish)
		state.days++

		//context.clearRect(0, 0, canvas.width, canvas.height)

		const totalFish = state.fish.reduce((a, b) => a + b)
		fishHeight = (canvas.height / 1705008653296)

		let y = 0
		for (let age = 0; age < state.fish.length; age++) {

			const count = state.fish[age]

			let [r, g, b] = Colour.Cyan
			r = (r/8 * age)
			g = (g/8 * age)
			
			context.fillStyle = `rgba(${r}, ${g}, ${b}, 90%)`
			context.fillRect(0, y, canvas.width, fishHeight * count)

			y += fishHeight * count

		}
	}


})