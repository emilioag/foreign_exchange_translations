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

RUN apt-get install -y nginx-full
RUN apt-get install -y uwsgi-plugin-python3
RUN apt-get install -y uwsgi
RUN pip3 install virtualenv
RUN mkdir /opt/venv
RUN virtualenv /opt/venv/foreinexchange -p python3
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
RUN rm /etc/nginx/sites-enabled/default
ADD nginx_exchange /var/www/foreinexchange/nginx_exchange
ADD uwsgi_exchange.ini /var/www/foreinexchange/uwsgi_exchange.ini
RUN ln -s /var/www/foreinexchange/nginx_exchange /etc/nginx/sites-enabled/
RUN ln -s /var/www/foreinexchange/uwsgi_exchange.ini /etc/uwsgi/apps-enabled/

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
RUN /opt/venv/foreinexchange/bin/pip install -r /tmp/requirements.txt
RUN mkdir -p /data/db
RUN mkdir -p /var/log/supervisor
ADD supervisord.conf /etc/supervisor/conf.d/supervisord.conf
ADD startup.sh /tmp/startup.sh
RUN chmod 755 /tmp/startup.sh
RUN mkdir -p /var/www/foreinexchange/be
RUN mkdir -p /var/www/foreinexchange/fe
RUN chmod -R 755 /var/www/foreinexchange
ADD be /var/www/foreinexchange/be
ADD fe /var/www/foreinexchange/fe

VOLUME /var/www/foreinexchange
WORKDIR /var/www/foreinexchange

EXPOSE 80 8080

ENTRYPOINT /tmp/startup.sh
# CMD ln -s /proc/self/fd /dev/fd; /usr/bin/supervisord -n