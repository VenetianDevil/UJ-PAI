import { React, useState } from 'react';
import * as server from '../_services/ServerService';
import { Button, Modal, Form } from 'react-bootstrap';
var _ = require('lodash');

export function ResignationModalComponent(props) {

  const offer = props.offer;

  async function handleResignation(e) {
    e.preventDefault();
    console.log('bidding', offer.id_item);
    await server.retractBidsOnOffer(offer.id_item)
      .then((data) => {
        console.log(data)
        props.callback();
        props.onHide();
      })
  }

  return (
    <Modal show={props.show} onHide={props.onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{offer.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to stop bidding on that item?</p>
        <Form onSubmit={handleResignation}>
          <Button variant="primary" type="submit" className='w-100'>
            RETRACT OFFER
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
