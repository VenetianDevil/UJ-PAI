import React from 'react';
import { Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "../_styles/loader.css";

export class LoaderComponent extends React.Component {

  constructor(props) {
    super(props); 
  }

  render() {
    return (
      <div class="lds-facebook"><div></div><div></div><div></div></div>);
  }
}

