import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");

async function main() {
  // address of the router and the tokens
  const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const WETHAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

  const TOKEN_HOLDER = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";

  // impersonating
  await helpers.impersonateAccount(TOKEN_HOLDER);
  const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

  // getting the instance of the tokens
  const USDC = await ethers.getContractAt(
    "IERC20",
    USDCAddress,
    impersonatedSigner
  );
  const DAI = await ethers.getContractAt("IERC20", DAIAddress);
  const WETH = await ethers.getContractAt("IERC20", WETHAddress);

  // getting the instance of the router
  const ROUTER = await ethers.getContractAt(
    "IUniswapV2Router",
    ROUTER_ADDRESS,
    impersonatedSigner
  );

  // getting the balance of the tokens
  const usdcBalance = await USDC.balanceOf(TOKEN_HOLDER);
  const daiBalance = await DAI.balanceOf(TOKEN_HOLDER);
  const wethBalance = await WETH.balanceOf(TOKEN_HOLDER);

  console.log("USDC balance: ", usdcBalance.toString());
  console.log("DAI balance: ", daiBalance.toString());
  console.log("WETH balance: ", wethBalance.toString());

  const amountOut = ethers.parseUnits("2", 18);
  const amountInMax = ethers.parseUnits("1000", 6);

  // deadline
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  // approval
  console.log("Approving tokens...");
  await USDC.approve(ROUTER_ADDRESS, amountOut);
  console.log("Tokens approved!");

  // swapping happening here
  const swapTx = await ROUTER.connect(impersonatedSigner).swapTokensForExactETH(
    amountOut,
    amountInMax,
    [USDC, WETH],
    TOKEN_HOLDER,
    deadline
  );

  await swapTx.wait();

  const balAfterSwap = await ethers.provider.getBalance(TOKEN_HOLDER);
  console.log({
    ETHERSBALANCEAFTERSWAP: ethers.formatUnits(balAfterSwap.toString(), 18),
  });

  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

// swapTokensForExactTokens
// addLiquidity
