* My-SQL setup

Set up database importing file "***auctionhouse.sql***" to MySql.

create user with access
```
CREATE USER 'student'@'localhost' IDENTIFIED WITH mysql_native_password BY 'SuperUJ';
grant all privileges on auctionhouse.* to 'student'@'localhost';
```

* Backend launch

install node environment and other dependencies
```
npm i
```
run server
```
node index.js
or
npm start
```

* React run

install React and other dependencies
```
npm i
```
run sever
```
npm start
```
