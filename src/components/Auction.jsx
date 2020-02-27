import React, { useState } from 'react';

import { auctionStateMappings } from '../auctionStateMappings';

export default function Auction(props) {
  const { toggleDisplayAuction, auctionInfo, changeHandler, bidAmount } = props;
  console.log({auctionInfo})
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
          <aside className='center'>
            <input className='inputBid' type='number' name='bidAmount' value={bidAmount} onChange={(e) => changeHandler(e)}></input>
            <button className='button-inverted'>Place bid</button>
          </aside>
        </div>
        <div>
          <h4>It{'\''}s over at:{' '}</h4>
          <p className='inline'>{localeEndTime}</p>
        </div>
    </div>
  )
}