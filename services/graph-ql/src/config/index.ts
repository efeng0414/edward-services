import dotenv from "dotenv";
import fs from "fs";

export function configure(): void {
  const ENV_FILE = `.env.${process.env.NODE_ENV}`;

  try {
    const envConfig = dotenv.parse(fs.readFileSync(ENV_FILE));

    Object.keys(envConfig).forEach(key => {
      process.env[key] = envConfig[key];
    });
  } catch (error) {
    console.log(`Could not open enviornment file ${ENV_FILE}`);
    process.exit(1);
  }
}

export function isLocal(): boolean {
  return process.env.RUNNING_ON !== "server";
}
