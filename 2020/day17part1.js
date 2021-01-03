const input = `.#.
..#
###`

const stage = new Stage(document.body).d
const {scene, camera} = stage

const orbit = new THREE.OrbitControls(camera, document.body)
orbit.mouseButtons.LEFT = THREE.MOUSE.ROTATE
orbit.mouseButtons.MIDDLE = THREE.MOUSE.PAN
orbit.mouseButtons.RIGHT = THREE.MOUSE.ROTATE
orbit.touches.ONE = THREE.TOUCH.ROTATE
orbit.touches.TWO = THREE.TOUCH.DOLLY_ROTATE
orbit.enableKeys = false
orbit.enableDamping = true
orbit.panSpeed = 1.8
on.process(orbit.update)

document.addEventListener("touchstart", e => e.preventDefault(), {passive: false})
document.addEventListener("touchmove", e => e.preventDefault(), {passive: false})

const scale = 0.05
const geo = new THREE.BoxGeometry(1 * scale, 1 * scale, 1 * scale)
const mat = new THREE.MeshNormalMaterial()

const getKey = (x, y, z) => `${x},${y},${z}`
const readKey = (key) => key.split(",").map(v => v.as(Number))

const spaces = {}
const meshes = {}
const createSpace = (x, y, z, initial = true) => {
	const box = new THREE.Mesh(geo, mat)
	box.position.set(...[x, y, z].map(v => v * scale))
	box.visible = initial
	scene.add(box)
	const key = getKey(x, y, z)
	meshes[key] = box
	spaces[key] = initial
	return key
}

const $Space = (x, y, z) => {
	const key = getKey(x, y, z)
	let initial = spaces[key]
	if (initial === undefined) {
		createSpace(x, y, z, false)
		initial = false
	}
	return initial
}

const EW_SIZE = 1
const SITES = []
for (let x = -EW_SIZE; x <= EW_SIZE; x++) {
	for (let y = -EW_SIZE; y <= EW_SIZE; y++) {
		for (let z = -EW_SIZE; z <= EW_SIZE; z++) {
			if (x === 0 && y === 0 && z === 0) continue
			SITES.push([x, y, z])
		}
	}
}

const getNeighbours = (x, y, z) => {
	const neighbours = []
	for (const [dx, dy, dz] of SITES) {
		const [nx, ny, nz] = [x+dx, y+dy, z+dz]
		const neighbour = $Space(nx, ny, nz)
		neighbours.push(neighbour)
	}
	return neighbours
}

const initial = input.split("\n").map(r => r.split(""))
for (let y = 0; y < initial.length; y++) {
	const row = initial[y]
	for (let x = 0; x < row.length; x++) {
		const element = row[x]
		createSpace(x, y, 0, element === "#")
	}
}


on.keydown(e => {
	if (e.key === " ") {
		update()
	}
})

let t = 0
const update = async () => {
	
	t++
	const newSpaces = []
	
	// Make neighbours
	for (const key in spaces) {
		const [x, y, z] = readKey(key)
		getNeighbours(x, y, z)
	}
	
	for (const key in spaces) {
		const [x, y, z] = readKey(key)
		const state = spaces[key]
		const neighbours = getNeighbours(x, y, z)
		const score = neighbours.filter(v => v).length
		if (state) {
			if (score === 2 || score === 3) newSpaces[key] = true  
			else newSpaces[key] = false
		}
		else {
			if (score === 3) newSpaces[key] = true
			else newSpaces[key] = false
		}
	}
	
	let tally = 0
	for (const key in newSpaces) {
		const newSpace = newSpaces[key]
		spaces[key] = newSpace
		meshes[key].visible = newSpace
		if (newSpace) tally++
	}
	
	print(t, tally)
	
}

