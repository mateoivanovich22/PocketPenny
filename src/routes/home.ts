import express from 'express'
import path from 'path';

import { createHash } from "../utils";

import { passportCall } from "../utils"

import UsersManager from "../services/usersManager";

import { UserDocument, ExtendedSession } from '../types';

import jwt, { JwtPayload } from 'jsonwebtoken';

import config from "../config/config";

import nodemailer from "nodemailer";

const nodemailerKey = config.nodemailer.key;

const userManager = new UsersManager();

const router = express.Router()

router.get('/', (_req, res) => {
  const htmlPath = path.resolve(__dirname, '../public/html/login.html');
  res.sendFile(htmlPath);
})

router.post('/login', passportCall("login") , async (req, res) => {

  if (!req.user) {
    console.log("Error intentando acceder a su cuenta");
    
    return res.sendStatus(305)
  }

  const userDocument = req.user as UserDocument;

  const userId = userDocument._id;

  try {
    await userManager.updateUserById(userId, { last_connection: new Date() });
    console.log("Last connection actualizada correctamente");
  } catch (err) {
    console.log("Error al actualizar last_connection:", err);
  }

  const extendedSession = req.session as ExtendedSession;
  extendedSession.user = userDocument;

  return res.sendStatus(200);
})

router.get('/register', (_req, res) => {

  const htmlPath = path.resolve(__dirname, '../public/html/register.html');
  res.sendFile(htmlPath);
})

router.post('/register',  async (req, res) => {
  const password1: string = req.body.password1;
  const password2: string = req.body.password2;
  const email: string = req.body.email;

  const userExistent: boolean = await userManager.findUserByEmail(email);

  if(userExistent){
    return res.sendStatus(306);
  }

  if(password1 != password2){
    return res.sendStatus(305)
  }

  const user: object = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: createHash(req.body.password1),
  }

  const newUser = await userManager.createUser(user)

  req.user = newUser;

  if (!req.user) { 
    console.log("Error intentando acceder a su cuenta");
    return res.sendStatus(306)
  } 
  
  const userDocument = req.user as UserDocument;

  const extendedSession = req.session as ExtendedSession;
  extendedSession.user = userDocument;

  return res.sendStatus(200)
})

router.get("/budget", async (req, res) => {
  const extendedSession = req.session as ExtendedSession;
  const user = extendedSession.user

  let noBillsYet: boolean = false;
  let inputAmount: boolean = true;
  let expensesByDay: any = [];

  if(user.totalAmountToSpend == 0) {
    noBillsYet = true
    inputAmount = false
  }

  if(user.gastos.length != 0) {
    const expensesMap = new Map();
        user.gastos.forEach(expense => {
            const dateValue = new Date(expense.date);
            const dateKey = dateValue.toDateString();
            if (!expensesMap.has(dateKey)) {
                expensesMap.set(dateKey, []);
            }
            expensesMap.get(dateKey).push({ ...expense, date: dateValue }); 
        });
        expensesByDay = Array.from(expensesMap, ([date, expenses]) => ({
            date: new Date(date),
            expenses: expenses
        }));
  }
  const categorySet = new Set<string>(); 
  user.gastos.forEach(expense => {
      categorySet.add(expense.description);
  });

  const categories = Array.from(categorySet);
  const expensesByCategory: number[] = categories.map(category => {
      const categoryExpenses = user.gastos.filter(expense => expense.description === category);
      const categoryTotal = categoryExpenses.reduce((total, expense) => total + expense.amount, 0);
      return (categoryTotal / user.totalSpendAmount) * 100;
  });

  const remainingAmount: number = user.totalAmountToSpend - user.totalSpendAmount;

  res.render('budget', { user, noBillsYet, inputAmount, expensesByDay, expensesByCategory , categories, remainingAmount });	
})


router.post("/start", async (req, res) => { 
  const amount = req.body.inputValue

  const extendedSession = req.session as ExtendedSession;

  const userId = extendedSession.user._id;

  const userStart: Object = await userManager.startUser(userId, amount)

  const userDocument = userStart as UserDocument;
  extendedSession.user = userDocument;

  if (userStart) {
    return res.sendStatus(200)
  } else {
    return res.sendStatus(400)
  }
  
});


router.post("/newExpense", async (req, res) => {
  const amount = parseInt(req.body.inputValueAmount);
  const description = req.body.checkedValue;
  const extendedSession = req.session as ExtendedSession;
  const userId = extendedSession.user._id;

  const newUserExpense = await userManager.newExpense(amount, description, userId);
  const userDocument = newUserExpense as UserDocument;
  extendedSession.user = userDocument;

  if(newUserExpense) {
    res.sendStatus(200)
  }else{
    res.sendStatus(400)
  }
    
})

router.post("/remaining-money-new", async (req, res) => {
  const newAmountString: string = req.body.newValue;

  const newAmountNumber: number = parseInt(newAmountString.split(" ")[1])

  const extendedSession = req.session as ExtendedSession;
  const userId = extendedSession.user._id;

  const updateRemainingValue = await userManager.updateRemainingValue( userId , newAmountNumber);

  if(updateRemainingValue){
    const userDocument = updateRemainingValue as UserDocument;
    extendedSession.user = userDocument;

    return res.sendStatus(200)
  }else{
    return res.sendStatus(305)
  }
    
})


router.post("/deleteSpent", async (req, res) => {
  const gastoId = req.body.gastoId;
  const extendedSession = req.session as ExtendedSession;
  const userId = extendedSession.user._id;

  const deleteSpent = await userManager.deleteSpent(gastoId ,userId);

  if(deleteSpent){
    const userDocument = deleteSpent as UserDocument;
    extendedSession.user = userDocument;

    return res.sendStatus(200)
  }else{
    return res.sendStatus(305)
  }

})

router.post("/editSpent", async (req, res) => {
  const newAmountEdit = req.body.newValue;
  const gastoId = req.body.gastoId;

  const newAmountNumber: number = parseInt(newAmountEdit.split(" ")[1])

  const extendedSession = req.session as ExtendedSession;
  const userId = extendedSession.user._id;

  const transactionEdit = await userManager.editSpentTransaction(gastoId , userId ,newAmountNumber)

  if(transactionEdit){
    const userDocument = transactionEdit as UserDocument;
    extendedSession.user = userDocument;
    return res.sendStatus(200)
  }else{
    return res.sendStatus(400)
  }
  
})


router.get("/reset-password",  (_req, res) => {
  const htmlPath = path.resolve(__dirname, '../public/html/resetPassword.html');
  res.sendFile(htmlPath);
})

function generateRandomNumber() {
  return Math.floor(1000 + Math.random() * 9000);
}

router.post("/reset-password", async (req, res) => {
  const email: string = req.body.email;

  const authCode = {authNumber: generateRandomNumber(), email: email}

  const emailChequed = await userManager.findUserByEmail(email);

  if(!emailChequed) {
    return res.sendStatus(404)
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; font-size: 16px;">
      <h2 style="color: #007bff; font-size: 24px; font-weight: bold;">PocketPenny Password Reset</h2>
      <p>Dear User,</p>
      <p>We received a request to reset your password for your PocketPenny account.</p>
      <p style="font-size: 18px; font-weight: bold;">Your Verification Code:</p>
      <p style="font-size: 24px; font-weight: bold; color: #007bff;">${authCode.authNumber}</p>
      <p>Please enter this code on the PocketPenny website to proceed with resetting your password.</p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
      <p>Best regards,</p>
      <p>The PocketPenny Team</p>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: "mateoivanovichichi@gmail.com",
      pass: nodemailerKey,
    },
  });

  const mailOptions = {
    from: "Mateoivanovich43@gmail.com",
    to: email,
    subject: "PocketPenny Password Reset",
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, (err, _info) => {
    if (err) {
      console.log("Error al enviar el correo:", err);
      return;
    }
  });

  const token = jwt.sign(authCode, "mateo123")

  return res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 900000 }).status(200).send();

});

interface AuthPayload extends JwtPayload {
  authNumber: number,
  email:string;
}

router.post("/reset-authorization", async (req, res) => {

  const token = req.cookies.token;

  if (!token) {

      return res.status(401).send("Token not provided");
  }
  
  try {
    const decoded = jwt.verify(token, "mateo123") as AuthPayload;
    const authCode: number = decoded.authNumber;

    const userEnteredCode: number = parseInt(req.body.authCodeUser);

    if (userEnteredCode !== authCode) {
        return res.status(400).send("Invalid authentication code");
    }
    
    return res.sendStatus(200);
  } catch (error) {
      console.log("JWT verification error:", error);
      return res.status(401).send("Invalid token");
  }
})

router.post("/new-password", async(req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send("Token not provided");
  }
  
  try {
    const decoded = jwt.verify(token, "mateo123") as AuthPayload;
    const email: string = decoded.email;

    const newPassword: string = createHash(req.body.newPassword);

    const newUserPass = await userManager.changePassword(email, newPassword)
    
    if(newUserPass) return res.sendStatus(200);

    return res.sendStatus(400);
  } catch (error) {
      console.log("JWT verification error 2:", error);
      return res.status(401).send("Invalid token");
  }
})

export default router
