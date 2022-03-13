* My-SQL setup

Set up database importing file "***database.sql***" to MySql.

create user with acces
```
CREATE USER 'student'@'localhost' IDENTIFIED WITH mysql_native_password BY 'SuperUJ';
grant all privileges on auctionhouse.* to 'student'@'localhost';
```

* Backend lauch

```
node index.js
```

* Front 

```
npm start
```
