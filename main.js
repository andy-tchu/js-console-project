const rl = require("readline-sync");
const mongoose = require("./db");
const Tool = require("./tool");
const Material = require("./material");
const User = require("./user");
const Item = require("./item");

async function main() {
  while (true) {
    console.log(
      `1. Add Tool
2. Add Material
3. Add User
4. Add Item Amount
5. List Items
6. List Users
7. Use Tool
8. Use Material
9. Delete Tool
10. Delete Material
11. Delete User
12. Build Somthing
13. Exit`
    );
    const choice = rl.question("Choose an option: ");
    switch (choice) {
      case "1":
        await addTool();
        break;
      case "2":
        await addMaterial();
        break;
      case "3":
        await addUser();
        break;
      case "4":
        await addItemAmount();
        break;
      case "5":
        await listItems();
        break;
      case "6":
        await listUsers();
        break;
      case "7":
        await useTool();
        break;
      case "8":
        await useMaterial();
        break;
      case "9":
        await delTool();
        break;
      case "10":
        await delMaterial();
        break;
      case "11":
        await delUser();
        break;
      case "12":
        await buildSomething();
        break;
      case "13":
        mongoose.disconnect();
        return;
      default:
        console.log("Invalid option. Try again.");
    }
  }
}

async function addTool() {
  const name = rl.question("Tool name: ");
  const amount = rl.questionInt("Tool amount: ");
  const cost = rl.questionFloat("Tool cost: ");
  const usage = rl.question("Tool usage: ");
  const condition = rl.questionInt("Tool condition (1-100): ");

  const tool = new Tool({ name, amount, cost, usage, condition });
  try {
    await tool.save();
    console.log("Tool added successfully.");
  } catch (err) {
    console.error("Tool add error:", err.message);
  }
}

async function addMaterial() {
  const name = rl.question("Material name: ");
  const amount = rl.questionInt("Material amount: ");
  const cost = rl.questionFloat("Material cost: ");
  const supplier = rl.question("Supplier: ");
  const quality = rl.question("Quality: ");

  const material = new Material({ name, amount, cost, supplier, quality });
  try {
    await material.save();
    console.log("Material added successfully.");
  } catch (err) {
    console.error("Material add error:", err.message);
  }
}

async function addUser() {
  const name = rl.question("User name: ");
  const age = rl.questionInt("User age: ");
  try {
    const user = new User({ name, age });
    await user.save();
    console.log("User added successfully.");
  } catch (err) {
    console.error("User add error:", err.message);
  }
}

async function addItemAmount() {
  const itemName = rl.question("Enter Item name: ");
  const item = await Item.findOne({ name: itemName });
  if (!item) {
    console.log("Item not found");
    return;
  }

  const amount = rl.question("Enter new arrival amount: ");

  try {
    await item.newArrival(amount);
    await item.save();
    console.log("Item amount updated successfully.");
  } catch (err) {
    console.error("Item amount update error:", err.message);
  }
}

async function listItems() {
  const items = await Tool.find().populate("borrowedBy").exec();
  items.forEach((item) => {
    console.log(
      `Tool: ${item.name}, Condition: ${item.condition}, Amount: ${
        item.amount
      }, Borrowed By: ${item.borrowedBy.map((user) => user.name).join(", ")}`
    );
  });
  const materials = await Material.find().exec();
  materials.forEach((item) => {
    console.log(
      `Material: ${item.name}, Supplier: ${item.supplier}, Quality: ${item.quality}, Amount: ${item.amount}`
    );
  });
}

async function listUsers() {
  const users = await User.find().populate("usedItems").exec();
  users.forEach((user) => {
    console.log(
      `Name: ${user.name}, Age: ${user.age}, Used Items: ${user.usedItems
        .map((item) => item.name)
        .join(", ")}`
    );
  });
}

async function useTool() {
  const userName = rl.question("Enter User name: ");
  const user = await User.findOne({ name: userName });
  if (!user) {
    console.log("User not found");
    return;
  }

  const toolName = rl.question("Enter Tool name: ");
  const tool = await Tool.findOne({ name: toolName });
  if (!tool) {
    console.log("Tool not found");
    return;
  }

  try {
    await user.useItem(tool);
    await tool.save();
    console.log("Tool used successfully.");
  } catch (err) {
    console.error("Tool use error: ", err.message);
  }
}

async function useMaterial() {
  const materialName = rl.question("Enter Material name: ");
  const material = await Material.findOne({ name: materialName });
  if (!material) {
    console.log("Material not found");
    return;
  }

  const materialAmountUsed = rl.question("Enter Amount of Material to use: ");

  try {
    await material.use(materialAmountUsed);
    await material.save();
    console.log("Material used successfully.");
  } catch (err) {
    console.error("Material use error: ", err.message);
  }
}

async function delTool(params) {
  const toolName = rl.question("Enter Tool name: ");
  const tool = await Tool.findOne({ name: toolName });
  if (!tool) {
    console.log("Tool not found");
    return;
  }

  try {
    await tool.deleteOne();
    console.log("Tool deleted successfully.");
  } catch (err) {
    console.error("Tool delete error: ", err.message);
  }
}

async function delMaterial(params) {
  const materialName = rl.question("Enter Material name: ");
  const material = await Material.findOne({ name: materialName });
  if (!material) {
    console.log("Material not found");
    return;
  }

  try {
    await material.deleteOne();
    console.log("Material deleted successfully.");
  } catch (err) {
    console.error("Material delete error: ", err.message);
  }
}

async function delUser(params) {
    const userName = rl.question("Enter User name: ");
    const user = await User.findOne({ name: userName });
    if (!user) {
      console.log("User not found");
      return;
    }
  
    try {
      await user.deleteOne();
      console.log("User deleted successfully.");
    } catch (err) {
      console.error("User delete error: ", err.message);
    }
  }

async function buildSomething() {
  const userName = rl.question("Enter User Name: ");
  const user = await User.findOne({ name: userName });
  if (!user) {
    console.log("User not found");
    return;
  }

  const buildPlan = {
    hammer: "hammer",
    screwdriver: "screwdriver",
    nails: 100,
    wood: 20,
  };

  try {
    await user.buildSomething(buildPlan);
    console.log("Somthing builded successfully.");
  } catch (err) {
    console.log("Building somthing error: ", err.message);
  }
}

main();
