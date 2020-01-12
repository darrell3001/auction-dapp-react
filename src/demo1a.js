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
      backgroundColor: theme.palette.background.default
    }
  }
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700
  }
});

export default function Demo(props) {
  const classes = useStyles();

  const [checked, setChecked] = React.useState([0]);

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  // const onClick = (e, datum) => {
  //   if (onRowClick) {
  //     onRowClick(evt, datum);
  //   }
  // };

  // <StyledTableCell align="right">id</StyledTableCell>
  // <StyledTableRow key={props.auctions[key].id}>
  //               <StyledTableCell align="right">

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <TableCell align="right"></TableCell>
            <TableCell align="right">id</TableCell>
            <TableCell align="right">Item</TableCell>
            <TableCell align="right">End Time</TableCell>
            <TableCell align="right">Max Bid</TableCell>
            <TableCell align="right">Current State</TableCell>
            <TableCell align="right">Winning Bid</TableCell>
            <TableCell align="right">Owner</TableCell>
            <TableCell align="right">Max Bidder</TableCell>
            <TableCell align="right">Winning Bider</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(props.auctions).map(function(key) {
            const labelId = `checkbox-list-label-${props.auctions[key].id}`;
            return (
              <TableRow
                key={props.auctions[key].id}
                onClick={handleToggle(props.auctions[key].id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    // disabled={checked.length > 1 ? true : false}
                    // onClick={e => onClick(e, datum)}
                    key={props.auctions[key].id}
                    edge="start"
                    checked={checked.indexOf(props.auctions[key].id) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </TableCell>
                <TableCell align="right">{props.auctions[key].id}</TableCell>
                <TableCell align="right">
                  {props.auctions[key].itemName}
                </TableCell>
                <TableCell align="right">
                  {props.auctions[key].endTime}
                </TableCell>
                <TableCell align="right">
                  {props.auctions[key].maxBid}
                </TableCell>
                <TableCell align="right">
                  {props.auctions[key].winningBid}
                </TableCell>
                <TableCell align="right">
                  {props.auctions[key].currentState}
                </TableCell>
                <TableCell align="right">
                  {props.auctions[key].winningBidder}
                </TableCell>
                <TableCell align="right">{props.auctions[key].owner}</TableCell>
                <TableCell align="right">
                  {props.auctions[key].maxBidder}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
