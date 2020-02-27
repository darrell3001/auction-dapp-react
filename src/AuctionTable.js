import React, { useState } from 'react';
import Auction from './components/Auction';
import { auctionStateMappings } from './auctionStateMappings';

export default function AuctionTable(props) {
  const { blur, toggleDisplayBlur, changeHandler, bidAmount } = props;
  const [toggleDisplayAuction, setToggleDisplayAuction] = useState(false);
  const [auctionInfo, setAuctionInfo] = useState(null);

  const eventHandlerWrapper = value => () => {
    props.handler(value);
  };

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
    
    const style = {
      filter: 'blur(1px)'
    }
  
  function clickAuction(key, auctionObjectEvent) {
    eventHandlerWrapper(key);
    console.log({key});
    console.log(eventHandlerWrapper(key));
    setAuctionInfo(auctionObjectEvent)
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
      />
      <table style={blur ? style: null} >
        <thead>
          <tr>
            <th></th>
            <th>Item</th>
            <th>Ends</th>
            <th>Current State</th>
            <th>Max Bid</th>
            <th>Winning Bid</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(props.auctions).map(function(key) {
            const labelId = `checkbox-list-label-${props.auctions[key].id}`;
            const localeEndTime = new Date(
              props.auctions[key].endTime * 1000
              ).toLocaleString();
              
              const auctionState =
              auctionStateMappings[[props.auctions[key].currentState]]
              .description;
              
              var thisIsAuctionOwner = `${
                isAuctionOwner(key) ? 'rowAuctionOwner' : ''
            }`;
            var thisIsAuctionMaxBidder = `${
              isAuctionMaxBidder(key) ? 'rowAuctionMaxBidder' : ''
            }`;
            var thisIsAuctionWinningBidder = `${
              isAuctionWinningBidder(key) ? 'rowAuctionWinningBidder' : ''
            }`;

            var rowClass = `${thisIsAuctionOwner} ${thisIsAuctionMaxBidder} ${thisIsAuctionWinningBidder}`;
            return(
              <tr
              className={rowClass}
              key={props.auctions[key].id}
                // onClick={eventHandlerWrapper(key)}
                onClick={() => clickAuction(key, props.auctions[key])}
                > 
                <td
                  key={props.auctions[key].id}
                  checked={props.checked.indexOf(props.auctions[key].id) !== -1}
                  >
                  <input style={{width: '50px'}} type='checkbox'></input>
                </td>
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
