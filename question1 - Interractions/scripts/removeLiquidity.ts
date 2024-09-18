// import { ethers } from "hardhat";
const { ethers } = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");

async function removeLiquidity() {
  const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const TOKEN_HOLDER = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";

  // Impersonate account
  await helpers.impersonateAccount(TOKEN_HOLDER);
  const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

  // Getting router instance
  console.log("Getting token contracts...");
  const ROUTER = await ethers.getContractAt(
    "IUniswapV2Router",
    ROUTER_ADDRESS,
    impersonatedSigner
  );

  const liquidityToken = await ethers.getContractAt(
    "IERC20",
    "0xADDRESS_OF_YOUR_LP_TOKEN",
    impersonatedSigner
  );

  // Get liquidity token balance
  const liquidityBalance = await liquidityToken.balanceOf(TOKEN_HOLDER);
  console.log("Liquidity Token Balance: ", liquidityBalance.toString());

  // Approve router to spend the LP tokens
  await liquidityToken.approve(ROUTER_ADDRESS, liquidityBalance);

  // deadline
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10 

  // Remove liquidity
  console.log("Attempting to remove liquidity...");
  const tx = await ROUTER.connect(impersonatedSigner).removeLiquidity(
    USDCAddress,
    DAIAddress,
    liquidityBalance,
    0,
    0, 
    TOKEN_HOLDER,
    deadline
  );

  await tx.wait();

  const usdcBalance = await (await ethers.getContractAt("IERC20", USDCAddress, impersonatedSigner)).balanceOf(TOKEN_HOLDER);
  const daiBalance = await (await ethers.getContractAt("IERC20", DAIAddress, impersonatedSigner)).balanceOf(TOKEN_HOLDER);

  console.log({
    USDCBALANCE: ethers.formatUnits(usdcBalance.toString(), 6),
    DAIBALANCE: ethers.formatUnits(daiBalance.toString(), 18),
  });
}
