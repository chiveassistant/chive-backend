import "babel-polyfill";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { connect } from "mongoose";
import jwt from "jsonwebtoken";

import schema from "./schemas/schema";
import { tokenHash } from "./configuration/config";
import { refreshToken } from "./middleware/auth";

import User from "./models/user";

const app = express();

var corsOptions = {
  origin: "http://localhost:3080",
  credentials: true
};

const auth = async (req, res, next) => {
  const token = req.cookies.token;

  console.log("User's Cookies: ", req.cookies);

  if (!token) return next();

  try {
    const { user, expiration } = jwt.verify(token, tokenHash);
    req.user = await User.findOne({ email: user.email });

    // if the token is within 2 days of expiring, refresh it
    if (expiration - Date.now() <= 60 * 60 * 24 * 2) {
      const { newToken, user } = await refreshToken(token);
      if (newToken && user) {
        res.cookie("token", newToken, {
          maxAge: 60 * 60 * 24 * 7, // 7 days
          httpOnly: true
        });
      }
      console.log("Refreshed expiring token");
    }

    console.log("Found user from cookie: ", req.user.email);
  } catch (err) {
    console.log("Check token verify error: ", err);
    console.log("User has been logged out due to inactivity.");
    req.user = user;
  }

  return next();
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(auth);

const server = new ApolloServer({
  schema: schema,
  context: ({ req, res }) => ({
    req: req,
    res: res
  })
});

server.applyMiddleware({ app, cors: corsOptions });

connect(
  "mongodb://localhost:27017/chive",
  { useNewUrlParser: true }
)
  .then(() => {
    var port = 3000;
    app.listen({ port: port }, () =>
      console.log(
        `Server ready at http://localhost:${port}${server.graphqlPath}`
      )
    );
  })
  .catch(err => console.log(err));
