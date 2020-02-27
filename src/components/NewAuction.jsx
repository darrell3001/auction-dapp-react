import React from 'react';

export default function NewAuction(props) {
  const { 
    noneSelected, 
    onChangeNewAuctionItemName,
    onChangeNewAuctionDurationInMinutes,
    onClickNewAuctionButton,
    newAuctionItemName,
    newAuctionDurationInMinutes,
    displayNewAuction,
    toggleAuction
  } = props;
  return (
    <div 
      className='new-auction' 
      style={{display: displayNewAuction ? 'block' : 'none'}}
    >
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
          <button onClick={toggleAuction}>⏎</button>
          <button
          className='button-inverted'
            disabled={!noneSelected}
            onClick={e => onClickNewAuctionButton(e)}
          >
            Create Auction
          </button>
        </div>
    </div>
  );
}
