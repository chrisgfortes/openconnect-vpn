import { exec } from "child_process";
import path from "path";

const promisify = (command, { cwd }) => {
  return new Promise((resolve, reject) =>
    exec(command, { cwd: path.resolve(cwd || __dirname) }, (err, res) =>
      err ? reject(err) : resolve(res)
    )
  );
}

export default promisify;