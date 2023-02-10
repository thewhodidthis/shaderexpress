bundle: rollup dprint
rollup:
	rollup main.js --format iife --file sexpress.js --name sexpress
dprint:
	dprint fmt sexpress.js
