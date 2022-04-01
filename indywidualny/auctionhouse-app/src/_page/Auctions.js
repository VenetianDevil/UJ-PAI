import React from 'react';
import * as server from '../_services/ServerService';
import { Item } from '../_components/Item';
import { Row } from 'react-bootstrap';

export class Auctions extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isAdmin : props.isAdmin,
      offers: [],
      isLoading: true };
  }

  async getActiveOffers() {
    await server.getActiveOffers()
      .then((data) => {
        // console.log(data)
        this.setState({ offers: data, isLoading: false });
      })
      .catch(e => console.log(e));
  }

  async getAllOffers() {
    await server.getAllOffers()
    .then((data) => {
      // console.log(data)
      data.sort((a, b) => {
        return Number(b.active) - Number(a.active);
      });
      this.setState({ offers: data, isLoading: false });
    })
    .catch(e => console.log(e));
  }

  componentDidMount() {
    if(this.state.isAdmin){
      this.getAllOffers();
    } else {
      this.getActiveOffers();
    }
  }

  render() {
    const { offers, isLoading } = this.state;
    console.log(isLoading)

    if (isLoading) {
      return null;
    }

    return (
      <section>
        <h2 className='text-center my-5'>Offers</h2>
        <Row className='px-md-5'>
          {offers.map(offer => <Item key={offer.id_offer} offer={offer}></Item>)}
        </Row>
      </section>
    );
  }
}