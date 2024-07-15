// backend/routes/orgs.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/getupdates/:userId'), async (req,res) =>{
  const user = await User.findById(req.params.userId);
  if (user){
    res.status(200).json(user.bought_stocks);
  }else{
    res.status(404).json("user not found");
  }
}
router.get('/new/:id', async (req,res) =>{
  //console.log(req.params.id);
  const user = await User.findById(req.params.id);
  if (user){
    res.json(user.bought_stocks);
  }else{
    res.json("errrrrrrr");
  }
})
// Get stock data for an organization
router.post('/sell/:id', async (req, res) =>{
    const userId = req.params.id;
    const {symbol,price,quantity} = await req.body;
    //console.log(symbol);
    try{
      const user = await User.findById(userId);
      if (user){
        const stockIndex = user.bought_stocks.findIndex(stock => stock.symbol === symbol);
        if (stockIndex !== -1) {
          if (quantity-user.bought_stocks[stockIndex].quantity===0){
            user.bought_stocks[stockIndex].status = "Close";
          }; 
          user.bought_stocks[stockIndex].pl =user.bought_stocks[stockIndex].pl+(price*quantity)-(user.bought_stocks[stockIndex].price*quantity);
          user.bought_stocks[stockIndex].quantity = user.bought_stocks[stockIndex].quantity-quantity;
          user.bought_stocks[stockIndex].closeDate = new Date();
          user.demat_amnt = user.demat_amnt + ((price-user.bought_stocks[stockIndex].price)*quantity)+user.bought_stocks[stockIndex].price*quantity; 
          user.net_pl = user.net_pl+(price*quantity)-(user.bought_stocks[stockIndex].price*quantity);
          await user.save();
          return res.status(200).json({ msg: `Sold Successfully, Profit: ${(price*quantity)-(user.bought_stocks[stockIndex].price*quantity)} Rs` });
        }else{
          return res.status(300).json({ msg: "cannot sell stocks that you dont have" });
        }
      }else{
        return res.status(300).json({ msg: "Failed to sell!!" });
      }

    }catch{
        return res.status(300).send("failed to fetch user");
    }
});
/*const user = await User.findOne({ 'sold_stocks.symbol': symbol }).exec();

if (user) {
  // Find the index of the matching sold_stock entry
  const stockIndex = user.sold_stocks.findIndex(stock => stock.symbol === symbol);

  if (stockIndex !== -1) {
    // Update the existing entry
    user.sold_stocks[stockIndex] = {
      ...user.sold_stocks[stockIndex],
      // Add your new data here
      newField: 'new value',
    };
  } else {
    // If the symbol doesn't exist in sold_stocks, add a new entry
    user.sold_stocks.push({
      symbol: symbol,
      // Add your new data here
      newField: 'new value',
    });
  }

  // Save the updated user document
  await user.save();
} else {
  console.log('User not found');
} */

router.post('/buy/:id', async (req, res) =>{
  const userId = req.params.id;
  const {symbol,price,quantity} = await req.body;
  //console.log(symbol);
  try{
    const user = await User.findById(userId);
    if (user){
      const stockIndex = user.bought_stocks.findIndex(stock => stock.symbol === symbol);
      if (stockIndex !== -1) {
        if (user.bought_stocks[stockIndex].status === "Open"){
          return res.status(300).json({ msg: "Trade is open!\n Sorry! we don't allow multiple trade on  same stock" });
        }else{
          user.bought_stocks[stockIndex].quantity = quantity;
          user.bought_stocks[stockIndex].price = price;
          user.bought_stocks[stockIndex].status = "Open"; 
        }
      }else{
        user.bought_stocks= [{
          symbol: symbol,
          price: price,
          status: "Open",
          quantity: quantity,
          pl: 0,
        },...user.bought_stocks];
      }
      user.investment_amnt = user.investment_amnt+(price*quantity);
      user.demat_amnt = user.demat_amnt - (price*quantity);
      await user.save();
      return res.status(200).json({ msg: "Bought Successfully" });
    }else{
      return res.status(400).json({ msg: "Failed to buy!!" });
    }

  }catch{
      return res.status(400).send("failed to fetch user");
  }
});


module.exports = router;


