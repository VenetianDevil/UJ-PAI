import { environment } from '../environment.ts';
import { Observable, of, BehaviorSubject, retry } from 'rxjs';
// import { User } from './user.ts';
import { useNavigate } from "react-router-dom";
import { NotificationManager } from 'react-notifications';

// let currentUserSubject = {};
// let currentUser = null;
console.log(localStorage.getItem('currentUser'))
if (localStorage.getItem('currentUser') === '' || localStorage.getItem('currentUser') === 'undefined') {
  localStorage.removeItem('currentUser');
  currentUserSubject.next(null);
}
// if (localStorage.getItem('currentUser')) {
// }
let currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
let currentUser = currentUserSubject.asObservable();
let isLoggedIn = currentUser != null ? true : false;
console.log(currentUser)

async function request(method, url, data) {
  console.log('gonna fetch')
  try {
    const response = await fetch(url, {
      method: method,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message) {
          console.info(res.message);
        }

        if (res.status == 200) {
          if (res.token) {
            res.data[0].token = res.token;
          }

          return res.data;
        } else if (res.status == 400) {
          NotificationManager.error('Wrong password!', 'Login failed');
        } else if (res.status == 404) {
          NotificationManager.info('Try to log in again.', 'Registered succes');
        } else if (res.status == 409) {
          NotificationManager.error(res.message, 'Error!');
        } else if (res.status == 500) {
          NotificationManager.error('Sorry cannot handle it now', 'Error!');
        }

        return null;
      })

    return response;
  } catch (err) {
    console.error(err)
  }
}

function currentUserValue() {
  // console.log(currentUserSubject);
  return currentUserSubject.value ? currentUserSubject.value[0] : null;
}

async function register(credentials) {
  return request('POST', `${environment.serverUrl}/users/register`, credentials)
    .then((user) => {
      console.log(user);
      if (user) {
        isLoggedIn = true;
        localStorage.setItem('currentUser', JSON.stringify(user));
        currentUserSubject.next(user);
        console.log(localStorage);
        NotificationManager.success('Logged in successfully', 'Registered!');
      }

      console.error("no user data received")
      return user;
    })
    .catch(error => {
      NotificationManager.error(error.message, 'Error!');
      console.error(error)
    })
}

async function login(credentials) {
  return request('POST', `${environment.serverUrl}/users/login`, credentials)
    .then((user) => {
      console.log(user);
      if (user) {
        isLoggedIn = true;
        localStorage.setItem('currentUser', JSON.stringify(user));
        currentUserSubject.next(user);
        console.log(localStorage);
        NotificationManager.success('Logged in successfully', 'Logged in!');
      }

      return user;
    })
    .catch(error => {
      NotificationManager.error(error.message, 'Error!');
      console.error(error)
    })
};

async function logout() {
  // let navigate = useNavigate();

  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!ktos zrobil logout');
  return request('GET', `${environment.serverUrl}/users/logout`)
    .then((response) => {
      console.log("czy ja tu wgl wchodze?")
      isLoggedIn = false;
      localStorage.removeItem('currentUser');
      currentUserSubject.next(null);
      NotificationManager.warning('Logged out successfully', 'Logged out!');
      // musi tu być jakoś redirect zrobiony bo inaczej mi strona wysiada i musze conajmniej odświeżyć
    })
    .catch(error => {
      console.error(error);
      NotificationManager.error(error.message, 'Error!');
    })
};

export { register, login, logout, currentUserValue, isLoggedIn };