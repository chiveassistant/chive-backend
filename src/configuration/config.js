import dotenv from "dotenv";
dotenv.config({ silent: true });

var environmentKeys = [
  "SALTROUNDS",
  "TOKENSECRET",
  "SERVERPORT",
  "CORSORIGIN",
  "CORSALLOWED"
];

environmentKeys = environmentKeys.filter(key => {
  if (typeof process.env[key] === "undefined") {
    return true; // [key is present, key name]
  }
  return false;
});

if (environmentKeys.length > 0) {
  throw new Error(
    `Failed to load environment variables: ${environmentKeys.join(" ")}
       You may be missing your .env file or the system is not configured properly
`
  );
}

export const saltRounds = parseInt(process.env.SALTROUNDS);
export const tokenHash = process.env.TOKENSECRET;
export const serverPort = process.env.SERVERPORT;
export const corsOrigin = process.env.CORSORIGIN;
export const corsAllowed = process.env.CORSALLOWED;
