import { environment } from '../environment.ts';
import { Observable, of, BehaviorSubject } from 'rxjs';
// import { User } from './user.ts';

// let currentUserSubject = null;
// let currentUser = null;
let currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
let currentUser = currentUserSubject.asObservable();
let isLoggedIn = currentUser != null ? true : false;

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
        
        if (res.token){
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
  return currentUserSubject.value[0];
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
  console.log('ktos zrobil logout ale ignoruje to')
  // return request('POST', `${environment.serverUrl}/logout`)
  // .then((response) => {
  //   localStorage.removeItem('currentUser');
  //   this.currentUserSubject.next(null);
  //   this.isLoggedIn = false;
  //   // this.notification.success('Papa &#128075');
  //     // Redirect the user
  //     // this.router.navigate(['/']);
  // });
}

export { login, logout, currentUserValue };