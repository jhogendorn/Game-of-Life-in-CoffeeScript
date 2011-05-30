game = new GameOfLife(document.getElementById('board').getContext("2d"))

tng = () ->
	game.runGeneration()
	game.render()
	document.getElementById('info').innerHTML = "Generation: " + game.gen
	if game.checkStable() then clearInterval(interval)

game.render()
interval = setInterval(tng, 10)
