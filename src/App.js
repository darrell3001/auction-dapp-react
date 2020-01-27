//#region imports
import React, { Component } from "react";
import Web3 from "web3";
import { SMART_CONTRACT_ABI, SMART_CONTRACT_ADDRESS } from "./config";

import "./App.css";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";

import AuctionTable from "./AuctionTable";

// import "./auctionStateMappings";
const auctionStateMappings = {
  0: { state: "inProgress", description: "In Progress" },
  1: { state: "awaitingPayment", description: "Ended - Awaiting Payment" },
  2: { state: "awaitingShipment", description: "Ended - Awaiting Shipping" },
  3: { state: "awaitingDelivery", description: "Ended - Awaiting Delivery" },
  4: { state: "complete", description: "Complete" },
  5: { state: "deleted", description: "Deleted" }
}; //#endregion

//#region App - default class
export default class App extends Component {
  //#region constructor
  constructor(props) {
    super(props);
    this.state = {
      fromAddress: 0,
      checked: [],

      newAuctionItemName: "",
      newAuctionDurationInMinutes: "",

      bidAmount: 0,

      auctions: {},

      currentStatus: ""
    };

    this.contract = 0;

    this.getWalletInfo = this.getWalletInfo.bind(this);
    this.getContractInfo = this.getContractInfo.bind(this);
    this.subscribeToAllEvents = this.subscribeToAllEvents.bind(this);
    this.getAuctionCount = this.getAuctionCount.bind(this);
    this.getDashboardData = this.getDashboardData.bind(this);

    this.onClickCheckBox = this.onClickCheckBox.bind(this);
    this.guid = this.guid.bind(this);
    this.onChangeBidAmount = this.onChangeBidAmount.bind(this);
    this.onClickBidButton = this.onClickBidButton.bind(this);
    this.onClickPaymentButton = this.onClickPaymentButton.bind(this);
    this.onClickReceivedButton = this.onClickReceivedButton.bind(this);
    this.onClickShippedButton = this.onClickShippedButton.bind(this);
    this.onClickEndButton = this.onClickEndButton.bind(this);

    this.isAuctionOwnerSelected = this.isAuctionOwnerSelected.bind(this);
    this.isAuctionWinningBidderSelected = this.isAuctionWinningBidderSelected.bind(
      this
    );
    this.canAuctionBeEnded = this.canAuctionBeEnded.bind(this);

    this.timerPop = this.timerPop.bind(this);
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
            if (auctionStateMappings[auction.currentState].state != "deleted") {
              this.setState(prevState => ({
                auctions: {
                  ...prevState.auctions,
                  [auction["id"]]: auction
                }
              }));
            }
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
      .allEvents((error, event) => {
        if (error) {
          this.setState({ currentStatus: "failed to subscribe" });

          setInterval(() => {
            this.timerPop();
          }, 5000);
        }
      })

      .on("data", event => {
        console.log(event.event + " - id : " + event.returnValues.id);

        switch (event.event) {
          case "AuctionDeleted":
            var newAuctions = { ...this.state.auctions };
            delete newAuctions[event.returnValues.id];

            var currentIndex = this.state.checked.indexOf(
              event.returnValues.id
            );
            var newChecked = [...this.state.checked];

            if (currentIndex != -1) {
              newChecked.splice(currentIndex, 1);
            }

            this.setState({ checked: newChecked, auctions: newAuctions });
            break;

          default:
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
        }
      })
      .on("error", error => {
        console.log("Error occured on subscribe  - ", error);
      });
  }
  //#endregion subscribeToAllEvents()

  //#region timerPop()
  timerPop() {
    const msg = "timer pop - " + Date().toLocaleString();
    this.setState({ currentStatus: msg, auctions: {} });
    this.getDashboardData();
  }
  //#endregion subscribeToAllEvents()

  //#region componentDidMount()
  componentDidMount() {
    console.log("hello - componentDidMount()");

    // if getWalletInfo() returns 0, then we cannot proceed so just return
    if (!this.getWalletInfo()) return;

    // if getContractInfo() returns 0, then we cannot proceed so just return
    if (!this.getContractInfo()) return;

    this.subscribeToAllEvents();

    this.getDashboardData();
  }
  //#endregion

  //#region methodSend()
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
  //#endregion

  //#region onChangeNewAuctionItemName()
  onChangeNewAuctionItemName(e) {
    console.log("onChangeNewAuctionItemName()");

    this.setState({
      newAuctionItemName: e.target.value
    });
  }
  //#endregion

  //#region onChangeNewAuctionDurationInMinutes()
  onChangeNewAuctionDurationInMinutes(e) {
    console.log("onChangeNewAuctionDurationInMinutes()");

    this.setState({
      newAuctionDurationInMinutes: e.target.value
    });
  }
  //#endregion

  //#region onClickNewAuctionButton()
  onClickNewAuctionButton(e) {
    console.log("onClickNewAuctionButton()");

    const methodName = "createNewAuction";
    const guid = this.guid();

    const payload = {
      from: this.state.fromAddress
    };

    console.log(this.state.newAuctionItemName);
    console.log(this.state.newAuctionDurationInMinutes);

    this.contract.methods[methodName](
      this.state.newAuctionItemName,
      parseInt(this.state.newAuctionDurationInMinutes),
      guid
    )
      .send(payload)
      .then(receipt => {
        console.log("transaction submitted");
      })
      .catch(err => {
        console.log("error - ", err.message);
      });
  }
  //#endregion

  //#region onChangeBidAmount()
  onChangeBidAmount(e) {
    console.log("onChangeBidAmount()");

    this.setState({
      bidAmount: e.target.value
    });
  }
  //#endregion

  //#region onClickBidButton()
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
  //#endregion

  //#region onClickPaymentButton()
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
  //#endregion

  //#region onClickReceivedButton()
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
  //#endregion

  //#region onClickShippedButton()
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
  //#endregion

  //#region onClickEndButton()
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
  //#endregion

  //#region onClickDeleteButton()
  onClickDeleteButton(e) {
    console.log("onClickDeleteButton()");

    const methodName = "deleteAuction";
    const guid = this.guid();
    const auctionId = this.state.checked["0"];
    const payload = {
      from: this.state.fromAddress
    };

    this.methodSend(methodName, auctionId, guid, payload);
  }
  //#endregion

  //#region onClickCheckBox()
  onClickCheckBox(value) {
    var currentIndex = this.state.checked.indexOf(value);

    if (currentIndex == -1 && this.state.checked.length != 0) return;

    var newChecked = [...this.state.checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({ checked: newChecked });
  }
  //#endregion

  //#region ORIGINALonClickCheckBox()
  // TODO: May need this code is support for multiselect is added
  ORIGINALonClickCheckBox(value) {
    var currentIndex = this.state.checked.indexOf(value);
    var newChecked = [...this.state.checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({ checked: newChecked });
  }
  //#endregion

  isAuctionOwnerSelected() {
    if (this.state.checked.length != 1) return false;

    if (
      this.state.fromAddress.toUpperCase() ==
      this.state.auctions[this.state.checked[0]].owner.toUpperCase()
    ) {
      return true;
    } else {
      return false;
    }
  }

  isAuctionWinningBidderSelected() {
    if (this.state.checked.length != 1) return false;

    if (
      this.state.fromAddress.toUpperCase() ==
      this.state.auctions[this.state.checked[0]].winningBidder.toUpperCase()
    ) {
      return true;
    } else {
      return false;
    }
  }

  canAuctionBeEnded(auction) {
    const auctionEndTime = new Date(auction.endTime * 1000);

    if (auction.currentState == 0) {
      if (auction.maxBidder == 0) {
        return true;
      }

      if (auctionEndTime < new Date()) {
        return true;
      }
    }

    return false;
  }

  //#region guid()
  guid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  //#endregion

  //#region main render()
  render() {
    console.log("hello - render");

    const multiSelected = this.state.checked.length > 1 ? true : false;
    const onlyOneSelected = this.state.checked.length == 1 ? true : false;
    const noneSelected = this.state.checked.length == 0 ? true : false;

    const auctionOwnerIsSelected =
      onlyOneSelected && this.isAuctionOwnerSelected();

    const auctionWinningBidderIsSelected =
      onlyOneSelected && this.isAuctionWinningBidderSelected();

    const auctionStateInProgress =
      onlyOneSelected &&
      this.state.auctions[this.state.checked[0]].currentState == 0;

    const auctionStateAwaitingPayment =
      onlyOneSelected &&
      this.state.auctions[this.state.checked[0]].currentState == 1;

    const auctionStateAwaitingShipment =
      onlyOneSelected &&
      this.state.auctions[this.state.checked[0]].currentState == 2;

    const auctionStateAwaitingDelivery =
      onlyOneSelected &&
      this.state.auctions[this.state.checked[0]].currentState == 3;

    const auctionStateComplete =
      onlyOneSelected &&
      this.state.auctions[this.state.checked[0]].currentState == 4;

    const auctionCanBeEnded =
      onlyOneSelected &&
      this.canAuctionBeEnded(this.state.auctions[this.state.checked[0]]);

    return (
      <Card>
        <Card.Header className="text-center form-h1">Auction DApp</Card.Header>

        <Card.Body className="text-left bg-light-blue">
          <Card.Text>
            <b>Welcome to the Very Simple Decentralized Auction App!</b>
            <br /> Developed by KryptoCraft
          </Card.Text>
        </Card.Body>
        <AuctionTable
          fromAddress={this.state.fromAddress}
          auctions={this.state.auctions}
          handler={this.onClickCheckBox}
          checked={this.state.checked}
        />

        <div id="NewAuctionDiv">
          <Form>
            <Form.Group as={Row}>
              <Form.Label column>New Auction Item:</Form.Label>
              <Col>
                <Form.Control
                  disabled={!noneSelected}
                  onChange={e => this.onChangeNewAuctionItemName(e)}
                />
              </Col>

              <Form.Label column>Auction Duration (Minutes):</Form.Label>
              <Col>
                <Form.Control
                  type="numeric"
                  disabled={!noneSelected}
                  onChange={e => this.onChangeNewAuctionDurationInMinutes(e)}
                />
              </Col>

              <Button
                disabled={!noneSelected}
                type="button"
                variant="outline-primary"
                className="btn"
                onClick={e => this.onClickNewAuctionButton(e)}
              >
                New Auction
              </Button>
            </Form.Group>
          </Form>
        </div>

        <div id="BidderDiv">
          <Form>
            <Form.Group as={Row}>
              <Form.Label column>Bid:</Form.Label>
              <Col>
                <Form.Control
                  type="numeric"
                  disabled={
                    !onlyOneSelected ||
                    auctionOwnerIsSelected ||
                    !auctionStateInProgress
                  }
                  onChange={e => this.onChangeBidAmount(e)}
                />
              </Col>
              <Button
                disabled={
                  !onlyOneSelected ||
                  auctionOwnerIsSelected ||
                  !auctionStateInProgress
                }
                type="button"
                variant="outline-primary"
                className="btn"
                onClick={e => this.onClickBidButton(e)}
              >
                Bid
              </Button>
            </Form.Group>
          </Form>
        </div>

        <div id="WinnerDiv">
          <Button
            disabled={
              !auctionWinningBidderIsSelected || !auctionStateAwaitingPayment
            }
            type="button"
            variant="outline-primary"
            className="btn float-left mr-2"
            onClick={e => this.onClickPaymentButton(e)}
          >
            Payment
          </Button>
          <Button
            disabled={
              !auctionWinningBidderIsSelected || !auctionStateAwaitingDelivery
            }
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
            disabled={!auctionOwnerIsSelected || !auctionStateAwaitingShipment}
            type="button"
            variant="outline-primary"
            className="btn float-left mr-2"
            onClick={e => this.onClickShippedButton(e)}
          >
            Shipped
          </Button>
          <Button
            disabled={!auctionOwnerIsSelected || !auctionCanBeEnded}
            type="button"
            variant="outline-primary"
            className="btn float-left mr-2"
            onClick={e => this.onClickEndButton(e)}
          >
            End
          </Button>
          <Button
            disabled={!auctionOwnerIsSelected || !auctionStateComplete}
            type="button"
            variant="outline-primary"
            className="btn float-left mr-2"
            onClick={e => this.onClickDeleteButton(e)}
          >
            Delete
          </Button>
        </div>
      </Card>
    );
  }
  //#endregion main render()
}
//#endregion
