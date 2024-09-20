const mongoose = require("./db");
const { Schema } = mongoose;

const itemSchema = new Schema({
  name: { type: String, required: true, unique: true, dropDups: true },
  amount: { type: Number, required: true, min: 0 },
  cost: { type: Number, required: true, min: 0 },
});

itemSchema.methods.worth = function () {
  return this.amount * this.cost;
};

itemSchema.methods.newArrival = function (amount) {
  this.amount += amount;
};

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
