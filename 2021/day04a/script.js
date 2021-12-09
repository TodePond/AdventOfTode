
input = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`

const NL = "\n"
const Board = MotherTode(`
	:: Line { BoardTail }
	>> (board) => "[" + NL + board + NL + "]"
	BoardTail :: "\n" Line >> (tail) => ", " + tail
	
	Line :: [_] Number { LineTail } >> ([_, number, tail]) => "	[" + number + tail + "]"
	LineTail :: _ Number >> ([_, number]) => ", " + number
	
	_ :: /[ ]/+
	Number :: /[0-9]/+ >> (number) => "{number: " + number + "}" 
`)

const parseBoard = (board) => {
	const code = Board(board).output
	const func = new Function("return " + code)
	return func()
}

const lines = input.split("\n")
const numbers = lines[0].split(",").map(n => parseInt(n))
const boardLines = lines.slice(2).join("\n")
const boardStrings = boardLines.split("\n\n")
const boards = boardStrings.map(b => parseBoard(b))

const BOARD_SCALE = 0.9
const SHOW_SCALE = 0.98

let numberPosition = 0
let phase = 0

on.load(() => {
	const show = Show.start({interval: 1000 / 20})
	const {canvas, context} = show
	show.tick = () => {
		
		const calledNumber = numbers[numberPosition]
		
		context.clearRect(0, 0, canvas.width, canvas.height)
		
		const rowCount = Math.round(Math.sqrt(boards.length))
		const columnCount = Math.round(boards.length / Math.sqrt(boards.length))
		
		const boardWidth = canvas.width / rowCount
		const boardHeight = canvas.height / rowCount
		
		let x = 0
		let y = 0
		
		context.translate(canvas.width/2, canvas.height/2)
		context.scale(SHOW_SCALE, SHOW_SCALE)
		context.translate(-canvas.width/2, -canvas.height/2)
		
		const slotWidth = boardWidth / 5
		const slotHeight = boardHeight / 5
		
		for (let i = 0; i < boards.length; i++) {
			
			
			const y = Math.floor(i / columnCount) * boardHeight
			const x = (i % columnCount) * boardWidth
			
			context.scale(BOARD_SCALE, BOARD_SCALE)
			context.translate(0.5 * (boardWidth - boardWidth*BOARD_SCALE), 0.5 * (boardHeight - boardHeight*BOARD_SCALE))
			
			context.fillStyle = Colour.White
			context.fillRect(0, 0, boardWidth, boardHeight)
			
			const board = boards[i]
			for (let j = 0; j < board.length; j++) {
				const boardRow = board[j]
				for (let k = 0; k < boardRow.length; k++) {
					const slot = boardRow[k]
					if (slot.number === calledNumber) {
						slot.isCalled = true
						const result = checkWinner(board)
						if (phase === 0 && result) {
							print("Board", i)
							print("Score", getScore(board))
							phase++
						}
					}
					const red = slot.number / 100 * 255
					const green = 255 - red
					const blue = 255 - red/2
					context.fillStyle = "rgb(255, " + green + ", " + blue + ")"
					if (slot.isCalled) context.fillStyle = Colour.Blue
					if (slot.isWinner) context.fillStyle = Colour.Green
					context.fillRect(k * slotWidth, j * slotHeight, slotWidth, slotHeight)
				}
			}
			
			context.translate(-0.5 * (boardWidth - boardWidth*BOARD_SCALE), -0.5 * (boardHeight - boardHeight*BOARD_SCALE))
			context.scale(1/BOARD_SCALE, 1/BOARD_SCALE)
			
			if ((i+1) % columnCount === 0) {
				context.translate(-boardWidth * (columnCount-1), boardHeight)
			} else {
				context.translate(boardWidth, 0)
			}
			
		}
		
		context.resetTransform()
		
		if (phase === 0) numberPosition++
	}
})

const checkWinner = (board) => {
	for (const row of board) {
		if (row.every(slot => slot.isCalled)) {
			for (const slot of row) {
				slot.isWinner = true
			}
			return true
		}
	}
	
	const columns = [[], [], [], [], []]
	for (let y = 0; y < 5; y++) {
		for (let x = 0; x < 5; x++) {
			columns[x][y] = board[y][x]
		}
	}
	
	for (const column of columns) {
		if (column.every(slot => slot.isCalled)) {
			for (const slot of column) {
				slot.isWinner = true
			}
			return true
		}
	}
	
}

const getScore = (board) => {
	let sum = 0
	for (let y = 0; y < 5; y++) {
		for (let x = 0; x < 5; x++) {
			const slot = board[y][x]
			if (!slot.isCalled) sum += slot.number
		}
	}
	return sum * numbers[numberPosition]
}
