import React, { Component } from 'react';
import welcome from '@/assets/welcome.png';

export default class Home extends Component {

  render() {
    return (
      <div style={{background:'#fff', height:'100%', textAlign: 'center'}}>
        <img style={{width: '600px', marginTop: '200px'}} src={welcome} />
      </div>
    );
  }
}