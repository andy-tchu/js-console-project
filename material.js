const Item = require('./item');
const { Schema } = require('mongoose');

const materialSchema = new Schema({
  supplier: { type: String, required: true },
  quality: { type: String, required: true }
});

materialSchema.methods.use = function(amountUsed) {
  if (this.amount >= amountUsed) {
    this.amount -= amountUsed;
  } else {
    throw new Error('Not enough material in stock');
  }
};

const Material = Item.discriminator('Material', materialSchema);
module.exports = Material;
