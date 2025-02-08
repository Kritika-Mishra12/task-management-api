import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import tokenTypes from './tokens.js';
import User from '../models/user.model.js';
import envVar from './envVar.js'

const jwtOptions = {
  secretOrKey: envVar.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  console.log("payload",payload)
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await User.findById(payload.id);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export default jwtStrategy;
