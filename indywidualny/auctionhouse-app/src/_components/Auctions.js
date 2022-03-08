import React from 'react';
import * as server from '../_services/ServerService';


export class Auctions extends React.Component {

  // constructor() {
  //   super();
  //   this.loading = true;
  //   this.offers = [];
  // }

  state = { offers: [], isLoading: true};

  async getActiveOffers() {
    await server.getActiveOffers()
      .then((data) => {
        console.log(data)
        this.setState({ offers: data, isLoading: false });
      })
      .catch(e => console.log(e));
  }

  componentDidMount() {
    this.getActiveOffers();
  }

  render() {
    const { offers, isLoading } = this.state;
    console.log(isLoading)

    if (isLoading) {
      return null;
    }

    return (
      <div>
        <h2> Offers </h2>
        <ul>
          {offers.map(offer => <li id={offer.idoffer}>{offer.title}</li>)}
        </ul>
      </div>
    );
  }
}