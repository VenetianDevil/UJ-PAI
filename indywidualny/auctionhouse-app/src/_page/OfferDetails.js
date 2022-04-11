import React from 'react';
import * as server from '../_services/ServerService';
import * as auth from '../_services/AuthService';
import { Col, Row, Button, Modal, Form, Table } from 'react-bootstrap';
import { Link, useParams, setState } from "react-router-dom";
import { BidModalComponent } from '../_components/BidModalComponent';
import { ItemStatusModalComponent } from '../_components/ItemStatusModalComponent';
import { LoaderComponent } from '../_components/LoaderComponent';

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
    this.state = {
      offer: {},
      showBidModal: false,
      showStatusModal: false,
      isLoading: true,
      admin: {
        bids: [],
        is_admin: auth.currentUserValue() && auth.currentUserValue().is_admin
      }
    };
    this.id = this.props.id;

    this.handleClose = this.handleClose.bind(this);
    this.showBidModal = this.showBidModal.bind(this);
    this.showStatusModal = this.showStatusModal.bind(this);
    this.forceUpdate = this.forceUpdate.bind(this)
  }

  componentDidMount() {
    this.getOffer();
    if (this.state.admin.is_admin) {
      this.getBiddingHistory();
    }
    // this.setState({ isLoading: false });
  }

  componentDidUpdate() {
    if(!!this.state.forceUpdate){
      this.getOffer();
      this.setState({ forceUpdate: false });
    }
  }

  forceUpdate() {
    this.setState({ forceUpdate: true });
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
          return b.price - a.price;
        });
        this.setState({ admin: { bids: data, is_admin: 1 }, isLoading: false });
        console.log(this.state.admin.bids[0])
      })
      .catch(e => console.log(e));
  }

  handleClose() {
    console.log('close')
    this.setState({ showBidModal: false, showStatusModal: false })
  }

  showBidModal() {
    this.setState({ showBidModal: true });
  }

  showStatusModal() {
    console.log('showStatusModal')
    this.setState({ showStatusModal: true });
  }

  render() {
    const { offer, isLoading, admin } = this.state;
    console.log('admin', admin);

    if (isLoading) {
      return (<LoaderComponent></LoaderComponent>)
    }

    return (
      <section className='offer-details my-5'>
        <Row className='px-md-5 py-5'>
          <Col xs={12} md={6} className={"col-desc deactivatedSignWrapper mb-4 " + (offer.active ? '' : 'deactivated')}>
            <div className='p-4 text-center'>
              <h2 className='text-center'>{offer.title}</h2>
              <p className='my-5'><i>{offer.description}</i></p>
              {!!auth.currentUserValue() ?
                (admin.is_admin ?
                  <Button role="button" variant="primary" onClick={this.showStatusModal}>{offer.active ? 'DEACTIVATE' : 'ACTIVATE'}</Button> :
                  <Button role="button" variant="primary" onClick={this.showBidModal}>BID</Button>) :
                <Link to="/login"><Button role="button" variant="primary">BID</Button></Link>}
            </div>
          </Col>
          <Col xs={12} md={6} className="d-flex px-0 px-md-3 mb-4">
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
                    <tr key={bid.id_bid} className={!!bid.retracted ? 'retracted_bid' : ''}>
                      <td>{bid.id_bid}</td>
                      <td>{bid.username}</td>
                      <td>{Number(bid.price).toFixed(2)}</td>
                      <td>{new Date(bid.ts).toISOString().slice(0, 10)}</td>
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

        <BidModalComponent show={this.state.showBidModal} onHide={this.handleClose} offer={offer}></BidModalComponent>

        <ItemStatusModalComponent show={this.state.showStatusModal} onHide={this.handleClose} offer={offer} forceUpdate={this.forceUpdate}></ItemStatusModalComponent>

      </section>
    );
  }
}

