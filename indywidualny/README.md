# Setup

* My-SQL setup

Set up database importing file "***auctionhouse.sql***" to MySql.

create user with access
```
CREATE USER 'student'@'localhost' IDENTIFIED WITH mysql_native_password BY 'SuperUJ';
grant all privileges on auctionhouse.* to 'student'@'localhost';
```

* Backend

install node environment and other dependencies
```
cd server && npm i
```

* React

install React and other dependencies
```
npm i
```
---
Bug that can occur:
```
npm WARN read-shrinkwrap This version of npm is compatible with lockfileVersion@1, but package-lock.json was generated for lockfileVersion@2. I'll try to do my best with it!
npm ERR! Cannot read property 'match' of undefined
```
Fix:
```
sudo rm -rf node_modules package-lock.json && npm install
```

# Run develop

* 1 terminal - react (http://localhost:3000/)
```
npm start-client
```

* 2 terminal - backend (http://localhost:3001/)
```
cd server && npm start
```

# Run app with build
```
npm start
```

http://localhost:3001/

# Example accounts
admin account
login: Karolina
pass: admin

user account
login: Tomek
pass: tom