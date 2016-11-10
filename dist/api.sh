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
	docker build -t fyp-api:dev -f dev/api/Dockerfile .

	echo "here"
	# Kill any previous containers
	docker rm fyp-api-dev 2> /dev/null

	# Run container
	docker run -t -i -p 3000:80 \
	-v $PWD/../src/api/:/var/www/api \
	--name=fyp-api-dev \
	--net=fyp-network \
	fyp-api:dev
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
