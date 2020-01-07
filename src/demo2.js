import React from "react";
import MaterialTable from "material-table";

// export default function MaterialTableDemo() {
export default function Demo2(props) {
  console.log("hello1 = ", props);

  // const [state, setState] = React.useState({
  // columns: [
  // const columns = [
  //   { title: "id", field: "id", type: "numeric" },
  //   { title: "itemName", field: "itemName" },
  //   { title: "owner", field: "owner" },
  //   { title: "endTime", field: "endTime" },
  //   { title: "maxBidder", field: "maxBidder" },
  //   { title: "maxBid", field: "maxBid" },
  //   { title: "winningBidder", field: "winningBidder" },
  //   { title: "winningBid", field: "winningBid" },
  //   { title: "currentState", field: "currentState" }
  //   // {
  //   //   title: 'Birth Place',
  //   //   field: 'birthCity',
  //   //   lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
  //   // },
  // ];
  // data: [
  //   {
  //     id: "1",
  //     itemName: "coat",
  //     owner: "123",
  //     endTime: "11am",
  //     maxBidder: "456",
  //     maxBid: "5",
  //     winningBidder: "",
  //     winningBid: "",
  //     currentState: "5"
  //   },

  //   {
  //     id: "2",
  //     itemName: "car",
  //     owner: "567",
  //     endTime: "12noon",
  //     maxBidder: "999",
  //     maxBid: "10",
  //     winningBidder: "999",
  //     winningBid: "10",
  //     currentState: "5"
  //   }

  // { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
  // {
  //   name: 'Zerya Betül',
  //   surname: 'Baran',
  //   birthYear: 2017,
  //   birthCity: 34,
  // },
  //   ]
  // });

  // {Object.keys(props.auctions).map(function(key) {
  //   return (
  //         {props.auctions[key].itemName}
  //         {props.auctions[key].endTime}
  //       </StyledTableCell>
  //       <StyledTableCell align="right">
  //         {props.auctions[key].maxBid}
  //       </StyledTableCell>
  //       <StyledTableCell align="right">
  //         {props.auctions[key].winningBid}
  //       </StyledTableCell>
  //       <StyledTableCell align="right">
  //         {props.auctions[key].currentState}
  //       </StyledTableCell>
  //     </StyledTableRow>
  //   );
  // })}

  return (
    <MaterialTable
      title="DApp Auction"
      columns={props.columns}
      data={
        
        Object.keys(props.auctions).map(function(key) {
          return ( {props.auctions[key].id} );
        })}






      // editable={{
      //   onRowAdd: newData =>
      //     new Promise(resolve => {
      //       setTimeout(() => {
      //         resolve();
      //         setState(prevState => {
      //           const data = [...prevState.data];
      //           data.push(newData);
      //           return { ...prevState, data };
      //         });
      //       }, 600);
      //     }),
      //   onRowUpdate: (newData, oldData) =>
      //     new Promise(resolve => {
      //       setTimeout(() => {
      //         resolve();
      //         if (oldData) {
      //           setState(prevState => {
      //             const data = [...prevState.data];
      //             data[data.indexOf(oldData)] = newData;
      //             return { ...prevState, data };
      //           });
      //         }
      //       }, 600);
      //     }),
      //   onRowDelete: oldData =>
      //     new Promise(resolve => {
      //       setTimeout(() => {
      //         resolve();
      //         setState(prevState => {
      //           const data = [...prevState.data];
      //           data.splice(data.indexOf(oldData), 1);
      //           return { ...prevState, data };
      //         });
      //       }, 600);
      //     })
      // }}
    />
  );
};
