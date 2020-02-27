import React from 'react';

export default function Auction(props) {
  const { toggleDisplayAuction, auctionInfo } = props;
  console.log({auctionInfo})
  let item;
  // This protects against undefined.
  if (auctionInfo != null) {
    item = auctionInfo.itemName;
  }
  return(
    <div style={{position: 'absolute', display: toggleDisplayAuction ? 'block' : 'none'}}>
      Hello Toggle: {item}
    </div>
  )
}