import React from 'react';
import * as server from '../_services/ServerService';
import * as auth from '../_services/AuthService';
import { Col, Row, Button, Modal, Form, Table } from 'react-bootstrap';
import { Link, useParams, setState } from "react-router-dom";

import '../_styles/offerDetails.css'

function OfferDetails() {
  const { id, title } = useParams();

  return (
    <OfferDetailsComponent id={id}></OfferDetailsComponent>
  )
}

export default OfferDetails;

class OfferDetailsComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = { offer: {}, bidVal: 1000, show: false, isLoading: true, admin: { bids: [], is_admin: auth.currentUserValue() && auth.currentUserValue().is_admin } };
    this.id = this.props.id;

    this.handleBid = this.handleBid.bind(this);
    this.handleBidding = this.handleBidding.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.showBidModal = this.showBidModal.bind(this);
  }

  async getOffer() {
    await server.getOffer(this.id)
      .then((data) => {
        console.log(data)
        this.setState({ offer: data[0], isLoading: false });
      })
      .catch(e => console.log(e));
  }

  async getBiddingHistory() {
    this.setState({ isLoading: true });
    await server.getBiddingHistory(this.id)
      .then((data) => {
        console.log(data)
        data.sort((a, b) => {
          return b.value - a.value;
        });
        this.setState({ admin: { bids: data, is_admin: 1 }, isLoading: false });
        console.log(this.state.admin.bids[0])
      })
      .catch(e => console.log(e));
  }

  async handleBidding(e) {
    e.preventDefault();
    console.log('bidding', this.state.bidVal);
    await server.placeBid({ id_offer: this.id, value: this.state.bidVal })
      .then((data) => {
        this.handleClose();
      })
  }

  handleBid(e) {
    e.preventDefault();
    this.setState({ bidVal: e.target.value })
  }

  handleClose() {
    console.log('close')
    this.setState({ bidVal: null, show: false })
  }

  showBidModal() {
    this.setState({ show: true });
  }

  componentDidMount() {
    this.getOffer();
    if (this.state.admin.is_admin) {
      this.getBiddingHistory();
    }
    // this.setState({ isLoading: false });
  }

  render() {
    const { offer, isLoading, admin } = this.state;
    console.log('admin', admin);

    if (isLoading) {
      return null;
    }

    return (
      <section className='offer-details my-5'>
        <Row className='px-md-5 py-5'>
          <Col xs={12} md={6} className="col-desc">
            <div className='px-4 text-center'>
              <h2 className='text-center'>{offer.title}</h2>
              <p className='my-5'><i>{offer.description}</i></p>
              {!!auth.currentUserValue() ? (admin.is_admin ? '' :
                <Button role="button" variant="primary" onClick={this.showBidModal}>BID</Button>) :
                <Link to="/login"><Button role="button" variant="primary">BID</Button></Link>}
            </div>
          </Col>
          <Col xs={12} md={6}>
            <img src={offer.img_url}></img>
          </Col>
          {admin.is_admin ?
            <Col xs={12} className="my-4">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Value</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {!!admin.bids.length ? admin.bids.map(bid =>
                    <tr className={!!bid.retracted ? 'retracted_bid' : ''}>
                      <td>{bid.id_bid}</td>
                      <td>{bid.username}</td>
                      <td>{bid.value}</td>
                      <td>{new Date(bid.date).toISOString().slice(0, 10)}</td>
                    </tr>
                  ) :
                    <tr className='text-center'><td colSpan={4}>No bids placed</td></tr>
                  }
                </tbody>
              </Table>
            </Col>
            : ''
          }
        </Row>

        <Modal show={this.state.show} onHide={this.handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{offer.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.handleBidding}>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>bid val *</Form.Label>
                <Form.Control type="number" placeholder="100 000" onChange={this.handleBid} />
              </Form.Group>

              <Button variant="primary" type="submit" className='w-100'>
                BID
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </section>
    );
  }
}

