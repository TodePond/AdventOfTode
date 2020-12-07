const MotherTode = ([input]) => {
	const result = TERM._MotherTode(input)
	const source = result.output
	const program = new Function(source)
	//print(source)
	program()
	return source
}

TERM._MotherTode = TERM.emit(
	TERM.list([
		TERM.maybe(TERM.whitespace),
		TERM.emit(TERM.maybe(TERM.term("_Expression")), (expression) => expression.output),
		TERM.maybe(TERM.whitespace),
		TERM.eof,
	]),
	([ws, expression]) => expression.output,
)

TERM._Expression = TERM.or([
	TERM.term("_TermDefinition"),
])

TERM._TermDefinition = TERM.or([
	TERM.term("_TermCommaOperation"),
	TERM.term("_TermNewlineOperation"),
	TERM.term("_TermLiteral"),
])

TERM._TermLiteral = TERM.emit(
	TERM.list([
		TERM.term("_TermName"),
		TERM.maybe(TERM.gap),
		TERM.term("_Pattern"),
	]),
	([termName, gap, pattern]) => `TERM.${termName.output} = ${pattern.output}`,
)

TERM._Pattern = TERM.or([
	TERM.term("_InputOutput"),
	TERM.term("_InputOutputBlock"),
	TERM.term("_Input"),
	TERM.term("_OutputOnly"),
])

TERM._OutputOnly = TERM.emit(
	TERM.term("_Output"),
	(javascript) => `TERM.emit(\n	TERM.anything,\n	${javascript.output}\n)`
)

TERM._InputOutputBlock = TERM.emit(
	TERM.list([
		TERM.string("("),
		TERM.newline,
		TERM.maybe(TERM.gap),
		TERM.term("_Input"),
		TERM.maybe(TERM.gap),
		TERM.maybe(TERM.newline),
		TERM.maybe(TERM.gap),
		TERM.term("_Output"),
		TERM.maybe(TERM.gap),
		TERM.newline,
		TERM.maybe(TERM.gap),
		TERM.string(")"),
	]),
	([b1, nl1, g1, input, g2, nl2, g3, output]) => `TERM.emit(\n	${input.output},\n	${output.output}\n)`,
)

TERM._InputOutput = TERM.emit(
	TERM.list([
		TERM.term("_Input"),
		TERM.maybe(TERM.gap),
		TERM.term("_Output"),
	]),
	([input, gap, output]) => `TERM.emit(\n	${input.output},\n	${output.output}\n)`,
)

TERM._Output = TERM.emit(
	TERM.list([
		TERM.string(">>"),
		TERM.maybe(TERM.gap),
		TERM.term("_JavaScript"),
	]),
	([_, gap, javascript]) => javascript.output,
)

TERM._JavaScript = TERM.list([
	TERM.line,
])

TERM._Input = TERM.emit(
	TERM.list([
		TERM.string("::"),
		TERM.maybe(TERM.gap),
		TERM.term("_Part"),
	]),
	([_, gap, part]) => `TERM.list([\n	${part.output}\n])`
)

TERM._Part = TERM.or([
	TERM.term("_Parts"),
	TERM.term("_PartOrOperator"),
	TERM.term("_PartExcept"),
	TERM.term("_PartMany"),
	TERM.term("_PartMaybeQuestion"),
	TERM.term("_PartsGroupSingle"),
	TERM.term("_PartsGroupMulti"),
	TERM.term("_StringLiteral"),
	TERM.term("_StringLiteralSingleQuotes"),
	TERM.term("_RegexLiteral"),
	TERM.term("_PartNameLiteral"),
])

TERM._PartMany = TERM.emit(
	TERM.list([
		TERM.orExcept(TERM.term("_Part"), TERM.term("_PartMany")),
		TERM.maybe(TERM.gap),
		TERM.string("+"),
	]),
	([part]) => `TERM.many(${part.output})`,
)

TERM._PartMaybeQuestion = TERM.emit(
	TERM.list([
		TERM.orExcept(TERM.term("_Part"), TERM.term("_PartMaybeQuestion")),
		TERM.maybe(TERM.gap),
		TERM.string("?"),
	]),
	([part]) => `TERM.maybe(${part.output})`,
)

TERM._Parts = TERM.emit(
	TERM.list([
		TERM.orExcept(TERM.term("_Part"), TERM.term("_Parts")),
		TERM.maybe(TERM.gap),
		TERM.term("_Part"),
	]),
	([left, _, right]) => `${left.output},\n	${right.output}`
)

TERM._PartOrOperator = TERM.emit(
	TERM.list([
		TERM.orExcept(TERM.term("_Part"), TERM.term("_PartOrOperator")),
		TERM.maybe(TERM.gap),
		TERM.string("|"),
		TERM.maybe(TERM.gap),
		TERM.term("_Part"),
	]),
	([left, g1, op, g2, right]) => `TERM.or([\n	${left.output},\n	${right.output}\n])`
)

TERM._PartExcept = TERM.emit(
	TERM.list([
		TERM.orExcept(TERM.term("_Part"), TERM.term("_PartExcept")),
		TERM.maybe(TERM.gap),
		TERM.string("except"),
		TERM.maybe(TERM.gap),
		TERM.term("_Part"),
	]),
	([left, g1, op, g2, right]) => `TERM.orExcept(\n	${left.output},\n	${right.output}\n)`
)

TERM._PartsGroupSingle = TERM.emit(
	TERM.list([
		TERM.string("("),
		TERM.maybe(TERM.gap),
		TERM.term("_Part"),
		TERM.maybe(TERM.gap),
		TERM.string(")"),
	]),
	([b, _, part]) => `TERM.list([\n	${part.output}\n])`,
)

TERM._PartsGroupMulti = TERM.emit(
	TERM.list([
		TERM.string("("),
		TERM.maybe(TERM.gap),
		TERM.newline,
		TERM.maybe(TERM.gap),
		TERM.term("_PartGroupMultiInner"),
		TERM.maybe(TERM.gap),
		TERM.newline,
		TERM.maybe(TERM.gap),
		TERM.string(")"),
	]),
	([b, g1, nl, g2, part]) => `TERM.list([\n	${part.output}\n])`,
)

TERM._PartGroupMultiInner = TERM.or([
	TERM.term("_PartGroupMultiInners"),
	TERM.term("_Part"),
])

TERM._PartGroupMultiInners = TERM.emit(
	TERM.list([
		TERM.orExcept(TERM.term("_PartGroupMultiInner"), TERM.term("_PartGroupMultiInners")),
		TERM.maybe(TERM.gap),
		TERM.newline,
		TERM.maybe(TERM.gap),
		TERM.term("_PartGroupMultiInner"),
	]),
	([left, g1, nl, g2, right]) => `${left.output},\n	${right.output}`,
)

TERM._StringLiteral = TERM.emit(
	TERM.list([
		TERM.string('"'),
		TERM.maybe(TERM.many(TERM.regexp(/[^"]/))),
		TERM.string('"'),
	]),
	([_, inner]) => `TERM.string(\`${inner.output}\`)`
)

TERM._StringLiteralSingleQuotes = TERM.emit(
	TERM.list([
		TERM.string("'"),
		TERM.maybe(TERM.many(TERM.regexp(/[^']/))),
		TERM.string("'"),
	]),
	([_, inner]) => `TERM.string(\`${inner.output}\`)`
)

TERM._RegexLiteral = TERM.emit(
	TERM.list([
		TERM.string('/'),
		TERM.maybe(TERM.many(TERM.regexp(/[^/]/))),
		TERM.string('/'),
	]),
	(regexp) => `TERM.regexp(${regexp.output})`
)

TERM._PartNameLiteral = TERM.emit(
	TERM.term("_PartName"),
	(name) => `TERM.term("${name.output}")`,
)

TERM._PartName = TERM.list([
	TERM.regexp(/[a-zA-Z_]/),
	TERM.maybe(TERM.many(TERM.regexp(/[_a-zA-Z]/))),
])

TERM._TermName = TERM.list([
	TERM.regexp(/[A-Z_]/),
	TERM.maybe(TERM.many(TERM.regexp(/[_a-zA-Z]/))),
])

TERM._TermCommaOperation = TERM.emit(
	TERM.list([
		TERM.orExcept(TERM.term("_TermDefinition"), TERM.term("_TermCommaOperation")),
		TERM.maybe(TERM.gap),
		TERM.string(","),
		TERM.maybe(TERM.gap),
		TERM.term("_TermDefinition"),
	]),
	([left, g1, c, g2, right]) => `${left.output}\n${right.output}`
)

TERM._TermNewlineOperation = TERM.emit(
	TERM.list([
		TERM.orExcept(TERM.term("_TermDefinition"), TERM.term("_TermNewlineOperation")),
		TERM.maybe(TERM.gap),
		TERM.string("\n"),
		TERM.maybe(TERM.gap),
		TERM.term("_TermDefinition"),
	]),
	([left, g1, nl, g2, right]) => `${left.output}\n${right.output}`
)
