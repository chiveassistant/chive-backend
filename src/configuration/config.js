import dotenv from "dotenv";
dotenv.config({ silent: true });

var environmentKeys = ["PASSWORDHASH", "JWTHASH"];

environmentKeys = environmentKeys.filter(key => {
  if (typeof process.env[key] === "undefined") {
    return true; // [key is present, key name]
  }
  return false;
});

if (environmentKeys.length > 0) {
  throw new Error(
    `Failed to load environment variables: ${environmentKeys.join(" ")}`
  );
}

export const passwordHash = parseInt(process.env.PASSWORDHASH);
export const jwtHash = process.env.JWTHASH;
