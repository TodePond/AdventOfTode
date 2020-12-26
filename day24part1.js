const input = `sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew`

const lines = input.split("\n")

MotherTode`
Language :: Tile >> t => JS([t])
Tile :: Expression >> (e) => "[" + e + "]"
Expression :: Directions | Direction
Directions :: Direction Expression >> ([left, right]) => left + ", " + right
Direction :: East | SouthEast | SouthWest | West | NorthWest | NorthEast >> (d) => '"' + d + '"'
East :: "e"
SouthEast :: "se"
SouthWest :: "sw"
West :: "w"
NorthWest :: "nw"
NorthEast :: "ne"
`

const DIRECTIONS = {
	ne: [ 1, 1],
	nw: [-1, 1],
	se: [ 1,-1],
	sw: [-1,-1],
	e:  [ 2, 0],
	w:  [-2, 0],
}

const getPosition = (tile) => {
	let [x, y] = [0, 0]
	for (const d of tile) {
		const [dx, dy] = DIRECTIONS[d]
		x += dx
		y += dy
	}
	return [x, y]
}

const getTallies = (positions) => {
	const tallies = {}
	for (const position of positions) {
		const key = position.join(",")
		if (tallies[key] === undefined) tallies[key] = 0
		tallies[key]++
	}
	return tallies
}

const tiles = lines.map(line => TERM.Language(line).output)
const positions = tiles.map(tile => getPosition(tile))
const tallies = getTallies(positions)
const blacks = Object.values(tallies).filter(t => t % 2 !== 0)

print(blacks.length)
