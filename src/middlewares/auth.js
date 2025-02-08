import passport from "passport";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError.js";
import { roleRights } from "../config/roles.js";

const verifyCallback =
  (req, resolve, reject, requiredRights) => async (err, user, info) => {
    console.log("ddd", { err, info, user,requiredRights });
    if (err || info || !user) {
      const msg =
        // eslint-disable-next-line no-nested-ternary
        info &&
        info.message === "jwt malformed" &&
        requiredRights.includes("scan")
          ? "The QR cod is not recognized"
          : requiredRights.includes("scan")
          ? "Unauthorised"
          : "Please authenticate";
      return reject(new ApiError(httpStatus.UNAUTHORIZED, msg));
    }
    if (user && user.isDeleted) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, "Account deleted"));
    }
    if (user.isBlock) {
      return reject(
        new ApiError(httpStatus.FORBIDDEN, "You have blocked by Admin")
      );
    }

    req.user = user;

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role);
      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights.includes(requiredRight)
      );
      if (!hasRequiredRights && req.params.userId !== user.id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
      }
    }

    resolve();
  };

const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

export default auth;
