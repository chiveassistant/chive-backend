import "babel-polyfill";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { connect } from "mongoose";

import schema from "./schemas/schema";
import { tokenHash } from "./configuration/config";
import { refreshTokens } from "./middleware/auth";

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
    const { user: thinUser } = jwt.verify(token, tokenHash);
    req.user = await User.findOne({ email: thinUser.email });
  } catch (err) {
    const refreshToken = req.cookies["refresh-token"];

    if (!refreshToken) return next();

    const newTokens = await refreshTokens(token, refreshToken);

    if (newTokens.token && newTokens.newRefreshToken) {
      res.cookie("token", newTokens.token, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true
      });
      res.cookie("refresh-token", newTokens.refreshToken, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true
      });
    }

    req.user = newTokens.user;
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
