const Show = {}

Show.start = ({interval = 1000 / 60, tick = () => {}, overload = 1} = {}) => {
	
	document.body.style["margin"] = "0px"
	document.body.style["overflow"] = "hidden"
	document.body.style["background-color"] = Colour.Black

	const canvas = document.createElement("canvas")
	const context = canvas.getContext("2d")
	canvas.style["margin"] = "0px"
	canvas.style["background-color"] = Colour.Black
	document.body.appendChild(canvas)
	
	on.resize(() => {
		canvas.width = innerWidth
		canvas.height = innerHeight
		canvas.style["width"] = canvas.width
		canvas.style["height"] = canvas.height
	})
	
	trigger("resize")
	
	const show = {canvas, context, interval, tick}
	
	let previousInterval = interval
	
	const wrappedTick = () => {
		
		// Interval changed
		if (show.interval !== previousInterval) {
			clearInterval(show.id)
			show.id = setInterval(wrappedTick, show.interval)
			previousTick = show.interval
		}
		
		for (let i = 0; i < show.overload; i++) show.tick()
		
	}
	
	show.id = setInterval(wrappedTick, interval)
	
	
	return show
	
}