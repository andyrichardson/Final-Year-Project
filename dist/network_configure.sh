#!/bin/bash

# Add network bridge
brctl addbr fyp-bridge
ip addr add 192.168.1.1 dev fyp-bridge
ip link set dev fyp-bridge up

# Tell docker
echo 'DOCKER_OPTS="-b=fyp-bridge"' >> /etc/default/docker
docker network create fyp-network
