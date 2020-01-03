
  this.state = {
    food: {
      sandwich: {
        capsicum: true,
        crackers: true,
        mayonnaise: true
      },
      pizza: {
        jalapeno: true,
        extraCheese: false
      }
    }
  }

  this.setState(prevState => ({
    food: {
      ...prevState.food,           // copy all of the existing food object
      pizza: {                     // specific we want to taret pizza object of food
        ...prevState.food.pizza,   // copy all food.pizza key-value pairs
        extraCheese: true          // update value of specific key
      }
    }
  }))

this.setState(prevState => ({
  auctions: {
    ...prevState.auctions,
    auctions: { 
      ...prevState.auctions.auction['id'],
      auction
    }
  }
}))

var auctions = {
  1 : {id: 1, itemName: "car"},
  2 : {id: 2, itemName: "boat"}
  }

