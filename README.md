# foreign_exchange_translations

docker build -t forein .

docker run --name forein -d -p 8080:8080 -v forein_exchange:/var/www/foreinexchange forein

docker exec -it forein bash
