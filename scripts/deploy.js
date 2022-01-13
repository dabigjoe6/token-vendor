// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const JoeToken = await hre.ethers.getContractFactory("JoeToken");
  const joeToken = await JoeToken.deploy(1000);

  const joeTokenInstance = await joeToken.deployed();

  console.log("JoeToken deployed to: ", joeToken.address);

  const Vendor = await hre.ethers.getContractFactory("Vendor");
  const vendor = await Vendor.deploy(joeToken.address);

  await vendor.deployed();

  console.log("Vendor deployed to: ", vendor.address);

  let amount = hre.ethers.BigNumber.from(10);
  amount = amount.pow(18);
  amount = amount.mul(1000);

  amount = amount.toString();

  await joeTokenInstance.functions.transfer(vendor.address, amount);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
