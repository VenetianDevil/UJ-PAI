// import { environment } from './Environment';

import React from "react";

const environment = {
  production: false,
  serverUrl: 'http://localhost:1596/api',
};

async function request(method, url, data) {
  console.log('gonna fetch')

  try {
    const response = await fetch(url, {
      method: method,
      body: JSON.stringify(data),
      headers: {
        // 'Authorization': 'bearer ' + (!!this.authService.currentUserValue ? this.authService.currentUserValue.token : ''),
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