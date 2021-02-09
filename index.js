import "dotenv/config";
import os from "os";
import { exec, execSync } from "child_process";
import puppeteer from "puppeteer";
import { objectToQuery } from "./lib/querystring";

const promisify = (...args) =>
  new Promise((resolve, reject) =>
    exec(...args, { cwd: __dirname }, (err, res) =>
      err ? reject(err) : resolve(res)
    )
  );

const connect = async () => {
  const ENV = process.env;
  console.log("[VPN] Initializing connection with VPN...");

  const list = [
    `openssl s_client -servername ${ENV.VPN_PORTAL}`,
    `-connect ${ENV.VPN_PORTAL}:443`,
    "| openssl x509 -pubkey -noout",
    "| openssl rsa -pubin -outform der",
    "| openssl dgst -sha256 -binary",
    "| openssl enc -base64",
  ];

  console.log("[VPN] Getting certificate signature...");
  const pinShaCert = execSync(list.join(" "));

  const reqParams = [
    "./sbin/openconnect",
    `--protocol=gp ${ENV.VPN_PORTAL}`,
    `--servercert pin-sha256:${pinShaCert.toString().trim()}`,
  ];

  console.log("[VPN] Getting authentication url...");

  const req_url = await promisify(reqParams.join(" ")).catch(
    (error) => error.toString()?.match(/https:\/\/[^\s]+/g)?.[0]
  );

  console.log("[VPN] Authenticating...");

  const browser = await puppeteer.launch({
    headless: true,
  });

  const fields = {
    email: 'input[type="email"]',
    password: "input[type=password]",
    submit: "[type=submit]",
  };

  const page = await browser.newPage();
  await page.goto(req_url, { waitUntil: "domcontentloaded" });

  await page.waitForSelector(fields.email);
  await page.type(fields.email, ENV.LOGIN_USERNAME);

  await page.waitForTimeout(200);

  await page.click(fields.submit);

  await page.waitForSelector(fields.password);
  await page.type(fields.password, ENV.LOGIN_PASSWORD);

  await page.waitForTimeout(1500);
  await page.waitForSelector(fields.submit);
  await page.click(fields.submit);

  await page.waitForSelector(fields.submit);
  await page.click(fields.submit);

  await page.waitForNavigation();

  const bodyHTML = await page.content();
  const cookie = bodyHTML?.match(/(?<=kie\>)(.*)(?=<\/pre)/g)?.[0];

  await browser.close();

  const pyScript = [
    "python3 ./sbin/globalprotect-login.py",
    `-u ${ENV.LOGIN_USERNAME}`,
    `${ENV.VPN_LOGIN_URL}`,
    `prelogin-cookie=${cookie}`,
    "--no-verify",
  ];

  console.log("[VPN] Getting auth cookie...");

  const authArgs = await promisify(pyScript.join(" ")).then((text) =>
    text.match(/(?<=<argument>)(.*?)(?=<\/argument>)/g).filter((item) => item)
  );

  const params = {
    authcookie: authArgs[1],
    portal: authArgs[3],
    user: encodeURIComponent(authArgs[4]),
    domain: encodeURIComponent(authArgs[7]),
    computer: os.hostname(),
    "preferred-ip": "",
  };

  const connectVpnUrl = [
    "sudo ./sbin/openconnect --protocol=gp",
    `--usergroup=gateway ${ENV.VPN_PORTAL}`,
    `--cookie "${objectToQuery(params)}"`,
    `--servercert pin-sha256:${pinShaCert.toString().trim()}`,
  ];

  console.log(`[VPN] Connecting with VPN (${ENV.VPN_PORTAL})...`);

  const connectToVPN = exec(connectVpnUrl.join(" "));

  connectToVPN.stdout.on("data", (message) => console.log(`[VPN] ${message}`));
};

connect();
