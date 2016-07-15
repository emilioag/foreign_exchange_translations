from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DBUSER = "forein_user"
DBPASS = "forein_user_pass"
DBHOST = "localhost"
DBNAME = "test"


class PostgreSQL:
    class __PostgreSQL:
        def __init__(self, db):
            engine = create_engine(
                'postgresql://{0}:{1}@{2}/{3}'.format(
                    DBUSER, DBPASS, DBHOST, db))
            Session = sessionmaker(bind=engine)
            self.session = Session()

        def __str__(self):
            return repr(self) + self.val
    instance = None

    def __init__(self, db):
        if not PostgreSQL.instance:
            PostgreSQL.instance = PostgreSQL.__PostgreSQL(db)

    def __getattr__(self, name):
        return getattr(self.instance, name)
