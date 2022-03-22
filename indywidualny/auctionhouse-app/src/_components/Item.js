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

  constructor(props){
    super(props);
    this.offer = props.offer;
  }

  render() {
    // console.log(this.offer);

    return (
      <Col xs={12} sm={6} lg={4} className={"mb-4 deactivatedSignWrapper " + (this.offer.active ? '' : 'deactivated')}>
        <div className="offer_item border-0">
          <img src={this.offer.img_url}></img>
          <h3> {this.offer.title} </h3>
          {/* to={"/offer-details/" + this.offer.id_item + "/" + toKebabCase(this.offer.title)}  */}
          <Link to={`${this.offer.id_item}/${toKebabCase(this.offer.title)}`} >
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