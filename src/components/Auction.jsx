import React, { useState, useEffect } from 'react';

import { auctionStateMappings } from '../auctionStateMappings';

export default function Auction(props) {
  const { 
    toggleDisplayAuction, 
    auctionInfo, 
    changeHandler, 
    bidAmount, 
    buttons,
    checkedObj
  } = props;

  const {
    checked,
    onClickCheckBox,
    clearOnClickCheckBox
  } = checkedObj;

  const { 
    onClickBidButton, 
    onClickPaymentButton, 
    onClickShippedButton, 
    onClickEndButton, 
    onClickDeleteButton,
    onClickReceivedButton
  } = buttons;

  let itemName, endTime, maxBid, winningBid, currentState, auctionState;
  
  // This protects against undefined.
  if (auctionInfo != null) {
    itemName = auctionInfo.itemName;
    endTime = auctionInfo.endTime;
    maxBid = auctionInfo.maxBid;
    winningBid = auctionInfo.winningBid;
    currentState = auctionInfo.currentState;
    auctionState = auctionStateMappings[[currentState]].description;
  }

  const localeEndTime = new Date(endTime * 1000).toLocaleString();

  useEffect(() => {
  },[])

  // This pushes contract number into checked array upon auction toggle.
  if (toggleDisplayAuction && checked.length <= 0) {
    onClickCheckBox(auctionInfo[0]);
  } else if (!toggleDisplayAuction && checked.length === 1) {
    clearOnClickCheckBox()
  }

  return(
    <div 
      className='new-auction'
      style={{display: toggleDisplayAuction ? 'block' : 'none'}}
    >
        <div>
          <h4>{itemName}</h4>
          <p>Status:  <strong>{auctionState}</strong></p>
        </div>

        <div className='flex space-evenly wrap'>
          <p>Current bid: <strong>Ę{maxBid}</strong></p>
          <section className='center'>
            <input className='inputBid' type='number' name='bidAmount' value={bidAmount} onChange={(e) => changeHandler(e)}></input>
            <button className='button-inverted' onClick={() => onClickBidButton()}>Place bid</button>
          </section>
        </div>

        <div className='center'>
          <h4>Auction options:</h4>
          <button className='button-inverted' onClick={() => onClickEndButton()}>End</button>
          <button className='button-inverted' onClick={() => onClickShippedButton()}>Shipped</button>
          <button className='button-inverted' onClick={(e) => onClickDeleteButton(e)}>Delete</button>
        </div>

        <div className='center'>
          <h4>Auction winner:</h4>
          <button className='button-inverted' onClick={() => onClickPaymentButton()}>Payment</button>
          <button className='button-inverted' onClick={() => onClickReceivedButton()}>Received</button>
        </div>

        <div>
          <h4>It{'\''}s over at:{' '}</h4>
          <p className='inline'>{localeEndTime}</p>
        </div>
    </div>
  )
}