import React from 'react';
import * as server from '../_services/ServerService';
import * as auth from '../_services/AuthService';
import { Col, Row, Button, Modal, Form, Tabs, Tab } from 'react-bootstrap';
import { ItemUserOffer } from '../_components/ItemUserOffer';
import { Navigate, Route, Routes } from 'react-router-dom'
import { LoaderComponent } from '../_components/LoaderComponent';

export class Account extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      offers: [],
      isLoading: true,
      forceReload: null,
      text: "nic"
    };
    this.loggedIn = auth.currentUserValue() ? true : false;

    this.setStateByChild = this.setStateByChild.bind(this);
    this.getUserOffers = this.getUserOffers.bind(this);
  }

  componentDidMount() {
    this.getUserOffers();
  }

  componentDidUpdate() {
    if(!!this.state.forceReload){
      console.log('reload')
      this.getUserOffers();
      this.setState({ forceReload: null });
    }
  }

  setStateByChild() {
    this.setState({ forceReload: true });
  }

  async getUserOffers() {
    await server.getUserOffers()
      .then((data) => {
        console.log("user offers", data);
        this.setState({ offers: data, isLoading: false });
      })
      .catch(e => console.log(e));
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
      return (<LoaderComponent></LoaderComponent>)
    }

    return (
      <section>
        <h2 className='text-center my-5'>My bets</h2>
        <Tabs defaultActiveKey="active" id="uncontrolled-tab-example" justify >
          <Tab eventKey="active" title="Active">
            <Row className='p-5'>
              {offers.map(offer => { return (offer.active ? <ItemUserOffer key={offer.id_offer} offer={offer} forceParentReload={this.setStateByChild}></ItemUserOffer> : null) })}
            </Row>
          </Tab>
          <Tab eventKey="closed" title="Closed">
            <Row className='p-5'>
              {offers.map(offer => { return (!offer.active ? <ItemUserOffer key={offer.id_offer} offer={offer} forceParentReload={this.setStateByChild}></ItemUserOffer> : null) })}
            </Row>
          </Tab>
        </Tabs>
      </section>
    );
  }
}