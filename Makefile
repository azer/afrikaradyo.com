compile:
	@elm-make src/Main.elm --output public/bundle.js
	@uglifyjs public/bundle.js > public/bundle.min.js

deploy:
	@cd public && scp -r . root@afrikaradyo.com:/var/www/html/.

watch:
	@yolo -i src -c "make compile"
