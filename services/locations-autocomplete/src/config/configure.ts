import dotenv from "dotenv";
import fs from "fs";

const configure = (): void => {
  const ENV_FILE = `.env.${process.env.NODE_ENV}`;

  try {
    const envConfig = dotenv.parse(fs.readFileSync(ENV_FILE));

    Object.keys(envConfig).forEach(key => {
      process.env[key] = envConfig[key];
    });
  } catch (error) {
    console.log(`Could not open environtment file ${ENV_FILE}`);
    process.exit(1);
  }
};

export default configure;
