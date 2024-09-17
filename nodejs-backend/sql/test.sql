delete from users where username = 'jdoe';
insert into users (username, name, email, password) values ('jdoe','John Doe', 'j.d@test.com', '123456');
select * from users;
drop table if EXISTS new_items;
CREATE TABLE new_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL
);
delete from new_items;
DROP TABLE if EXISTS items ;
ALTER TABLE new_items RENAME TO items;
insert into items (name, description, image ,price, category) values ('good1', 'good1 description', '', 10, 'category1');
insert into items (name, description, image ,price, category) values ('good2', 'good2 description', '', 20, 'category1');
insert into items (name, description, image ,price, category) values ('good3', 'good3 description', '', 30, 'category1');
insert into items (name, description, image ,price, category) values ('service1', 'service1 description', '', 50, 'category2');
insert into items (name, description, image ,price, category) values ('service2', 'service2 description', '', 5, 'category2');
insert into items (name, description, image ,price, category) values ('service3', 'service3 description', '', 25, 'category2');

-- change table user items
DROP TABLE if EXISTS user_items ;
CREATE TABLE user_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL
);
