import dotenv from "dotenv";
dotenv.config({ silent: true });

var environmentKeys = [
  "SALTROUNDS",
  "TOKENSECRET",
  "SERVERPORT",
  "CORSORIGIN",
  "CORSCOOKIE"
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
export const corsOrigin = new RegExp(process.env.CORSORIGIN);
export const corsCookie = process.env.CORSCOOKIE;
