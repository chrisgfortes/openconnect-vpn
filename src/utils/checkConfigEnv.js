import chalk from "chalk";
import fs from "fs";
import prompts from "prompts";

const connectionQuestions = [
  {
    type: 'text',
    name: 'portal',
    message: 'Please enter your portal address'
  },
  {
    type: 'text',
    name: 'username',
    message: 'Please enter your username'
  },
  {
    type: 'password',
    name: 'password',
    message: 'Please enter your password'
  }
];

const createEnvFile = (filePath, fileData) => {
  const data = Object.entries(fileData).reduce((acc, [key, value]) => acc.concat(`${key}=${value}\n`), '');
  fs.writeFileSync(filePath, data, { encoding:'utf8', flag: 'w' });
};

const checkConfigEnv = async (env, envFilePath, options) => {
  const envKeys = ['VPN_PORTAL', 'LOGIN_USERNAME', 'LOGIN_PASSWORD'];
  const hasProperConfig = fs.existsSync(envFilePath) && envKeys.every(item => env[item]);

  if(options.config || options['config-secure']) {
    console.log(chalk.yellow('-------- VPN CONNECTION CONFIG --------'));
    console.log(`${chalk.white.bold('Portal Address:')} ${env.VPN_PORTAL}`);
    console.log(`${chalk.white.bold('Username:')} ${env.LOGIN_USERNAME}`);
    console.log(`${chalk.white.bold('Password:')} ${options['config-secure'] ? env.LOGIN_PASSWORD : '********'}`);
    console.log(chalk.yellow('---------------------------------------'));
    process.exit(0);
  } else if(options.reset || !hasProperConfig) {
    const response = await prompts(connectionQuestions);

    if(response.portal && response.username && response.password) {
      const envConfig = {
        [envKeys[0]]: response.portal,
        [envKeys[1]]: response.username,
        [envKeys[2]]: response.password,
      };

      createEnvFile(envFilePath, envConfig);

      return Promise.resolve(envConfig);
    } else {
      return Promise.reject();
    }
  };

  return Promise.resolve(env);
};

export default checkConfigEnv;