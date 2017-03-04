#!/bin/bash
CWD="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Help prompt
print_help(){
	echo "DEFAULT"
	printf "	Run container in release mode. \n\n"

	echo "ARGUMENTS"
	echo "	-d, --dev: Run container in development mode."
	echo "	-d, --test: Run container in test mode."
	echo "	-h, --help: Print this help prompt."
}

# Run development container
run_dev(){
  # Build container
  docker build -t fyp-neo4j:dev -f $CWD/dev/neo4j/Dockerfile $CWD

  # Kill any previous containers
  docker kill fyp-neo4j 1>& 2> /dev/null
  docker rm fyp-neo4j 1>& 2> /dev/null

  # Create neo4j folder
  mkdir $CWD/../neo4j/data -p

  # Run container
  docker run -p 7474:7474 -p 7687:7687\
  -v $CWD/../neo4j/data:/data \
  --name=fyp-neo4j \
  --net=fyp-network \
  fyp-neo4j:dev
}

# Run test container
run_test(){
  # Create database mount folder
  mkdir /tmp/neo4j-test

  # Build container
  docker build -t fyp-neo4j:test -f $CWD/test/neo4j/Dockerfile $CWD

  # Kill any previous containers
  docker kill fyp-neo4j 2> /dev/null
  docker rm fyp-neo4j 2> /dev/null

  # Run container
  docker run -d -p 7474:7474 -p 7687:7687 \
  -v /tmp/neo4j-test:/data \
  --name=fyp-neo4j \
  --net=fyp-network \
  fyp-neo4j:test
}

# Run release container
run_release(){
  # Build container
  docker build -t fyp-neo4j:release -f $CWD/release/neo4j/Dockerfile $CWD

  # Kill any previous containers
  docker kill fyp-neo4j 2> /dev/null
  docker rm fyp-neo4j 2> /dev/null

  # Run container
  docker run -d -p 7474:7474 -p 7687:7687\
  -v $HOME/neo4j/data:/data \
  -v $HOME/logs:/logs \
  --name=fyp-neo4j \
  --net=fyp-network \
  fyp-neo4j:release
}

# Cleanup temp files
run_cleanup(){
  docker kill fyp-neo4j 2> /dev/null
  docker rm fyp-neo4j 2> /dev/null
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
