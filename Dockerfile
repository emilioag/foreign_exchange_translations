FROM debian
MAINTAINER Emilio Arevalillo Gonzalez "agonzalez.emilio@gmail.com"

RUN apt-get update
RUN apt-get install -y python3-requests
RUN apt-get install -y build-essential
RUN apt-get install -y python3-dev
RUN apt-get install -y python3-pip
RUN apt-get install -y python3-dateutil
RUN apt-get install -y curl
RUN apt-get install -y supervisor
RUN apt-get install -y postgresql-9.4 postgresql-client-9.4 postgresql-server-dev-9.4
RUN apt-get install -y node npm

RUN rm -rf /usr/sbin/node
RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN npm install -g gulp

ADD be/requirements.txt /tmp/requirements.txt
USER postgres
RUN /etc/init.d/postgresql start &&\
    psql --command "CREATE USER forein_user WITH SUPERUSER PASSWORD 'forein_user_pass';" &&\
    createdb -O forein_user test
USER root

ADD 00001_script.sql /tmp/00001_script.sql
RUN pip3 install -r /tmp/requirements.txt
RUN mkdir -p /data/db
RUN mkdir -p /var/log/supervisor
ADD supervisord.conf /etc/supervisor/conf.d/supervisord.conf
ADD startup.sh /tmp/startup.sh
RUN chmod 755 /tmp/startup.sh
RUN mkdir -p /var/www/foreinexchange
RUN chmod 755  /var/www/foreinexchange

VOLUME /var/www/foreinexchange
WORKDIR /var/www/foreinexchange

EXPOSE 80 8080

ENTRYPOINT /tmp/startup.sh
# CMD ln -s /proc/self/fd /dev/fd; /usr/bin/supervisord -n