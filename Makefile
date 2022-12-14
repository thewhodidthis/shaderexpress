js/watch:
	deno bundle --import-map=imports.json example.js --watch --unstable bundle.js
js:
	deno bundle --import-map=imports.json example.js | \
		esbuild --bundle --minify --sourcefile=main.js --outfile=bundle.js
js/lint:
	deno lint main.js shader.js
