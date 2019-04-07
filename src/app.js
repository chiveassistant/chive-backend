import "babel-polyfill";
import cors from "cors";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { json } from "body-parser";
import { connect } from "mongoose";

import schema from "./schemas/schema";

const server = new ApolloServer({
  schema: schema
});

const app = express();

var corsOptions = {
  origin: "localhost",
  credentials: true // <-- REQUIRED backend setting
};
app.use(cors(corsOptions));

server.applyMiddleware({ app });

app.use(json());

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
