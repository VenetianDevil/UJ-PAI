const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

function createRouter(db) {
  const router = express.Router();

  router.post('/api/users/register', (req, res) => {
    
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    
      db.query(
        'INSERT INTO user (username, password) VALUES (?, ?)',
        [hash, req.body.username],
        (error, result) => {
          if (error) {
            console.error(error);
            if (error.code == "ER_DUP_ENTRY") {
              res.status(409).json({ status: 409, message: "This username is taken" });
            } else {
              res.status(500).json({ status: 500, message: "Couldn't create account user" });
            }
          } else {
            login(req, res);
          }
        }
      );
    })
  })

  function login(req, res) {
    db.query(
      'SELECT * FROM user where username=?',
      [req.body.username],
      (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ status: 500, message: 'Please try later' });
        } else {
          if (result[0]) {
            bcrypt.compare(req.body.password, result[0].password, function(err, comp_bool) {
              if(comp_bool){
                const userInfo = { id_user: result[0].id_user, is_admin: result[0].is_admin };
                const token = jwt.sign(userInfo, 'the-super-strong-secrect', { expiresIn: '1h' });
                const user = {
                  id_user: result[0].id_user,
                  username: result[0].username,
                  is_admin: result[0].is_admin,
                }
                res.status(200).json({ data: user, token, status: 200 });
              } else {
                res.status(400).json({ status: 400, message: "Wrong password! " });
              }
            })
          } else {
            res.status(404).json({ status: 404, message: 'No matching user with given name' });
          }
        }
      }
    );
  }

  router.post('/api/users/login', (req, res) => {
    login(req, res)
  })

  router.get('/api/users/logout', (req, res) => {
    res.status(200).json({ status: 200, message: "logOut - Front, I cannot do that, just clear user's cookies" });
    console.log("logOut");
  });

  function verifyToken(req, res, next) {
    // console.log(req.headers['authorization'])
    const bearerHeader = req.headers['authorization'];
    // console.log(req);
    if (bearerHeader) {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      // console.log('token', bearerToken)

      try {
        const user = jwt.verify(bearerToken, 'the-super-strong-secrect');
        if (!!user) {
          // console.log(user)
          req.user = user;
          next();
        }
        else {
          res.status(401).json({ status: 401, message: 'Your token expired' });
        }
      } catch (err) {
        res.status(401).json({ status: 401, message: 'Your token expired' });
      }

    }
    else {
      res.status(401).json({ status: 401, message: 'How dare you ask without token!' });
      // res.status(403).json({status: 403, message: 'Błąd autoryzacji! Nie masz dostępu do rządanych treści!'})
    }

  }

  function verifyAdminToken(req, res, next) {
    // console.log(req.headers['authorization'])
    const bearerHeader = req.headers['authorization'];
    // console.log(req);
    if (bearerHeader) {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      // console.log('token', bearerToken)

      try {
        const user = jwt.verify(bearerToken, 'the-super-strong-secrect');

        if (!user) {
          res.status(401).json({ status: 401, message: 'Your token expired' });
        }
        else {
          if (!!user.is_admin) {
            // console.log(user)
            req.user = user;
            next();
          } else {
            res.status(403).json({ status: 403, message: "You don't have rights. Become an admin." });
          }
        }
      } catch (err) {
        res.status(401).json({ status: 401, message: 'Your token expired' });
      }
    }
    else {
      res.status(401).json({ status: 401, message: 'Tak bez tokena prosisz?' });
      // res.status(403).json({status: 403, message: 'Błąd autoryzacji! Nie masz dostępu do rządanych treści!'})
    }

  }

  router.get('/api/items', (req, res, next) => {
    db.query(
      'SELECT * FROM item where active = 1',
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

  router.get('/api/items/admin', verifyAdminToken, (req, res, next) => {
    db.query(
      'SELECT * FROM item',
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

  router.get('/api/items/:id_item', function (req, res, next) {
    db.query(
      'SELECT * FROM item where id_item = ' + req.params.id_item,
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

  router.patch('/api/items/:id_item', verifyAdminToken, function (req, res, next) {
    db.query(
      'UPDATE item SET active = ? where id_item = ' + req.params.id_item,
      [req.body.active],
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 500 });
        } else {
          res.status(200).json({ status: 200 });
        }
      }
    );
  });

  router.get('/api/items/:id_item/bids', verifyAdminToken, function (req, res, next) {
    db.query(
      'SELECT * FROM bid NATURAL left join user WHERE id_item=' + req.params.id_item,
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

  router.post('/api/bids', verifyToken, function (req, res, next) {

    // check if received bid price is higher than the current max bid placed by this user
    db.query(
      'SELECT max(price) FROM bid where id_item=? AND id_user=?',
      [req.body.id_item, req.user.id_user],
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 500 });
        } else {
          // if so, then add new bid
          if (result[0]['max(price)'] == null || result[0]['max(price)'] < req.body.price) {
            db.query(
              'INSERT INTO bid (id_user, id_item, price) values (?, ?, ?)',
              [req.user.id_user, req.body.id_item, req.body.price],
              (error, result) => {
                if (error) {
                  console.log(error);
                  res.status(500).json({ status: 500 });
                } else {
                  console.log('update max bid id');
                  updateMaxBid(req.body.id_item, res);
                }
              }
            );
          } else { // if not tell that to user
            console.log(error);
            res.status(400).json({ status: 400, message: "You can't place bid with lower value than your highest one." });
          }
        }
      }
    )
  });

  router.patch('/api/bids', verifyToken, function (req, res, next) {
    db.query(
      'UPDATE bid SET retracted = true where id_item = ? AND id_user = ' + req.user.id_user,
      [req.body.id_item],
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 500 });
        } else {
          updateMaxBid(req.body.id_item, res)
        }
      }
    );
  });

  router.get('/api/users/items', verifyToken, function (req, res, next) {
    db.query(
      'select * from bid natural left join item where (id_item, price) in (SELECT id_item, max(price) FROM bid natural left join item where id_user = ' + req.user.id_user + ' group by id_item)',
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

  // @FIXME return info when there is more than one with max price (ignore new, leave first bet)
  function updateMaxBid(itemId, res) {
    db.query(
      'UPDATE item SET winning_bid_id = (Select id_bid from bid where price = (SELECT max(price) FROM bid where id_item=? AND retracted is null) AND id_item = ?) where id_item = ?', //uwzglednic bid.retracted -> nie liczą się juz
      [itemId, itemId, itemId],
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 500 });
        } else {
          res.status(200).json({ status: 200 });
        }
      }
    )
  }  

  return router;
}

module.exports = createRouter;