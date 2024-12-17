import fs from "node:fs/promises";
import "dotenv/config";

const SECRETS_FILE_PATH = process.env.SECRET_FILE_PATH;

export async function getSecrets() {
  const secrets = await fs.readFile(SECRETS_FILE_PATH, { encoding: "utf8" });
  return secrets;
}
