const input = `mjqjpqmgbljsphdztnvjfqwrcgsmlb`

const indexOfMarker = (input) => {
	let buffer = []
	for (let i = 0; i < input.length; i++) {
		const character = input[i]

		if (buffer.length < 14) {
			buffer.push(character)
		} else {
			buffer.shift()
			buffer.push(character)
		}

		if (buffer.length < 14) {
			continue
		}

		if (new Set(buffer).size === 14) {
			return i + 1
		}
	}
}

indexOfMarker(input).d
