import { environment } from '../environment.ts';
import * as auth from './AuthService';

async function request(method, url, data) {
  console.log('gonna fetch')

  try {
    console.log(auth.currentUserValue())
    const response = await fetch(url, {
      method: method,
      body: JSON.stringify(data),
      headers: {
        'Authorization': 'bearer ' + (!!auth.currentUserValue() ? auth.currentUserValue().token : ''),
      }
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log(data)
        if (res.message){
          console.info(res.message);
        }
        
        return res.data;
      })
      .catch(error => {
        if(error.status === 401){
          auth.logout();
        }
      })

    return response;
  } catch (err) {
    console.error(err)
  }
}

function getUsers() {
  return request('GET', `${environment.serverUrl}/users`);
};

function getActiveOffers() {
  return request('GET', `${environment.serverUrl}/offers_active`);
};

function getBids() {
  return request('GET', `${environment.serverUrl}/bids`);
};
export { getUsers, getActiveOffers };