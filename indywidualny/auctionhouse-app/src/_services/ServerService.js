import { environment } from '../environment.ts';
import * as auth from '../_services/AuthService';
import { useNavigate } from "react-router-dom";
import { NotificationManager } from 'react-notifications';

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
        
        if (res.status == 200 && (method == 'POST' || method == 'PATCH')){
          NotificationManager.success('Your action has been saved', 'Success!');
        }
        else if (res.status == 401){
          console.error(`mam ${res.status} i wylogowuje typa`);
          auth.logout()
        } else if (res.status == 500) {
          NotificationManager.error('Please try again later.', 'Server Error!');
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
  console.info("Currently there is no such option")
  // return request('GET', `${environment.serverUrl}/users`);
};

function getActiveOffers() {
  return request('GET', `${environment.serverUrl}/items`);
};

function getOffer(id) {
  return request('GET', `${environment.serverUrl}/items/${id}`);
};

function getBiddingHistory(id){
  return request('GET', `${environment.serverUrl}/items/${id}/bids`);
}

function placeBid(bid) {
  return request('POST', `${environment.serverUrl}/bids`, bid);
};

function resignFromOffer(offerId) {
  return request('PATCH', `${environment.serverUrl}/bids`, {id_item: offerId});
};

function getUserOffers(){
  return request('GET', `${environment.serverUrl}/users/items`);
}

export { getUsers, getActiveOffers, getOffer, placeBid, getBiddingHistory, getUserOffers, resignFromOffer };