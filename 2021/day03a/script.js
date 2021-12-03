const input = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`

const reports = input.split("\n")
const reportLength = reports[0].length

const states = [0].repeat(reportLength)
const previousStates = [0].repeat(reportLength)
const previousPreviousStates = [0].repeat(reportLength)


let position = 0
let finished = false

on.load(() => {
	const show = Show.start({overload: 1, interval: 1000 / 60, paused: true})
	const {context, canvas} = show

	show.tick = () => {

		context.clearRect(0, 0, canvas.width, canvas.height)
		const visWidth = canvas.width * 0.8
		const visLeft = (canvas.width - visWidth) / 2
		const barWidth = visWidth / reportLength

		for (let i = 0; i < states.length; i++) {
			context.fillStyle = Colour.Red
			context.fillRect(visLeft + barWidth*i, canvas.height/2, barWidth, previousPreviousStates[i] * 10)
			context.fillStyle = Colour.Orange
			context.fillRect(visLeft + barWidth*i, canvas.height/2, barWidth, previousStates[i] * 10)
			context.fillStyle = Colour.Yellow
			context.fillRect(visLeft + barWidth*i, canvas.height/2, barWidth, states[i] * 10)
		}

		const report = reports[position]
		if (report === undefined) {
			if (!finished) {
				const gammaString = states.map(s => s > 0? "1" : "0").join("").d
				const epsilonString = states.map(s => s > 0? "0" : "1").join("").d

				const gamma = parseInt(gammaString, 2).d
				const epsilon = parseInt(epsilonString, 2).d

				print("Answer:", gamma * epsilon)
			}
			finished = true
			return
		}

		for (let i = 0; i < report.length; i++) {
			const c = report[i]
			previousPreviousStates[i] = previousStates[i]
			previousStates[i] = states[i]
			if (c === "1") states[i]++
			else if (c === "0") states[i]--
		}

		position++

	}
	
	
})