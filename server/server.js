var express = require('express');
var { google } = require('googleapis');
var app = express(); 

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true})); 
app.use(express.static('public'));
app.use(express.static('views'));

app.get("/", (req,res) => {
    res.render("index");
});

app.get("/contact", (req,res) => {
    res.render("contact");
});

app.post('/thanks', async (req, res) => {

    const {firstName, lastName, email} = req.body;

    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
});
    

const client = await auth.getClient();

const googleSheets = google.sheets({version: "v4", auth:client});

const spreadsheetID = "1dDqVCN26jUwdsMx1m7DWduyVkAQ1hNPdnt7CkBJ39JQ";

const metaData = await googleSheets.spreadsheets.get({

    auth: auth,
    spreadsheetId: spreadsheetID,
});

const getRows = await googleSheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: spreadsheetID,
    range: "Sheet1",
});

await googleSheets.spreadsheets.values.append({
   
    auth: auth,
    spreadsheetId: spreadsheetID,
    range: "Sheet1!A:C",
    valueInputOption: "USER_ENTERED",
    resource: {
        values: [
            [firstName, lastName, email]
        ],
    }

});

res.render("thanks", {firstName: firstName, lastName: lastName});
});

module.exports = app;
