import React, { useState } from 'react';
import Auction from './components/Auction';
import { auctionStateMappings } from './auctionStateMappings';

export default function AuctionTable(props) {
  const { 
    blur, 
    toggleDisplayBlur, 
    changeHandler, 
    bidAmount, 
    buttons, 
    checkedObj
  } = props;

  const { checked } = checkedObj;
  const [toggleDisplayAuction, setToggleDisplayAuction] = useState(false);
  const [auctionInfo, setAuctionInfo] = useState(null);

  // const eventHandlerWrapper = value => {
  //   props.onClickCheckBox(value);
  // };

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
  
  // Returns a className
  function whoIsThis(key) {
    if (isAuctionOwner(key)) {
      return 'rowAuctionOwner'
    } else if (isAuctionMaxBidder(key)) {
      return 'rowAuctionMaxBidder' 
    } else if (isAuctionWinningBidder(key)) {
      return 'rowAuctionWinningBidder'
    } else {
      return null
    }
  }

  const style = {
    filter: 'blur(1px)'
  }
  
  function clickAuction(auctionObjectEvent) {
    // eventHandlerWrapper(key);
    // console.log({key});
    // console.log(eventHandlerWrapper(key));
    console.log({auctionObjectEvent})
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
        buttons={buttons}
        checkedObj={checkedObj}
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
            // console.log(props.auctions[key])
            const labelId = `checkbox-list-label-${props.auctions[key].id}`;
            const localeEndTime = new Date(
              props.auctions[key].endTime * 1000
              ).toLocaleString();
              
              const auctionState =
              auctionStateMappings[[props.auctions[key].currentState]]
              .description;
              

            return(
              <tr
              className={whoIsThis(key)}
              key={props.auctions[key].id}
                // onClick={() => eventHandlerWrapper(key)}
                onClick={() => clickAuction(props.auctions[key])}
                > 
                <td
                  key={props.auctions[key].id}
                  checked={checked.indexOf(props.auctions[key].id) !== -1}
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
