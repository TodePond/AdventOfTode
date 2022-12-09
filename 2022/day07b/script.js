const input = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`

const lines = input.split("\n")

const terms = Term.hoist(
	({
		line,
		input,
		command,
		listCommand,
		directoryCommand,
		output,
		directoryOutput,
		fileOutput,
		size,
		number,
		name,
		fileName,
		directoryName,
		fileExtension,
	}) => {
		return {
			line: Term.or([input, output]),
			input: Term.emit(Term.list([Term.string("$ "), command]), ([_, v]) => v),
			output: Term.or([directoryOutput, fileOutput]),

			directoryOutput: Term.emit(Term.list([Term.string("dir "), directoryName]), ([dir, v]) => {
				return _({
					type: "directory",
					name: v,
				})
			}),
			fileOutput: Term.emit(Term.list([size, fileName]), ([s, v]) => {
				return _({
					type: "file",
					name: v,
					size: s,
				})
			}),

			size: Term.emit(Term.list([number, Term.string(" ")]), ([v, _]) => v),
			number: Term.emit(Term.regExp(/[0-9]+/), (v) => parseInt(v)),

			name: Term.regExp(/[a-z]+/),
			fileName: Term.emit(Term.list([name, Term.maybe(fileExtension)]), ([v]) => v),
			fileExtension: Term.emit(Term.list([Term.string("."), name]), ([_, v]) => v),

			directoryName: Term.or([name, Term.string(".."), Term.string("/")]),

			command: Term.or([listCommand, directoryCommand]),
			listCommand: Term.emit(Term.string("ls"), () => _({ type: "list" })),
			directoryCommand: Term.emit(Term.list([Term.string("cd "), directoryName]), ([cd, v]) => {
				return _({
					type: "current directory",
					name: v,
				})
			}),
		}
	},
)

const instructions = lines.map((line) => terms.line.translate(line)).map((line) => JSON.parse(line)[0]).d

const executeInstructions = (instructions) => {
	let path = [""]
	const directorySizes = new Map()

	for (const instruction of instructions) {
		if (instruction.type === "current directory") {
			if (instruction.name === "..") {
				path.pop()
			} else if (instruction.name === "/") {
				path = [""]
			} else {
				path.push(instruction.name)
			}
		} else if (instruction.type === "file") {
			for (let i = 0; i < path.length; i++) {
				const directory = path.slice(0, i + 1).join("/")
				const size = directorySizes.get(directory) || 0
				const newSize = size + instruction.size
				directorySizes.set(directory, newSize)
			}
		}
	}

	return directorySizes
}

const directories = executeInstructions(instructions).d

const usedSpace = directories.get("")
const unusedSpace = 70000000 - usedSpace
const extraSpaceNeeded = 30000000 - unusedSpace

print("used space:", usedSpace)
print("unused space:", unusedSpace)
print("extra space needed:", extraSpaceNeeded)

const candidates = [...directories].filter(([_, size]) => size > extraSpaceNeeded).sort((a, b) => a[1] - b[1]).d
print("answer:", candidates[0][0], "size:", candidates[0][1])
