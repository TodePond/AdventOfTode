
// Most TERM functions follow this structure
// They expect an input, and return an object with four properties
// (input) => {success, source, head, tail, output}

TERM = {}

{
	//======//
	// Meta //
	//======//
	TERM.succeed = ({tail, source, output, term, args}, child) => ({
		success: true,
		tail,
		source,
		output,
		term,
		child,
		args,
		toString() { return this.output },
	})
	
	TERM.fail = ({tail, source, output, term, args}, child) => ({
		success: false,
		tail,
		source,
		output,
		term,
		child,
		args,
		toString() { return this.output },
	})
	
	//===========//
	// Primitive //
	//===========//	
	TERM.string = (string) => {
		const self = (input, args) => {
			const success = input.slice(0, string.length) == string
			if (success) {
				const tail = input.slice(string.length)
				const source = string
				const output = string
				return TERM.succeed({tail, source, output, args, term: self})
			}
			return TERM.fail({tail: input, args, term: self})
		}
		self.string = string
		return self
	}
	
	TERM.regexp = TERM.regExp = TERM.regex = TERM.regEx = (regexp) => {
		const self = (input, args) => {
			const fullRegex = new RegExp("^" + regexp.source + "$")
			let i = 0
			while (i <= input.length) {
				const source = input.slice(0, i)
				const success = fullRegex.test(source)
				if (success) {
					const tail = input.slice(source.length)
					const output = source
					return TERM.succeed({tail, source, args, output, term: self})
				}
				i++
			}
			return TERM.fail({tail: input, args, term: self})
		}
		self.regexp = regexp
		return self
	}
	
	//=========//
	// Control //
	//=========//
	TERM.emit = (term, func) => {
		const self = (input, args) => {
			const result = term(input, args)
			if (result.success) {
				const {tail, source} = result
				const output = result.child === undefined? func(result) : func(result.child)
				result.output = output
				return TERM.succeed({tail, source, args, output, term: self}, result)
			}
			return TERM.fail({tail: input, args, term: self})
		}
		self.term = term
		self.func = func
		return self
	}
	
	TERM.many = (term) => {
		const self = (input, args) => {
		
			const headResult = term(input, args)
			if (!headResult.success) {
				const tail = input
				const {source, output} = headResult
				const child = [headResult]
				child.tail = input
				child.term = self
				child.output = output
				child.source = source
				return TERM.fail({tail, source, args, output, term: self}, child)
			}
			
			const tailResult = TERM.many(term, args)(headResult.tail)
			if (!tailResult.success) {
				const {tail, source, output} = headResult
				const child = [headResult]
				child.tail = tail
				child.source = source
				child.output = output
				child.term = self
				return TERM.succeed({tail, args, source, output, term: self}, child)
			}
			
			const tail = tailResult.tail
			const source = `${headResult.source}${tailResult.source}`
			const output = `${headResult.output}${tailResult.output}`
			const child = [headResult, ...tailResult.child]
			child.source = source
			child.tail = tail
			child.output = output
			child.term = self
			return TERM.succeed({tail, source, args, output, term: self}, child)
		}
		self.term = term
		return self
	}
	
	TERM.maybe = (term) => {
		const self = (input, args) => {
			const result = term(input, args)
			const tail = result.tail
			const source = result.source === undefined? "" : result.source
			const output = result.output === undefined? "" : result.output
			return TERM.succeed({tail, source, args, output, term: self}, result)
		}
		self.term = term
		return self
	}
	
	TERM.list = (terms) => {
		const self = (input, args) => {
		
			const headResult = terms[0](input, args)
			if (!headResult.success) {
				const tail = input
				const {source, output} = headResult
				const child = [headResult]
				child.tail = tail
				child.source = source
				child.output = output
				child.term = self
				return TERM.fail({tail, source, args, output, term: self}, child)
			}
			
			if (terms.length <= 1) {
				const {tail, source, output} = headResult
				const child = [headResult]
				child.tail = tail
				child.source = source
				child.output = output
				child.term = self
				return TERM.succeed({tail, source, args, output, term: self}, child)
			}
			
			const tailResult = TERM.list(terms.slice(1))(headResult.tail, args)
			if (!tailResult.success) {
				const tail = input
				const source = headResult.source + (tailResult.source === undefined? "" : tailResult.source)
				const output = headResult.output + (tailResult.output === undefined? "" : tailResult.output)
				const child = [headResult, ...tailResult.child]
				child.source = source
				child.term = self
				child.tail = tail
				child.output = output
				return TERM.fail({tail, source, args, output, term: self}, child)
			}
			
			const tail = tailResult.tail
			const source = `${headResult.source}${tailResult.source}`
			const output = `${headResult.output}${tailResult.output}`
			const child = [headResult, ...tailResult.child]
			child.tail = tail
			child.source = source
			child.output = output
			child.term = self
			return TERM.succeed({tail, source, args, output, term: self}, child)
			
		}
		self.terms = terms
		return self
	}
	
	TERM.or = (terms) => {
		const self = (input, args = {exceptions: []}) => {
			const children = []
			const {exceptions} = args
			for (const term of terms) {
				if (exceptions.includes(term)) continue
				const result = term(input, args)
				children.push(result)
				if (result.success) {
					const {tail, source, output} = result
					children.tail = tail
					children.source = source
					children.output = output
					children.term = self
					return TERM.succeed({tail, args, source, output, term: self}, children)
				}
			}
			children.term = self
			children.source = undefined
			children.output = undefined
			children.tail = input
			return TERM.fail({tail: input, args, term: self}, children)
		}
		self.terms = terms
		return self
	}
	
	TERM.EOF = TERM.eof = TERM.endOfFile = (input, args) => {
		if (input.length === 0) {
			return TERM.succeed({term: TERM.eof, args, source: "", output: ""})
		}
		return TERM.fail({term: TERM.eof, args})
	}
	
	TERM.orExcept = (orTerm, exception) => {
		return (input, args = {}) => orTerm(input, {...args, exceptions: [...args.exceptions, exception]})
	}
	
	TERM.orNoExcept = (orTerm) => {
		return (input, args = {}) => orTerm(input, {...args, exceptions: []})
	}
	
	//=======//
	// Terms //
	//=======//	
	TERM.cache = {}
	TERM.term = (name) => {
		if (TERM.cache[name] !== undefined) return TERM.cache[name]
		
		const func = (...args) => {
			const term = TERM[name]
			if (term === undefined) throw new Error(`[Term.js] Unrecognised term: '${name}'`)
			return TERM[name](...args)
		}
		func._.terms.get = () => TERM[name] === undefined? undefined : TERM[name].terms
		func._.term.get = () => TERM[name] === undefined? undefined : TERM[name].term
		func._.func.get = () => TERM[name] === undefined? undefined : TERM[name].func
		func._.regexp.get = () => TERM[name] === undefined? undefined : TERM[name].regexp
		func._.string.get = () => TERM[name] === undefined? undefined : TERM[name].string
		func._.ref.get = () => TERM[name]
		TERM.cache[name] = func
		return func
	}
	
	//====================//
	// In-Built Functions //
	//====================//
	TERM.anything = TERM.string("")
	TERM.space = TERM.string(" ")
	TERM.tab = TERM.string("	")
	TERM.newline = TERM.newLine = TERM.string("\n")
	
	TERM.gap = TERM.many(
		TERM.or([
			TERM.space,
			TERM.tab,
		])
	)
	
	TERM.ws = TERM.whitespace = TERM.whiteSpace = TERM.many(
		TERM.or([
			TERM.space,
			TERM.tab,
			TERM.newline,
		])
	)
	
	TERM.name = TERM.list ([
		TERM.regexp(/[a-zA-Z_$]/),
		TERM.many(TERM.regexp(/[a-zA-Z0-9_$]/))
	])
	
	TERM.margin = TERM.or([
		TERM.many(TERM.tab),
		TERM.many(TERM.space),
	])
	
	TERM.line = TERM.many(TERM.regexp(/[^\n]/))
	
}