import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import Checkbox from "@material-ui/core/Checkbox";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";

import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";

import "./App.css";

// import "./auctionStateMappings";
const auctionStateMappings = {
  0: { state: "inProgress", description: "In Progress" },
  1: { state: "awaitingPayment", description: "Ended - Awaiting Payment" },
  2: { state: "awaitingShipment", description: "Ended - Awaiting Shipping" },
  3: { state: "awaitingDelivery", description: "Ended - Awaiting Delivery" },
  4: { state: "complete", description: "Complete" },
  5: { state: "deleted", description: "Deleted" }
};

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    "&:nth-of-type(odd)": {
      // backgroundColor: theme.palette.background.default
    }
  }
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700
  }
});

export default function AuctionTable(props) {
  const classes = useStyles();

  // const [checked, setChecked] = React.useState([0]);

  const eventHandlerWrapper = value => () => {
    props.handler(value);
  };

  // <StyledTableCell align="right">id</StyledTableCell>
  // <StyledTableRow key={props.auctions[key].id}>
  //               <StyledTableCell align="right">

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

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell align="right"></StyledTableCell>
            <StyledTableCell align="right">Item</StyledTableCell>
            <StyledTableCell align="right">End Time</StyledTableCell>
            <StyledTableCell align="right">Current State</StyledTableCell>
            <StyledTableCell align="right">Max Bid</StyledTableCell>
            <StyledTableCell align="right">Winning Bid</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {Object.keys(props.auctions).map(function(key) {
            const labelId = `checkbox-list-label-${props.auctions[key].id}`;
            const localeEndTime = new Date(
              props.auctions[key].endTime * 1000
            ).toLocaleString();

            const auctionState =
              auctionStateMappings[[props.auctions[key].currentState]]
                .description;

            var thisIsAuctionOwner = `${
              isAuctionOwner(key) ? "rowAuctionOwner" : ""
            }`;
            var thisIsAuctionMaxBidder = `${
              isAuctionMaxBidder(key) ? "rowAuctionMaxBidder" : ""
            }`;
            var thisIsAuctionWinningBidder = `${
              isAuctionWinningBidder(key) ? "rowAuctionWinningBidder" : ""
            }`;

            var rowClass = `${thisIsAuctionOwner} ${thisIsAuctionMaxBidder} ${thisIsAuctionWinningBidder}`;

            return (
              <StyledTableRow
                className={rowClass}
                key={props.auctions[key].id}
                onClick={eventHandlerWrapper(key)}
                // disabled={true}
              >
                <StyledTableCell padding="checkbox">
                  <Checkbox
                    // onClick={eventHandlerWrapper(key)}
                    // disabled={true}
                    // onClick={props.handle(6)}
                    // disabled={checked.length > 1 ? true : false}
                    // onClick={e => onClick(e, datum)}
                    key={props.auctions[key].id}
                    edge="start"
                    checked={
                      props.checked.indexOf(props.auctions[key].id) !== -1
                    }
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  {props.auctions[key].itemName}
                </StyledTableCell>
                <StyledTableCell align="right">{localeEndTime}</StyledTableCell>
                <StyledTableCell align="right">{auctionState}</StyledTableCell>
                <StyledTableCell align="right">
                  {props.auctions[key].maxBid}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {props.auctions[key].winningBid}
                </StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
