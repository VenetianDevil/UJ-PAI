* My-SQL setup

Set up database importing file "***auctionhouse.sql***" to MySql.

create user with access
```
CREATE USER 'student'@'localhost' IDENTIFIED WITH mysql_native_password BY 'SuperUJ';
grant all privileges on auctionhouse.* to 'student'@'localhost';
```

* Backend launch

```
node index.js
```

* Front 

```
npm start
```
