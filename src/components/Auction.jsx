import React, { useState } from 'react';

import { auctionStateMappings } from '../helpers/auctionStateMappings';

export default function Auction(props) {
  const { 
    toggleDisplayAuction, 
    auctionInfo, 
    changeHandler, 
    bidAmount, 
    buttons,
    checkedObj,
    clickAuction,
    whoIsThis
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
  
  let who, itemName, endTime, maxBid, winningBid, currentState, auctionState;
  
  if (auctionInfo != null) {
    who = whoIsThis(auctionInfo[0]);
  }
  // This protects against undefined.
  if (auctionInfo != null) {
    console.log(auctionInfo + 'hit')
    itemName = auctionInfo.itemName;
    endTime = auctionInfo.endTime;
    maxBid = auctionInfo.maxBid;
    winningBid = auctionInfo.winningBid;
    currentState = auctionInfo.currentState;
    auctionState = auctionStateMappings[[currentState]].description;
  }
  
  const localeEndTime = new Date(endTime * 1000).toLocaleString();

  // This pushes contract number into checked array upon auction toggle.
  if (toggleDisplayAuction && checked.length <= 0) {
    onClickCheckBox(auctionInfo[0]);
    console.log(auctionInfo)
  } else if (!toggleDisplayAuction && checked.length === 1) {
    clearOnClickCheckBox()
  }
  
  function show(state) {
    if (currentState == state) {
      return {display: 'inline-block'};
    } else {
      return {display: 'none'};
    }
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
          <section  style={{display: (who === 'rowAuctionOwner') ? 'none' : 'block' }} className='center'>
            <input className='inputBid' type='number' name='bidAmount' value={bidAmount} onChange={(e) => changeHandler(e)}></input>
            <button className='button-inverted' onClick={() => onClickBidButton()}>Place bid</button>
          </section>
        </div>

        <div style={{display: (who === 'rowAuctionOwner') ? 'block' : 'none' }} className='center'>
          <h4>Auction options:</h4>
          <button style={show(0)} className='button-inverted' onClick={() => onClickEndButton()}>End</button>
          <button style={show(2)} className='button-inverted' onClick={() => onClickShippedButton()}>Shipped</button>
          <button style={show(4)} className='button-inverted' onClick={() => onClickDeleteButton()}>Delete</button>
        </div>

        <div style={{display: (who === 'rowAuctionWinningBidder') ? 'block' : 'none' }} className='center'>
          <h4>Auction winner:</h4>
          <button style={show(1)} className='button-inverted' onClick={() => onClickPaymentButton()}>Payment</button>
          <button style={show(3)} className='button-inverted' onClick={() => onClickReceivedButton()}>Received</button>
        </div>

        <div>
          <h4>It{'\''}s over at:{' '}</h4>
          <p className='inline'>{localeEndTime}</p>
        </div>

        <div className='center'>
        <button onClick={() => clickAuction()}>⏎</button>
        </div>
    </div>
  )
}