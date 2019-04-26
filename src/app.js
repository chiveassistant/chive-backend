import "babel-polyfill";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

import { ApolloServer } from "apollo-server-express";
import schema from "./schemas/schema";
import { connect } from "mongoose";

import { serverPort, corsOrigin } from "./configuration/config";

import { auth } from "./middleware/auth";

const app = express();

app.use("/health", ({ res }) => {
  res.send("I'm healthy!");
});

app.use("/images/uploads", express.static(__dirname + "/../storage/uploads/"));
app.use("/images/recipes", express.static(__dirname + "/../storage/recipes/"));

var corsOptions = {
  origin: corsOrigin,
  credentials: true
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
    app.listen({ port: serverPort }, () => {
      console.clear();
      console.log(
        `Server ready at http://localhost:${serverPort}${server.graphqlPath}`
      );
    });
  })
  .catch(err => {
    console.log("Encountered error: ", err);
  });
