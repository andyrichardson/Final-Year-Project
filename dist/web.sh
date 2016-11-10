#!/bin/bash

# Help prompt
print_help(){
	echo "DEFAULT"
	printf "	Run container in release mode. \n\n"

	echo "ARGUMENTS"
	echo "	-d, --dev: Run container in development mode."
	echo "	-h, --help: Print this help prompt."
}

# Run development container
run_dev(){
	# Build container
	docker build -t fyp-web:dev -f dev/web/Dockerfile .

	echo "here"
	# Kill any previous containers
	docker rm fyp-web-dev 2> /dev/null

	# Run container
	docker run -t -i -p 80:80 \
	-v $PWD/../src/web/:/var/www/web \
	--name=fyp-web-dev \
	--net=fyp-network \
	fyp-web:dev
}

# Run release container
run_release(){
	echo "release is not configured"
}



case $1 in
	-h | --help)
		print_help
		;;

	-d | --dev)
		run_dev
		;;

	"")
		run_release
		;;

	*)

		echo "Command not found, please check flags"
		;;
esac
