const input = `forward 5
down 5
forward 8
up 3
down 8
forward 2`

const Instructions = MotherTode(`
	
	:: HEADER __ Instruction {"\n" Instruction} __ FOOTER

	__ >> "\\n" 
	HEADER >> "let [horizontalPosition, depth, aim] = [0, 0, 0]"
	FOOTER >> "return {horizontalPosition, depth}"

	Instruction :: Forward | Down | Up
	Number :: /[0-9]/+	

	Forward :: "forward " Number >> ([up, n]) => "horizontalPosition += " + n + "; depth += aim * " + n
	Down :: "down " Number >> ([up, n]) => "aim += " + n
	Up :: "up " Number >> ([up, n]) => "aim -= " + n
`)

const javascript = Instructions(input).output.d
const func = new Function(javascript)

const {horizontalPosition, depth} = func(0, 0).d
print(horizontalPosition * depth)

on.load(() => {
	const show = Show.start({overload: 1})
	const {context, canvas} = show
	context.fillStyle = Colour.Yellow
	
	state = {horizontalPosition: 0, depth: 0, aim: 0}
	const moves = javascript.split("\n").slice(1, -1).map(m => new Function("{horizontalPosition, depth, aim}", m + "\nreturn {horizontalPosition, depth, aim}"))
	
	let i = 0
	show.tick = () => {
		
		const move = moves[i]
		if (move === undefined) return
		state = move(state)
		i++
		
		context.fillRect(50 + state.horizontalPosition * 0.45, 100 + state.depth*0.0006, 5, 5)
		
	}
	
})