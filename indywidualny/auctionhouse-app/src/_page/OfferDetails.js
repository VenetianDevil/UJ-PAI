import React from 'react';
import * as server from '../_services/ServerService';
import * as auth from '../_services/AuthService';
import { Col, Row, Button } from 'react-bootstrap';
import { Link, useParams } from "react-router-dom";

import '../_styles/offerDetails.css'

function OfferDetails() {
  const { id, title } = useParams();

  return (
    <OfferDetailsComponent id={id}></OfferDetailsComponent>
  )
}

export default OfferDetails;

class OfferDetailsComponent extends React.Component {

  state = { offer: {}, isLoading: true };
  id = this.props.id;

  async getOffer() {
    await server.getOffer(this.id)
      .then((data) => {
        console.log(data)
        this.setState({ offer: data[0], isLoading: false });
      })
      .catch(e => console.log(e));
  }

  componentDidMount() {
    this.getOffer();
  }

  render() {
    const { offer, isLoading } = this.state;
    // console.log(offer);

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
              {!!auth.currentUserValue() ? <Button role="button" variant="primary">BID</Button> : <Link to="/login"><Button role="button" variant="primary">BID</Button></Link>}
            </div>
          </Col>
          <Col xs={12} md={6}>
            <img src={offer.img_url}></img>
          </Col>
        </Row>
      </section>
    );
  }
}

