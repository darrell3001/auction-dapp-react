//#region imports
import React, { Component } from "react";
import Web3 from "web3";
import { SMART_CONTRACT_ABI, SMART_CONTRACT_ADDRESS } from "./config";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";

import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";

import Demo from "./demo";
import Demo4 from "./demo4";
//#endregion

//#region App - default class
export default class App extends Component {
  //#region constructor
  constructor(props) {
    super(props);
    this.state = {
      fromAddress: 0,
      checked: [],
      bidAmount: 0,

      auctions: {},

      currentStatus: "",
      lastTransactionStatus: ""
    };

    this.contract = 0;

    this.getWalletInfo = this.getWalletInfo.bind(this);
    this.getContractInfo = this.getContractInfo.bind(this);
    this.subscribeToAllEvents = this.subscribeToAllEvents.bind(this);
    this.getAuctionCount = this.getAuctionCount.bind(this);
    this.getDashboardData = this.getDashboardData.bind(this);

    this.handler = this.handler.bind(this);
    this.guid = this.guid.bind(this);
    this.onChangeBidAmount = this.onChangeBidAmount.bind(this);
    this.onClickBidButton = this.onClickBidButton.bind(this);
    this.onClickPaymentButton = this.onClickPaymentButton.bind(this);
    this.onClickReceivedButton = this.onClickReceivedButton.bind(this);
    this.onClickShippedButton = this.onClickShippedButton.bind(this);
    this.onClickEndButton = this.onClickEndButton.bind(this);
  }
  //#endregion constructor

  //#region getAuctionCount()
  getAuctionCount() {
    return this.contract.methods
      .getAuctionCount()
      .call()
      .catch(error => {
        console.log("getAuctionCount() - error - ", error.message);
      });
  }
  //#endregion getAuctionCount()

  //#region getDashboardData()
  getDashboardData() {
    this.getAuctionCount().then(auctionCount => {
      for (var auctionId = 0; auctionId < auctionCount; auctionId++) {
        this.contract.methods
          .auctions(auctionId)
          .call()
          .then(auction => {
            this.setState(prevState => ({
              auctions: {
                ...prevState.auctions,
                [auction["id"]]: auction
              }
            }));
          });
      }
    });
  }
  //#endregion getDashboardData()

  //#region getWalletInfo()
  async getWalletInfo() {
    if (window.ethereum) {
      window.ethereum.autoRefreshOnNetworkChange = false;
      window.web3 = new Web3(window.ethereum);
    } else {
      console.log(
        "Please install MetaMask. How To instructions can be found here: https://www.youtube.com/watch?v=wTlI2_zxXpU"
      );
      return 0;
    }

    await window.ethereum
      .enable()
      .then(accounts => {
        console.log("Wallet access approval granted");
        console.log("fromAddress = ", accounts[0]);
        this.setState({ fromAddress: accounts[0] });

        // this handler will fire when account is changed in MetaMask
        window.ethereum.on("accountsChanged", accounts => {
          // Note: accounts[0] and window.ethereum.selectedAddress are the same
          console.log("updated fromAddress = ", accounts[0]);
          this.setState({ fromAddress: accounts[0] });
        });
      })
      // User denied account access...
      .catch(error => {
        console.log(
          "maybe user didn't give permission to use wallet??. Cannot proceed.",
          error
        );
        this.setState({ fromAccount: 0 });
        return 0;
      });
  }
  //#endregion getWalletInfo()

  //#region getContractInfo()
  async getContractInfo() {
    try {
      this.contract = new window.web3.eth.Contract(
        SMART_CONTRACT_ABI,
        SMART_CONTRACT_ADDRESS
      );
      return -1;
    } catch {
      return 0;
    }
  }
  //#endregion getContactInfo()

  //#region subscribeToAllEvents()
  subscribeToAllEvents() {
    this.contract.events
      .allEvents()
      .on("data", event => {
        console.log(event.event + " - id : " + event.returnValues.id);

        this.contract.methods
          .auctions(event.returnValues.id)
          .call()
          .then(auction => {
            this.setState(prevState => ({
              auctions: {
                ...prevState.auctions,
                [auction["id"]]: auction
              }
            }));
          });
      })
      .on("error", error => {
        console.log("Error occured on subscribe  - ", error);
      });
  }
  //#endregion subscribeToAllEvents()

  //#region componentDidMount()
  componentDidMount() {
    console.log("hello componentDidMount()");

    // if getWalletInfo() returns 0, then we cannot proceed so just return
    if (!this.getWalletInfo()) return;

    // if getContractInfo() returns 0, then we cannot proceed so just return
    if (!this.getContractInfo()) return;

    this.subscribeToAllEvents();

    this.getDashboardData();
  }
  //#endregion

  methodSend(methodName, auctionId, guid, payload) {
    this.contract.methods[methodName](auctionId, guid)
      .send(payload)
      .then(receipt => {
        console.log("transaction submitted");
      })
      .catch(err => {
        console.log("error - ", err.message);
      });
  }

  onChangeBidAmount(e) {
    console.log("onChangeBidAmount()");

    this.setState({
      bidAmount: e.target.value
    });
  }

  onClickBidButton(e) {
    console.log("onClickBidButton()");

    const methodName = "bid";
    const guid = this.guid();
    const auctionId = this.state.checked["0"];
    const payload = {
      from: this.state.fromAddress,
      value: window.web3.utils.toWei(this.state.bidAmount.toString(), "wei")
    };

    this.methodSend(methodName, auctionId, guid, payload);
  }

  onClickPaymentButton(e) {
    console.log("onClickPaymentButton()");

    const methodName = "sendPayment";
    const guid = this.guid();
    const auctionId = this.state.checked["0"];
    const payload = {
      from: this.state.fromAddress
    };

    this.methodSend(methodName, auctionId, guid, payload);
  }

  onClickReceivedButton(e) {
    console.log("onClickReceivedButton()");

    const methodName = "confirmDelivery";
    const guid = this.guid();
    const auctionId = this.state.checked["0"];
    const payload = {
      from: this.state.fromAddress
    };

    this.methodSend(methodName, auctionId, guid, payload);
  }

  onClickShippedButton(e) {
    console.log("onClickShippedButton()");

    const methodName = "confirmShipment";
    const guid = this.guid();
    const auctionId = this.state.checked["0"];
    const payload = {
      from: this.state.fromAddress
    };

    this.methodSend(methodName, auctionId, guid, payload);
  }

  onClickEndButton(e) {
    console.log("onClickEndButton()");

    const methodName = "endAuction";
    const guid = this.guid();
    const auctionId = this.state.checked["0"];
    const payload = {
      from: this.state.fromAddress
    };

    this.methodSend(methodName, auctionId, guid, payload);
  }

  handler(value) {
    console.log("handler() - ", value);

    var currentIndex = this.state.checked.indexOf(value);
    var newChecked = [...this.state.checked];

    console.log("handler() - 123 = ", currentIndex);

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({ checked: newChecked });
  }

  guid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // <Demo4 auctions={this.state.auctions} />

  //#region main render()
  render() {
    console.log("hello - from render");
    return (
      <Card>
        <Card.Header className="text-center form-h1">Auction DApp</Card.Header>

        <Card.Body className="text-left bg-light-blue">
          <Card.Text>
            <b>Welcome to the Very Simple Decentralized Auction App!</b>
            <br /> Developed by KryptCraft
          </Card.Text>
        </Card.Body>
        {/* <Demo auctions={this.state.auctions} /> */}
        <Demo
          auctions={this.state.auctions}
          handler={this.handler}
          checked={this.state.checked}
        />

        <div id="BidderDiv">
          <Form>
            <Form.Group as={Row} controlId="formHorizontalBid">
              <Form.Label column sm={2}>
                Bid:
              </Form.Label>
              <Col sm={4}>
                <Form.Control
                  type="numeric"
                  disabled={this.state.checked.length > 1 ? true : false}
                  onChange={e => this.onChangeBidAmount(e)}
                />
              </Col>
            </Form.Group>
          </Form>

          <Button
            disabled={this.state.checked.length > 1 ? true : false}
            type="button"
            variant="outline-primary"
            className="btn mr-2"
            onClick={e => this.onClickBidButton(e)}
          >
            Bid
          </Button>
        </div>

        <div id="WinnerDiv">
          <Button
            disabled={this.state.checked.length > 1 ? true : false}
            type="button"
            variant="outline-primary"
            className="btn float-left mr-2"
            onClick={e => this.onClickPaymentButton(e)}
          >
            Payment
          </Button>
          <Button
            disabled={this.state.checked.length > 1 ? true : false}
            type="button"
            variant="outline-primary"
            className="btn float-left mr-2"
            onClick={e => this.onClickReceivedButton(e)}
          >
            Received
          </Button>
        </div>
        <div id="OwnerDiv">
          <Button
            disabled={this.state.checked.length > 1 ? true : false}
            type="button"
            variant="outline-primary"
            className="btn float-left mr-2"
            onClick={e => this.onClickShippedButton(e)}
          >
            Shipped
          </Button>
          <Button
            disabled={this.state.checked.length > 1 ? true : false}
            type="button"
            variant="outline-primary"
            className="btn float-left mr-2"
            onClick={e => this.onClickEndButton(e)}
          >
            End
          </Button>
        </div>
      </Card>
    );
  }
}

//#endregion main render()

//#endregion
