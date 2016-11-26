#!/bin/bash
CWD="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

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
	docker build -t fyp-web:dev -f $CWD/dev/web/Dockerfile $CWD

	# Kill any previous containers
	docker kill fyp-web 2> /dev/null
	docker rm fyp-web 2> /dev/null

	# Run container
	docker run -t -i -p 80:80 \
	-v $CWD/../src/web/:/var/www/web \
	--name=fyp-web \
	--net=fyp-network \
	fyp-web:dev
}

# Run test container
run_test(){
	# Build container
	docker build -t fyp-web:test -f $CWD/release/web/Dockerfile $CWD

	# Kill any previous containers
	docker kill fyp-web 2> /dev/null
	docker rm fyp-web 2> /dev/null

	# Run container
	docker run -d -p 80:80 \
	-v $CWD/../src/web:/var/www/web \
	--name=fyp-web \
	--net=fyp-network \
	fyp-web:test
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

	-t | --test)
		run_test
		;;

	"")
		run_release
		;;

	*)

		echo "Command not found, please check flags"
		;;
esac
