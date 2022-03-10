import { environment } from '../environment.ts';
import { Observable, of, BehaviorSubject } from 'rxjs';
// import { User } from './user.ts';
import { useNavigate } from "react-router-dom";

// let currentUserSubject = {};
// let currentUser = null;
console.log(localStorage.getItem('currentUser'))
if(localStorage.getItem('currentUser')===''){
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

        if (res.token) {
          res.data[0].token = res.token;
        }

        return res.data;
      })

    return response;
  } catch (err) {
    console.error(err)
  }
}

function currentUserValue() {
  console.log(currentUserSubject);
  return currentUserSubject.value ? currentUserSubject.value[0] : null;
}

function register(credentials) {
  return request('POST', `${environment.serverUrl}/register`, credentials)
    .then((response) => {
      console.log(response);
      isLoggedIn = true;
      localStorage.setItem('currentUser', JSON.stringify(response));
      currentUserSubject.next(response);
      console.log(localStorage);
      return response;
    })
    .catch(error => {
      // this.notification.error(error.error.message);
      console.error(error)
    })
}

function login(credentials) {
  return request('POST', `${environment.serverUrl}/login`, credentials)
    .then((response) => {
      console.log(response);
      isLoggedIn = true;
      localStorage.setItem('currentUser', JSON.stringify(response));
      currentUserSubject.next(response);
      console.log(localStorage);
      return response;
    })
    .catch(error => {
      // this.notification.error(error.error.message);
      console.error(error)
    })
};

function logout() {
  // let navigate = useNavigate();

  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!ktos zrobil logout');
  return request('POST', `${environment.serverUrl}/logout`)
    .then((response) => {
      // let history = useHistory();
      console.log("czy ja tu wgl wchodze?")
      isLoggedIn = false;
      localStorage.removeItem('currentUser');
      currentUserSubject.next(null);
      // navigate("/login");
      // this.notification.success('Papa &#128075');
      // Redirect the user
      // this.router.navigate(['/']);
    })
    .catch(error => {
      console.error(error);
    })
};

export { register, login, logout, currentUserValue, isLoggedIn };