import React from 'react';
import { Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const toKebabCase = str =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('-');

export class Item extends React.Component {

  offer = this.props.offer;

  render() {
    // console.log(this.offer);

    return (
      <Col xs={12} sm={6} lg={4}>
        <div className="offer_item">
          <img src={this.offer.img_url}></img>
          <h3> {this.offer.title} </h3>
          {/* to={"/offer-details/" + this.offer.id_offer + "/" + toKebabCase(this.offer.title)}  */}
          <Link to={`/offer-details/${this.offer.id_offer}/${toKebabCase(this.offer.title)}`}>
            <Button role="link" variant="outline-primary" className='px-4'>View details</Button>
          </Link>
        </div>
      </Col>
    );
  }
}

// export default (props) => (
//   <TaskDetail
//       {...props}
//       params={useParams()}
//   />
// );