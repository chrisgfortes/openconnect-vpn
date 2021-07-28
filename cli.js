#!/usr/bin/env node
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import connect from "./src/connect";

const cli = () => {
  const yargsInstance = yargs(hideBin(process.argv));
  
  yargsInstance.getOptions().boolean.splice(-2);

  // Options
  yargsInstance
    .option('version', { describe: "Get cli version" })
    .option('reset', { describe: "Reset configuration and connect" })
    .option('config', { describe: "Show configuration with hidden password" })
    .option('config-secure', { describe: "Show configuration showing password" })
    .option('onclose', { describe: "Run a command after disconnect from vpn", type: 'string' })
  
  
  // Commands
  yargsInstance
    .command('$0', '', () => {}, () => yargsInstance.showHelp())
    .command('connect', 'Start the vpn connection', {}, connect);

  yargsInstance.argv;
}

cli();