sed -i '/local   all             postgres                                peer/c\local   all             postgres                                trust' /etc/postgresql/9.4/main/pg_hba.conf
/etc/init.d/postgresql start && psql -U postgres -W -d test -a -f /tmp/00001_script.sql
/usr/bin/supervisord -n