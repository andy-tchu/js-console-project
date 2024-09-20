const Item = require("./item");
const { Schema } = require("mongoose");

const toolSchema = new Schema({
  usage: { type: String, required: true },
  borrowedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  condition: { type: Number, required: true, min: 1, max: 100 },
});

toolSchema.methods.useTool = function (userId) {
  if (this.condition > 15) {
    this.condition -= 10;
    this.borrowedBy.push(userId);
  } else {
    throw new Error("Tool is in poor condition and cannot be used");
  }
};

toolSchema.methods.fixTool = function () {
  this.condition = Math.min(100, this.condition + 20);
};

const Tool = Item.discriminator("Tool", toolSchema);
module.exports = Tool;
