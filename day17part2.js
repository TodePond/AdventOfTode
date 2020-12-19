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

const getKey = (x, y, z, w) => `${x},${y},${z},${w}`
const readKey = (key) => key.split(",").map(v => v.as(Number))

const spaces = {}
const meshes = {}
const createSpace = (x, y, z, w, initial = true) => {
	const box = w === 0? new THREE.Mesh(geo, mat) : {position: {set() {}}}
	if (w === 0) scene.add(box)
	box.position.set(...[x, y, z, w].map(v => v * scale))
	box.visible = initial
	const key = getKey(x, y, z, w)
	meshes[key] = box
	spaces[key] = initial
	return key
}

const $Space = (x, y, z, w) => {
	const key = getKey(x, y, z, w)
	let initial = spaces[key]
	if (initial === undefined) {
		createSpace(x, y, z, w, false)
		initial = false
	}
	return initial
}

const EW_SIZE = 1
const SITES = []
for (let x = -EW_SIZE; x <= EW_SIZE; x++) {
	for (let y = -EW_SIZE; y <= EW_SIZE; y++) {
		for (let z = -EW_SIZE; z <= EW_SIZE; z++) {
			for (let w = -EW_SIZE; w <= EW_SIZE; w++) {
				if (x === 0 && y === 0 && z === 0 && w === 0) continue
				SITES.push([x, y, z, w])
			}
		}
	}
}

const getNeighbours = (x, y, z, w) => {
	const neighbours = []
	for (const [dx, dy, dz, dw] of SITES) {
		const [nx, ny, nz, nw] = [x+dx, y+dy, z+dz, w+dw]
		const neighbour = $Space(nx, ny, nz, nw)
		neighbours.push(neighbour)
	}
	return neighbours
}

const initial = input.split("\n").map(r => r.split(""))
for (let y = 0; y < initial.length; y++) {
	const row = initial[y]
	for (let x = 0; x < row.length; x++) {
		const element = row[x]
		createSpace(x, y, 0, 0, element === "#")
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
		const [x, y, z, w] = readKey(key)
		getNeighbours(x, y, z, w)
	}
	
	for (const key in spaces) {
		const [x, y, z, w] = readKey(key)
		const state = spaces[key]
		const neighbours = getNeighbours(x, y, z, w)
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
		const mesh = meshes[key]
		mesh.visible = newSpace
		if (newSpace) tally++
		const w = readKey(key)[3]
		if (w !== 0) mesh.visible = false
	}
	
	print(t, tally)
	
}

