const mongoose = require("./db");
const { Schema } = mongoose;
const Tool = require("./tool");
const Material = require("./material");

const userSchema = new Schema({
  name: { type: String, required: true, unique: true, dropDups: true },
  age: { type: Number, required: true },
});

userSchema.methods.useItem = function (item) {
  if (item instanceof mongoose.model("Tool")) {
    item.useTool(this._id);
  } else if (item instanceof mongoose.model("Material")) {
    item.use(1); // or specify the amount used
  }
};

userSchema.virtual("usedItems", {
  ref: "Tool",
  localField: "_id",
  foreignField: "borrowedBy",
});

userSchema.methods.buildSomething = async function (buildPlan) {
  const toolNames = Object.keys(buildPlan).filter(
    (key) => typeof buildPlan[key] === "string"
  );
  const materialNames = Object.keys(buildPlan).filter(
    (key) => typeof buildPlan[key] === "number"
  );

  //Check all tools are available
  for (let toolName of toolNames) {
    const tool = await Tool.findOne({ name: toolName });
    if (!tool) {
      throw new Error(`Tool ${toolName} not found.`);
    }
  }

  //Check all materials are available and enough in stock
  notAvailable = false;
  for (let materialName of materialNames) {
    const material = await Material.findOne({ name: materialName });
    if (material) {
      const amountNeeded = buildPlan[materialName];
      if (material.amount < amountNeeded) {
        throw new Error(`Not enough ${materialName} in stock.`);
      }
    } else {
      throw new Error(`Material ${materialName} not found.`);
    }
  }

  // Using the tools specified
  for (let toolName of toolNames) {
    const tool = await Tool.findOne({ name: toolName });
    if (tool) {
      try {
        await this.useItem(tool);
        await tool.save();
        console.log(`${toolName} used successfully.`);
      } catch (err) {
        throw new Error(`Error using ${toolName}: ${err.message}`);
      }
    } else {
      throw new Error(`Tool ${toolName} not found.`);
    }
  }

  // Using the materials specified
  for (let materialName of materialNames) {
    const material = await Material.findOne({ name: materialName });
    if (material) {
      const amountNeeded = buildPlan[materialName];
      try {
        if (material.amount >= amountNeeded) {
          material.amount -= amountNeeded;
          await material.save();
          console.log(`${amountNeeded} of ${materialName} used successfully.`);
        } else {
          throw new Error(`Not enough ${materialName} in stock.`);
        }
      } catch (err) {
        throw new Error(`Error using ${materialName}: ${err.message}`);
      }
    } else {
      throw new Error(`Material ${materialName} not found.`);
    }
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
