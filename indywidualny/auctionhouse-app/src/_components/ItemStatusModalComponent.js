import { React, useState } from 'react';
import * as server from '../_services/ServerService';
import { Button, Modal, Form } from 'react-bootstrap';
var _ = require('lodash');

export function ItemStatusModalComponent(props) {

  const offer = props.offer;

  async function changeItemStatus(e) {
    e.preventDefault();
    await server.changeItemStatus(offer.id_item, !offer.active)
      .then((data) => {
        props.onHide();
        props.forceUpdate();
      })
  }

  return (
    <Modal show={props.show} onHide={props.onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{offer.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to {offer.active ? 'close' : 'open'} this auction?</p>
        <Form onSubmit={changeItemStatus}>
          <Button variant="primary" type="submit" className='w-100'>
            {offer.active ? 'CLOSE' : 'OPEN'} AUCTION
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
