#! /usr/bin/env node
import "dotenv/config";
import path from "path";
import chalk from "chalk";
import checkConfigEnv from "./utils/checkConfigEnv";
import connectVPN from "./utils/connectVPN";

const envPath = path.resolve('./.env');

const connect = (argv) => {
  checkConfigEnv(process.env, envPath, { ...argv })
    .then((env) => connectVPN(argv, env))
    .catch((error) => {
      console.log('[VPN] Connection failed');
      console.log(`[VPN] ${chalk.yellow("Please check your portal address, username, password and try again")}`);
      console.log(error);
      process.exit(1);
    });
}

export default connect;