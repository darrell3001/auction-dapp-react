import React from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';

export default function NewAuction(props) {
  const { 
    noneSelected, 
    onChangeNewAuctionItemName,
    onChangeNewAuctionDurationInMinutes,
    onClickNewAuctionButton,
    newAuctionItemName,
    newAuctionDurationInMinutes,
    displayNewAuction,
    toggleDisplayNewAuction
  } = props;
  return (
    <div style={{display: displayNewAuction ? 'block' : 'none'}}>
      <div className='new-auction flex'>
        <section>
          <div>
            <h4>Title</h4>
            <p className='inline'>Use words people would search for when looking for your item.</p>
            <input
              type='text'
              disabled={!noneSelected}
              onChange={e => onChangeNewAuctionItemName(e)}
              value={newAuctionItemName}
            />
          </div>
          <div>
            <h4>Auction Duration</h4>
            <p className='inline'>How long would you like your auction to be in minutes?</p>
            <input 
              type='number'
              disabled={!noneSelected}
              onChange={e => onChangeNewAuctionDurationInMinutes(e)}
              value={newAuctionDurationInMinutes}
            ></input>
          </div>
          <div className='center'>
            <button onClick={toggleDisplayNewAuction}>⏎</button>
            <button
            className='button-inverted'
              disabled={!noneSelected}
              // onClick={e => onClickNewAuctionButton(e)}
            >
              Create Auction
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
