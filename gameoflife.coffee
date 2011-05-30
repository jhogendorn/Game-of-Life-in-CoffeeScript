class GameOfLife
	canvas: null		# CanvasRenderingContext2D object (We store it like this because its still possible to get the dom node out of it, which we use less)
	gen: 0				# Generation Counter
	genc: []			# Current Generation
	genn: []			# Next Generation
	genlog: []			# A JSON log of the last # generations to detect stability. JSON is used because its easier to compare than an two entire arrays, and its standard.
	history: 5			# How many generations to log (ie what size of oscillating pattern to detect)
	seedweight: 0.2		# 0 to 1 of density of life:death for initial random seed. 1 is complete life, 0 complete death. High densities are pointless, most cells die on second generation.
	grid:				# Size of the grid, in cells
		x: 50
		y: 50
	cell:				# Size of cells, in pixels
		w: 10
		h: 10
	# Provide a canvas element to draw to, optionally provide a starting seed
	constructor: (canvas, seed) -> 
		if not canvas.canvas? or not canvas.nodeName is "CANVAS" # We've either been given a CanvasRenderingContext2D, which has a .canvas property, or we've been given a canvas DOM node, which will have a nodeName
			throw "Game needs a canvas object or canvas DOM node"
		@canvas = if canvas.nodeName? then canvas.getContext("2d") else canvas
		if not seed?
			# generate initial seed.
			@genc = for x in [0...@grid.x]
				for y in [0...@grid.y]
					@seedweight > Math.random() 
		else
			@genc = seed
		@genn = @genc
	# Count the neighbours in the adjacent cells, uses toroidal rules to map the edges.
	_countNeighbours: (x, y) ->
		xp = if x + 1 > @grid.x - 1 then 0 else x + 1
		xm = if x - 1 < 0 then @grid.x - 1 else x - 1
		yp = if y + 1 > @grid.y - 1 then 0 else y + 1
		ym = if y - 1 < 0 then @grid.y - 1 else y - 1
		# {top left} {top} {top right} {left} {right} {bottom left} {bottom} {bottom right}
		@genc[xm][ym] + @genc[x][ym] + @genc[xp][ym] + @genc[xm][y] + @genc[xp][y] + @genc[xm][yp] + @genc[x][yp] + @genc[xp][yp]
	# Get the new state for any given cell
	_getState: (x, y) ->
		cell = @genc[x][y]
		pop = @_countNeighbours(x, y)
		# Standard rules for survival
		if cell and pop < 2 then return false
		if cell and 2 <= pop <= 3 then return true
		if cell and pop > 3 then return false
		if not cell and pop is 3 then return true
		false
	# Iterate over the next array and get the new state for each cell
	runGeneration: () ->
		@genn = for x in [0...@grid.x]
			for y in [0...@grid.y]
				@_getState(x, y)
		@_rotateGenerations()
		@genc = @genn
		@gen++
	# Rotate the history log by popping off the old and unshifting in the new
	_rotateGenerations: () ->
		if @genlog.length > @history then @genlog.pop()
		@genlog.unshift(JSON.stringify(@genn))
	# Check for stability in the last @history generations by matching the log against the current generation.
	checkStable: () ->
		genc = JSON.stringify(@genc)
		for key, gen of @genlog
			if gen is genc and key > 0 then return true
		return false
	# Make sure our canvas is appropriately sized, also used for clearing a canvas pre render
	_sizeCanvas: () ->
		# Use the attributes because using the css means the canvas stretches.
		@canvas.canvas.width = @grid.x * @cell.w
		@canvas.canvas.height = @grid.y * @cell.h
		return true
	# Render the current generation the the canvas element
	render: () ->
		@_sizeCanvas()
		for x in [0...@grid.x]
			for y in [0...@grid.y]
				@canvas.fillStyle = if @genc[x][y] then "black" else "white"
				@canvas.fillRect(x * @cell.w, y * @cell.h, @cell.w, @cell.h)
		return true
