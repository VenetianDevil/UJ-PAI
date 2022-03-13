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
          if (error.code == "ER_DUP_ENTRY") {
            res.status(500).json({ status: 409, message: "This username is taken" });
          } else {
            res.status(500).json({ status: 500, message: "Couldn't create account user" });
          }
        } else {
          db.query(
            'SELECT id_user, is_admin, name FROM user where name=? and password=?',
            [req.body.username, req.body.password],
            (error, result) => {
              if (error) {
                console.error(error);
                res.status(500).json({ status: 500, message: 'No matching user ' });
              } else {
                const userInfo = { id_user: result[0].id_user, is_admin: result[0].is_admin };
                const token = jwt.sign(userInfo, 'the-super-strong-secrect', { expiresIn: '1h' });
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
          res.status(404).json({ status: 404, message: 'No matching user with given name' });
        } else {
          if (result[0]) {
            console.log(result[0].password, req.body.password);
            console.log(result[0].password == req.body.password);
            if (result[0].password == req.body.password) {
              const userInfo = { id_user: result[0].id_user, is_admin: result[0].is_admin };
              const token = jwt.sign(userInfo, 'the-super-strong-secrect', { expiresIn: '1h' });
              res.status(200).json({ data: result, token, status: 200 });
            } else {
              res.status(401).json({ status: 401, message: "Wrong password! " });
            }
          } else {
            res.status(404).json({ status: 404, message: 'No matching user with given name' });
          }
        }
      }
    );
  })

  router.post('/api/logout', (req, res) => {
    res.status(200).json({ status: 200, message: "logOut - Front, I cannot do that, just clear user's cookies" });
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

      try {
        const user = jwt.verify(bearerToken, 'the-super-strong-secrect');
        if (!!user) {
          // console.log(user)
          req.user = user;
          next();
        }
        else {
          res.status(401).json({ status: 401, message: 'Twoja sesja wygasła' });
        }
      } catch (err) {
        res.status(401).json({ status: 401, message: 'Twoja sesja wygasła' });
      }

    }
    else {
      res.status(403).json({ status: 403, message: 'Tak bez tokena prosisz?' });
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
          res.status(401).json({ status: 401, message: 'Twoja sesja wygasła' });
        }
        else {
          if (!!user.is_admin) {
            // console.log(user)
            req.user = user;
            next();
          } else {
            res.status(403).json({ status: 403, message: 'Nie masz prawa do tych treści; zostań adminem' });
          }
        }
      } catch (err) {
        res.status(401).json({ status: 401, message: 'Twoja sesja wygasła' });
      }
    }
    else {
      res.status(403).json({ status: 403, message: 'Tak bez tokena prosisz?' });
      // res.status(403).json({status: 403, message: 'Błąd autoryzacji! Nie masz dostępu do rządanych treści!'})
    }

  }

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

  router.post('/api/bid', verifyToken, function (req, res, next) {
    // console.log(req.user);
    // console.log(req.body);
    const today = new Date();

    db.query(
      'INSERT INTO bid (id_user, id_offer, value, date) values (?, ?, ?, ?)',
      [req.user.id_user, req.body.id_offer, req.body.value, today],
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 500 });
        } else {
          console.log('update max bid id');
          updateMaxBid(req.body.id_offer);
        }
      }
    );
  });

  router.get('/api/offer/:id/biddings', verifyAdminToken, function (req, res, next) {
    db.query(
      'SELECT * FROM auctionhouse.bid NATURAL left join auctionhouse.user WHERE id_offer=' + req.params.id,
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

  router.get('/api/userOffers', verifyToken, function (req, res, next) {
    db.query(
      'select * from auctionhouse.bid natural left join auctionhouse.offer where (id_offer, value) in (SELECT id_offer, max(value) FROM auctionhouse.bid natural left join auctionhouse.offer where id_user = ' + req.user.id_user + ' group by id_offer)',
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

  router.post('/api/retractBids/:offerId', verifyToken, function (req, res, next) {
    db.query(
      'UPDATE bid SET retracted = true where id_offer = ? AND id_user = ' + req.user.id_user,
      [req.params.offerId],
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 500 });
        } else {
          updateMaxBid(req.params.offerId)
        }
      }
    );
  });

  function updateMaxBid(offerId) {
    db.query(
      'UPDATE offer SET winning_bid_id = (Select id_bid from bid where value = (SELECT max(value) FROM auctionhouse.bid where id_offer=? AND retracted <> 1)) where id_offer = ?', //uwzglednic bid.retracted -> nie liczą się juz
      [offerId, offerId],
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 500 });
        } else {
          res.status(200).json({ data: result, status: 200 });
        }
      }
    )
  }

  return router;
}

module.exports = createRouter;