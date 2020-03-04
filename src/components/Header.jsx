import React from 'react';

export default function Header(props) {
  const { toggleAuction, blur } = props;
  return(
    <div style={blur ? {filter: 'blur(1px)'}: null} className='header flex wrap space-between'>
      <div className='flex column'>
        <h1>Auction DApp</h1>
        <p>Developed by KryptoCraft</p>
      </div>
      <div>
        <button className='shadow button-inverted' onClick={toggleAuction}>Start a Auction</button>
      </div>
    </div>
  )
}
