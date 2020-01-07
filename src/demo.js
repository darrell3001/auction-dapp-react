import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

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

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="right">id</StyledTableCell>
            <StyledTableCell align="right">Owner</StyledTableCell>
            <StyledTableCell align="right">Item</StyledTableCell>
            <StyledTableCell align="right">End Time</StyledTableCell>
            <StyledTableCell align="right">Max Bid</StyledTableCell>
            <StyledTableCell align="right">Max Bidder</StyledTableCell>
            <StyledTableCell align="right">Winning Bid</StyledTableCell>
            <StyledTableCell align="right">Winning Bider</StyledTableCell>
            <StyledTableCell align="right">Current State</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(props.auctions).map(function(key) {
            return (
              <StyledTableRow key={props.auctions[key].id}>
                <StyledTableCell align="right">
                  {props.auctions[key].id}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {props.auctions[key].owner}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {props.auctions[key].itemName}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {props.auctions[key].endTime}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {props.auctions[key].maxBid}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {props.auctions[key].maxBidder}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {props.auctions[key].winningBid}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {props.auctions[key].winningBidder}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {props.auctions[key].currentState}
                </StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
