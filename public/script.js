const Papa = require("papaparse");



async function loadData(sheetID, sheetGID) {
    const sheetURL =
    `https://docs.google.com/spreadsheets/d/${sheetID}/export?format=csv&gid=${sheetGID}`;

    const response = await fetch(sheetURL);

    if (!response.ok) {
        throw new Error(
            `Could not load Google Sheet: ${response.status}`
        );
    }

    const csv = await response.text();

    const results = Papa.parse(csv, {
        header: true,
        skipEmptyLines: true
    });

    let capitol = "";
    const teme = {};
    const atentie = {};
    const data = [];

    results.data.forEach(row => {
        const note = {};
        if (row["Capitol"] !== "") {
            capitol = row["Capitol"];
        }

        for (const date of Object.keys(row).reverse()) {
            if (
                date !== "Capitol" &&
                date !== "Subcapitol" &&
                row[date] !== ""
            ) {
                if (row["Capitol"] === "MISC") {
                    if (row["Subcapitol"] === "Teme") {
                        teme[date] = row[date];
                    }
                    else if (row["Subcapitol"] === "Atentie") {
                        atentie[date] = row[date];
                    }
                }
                else {
                    if(row[date] === "P"){
                        note[date] = "Predat";
                    }
                    else{
                        note[date] = row[date];
                    }
                } 
            }
        } 
        if (capitol !== "MISC" && Object.keys(note).length > 0) {
            data.push({
                            capitol: capitol,
                            subcapitol: row["Subcapitol"],
                            note: note
            });
        }
    });
    const note_subcap = {};

    for (const item of data) {
        const nota_str = item.note[Object.keys(item.note)[0]];

        note_subcap[item.capitol] ??= {
            "@@@suma": 0,
            "@@@nr_note": 0,
            "@@@medie": 0
        };

        if (!isNaN(nota_str) && nota_str.trim() !== "") {
            const nota = Number(nota_str);

            note_subcap[item.capitol][item.subcapitol] = nota;

            note_subcap[item.capitol]["@@@suma"] += nota;
            note_subcap[item.capitol]["@@@nr_note"]++;

            note_subcap[item.capitol]["@@@medie"] =
                note_subcap[item.capitol]["@@@suma"] /
                note_subcap[item.capitol]["@@@nr_note"];
        }
    }
    console.log(data);
    return {
        data: data,
        teme: teme,
        atentie: atentie,
        note_subcap: note_subcap
    };
}

module.exports = loadData;

/*
function updateWebsite(data) {

    const content = document.getElementById("content");

    content.innerHTML = "";

    for (const item of data) {

        const chapter = document.createElement("div");
        chapter.className = "chapter";

        chapter.innerHTML = `
            <h2>${item.capitol}</h2>
            <h3>${item.subcapitol}</h3>
        `;

        for (const date in item.note) {

            const score = item.note[date];

            const scoreElement = document.createElement("div");

            scoreElement.className = "score";

            scoreElement.textContent =
                `${date}: ${score}`;

            chapter.appendChild(scoreElement);
        }

        content.appendChild(chapter);
    }
}


loadData();

*/