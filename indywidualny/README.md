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

Bug that can occur:
```
npm WARN read-shrinkwrap This version of npm is compatible with lockfileVersion@1, but package-lock.json was generated for lockfileVersion@2. I'll try to do my best with it!
npm ERR! Cannot read property 'match' of undefined
```
Fix:
```
sudo rm -rf node_modules package-lock.json && npm install
```