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

let reports = input.split("\n")
const reportLength = reports[0].length

let states = [0].repeat(reportLength)
let previousStates = [0].repeat(reportLength)
let previousPreviousStates = [0].repeat(reportLength)


let position = 0
let i = 0
let finished = false

let phase = 0

let o2 = 0
let co2 = 0

on.load(() => {
	const show = Show.start({overload: 1, interval: 1000 / 60, paused: true})
	const {context, canvas} = show

	show.tick = () => {

		const visWidth = canvas.width * 0.8
		const visLeft = (canvas.width - visWidth) / 2
		const barWidth = visWidth / reportLength

		const report = reports[position]
		if (phase === 0) {
			context.clearRect(0, 0, canvas.width, canvas.height/2)
			for (let i = 0; i < states.length; i++) {
				context.fillStyle = Colour.White
				context.fillRect(visLeft + barWidth*i, canvas.height/4, barWidth, -previousPreviousStates[i] * 10)
				context.fillStyle = Colour.Cyan
				context.fillRect(visLeft + barWidth*i, canvas.height/4, barWidth, -previousStates[i] * 10)
				context.fillStyle = Colour.Blue
				context.fillRect(visLeft + barWidth*i, canvas.height/4, barWidth, -states[i] * 10)
			}

			if (report === undefined) {
				const result = states[i] >= 0? "1" : "0"
				reports = reports.filter(r => r[i] === result)
				i++
				position = 0
				return
			}

			if (i >= reportLength) {
				const answer = states.map(s => s >= 0? "1" : "0").join("")
				const number = parseInt(answer.d, 2).d
				print("Oxygen", number)
				phase++
				o2 = number
				i = 0
				position = 0
				reports = input.split("\n")
				states = [0].repeat(reportLength)
				previousStates = [0].repeat(reportLength)
				previousPreviousStates = [0].repeat(reportLength)
				return
			}
		}
		else if (phase === 1) {
			context.clearRect(0, canvas.height/2, canvas.width, canvas.height/2)
			for (let i = 0; i < states.length; i++) {
				context.fillStyle = Colour.White
				context.fillRect(visLeft + barWidth*i, 3*canvas.height/4, barWidth, -previousPreviousStates[i] * 10)
				context.fillStyle = Colour.Pink
				context.fillRect(visLeft + barWidth*i, 3*canvas.height/4, barWidth, -previousStates[i] * 10)
				context.fillStyle = Colour.Red
				context.fillRect(visLeft + barWidth*i, 3*canvas.height/4, barWidth, -states[i] * 10)
			}

			/*if (i >= reportLength) {
				const answer = states.map(s => s >= 0? "1" : "0").join("")
				const number = parseInt(answer.d, 2).d
				print("Carbon Dioxide", number)
				phase++
				return
			}*/

			if (reports.length === 1) {
				const answer = reports[0]
				const number = parseInt(answer.d, 2).d
				print("Carbon Dioxide", number)
				phase++
				co2 = number
				return
			}

			if (report === undefined) {
				const result = states[i] >= 0? "1" : "0"
				reports = reports.filter(r => r[i] !== result)
				i++
				position = 0
				return
			}

			if (i >= reportLength) {
				const answer = states.map(s => s >= 0? "1" : "0").join("")
				const number = parseInt(answer.d, 2).d
				print("Carbon Dioxide", number)
				phase++
				co2 = number
				return
			}
		}
		else if (phase === 2) {
			print(o2 * co2)
			return
		}
	
		const c = report[i]
		previousPreviousStates[i] = previousStates[i]
		previousStates[i] = states[i]
		if (c === "1") states[i]++
		else if (c === "0") states[i]--
		position++


	}
	
	
})