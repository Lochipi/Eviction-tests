import { HardhatUserConfig , vars} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// configuration
const ALCHEMY_KEY = vars.get("ALCHEMY_KEY");
const PRIVATE_KEY = vars.get("PRIVATE_KEY");
const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY");
const ALCHEMY_MAINNET_API_KEY_URL = vars.get("ALCHEMY_MAINNET_API_KEY_URL");

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/" + ALCHEMY_KEY,
      accounts:[PRIVATE_KEY]
    },
    hardhat: {
      forking: {
        url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
      }
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};

export default config;
