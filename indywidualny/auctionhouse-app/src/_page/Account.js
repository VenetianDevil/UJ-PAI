import React from 'react';
import * as server from '../_services/ServerService';
import * as auth from '../_services/AuthService';
import { Col, Row, Button, Modal, Form, Tabs, Tab } from 'react-bootstrap';
import { ItemUserOffer } from '../_components/ItemUserOffer';
import { Navigate, Route, Routes } from 'react-router-dom'

export class Account extends React.Component {

  state = { offers: [], isLoading: true };
  loggedIn = auth.currentUserValue() ? true : false;

  async getUserOffers() {
    await server.getUserOffers()
      .then((data) => {
        console.log(data)
        this.setState({ offers: data, isLoading: false });
      })
      .catch(e => console.log(e));
  }

  componentDidMount() {
    this.getUserOffers();
  }

  render() {
    const { offers, isLoading } = this.state;
    console.log('islogged', this.loggedIn, offers);

    if (!this.loggedIn) {
      return (
        <Navigate to={{ pathname: '/login' }} />
      )
    }

    if (isLoading) {
      return null;
    }

    return (
      <section>
        <h2 className='text-center my-5'>My bets</h2>
        <Tabs defaultActiveKey="active" id="uncontrolled-tab-example" justify >
          <Tab eventKey="active" title="Active">
            <Row className='p-5'>
              {offers.map(offer => { return (offer.active ? <ItemUserOffer offer={offer}></ItemUserOffer> : null) })}
            </Row>
          </Tab>
          <Tab eventKey="closed" title="Closed">
            <Row className='p-5'>
              {offers.map(offer => { return (!offer.active ? <ItemUserOffer offer={offer}></ItemUserOffer> : null) })}
            </Row>
          </Tab>
        </Tabs>
      </section>
    );
  }
}