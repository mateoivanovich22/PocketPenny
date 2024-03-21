import express from 'express'

import session from "express-session";

import homeRouter from './routes/home'

import path from 'path';

import passport from "passport";
import initializePassport from "./config/passport.config";

import cookieParser from 'cookie-parser';

const PORT = 8080

const app = express()

app.use(cookieParser())

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'public', 'html'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "s3cr3t3",
    resave: false,
    saveUninitialized: false,
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('./dist'));

app.listen(PORT, () => {
  console.log(`Alquien se conecto en el puerto ${PORT}`)
})

app.use('/', homeRouter)