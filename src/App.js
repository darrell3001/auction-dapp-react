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

import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";

import Demo from "./demo";
// import Demo2 from "./demo2";
// import Demo3 from "./demo3";
//#endregion

//#region App - default class
export default class App extends Component {
  //#region constructor
  constructor(props) {
    super(props);
    this.state = {
      fromAddress: 0,
      contract: 0,
      auctionCount: "",

      auctions: {},

      currentStatus: "",
      lastTransactionStatus: "",

    };

    this.getWalletInfo = this.getWalletInfo.bind(this);
    this.getContractInfo = this.getContractInfo.bind(this);
    this.subscribeToEvents = this.subscribeToEvents.bind(this);
    this.getAuctionCount = this.getAuctionCount.bind(this);
    this.getAuction = this.getAuction.bind(this);
    this.getDashboardData = this.getDashboardData.bind(this);
  }
  //#endregion constructor

  //#region getAuction()
  getAuction(auctionId) {
    return this.contract.methods
      .auctions(auctionId)
      .call()
      .catch(error => {
        console.log("getAuction() - error - ", error.message);
      });
  }
  //#endregion getAuction()

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
        console.log("Approval granted");
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

  subscribeToAllEvents() {
    this.contract.events
      .allEvents()
      .on("data", event => {
        console.log(
          new Date() + " - " + event.event + " - id : " + event.returnValues.id
        );

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

  //#region subscribeToEvens()
  subscribeToEvents() {
    //#region .NewAuctionCreated()
    this.contract.events
      .NewAuctionCreated()
      .on("data", event => {
        console.log("hello888 = ", event);
        if (
          this.state.lastGuid["NewAuctionCreated"] != event.returnValues.guid
        ) {
          this.setState(prevState => ({
            lastGuid: {
              ...prevState.lastGuid,
              NewAuctionCreated: event.returnValues.guid
            }
          }));

          console.log(
            new Date() +
              " - " +
              "NewAuctionCreated.onEvent - New Auction was created. id : " +
              event.returnValues.id +
              ", itemName : " +
              event.returnValues.itemName
          );

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
        console.log("NewAuctionCreated.onEvent(error) - ", error);
      });
    //#endregion .NewAuctionCreated()

    //#region .BidAccepted()
    this.contract.events
      .BidAccepted()
      .on("data", event => {
        if (this.state.lastGuid["BidAccepted"] != event.returnValues.guid) {
          this.setState(prevState => ({
            lastGuid: {
              ...prevState.lastGuid,
              BidAccepted: event.returnValues.guid
            }
          }));
          console.log(
            new Date() +
              " - " +
              "BidAccepted.onEvent - New bid accepted. id : " +
              event.returnValues.id +
              ", maxBidder : " +
              event.returnValues.maxBidder +
              ", maxBid : " +
              event.returnValues.maxBid
          );

          // const newAuctions = this.state.auctions.slice()
          // newIds[event.returnValues.id] = 'B' //execute the manipulations
          // this.setState({ids: newIds}) //set the new state

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
        console.log("BidAccepted.onEvent(error) - ", error);
      });
    //#endregion .BidAccepted()

    //#region .AuctionEnded()
    this.contract.events
      .AuctionEnded()
      .on("data", event => {
        if (this.state.lastGuid["AuctionEnded"] != event.returnValues.guid) {
          this.setState(prevState => ({
            lastGuid: {
              ...prevState.lastGuid,
              AuctionEnded: event.returnValues.guid
            }
          }));
          console.log(
            new Date() +
              " - " +
              "AuctionEnded.onEvent - Auction has ended. id : " +
              event.returnValues.id +
              ", winner : " +
              event.returnValues.winner +
              ", winningBid : " +
              event.returnValues.winningBid
          );

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
        console.log("AuctionEnded.onEvent(error) - ", error);
      });
    // #endregion

    // #region .AuctionDeleted()
    this.contract.events
      .AuctionDeleted()
      .on("data", event => {
        if (this.state.lastGuid["AuctionDeleted"] != event.returnValues.guid) {
          this.setState(prevState => ({
            lastGuid: {
              ...prevState.lastGuid,
              AuctionDeleted: event.returnValues.guid
            }
          }));
          console.log(
            new Date() +
              " - " +
              "AuctionDeleted.onEvent - Auction has been deleted. id : " +
              event.returnValues.id
          );

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
        console.log("AuctionEnded.onEvent(error) - ", error);
      });
    // #endregion

    // #region .WinnerSentPayment()
    this.contract.events
      .WinnerSentPayment()
      .on("data", event => {
        if (
          this.state.lastGuid["WinnerSentPayment"] != event.returnValues.guid
        ) {
          this.setState(prevState => ({
            lastGuid: {
              ...prevState.lastGuid,
              WinnerSentPayment: event.returnValues.guid
            }
          }));
          console.log(
            "WinnerSentPayment.onEvent - Winner has sent payment. id : " +
              event.returnValues.id
          );

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
        console.log("WinnerSentPayment.onEvent(error) - ", error);
      });
    // #endregion

    // #region .OwnerShippedItem()
    this.contract.events
      .OwnerShippedItem()
      .on("data", event => {
        if (
          this.state.lastGuid["OwnerShippedItem"] != event.returnValues.guid
        ) {
          this.setState(prevState => ({
            lastGuid: {
              ...prevState.lastGuid,
              OwnerShippedItem: event.returnValues.guid
            }
          }));
          console.log(
            "OwnerShippedItem.onEvent - Owner shipped item. id : " +
              event.returnValues.id
          );

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
        console.log("OwnerShippedItem.onEvent(error) - ", error);
      });
    // #endregion

    // #region .WinnerReceivedItem()
    this.contract.events
      .WinnerReceivedItem()
      .on("data", event => {
        if (
          this.state.lastGuid["WinnerReceivedItem"] != event.returnValues.guid
        ) {
          this.setState(prevState => ({
            lastGuid: {
              ...prevState.lastGuid,
              WinnerReceivedItem: event.returnValues.guid
            }
          }));
          console.log(
            "WinnerReceivedItem.onEvent - Winner received item. id : " +
              event.returnValues.id
          );

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
        console.log("WinnerReceivedItem.onEvent(error) - ", error);
      });
    // #endregion
  }
  //#endregion

  //#region componentDidMount()
  componentDidMount() {
    console.log("hello componentDidMount()");

    // if getWalletInfo() returns 0, then we cannot proceed so just return
    if (!this.getWalletInfo()) return;

    // if getContractInfo() returns 0, then we cannot proceed so just return
    if (!this.getContractInfo()) return;

    this.subscribeToAllEvents();

    this.getDashboardData();

    //#endregion
  }
  //#endregion

  //#region main render()
  render() {
    console.log("hello - from render");
    return (
      <div className="container">
        // <Demo auctions={this.state.auctions} />
      </div>
    );
  }
}
//#endregion main render()

//#endregion

// <Demo2 contract={this.state.contract} />
// data={Object.keys(this.state.auctions).map(function(key) {
