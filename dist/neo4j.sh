#!/bin/bash
CWD="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

run_dev(){
  # Build container
  docker build -t neo4j:dev -f dev/neo4j/Dockerfile .

  # Kill any previous containers
  docker rm neo4j-dev 1>& 2> /dev/null

  # Create neo4j folder
  mkdir $PWD/../neo4j/data -p

  # Run container
  docker run -p 7474:7474 \
  -v $PWD/../neo4j/data:/data \
  --name=neo4j-dev \
  --net=fyp-network \
  neo4j:dev
}

run_test(){
  # Create database mount folder
  mkdir /tmp/neo4j-test

	# Build container
	docker build -t -d fyp-neo4j:test -f $CWD/release/neo4j/Dockerfile $CWD

	# Kill any previous containers
  docker kill fyp-neo4j-test 2> /dev/null
	docker rm fyp-neo4j-test 2> /dev/null

	# Run container
	docker run -d -p 7474:7474 \
	-v /tmp/neo4j-test:/data \
  --name=fyp-neo4j-test \
  --net=fyp-network \
  fyp-neo4j:test

	# Wait for container to initialize
  sleep 1m
}

run_cleanup(){
  docker kill fyp-neo4j-test 2> /dev/null
  docker rm fyp-neo4j-test 2> /dev/null
  rm -r /tmp/neo4j-test
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

  -c | --cleanup)
    run_cleanup
    ;;

	"")
		run_release
		;;

	*)
		echo "Command not found, please check flags"
		;;
esac
