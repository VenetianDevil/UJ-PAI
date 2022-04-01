import React from 'react';
import { Link, setState } from 'react-router-dom';
import * as server from '../_services/ServerService';
import * as auth from '../_services/AuthService';
import { Col, Row, Button, Modal, Form, Table, ButtonGroup } from 'react-bootstrap';
import { ResignationModalComponent } from './ResignationModalComponent';
import { BidModalComponent } from './BidModalComponent';

export class ItemUserOffer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showBidModal: false,
      showResignModal: false,
      isLoading: true,
      offer: props.offer,
    };

    this.handleClose = this.handleClose.bind(this);
    this.showBidModal = this.showBidModal.bind(this);
    this.showResignModal = this.showResignModal.bind(this);
    this.updateOffer = this.updateOffer.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.offer != prevProps.offer) {
      console.log("my props", this.props)
      this.setState({ offer: this.props.offer });
    }
  }

  handleClose() {
    console.log('close')
    this.setState({ showBidModal: false, showResignModal: false })
  }

  showBidModal() {
    this.setState({ showBidModal: true });
  }

  showResignModal() {
    this.setState({ showResignModal: true });
  }

  updateOffer() {
    let new_offer = this.state.offer;
    new_offer.retracted = true;
    this.setState({offer: new_offer});
  }

  render() {
    return (
      <Col xs={12} md={6} lg={4} className="p-0">
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
            {this.state.offer.active ?
              <ButtonGroup>
                <Button role="link" variant="outline-primary" className='px-4' onClick={this.showBidModal}>BID</Button>
                {!this.state.offer.retracted ? <Button role="link" variant="outline-primary" className='px-4' onClick={this.showResignModal}>RETRACT</Button> : null}
              </ButtonGroup>
              : null
            }
          </div>
        </div>

        <BidModalComponent show={this.state.showBidModal} onHide={this.handleClose} offer={this.state.offer} callback={this.props.forceParentReload}></BidModalComponent>

        <ResignationModalComponent show={this.state.showResignModal} onHide={this.handleClose} offer={this.state.offer} callback={this.updateOffer} centered></ResignationModalComponent>

      </Col>
    );
  }
}