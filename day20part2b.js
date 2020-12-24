const input = `Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...`

const puzzle = `.....##...  ....#.#.##  #....#.#..  
####..#...  ..#...##..  ...###...#  
#.##.####.  ...##..##.  ...###.#.#  
.#...####.  ...#...#..  ..#..##.##  
.##....##.  .#...#####  ##..#####.  
..###.####  #.#.#.#..#  #.####..#.  
.###.####.  ..#.#.#...  .#..#.#..#  
##.#..#.#.  .##...#.##  ###.####..  
#..##.#..#  ##.##.##..  .###.#.#..  
####...##.  ..#.##.###  #.#.#.#...  

####...##.  ..#.##.###  #.#.#.#...  
...######.  ..##.#..#.  ....#.####  
..##.###.#  #..#.##.#.  .....#.#..  
.###.###.#  #.##.#.#.#  #.#..#....  
...#.#.#.#  ##...#....  .#.##..##.  
##.######.  .##..##...  ...####.#.  
###..#.###  #####.#...  ..#.#.####  
#..###.#..  .#.####.#.  ...####.##  
#....##.##  #.###..#..  ..##.#..##  
...###.#..  .#..#.##..  .##...##.#  

...###.#..  .#..#.##..  .##...##.#  
.......#..  .....#..##  #...####.#  
...###.#..  .#..##...#  ##..#.....  
##.#####.#  #...#.####  ######...#  
.##.#...#.  .###.##.##  #....#.##.  
.#..#.####  ###.#...##  #####.###.  
....######  ##..#.#.#.  .##.##.###  
.......#..  ..#....#..  .#....###.  
######..#.  .#.#...###  #.#..#.#..  
.#####.#.#  ###..###..  ..#.##...#  
`

const tiles = input.split("\n\n")
MotherTode`
Tile :: Label Picture >> ([label, picture]) => ({[label.output]: picture.output})
Label :: "Tile " Number ":" >> ([_, n]) => n.output
Number :: /[0-9]/+ >> (n) => n.output.as(Number)
Picture (
	:: Row Row Row Row Row Row Row Row Row Row
	>> (rows) => rows.map(r => r.output)
)
Row (
	:: "\n" Column Column Column Column Column Column Column Column Column Column
	>> ([_, ...symbols]) => symbols.map(s => s.output)
)
Column :: Monster | Water
Monster :: "#"
Water :: "."
`
const pieces = tiles.map(t => TERM.Tile(t).output).reduce((a,b) => ({...a, ...b}))
const PIECE_COUNT = Object.values(pieces).length
print("Number of Pieces: ", PIECE_COUNT)

const PIECE_SIZE = 10
const PUZZLE_SIZE = Math.sqrt(Object.values(pieces).length)
const SHAVED_SIZE = PIECE_SIZE - 2
const MAP_SIZE = SHAVED_SIZE * PUZZLE_SIZE
const PUZZLE_TOTAL_SIZE = PIECE_SIZE * PUZZLE_SIZE
print("Puzzle Size: ", PUZZLE_SIZE, "x", PUZZLE_SIZE)
print("Piece Size: ", PIECE_SIZE, "x", PIECE_SIZE)
print("Shaved Piece Size: ", SHAVED_SIZE, "x", SHAVED_SIZE)
print("Map Resolution: ", MAP_SIZE, "x", MAP_SIZE)
print("Puzzle Resolution: ", PUZZLE_TOTAL_SIZE, "x", PUZZLE_TOTAL_SIZE)

const pre = HTML`<pre></pre>`
document.body.appendChild(pre)

const mapString = puzzle.filter(c => c !== " " && c !== "\n")
let map = []
let i = 0
for (let y = 0; y < PUZZLE_TOTAL_SIZE; y++) {
	if (y % 10 === 0) {}
	else if (y % 10 === 9) {}
	else map.push([])
	for (let x = 0; x < PUZZLE_TOTAL_SIZE; x++) {
		if (y % 10 === 0) {}
		else if (y % 10 === 9) {}
		else if (x % 10 === 0) {}
		else if (x % 10 === 9) {}
		else map.last.push(mapString[i])
		i++
	}
}


const TRANSFORMATIONS = [
	(x,y) => [ x, y],
	(x,y) => [-x, y],
	(x,y) => [ x,-y],
	(x,y) => [-x,-y],
	(x,y) => [ y, x],
	(x,y) => [-y, x],
	(x,y) => [ y,-x],
	(x,y) => [-y,-x],
]

const transformPiece = (piece, transformation, max=MAP_SIZE) => {
	const transformedPiece = []
	let [lx, ly] = [Infinity, Infinity]
	for (let y = 0; y < max; y++) {
		for (let x = 0; x < max; x++) {
			const [tx, ty] = transformation(x, y)
			if (transformedPiece[ty] === undefined) transformedPiece[ty] = []
			transformedPiece[ty][tx] = piece[y][x]
			lx = Math.min(lx, tx)
			ly = Math.min(ly, ty)
		}
	}
	
	const normalisedPiece = []
	for (let y = ly; y < ly + max; y++) {
		const dy = y - ly
		normalisedPiece[dy] = []
		for (let x = lx; x < lx + max; x++) {
			const dx = x - lx
			normalisedPiece[dy][dx] = transformedPiece[y][x]
		}
	}
	
	return normalisedPiece
}

const ogMap = transformPiece(map, TRANSFORMATIONS[0])

const drawMap = () => {
	pre.innerHTML = map.map(m => m.join("")).reversed.join("\n")
}

const MONSTER = [
	[ 1,-1],
	[ 4,-1],
	[ 5, 0],
	[ 6, 0],
	[ 7,-1],
	[10,-1],
	[11, 0],
	[12, 0],
	[13,-1],
	[16,-1],
	[17, 0],
	[18, 0],
	[18, 1],
	[19, 0],
]

const isMonster = ([x, y]) => {
	for (const [dx, dy] of MONSTER) {
		const [mx, my] = [x+dx, y+dy]
		if (mx >= MAP_SIZE || my >= MAP_SIZE || my < 0 || mx < 0) return false
		if (map[my][mx] !== "#" && map[my][mx] !== "O") return false
	}
	return true
}

const colourMonster = ([x, y]) => {
	map[y][x] = "O"
	for (const [dx, dy] of MONSTER) {
		const [mx, my] = [x+dx, y+dy]
		map[my][mx] = "O"
	}
	return true
}

let tx = 0
let ty = 0
let trans = 0
let tally = 0

const tick = () => {

	
	const element = map[ty][tx]
	if (element === ".") map[ty][tx] = " "
	else {
		const result = isMonster([tx, ty])
		if (result) {
			tally++
			colourMonster([tx, ty])
		}
	}
	
	drawMap()
	
	tx++
	if (tx >= MAP_SIZE) {
		tx = 0
		ty++
	}
	if (ty >= MAP_SIZE) {
		if (tally === 0) {
			trans++
			map = transformPiece(ogMap, TRANSFORMATIONS[trans])
			tx = 0
			ty = 0
			setTimeout(tick, 1)
		}
		const count = map.map(m => m.join("")).join("").filter(c => c === "#").d.length.d
		return
	}
	
	setTimeout(tick, 1)
}

tick()
