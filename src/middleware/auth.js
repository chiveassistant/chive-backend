import { jwtHash } from "../configuration/config";

export default (req, res, next) => {
  const authHeader = req.get("authorization");

  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const token = authHeader.split(" ")[1];

  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, jwtHash);
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  if (!decodedToken) {
    req.isAuth = false;
    next();
  }

  req.userEmail = decodedToken.email;
};
