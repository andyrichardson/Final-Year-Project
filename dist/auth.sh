#!/bin/bash

# Help prompt
print_help(){
	echo "DEFAULT"
	printf "	Run container in release mode. \n\n"

	echo "ARGUMENTS"
	echo "	-d, --dev: Run container in development mode."
	echo "  -s, --standalone: Run container in standalone mode (port 80)"
	echo "	-h, --help: Print this help prompt."
}

# Run development container
run_dev(){
	# Build container
	docker build -t fyp-auth:dev -f dev/auth/Dockerfile .

	# Kill any previous containers
	docker rm fyp-auth-dev 1>& 2> /dev/null

	# Standalone mode - expose to host
	# if [[ "$1" == "-s" || "$1" == "--standalone" ]]; then
	#     echo "Notice: Standalone Mode Active"
	#     PORT_FLAG="-p 80:80"
	# fi

	# Run container
	docker run -t -i $PORT_FLAG \
	-v $PWD/../src/auth:/var/www/auth \
	--name=fyp-auth-dev \
	--net=fyp-network\
	fyp-auth:dev
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
