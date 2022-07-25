
#!/bin/bash

DELAY=10

docker-compose --file kafka-docker-compose.yml down
# docker rm -f $(docker ps -a -q)
# docker volume rm $(docker volume ls -q)

docker-compose --file kafka-docker-compose.yml up -d

echo "****** Waiting for ${DELAY} seconds for containers to go up ******"
sleep $DELAY