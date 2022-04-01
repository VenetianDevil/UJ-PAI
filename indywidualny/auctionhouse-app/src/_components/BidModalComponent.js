import {React, useState} from 'react';
import * as server from '../_services/ServerService';
import { Button, Modal, Form } from 'react-bootstrap';
var _ = require('lodash');

export function BidModalComponent(props) {
  const [bidVal, setBidValState] = useState();

  const handleBidDebounce = _.debounce(handleBid, 200);
  const offer = props.offer;

  async function handleBidding(e) {
    e.preventDefault();
    console.log('bidding', bidVal);
    await server.placeBid({ id_item: offer.id_item, price: bidVal })
      .then((data) => {
        if(!!props.callback){
          props.callback();
        }
        props.onHide();
      })
  }

  function handleBid(e) {
    e.preventDefault();
    setBidValState(e.target.value)
  }

  return (
    <Modal {...props} centered>
      <Modal.Header closeButton>
        <Modal.Title>{offer.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleBidding}>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>bid val *</Form.Label>
            <Form.Control type="number" step="0.01" placeholder="100 000" onChange={handleBidDebounce} />
          </Form.Group>

          <Button variant="primary" type="submit" className='w-100'>
            BID
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
