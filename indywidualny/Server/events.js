const express = require('express');
const jwt = require('jsonwebtoken');

function createRouter(db) {
  const router = express.Router();

  router.post('/api/register', (req, res) => {

    db.query(
      'INSERT INTO user (username, password) VALUES (?, ?)',
      [req.body.username, req.body.password],
      (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ status: 500, message: "Couldn't create account user" });
        } else {
          db.query(
            'SELECT id_user, is_admin, name FROM user where name=? and password=?',
            [req.body.username, req.body.password],
            (error, result) => {
              if (error) {
                console.error(error);
                res.status(500).json({ status: 500, message: 'No matching user ' });
              } else {
                const token = jwt.sign({ id: result[0].id }, 'the-super-strong-secrect', { expiresIn: '1h' });
                res.status(200).json({ data: result, token, status: 200 });
              }
            }
          )
        }
      }
    );
  })

  router.post('/api/login', (req, res) => {

    db.query(
      'SELECT * FROM user where username=?',
      [req.body.username],
      (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ status: 500, message: 'No matching user with given name' });
        } else {
          console.log(result[0].password, req.body.password);
          console.log(result[0].password == req.body.password);
          if(result[0].password == req.body.password){
            const token = jwt.sign({ id: result[0].id }, 'the-super-strong-secrect', { expiresIn: '1h' });
            res.status(200).json({ data: result, token, status: 200 });            
          } else {
            res.status(401).json({ status: 401, message: "Wrong password! "});
          }
        }
      }
    );
  })

  router.post('/api/logout', (req, res) => {
    res.status(200).json({ status: 200, message: "logOut - Front, I cannot do that, just clear user's cookies"});            
    // console.log("logOut - Front, I cannot do that, just clear user's cookies");
  });

  function verifyToken(req, res, next) {
    // console.log(req.headers['authorization'])
    const bearerHeader = req.headers['authorization'];
    // console.log(req);
    if (bearerHeader) {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      // console.log('token', bearerToken)

      const user = jwt.verify(bearerToken, 'the-super-strong-secrect');

      if(!!user){
        req.user = user;
        next();
      }
      else{
        res.status(401).json({status: 401, message: 'Twoja sesja wygasła &#129320'});
      }
    }
    else {
      res.status(403).json({status: 403, message: 'Tak bez tokena prosisz?'});
      // res.status(403).json({status: 403, message: 'Błąd autoryzacji! Nie masz dostępu do rządanych treści!'})
    }

  }

  // router.get('/api/users', verifyToken, (req, res, next) => {
  //   db.query(
  //     'SELECT * FROM user',
  //     (error, result) => {
  //       if (error) {
  //         console.error(error);
  //         res.status(500).json({ status: 500, message: 'Cannot access ' });
  //       } else {
  //         console.log('restult', result)
  //         res.status(200).json({ data: result, status: 200 });
  //       }
  //     }
  //   );
  // });

  router.get('/api/offers_active', (req, res, next) => {
    db.query(
      'SELECT * FROM offer where active = 1',
      (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ status: 500 });
        } else {
          res.status(200).json({ data: result, status: 200 });
        }
      }
    );
  });

  router.get('/api/offer/:id', function (req, res, next) {
    db.query(
      'SELECT * FROM offer where id_offer = ' + req.params.id,
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 500 });
        } else {
          res.status(200).json({ data: result, status: 200 });
        }
      }
    );
  });

  return router;
}

module.exports = createRouter;