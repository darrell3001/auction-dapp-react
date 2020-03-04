import React, { useState } from 'react';
import Auction from './Auction';
import { auctionStateMappings } from '../helpers/auctionStateMappings';

export default function AuctionTable(props) {
  const { 
    blur, 
    toggleDisplayBlur, 
    changeHandler, 
    bidAmount, 
    buttons, 
    checkedObj
  } = props;
  const [toggleDisplayAuction, setToggleDisplayAuction] = useState(false);
  const [auctionInfo, setAuctionInfo] = useState(null);

  function isAuctionOwner(value) {
    if (
      props.fromAddress.toUpperCase() ==
      props.auctions[value].owner.toUpperCase()
    ) {
      return true;
    } else {
      return false;
    }
  }
  
  function isAuctionWinningBidder(value) {
    if (
    props.fromAddress.toUpperCase() ==
    props.auctions[value].winningBidder.toUpperCase()
    ) {
      return true;
    } else {
      return false;
    }
  }
    
  function isAuctionMaxBidder(value) {
    if (
      props.auctions[value].winningBidder == 0 &&
      props.fromAddress.toUpperCase() ==
      props.auctions[value].maxBidder.toUpperCase()
      ) {
        return true;
      } else {
        return false;
      }
    }

  function whoIsThis(key) {
    if (isAuctionOwner(key)) {
      return 'rowAuctionOwner'
    } else if (isAuctionMaxBidder(key)) {
      return 'rowAuctionMaxBidder' 
    } else if (isAuctionWinningBidder(key)) {
      return 'rowAuctionWinningBidder'
    } else {
      return;
    }
  }
  
  /**
   * @param auctionObjectEvent Data to populate Auction component.
   * @function setToggleDisplayAuction Toggles display state.
   * @function toggleDisplayBlur Toggles blur effect.
   */
  function clickAuction(auctionObjectEvent) {
    if (!!auctionObjectEvent) setAuctionInfo(auctionObjectEvent);
    setToggleDisplayAuction(toggleDisplayAuction ? false : true);
    toggleDisplayBlur();
  }

  return (
    <>
      <Auction
        auctionInfo={auctionInfo}
        toggleDisplayAuction={toggleDisplayAuction}
        toggleDisplayBlur={toggleDisplayBlur}
        changeHandler={changeHandler}
        bidAmount={bidAmount}
        buttons={buttons}
        checkedObj={checkedObj}
        clickAuction={clickAuction}
        whoIsThis={whoIsThis}
      />
      <table className='auction-table' style={blur ? {filter: 'blur(1px)'} : null} >
        <thead>
          <tr>
            <th>Item</th>
            <th>Ends</th>
            <th>Current State</th>
            <th>Max Bid</th>
            <th>Winning Bid</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(props.auctions).map(function(key) {
            const localeEndTime = new Date(
              props.auctions[key].endTime * 1000
              ).toLocaleString();
              const auctionState =
              auctionStateMappings[[props.auctions[key].currentState]]
              .description;
            return(
              <tr
                id={whoIsThis(key)}
                className='auction-row'
                key={props.auctions[key].id}
                onClick={() => clickAuction(props.auctions[key])}
              >
                <td>{props.auctions[key].itemName}</td>
                <td>{localeEndTime}</td>
                <td>{auctionState}</td>
                <td>{props.auctions[key].maxBid}</td>
                <td>{props.auctions[key].winningBid}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  );
}
