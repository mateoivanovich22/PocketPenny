import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {isValidPassword } from "../utils";
import UserModel from "../models/users";
// import { Strategy as GitHubStrategy } from "passport-github2";

// import config from "./config";

// const HOST = config.server.host

const initializePassport = () => {

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await UserModel.findOne({ email: username });
          if (!user) {
            return done(null, false, {
              message: "Correo electrónico incorrecto.",
            });
          }

          const passwordMatch = isValidPassword(user, password);

          if (!passwordMatch) {
            return done(null, false, { message: "Contraseña incorrecta." });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

//   passport.use(
//     "github",
//     new GitHubStrategy(
//       {
//         clientID: "Iv1.eeaab075a5ab9e44",
//         clientSecret: "c0c3c81c9d25c190289cfa0849f3875fb1cc8503",
//         callbackURL: `${HOST}/api/users/login/github/callback`,
//       },
//       async (accessToken, refreshToken, profile, done) => {
//         try {
//           let userConCuenta = await UserModel.findOne({
//             email: profile.username,
//           });

//           if (!userConCuenta) {
//             let newUser = {
//               firstname: profile.displayName,
//               lastname: "",
//               email: profile.username,
//               age: 22,
//               password: createHash(profile.id),
//               role: "user",
//             };

//             let result = await UserModel.create(newUser);
//             done(null, result);
//           } else {
//             done(null, userConCuenta);
//           }
//         } catch (error) {
//           return done(error);
//         }
//       }
//     )
//   );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

};

export default initializePassport;