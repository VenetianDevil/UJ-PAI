import React from 'react';
import { Link, setState } from 'react-router-dom';
import * as server from '../_services/ServerService';
import * as auth from '../_services/AuthService';
import { Col, Row, Button, Modal, Form, Table, ButtonGroup } from 'react-bootstrap';

export class ItemUserOffer extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      bidVal: 1000, 
      show: false, 
      showResign: false, 
      isLoading: true ,
      offer: props.offer,
    };

    this.handleBid = this.handleBid.bind(this);
    this.handleBidding = this.handleBidding.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.showBidModal = this.showBidModal.bind(this);
    this.showResignModal = this.showResignModal.bind(this);
    this.handleResignation = this.handleResignation.bind(this);
  }
  
  componentDidUpdate(prevProps) {
    if(this.props.offer != prevProps.offer){
      console.log("my props", this.props)
      this.setState({ offer: this.props.offer });  
    }
  }

  async handleBidding(e) {
    e.preventDefault();
    console.log('bidding', this.state.bidVal);
    await server.placeBid({ id_item: this.state.offer.id_item, price: this.state.bidVal })
      .then((data) => {
        this.handleClose();
        this.props.forceParentReload();
      })
  }

  handleBid(e) {
    e.preventDefault();
    this.setState({ bidVal: e.target.value })
  }

  handleClose() {
    console.log('close')
    this.setState({ bidVal: null, show: false, showResign: false })
  }

  showBidModal() {
    this.setState({ show: true });
  }

  showResignModal() {
    this.setState({ showResign: true });
  }

  async handleResignation(e) {
    e.preventDefault();
    console.log('bidding', this.state.offer.id_item);
    await server.retractBidsOnOffer(this.state.offer.id_item)
      .then((data) => {
        console.log(data)
        let new_offer = this.state.offer;
        new_offer.retracted = true;
        this.setState({offer: new_offer});
        this.handleClose();
      })
  }

  render() {
    return (
      <Col xs={12} sm={6} lg={4} className="p-0">
        <div className={'offer_item ' + (!this.state.offer.active ? ' offer-not-active' : '')}>
          <div>
            {this.state.offer.winning_bid_id && this.state.offer.winning_bid_id == this.state.offer.id_bid ?
              <div className='ribbon ribbon-top-right'>
                <span>Winning bid</span>
                <img src={this.state.offer.img_url}></img>
              </div>
              : (!!this.state.offer.retracted ?
                <div className='ribbon ribbon-top-right red'>
                  <span>Retracted</span>
                  <img src={this.state.offer.img_url}></img>
                </div>
                :
                <img src={this.state.offer.img_url}></img>)
            }
            <h3> {this.state.offer.title} </h3>
            <p>{Number(this.state.offer.price).toFixed(2)} PLN </p>
            { this.state.offer.active ?
              <ButtonGroup>
                <Button role="link" variant="outline-primary" className='px-4' onClick={this.showBidModal}>BID</Button>
                {!this.state.offer.retracted ? <Button role="link" variant="outline-primary" className='px-4' onClick={this.showResignModal}>RETRACT</Button> : null}
              </ButtonGroup>
              : null
            }
          </div>
        </div>

        <Modal show={this.state.show} onHide={this.handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.offer.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.handleBidding}>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>bid val *</Form.Label>
                <Form.Control type="number" step="0.01" placeholder="100 000" onChange={this.handleBid} />
              </Form.Group>

              <Button variant="primary" type="submit" className='w-100'>
                BID
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal show={this.state.showResign} onHide={this.handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.offer.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to stop bidding on that item?</p>
            <Form onSubmit={this.handleResignation}>
              <Button variant="primary" type="submit" className='w-100'>
                RETRACT OFFER
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Col>
    );
  }
}