import { environment } from '../environment.ts';
import * as auth from './AuthService';
import { useNavigate } from "react-router-dom";

async function request(method, url, data) {
  console.log('gonna fetch')

  try {
    console.log(auth.currentUserValue())
    const response = await fetch(url, {
      method: method,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + (!!auth.currentUserValue() ? auth.currentUserValue().token : ''),
      }
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log(data)
        if (res.message){
          console.info(res.message);
        }
        
        if (res.status == 401){
          console.error(`mam ${res.status} i wylogowuje typa`);
          auth.logout()
        }
        return res.data;
      })
      .catch(error => {
        if (error.status == 401){
          console.error(`mam ${error.status} i wylogowuje typa`);
          auth.logout()
        } else if(error.status === 403){
          console.info(error.message);
          // auth.logout();
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

function getOffer(id) {
  return request('GET', `${environment.serverUrl}/offer/${id}`);
};

function placeBid(bid) {
  return request('POST', `${environment.serverUrl}/bid`, bid);
};

function getBiddingHistory(id){
  return request('GET', `${environment.serverUrl}/offer/${id}/biddings`);
}

function getUserOffers(){
  return request('GET', `${environment.serverUrl}/userOffers`);
}

function resignFromOffer(offerId) {
  return request('POST', `${environment.serverUrl}/retractBids/${offerId}`);
};

export { getUsers, getActiveOffers, getOffer, placeBid, getBiddingHistory, getUserOffers, resignFromOffer };