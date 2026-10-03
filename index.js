const express = require("express");
const loadData = require("./public/script.js");

const app = express();
const PORT = process.env.PORT || 3000;

// EJS setup
app.set("view engine", "ejs");

// Static files
app.use(express.static("public"));

// =========================
// PASSWORD PROTECTION
// =========================

const PASSWORDS = {
    // "/razvan": "home123",
    // "/lectii": "lectii123",
    // "/probleme": "probleme123"
};

function passwordProtection(req, res, next) {

    const password = req.query.password;
    // console.log(aaa);

    if (password === PASSWORDS[req.path]) {
        next();
    } else {
        res.render("pagini/password", {
            page: req.path
        });
    }
}

async function loadPage(req, res, sheet_id, sheet_gid, salut){
    try {

        const data = await loadData(
            sheet_id,
            sheet_gid
        );

        console.log(data);

        res.render("pagini/note_elev", {
            alldata: data,
            salut: salut
        });

    } catch (error) {

        console.error("Error loading data:", error);

        res.status(500).send("Could not load spreadsheet");
    }
}

// Pagini elevi 
app.get(["/razvan", "/Razvan"], passwordProtection, async (req, res) => {
    await loadPage(req, res, 
        sheet_id="1zzT639uqyrLZjR4X1B8-W0DFRSSprRAO_yYXztGv6RI",
        sheet_gid="0",
        salut="Salut, Razvan"
    );
});

app.get(["/andrei", "/Andrei"], passwordProtection, async (req, res) => {
    await loadPage(req, res, 
        sheet_id="1FGGxirCEA4y2tvZ_V9U2Ic2KC-0l8HkohTOGw0jUZbc",
        sheet_gid="0",
        salut="Salut, Andrei"
    );
});
app.get(["/medeea", "/Medeea"], passwordProtection, async (req, res) => {
    await loadPage(req, res, 
        sheet_id="1_FyiOzVEEHb_igexU5Zc2HMUjgeDuQxiDQiTbNuLp_4",
        sheet_gid="0",
        salut="Buna, Medeea"
    );
});
app.get(["/luca", "/Luca"], passwordProtection, async (req, res) => {
    await loadPage(req, res, 
        sheet_id="1Xodcd4RBpl3cFaAUS8JnS7Fw3z7_2-9xfwvlqs6sOik",
        sheet_gid="0",
        salut="Salut, Luca"
    );
});

app.get(["/"], async (req, res) => {
    res.render("pagini/index");
});


app.listen(PORT, () => {
    console.log(`Website running on port ${PORT}`);
});
