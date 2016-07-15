CREATE TABLE exchange (
    id                  varchar(9),
    sell_currency       varchar(3),
    sell_amount         double precision,
    buy_currency        varchar(3),
    buy_amount          double precision,
    rate                double precision,
    date_booked         timestamp,
    CONSTRAINT id_exchange PRIMARY KEY(id)
);