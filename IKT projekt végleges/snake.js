import * as elemek from "./elemek.js";

const JATEKMEZO = document.querySelector("#jatekmezo"); // A JATEKMEZO a "jatekmezo" id-vel rendelkező div lesz
const VEGE = document.createElement("div"); // Ebbe lesz kiírva a játék vége
const pont = document.getElementById("score"); // Pontszám megjelenítése
const ELEMNAGYSAG = JATEKMEZO.clientWidth / 10; // Egy-egy kígyó rész és alma nagysága 
const PALYASZELESSEG = JATEKMEZO.clientWidth;
const PALYAMAGASSAG = JATEKMEZO.clientHeight;
const SEBESSEG = 125; // Ennyi ms (milisecundum) 1 "frame" vagyis ennyi időnként mozog a kígyó
let KIGYOFEJ;
let alma = document.createElement("div"); // Ebbe lesz az alma
let fut = false;
let kigyo = []; // Ebbe kerülnek a kígyó testrészei
let el = false;
let pontok = 0;
let elkezdodott = true; // Ahhoz kell, hogy a start gombot ne lehessen többször megnyomni
let helyek = []; // Az alma ranomizálásához az üres helyek
let foroghat = true; // Ahhoz kell hogy addig ne foroghasson a kígyó amíg el nem fordult, mert egy "frame" alatt magába fordulhatna

// Vége felirat stílusa
VEGE.style.fontSize = "20px";
VEGE.style.fontWeight = "bold";
VEGE.style.color = "red";
VEGE.style.position = "absolute";
VEGE.style.marginTop = "-74%";
VEGE.style.left = "44%";
VEGE.style.zIndex = "6";

// A start meg az ujra gomb lenyomására a két eljárás lefut
document.querySelector("#ujra").onclick = ujra;
document.getElementById("start").onclick = start;

// Létrehozom a kezdő kígyót
kigyo_start();

function ujra() {
    if (el == false) { // Ha nem él már a kígyó vagyis véget ért a játék vagy nem kezdődött el
        VEGE.style.fontSize = "20px"; // Vége felirat stílusa
        VEGE.style.fontWeight = "bold"; // Vége felirat stílusa
        VEGE.style.color = "red"; // Vége felirat stílusa
        VEGE.style.position = "absolute"; // Vége felirat stílusa
        VEGE.style.marginTop = "-74%"; // Vége felirat stílusa
        VEGE.style.left = "44%"; // Vége felirat stílusa
        VEGE.style.zIndex = "6"; // Vége felirat stílusa
        pontok = 0; 
        pont.textContent = `${pontok}`;
        VEGE.textContent = "";
        elkezdodott = true;
        fut = false;
        el = true;
        kigyo_start(); // megrajzolom a kezdő kígyót
    }
}

function start() {
    if (elkezdodott == true) { // kezdőértékek
        KIGYOFEJ.irany = "d"; // beállítom a kezdő irányt "jobbra"
        pont.textContent = `${pontok}`; 
        varj();
        elkezdodott = false;
        fut = true;
        el = true;
        window.addEventListener("keydown", iranyvaltozas); // Hozzáadok egy "event figyelőt" az ablakhoz, hogy érzékelje a gomb nyomásokat
        kovi();
    }
}

function kovi() {
    if (fut) {
        setTimeout(() => { // Meghívja a kígyó mozgatását, azt hogy nyert vagy meghalt-e, evett-e almát, kígyó megrajzolását
            mozog(); // majd meghívja magát minden "SEBESSEG" ms alatt
            halal();
            eszik();
            if (el) {
                rajzol();
            }
            kovi();
        }, SEBESSEG);
    }
}

function random_alma() {
    helyek = [];
    for (let y = 0; y < PALYAMAGASSAG / ELEMNAGYSAG; y++) { // létrehozok egy 10x10 elemes listát amiben benne vanak az összes hely a JATEKMEZO-n
        helyek.push([]);
        for (let x = 0; x < PALYASZELESSEG / ELEMNAGYSAG; x++) {
            helyek[y].push([y, x]);
        }
    }
    helyek.forEach(koordinata => { // végigmegyek az összes helyen a JATEKMEZO-bol és ha a kigyo részeinek koordinátaja megegyezik a JATEKMEZO adott koordinatajaval
        for (let i = 0; i < kigyo.length; i++) { // akkor kitörlöm az adott koordinátát
            koordinata.forEach(hely => {
                if (hely[0] * ELEMNAGYSAG == kigyo[i].y + i * ELEMNAGYSAG && hely[1] * ELEMNAGYSAG == kigyo[i].x) {
                    koordinata.splice(koordinata.indexOf(hely), 1);
                }
            });
        }
    });
    helyek = helyek.filter(array => array.length); // ha van olyan sor ahova nem mehet alma (vagyis üres) azt kitörlöm
    let oszlop = helyek[Math.floor(Math.random() * helyek.length)]; // alma helyének randomizálása
    let sor = oszlop[Math.floor(Math.random() * oszlop.length)]; // alma helyének randomizálása
    alma.x = sor[1]; // alma koordinátája
    alma.y = sor[0]; // alma koordinátája
    alma.style.position = "relative"; // alma stílusa
    alma.style.left = alma.x * ELEMNAGYSAG + "px"; // alma stílusa
    alma.style.top = (alma.y - kigyo.length) * ELEMNAGYSAG + "px"; // alma stílusa
    alma.style.width = ELEMNAGYSAG + "px"; // alma stílusa
    alma.style.height = ELEMNAGYSAG + "px"; // alma stílusa
    alma.style.backgroundImage = elemek.ALMA; // alma stílusa
    alma.style.backgroundSize = "contain"; // alma stílusa
    JATEKMEZO.append(alma); // hozzáadom a JATEKMEZO-höz az almát
}

function kigyo_start() {
    while (JATEKMEZO.firstChild) { // kitörlök mindent a JATEKMEZO-ből az összes elemet
        JATEKMEZO.removeChild(JATEKMEZO.firstChild);
    }
    kigyo = []; // kiürítem a kigyo testrészes listát és újra feltöltöm
    for (let j = 0; j < 4; j++) { // létrehozok 4 divet amit belerakok a "kigyo"-ba
        kigyo.push(document.createElement("div"));
        JATEKMEZO.appendChild(kigyo[j]); // hozzáadom a testrészeket a JATEKMEZO-höz
        kigyo[j].style.backgroundImage = elemek.TEST_VIZSZINTES; // testrész stílusa
        kigyo[j].x = (3 - j) * ELEMNAGYSAG; // testrész stílusa
        kigyo[j].y = -(j * ELEMNAGYSAG); // testrész stílusa
        kigyo[j].style.position = "relative"; // testrész stílusa
        kigyo[j].style.backgroundSize = "contain"; // testrész stílusa
        kigyo[j].style.width = ELEMNAGYSAG + "px"; // testrész stílusa
        kigyo[j].style.height = ELEMNAGYSAG + "px"; // testrész stílusa
        kigyo[j].style.left = kigyo[j].x + "px"; // testrész stílusa
        kigyo[j].style.top = kigyo[j].y + "px"; // testrész stílusa
        kigyo[j].irany = "d"; // megadom a testrészek kezdeti irányát
    }
    KIGYOFEJ = kigyo[0]; // megadom a kígyófejet
    rajzol(); // megrajzolom a testrészeket
    random_alma(); // létrehozok és randomizálom az almát
}

const varj = () => new Promise(res => setTimeout(res, SEBESSEG)); // Emiatt fog várni a program SEBESSEG ms-ot 

const iranyvaltozas = async (event) => {
    if (foroghat) {
        foroghat = false; // átállítom a foroghatot hamisra hogy ne tudjon forogni és a lenyomott billentyűre változtatom az irányt
        if (KIGYOFEJ.irany == "w" && event.key == "d") {
            KIGYOFEJ.irany = "d";
        }
        else if (KIGYOFEJ.irany == "w" && event.key == "a") {
            KIGYOFEJ.irany = "a";
        }
        else if (KIGYOFEJ.irany == "s" && event.key == "d") {
            KIGYOFEJ.irany = "d";
        }
        else if (KIGYOFEJ.irany == "s" && event.key == "a") {
            KIGYOFEJ.irany = "a";
        }
        else if (KIGYOFEJ.irany == "a" && event.key == "w") {
            KIGYOFEJ.irany = "w";
        }
        else if (KIGYOFEJ.irany == "a" && event.key == "s") {
            KIGYOFEJ.irany = "s";
        }
        else if (KIGYOFEJ.irany == "d" && event.key == "w") {
            KIGYOFEJ.irany = "w";
        }
        else if (KIGYOFEJ.irany == "d" && event.key == "s") {
            KIGYOFEJ.irany = "s";
        }
        await varj(); // miután várt a program SEBESSEG ms-ot a foroghat újra igaz lesz
        foroghat = true;
    }
}

function mozog() {
    for (let k = 0; k < kigyo.length; k++) { // végigmegyek a kígyó testrészein
        if (k != 0) { // ha nem a fej akkor megnézi a jelenlegi és az azelőtti testrész viszonyát és átállítja a testrész irányát
            if (kigyo[k - 1].x - kigyo[k].x == 0 && kigyo[k - 1].y - (kigyo[k].y + ELEMNAGYSAG) == ELEMNAGYSAG) {
                kigyo[k].irany = "s";
            }
            if (kigyo[k - 1].x - kigyo[k].x == 0 && kigyo[k - 1].y - (kigyo[k].y + ELEMNAGYSAG) == -ELEMNAGYSAG) {
                kigyo[k].irany = "w";
            }
            if (kigyo[k - 1].x - kigyo[k].x == ELEMNAGYSAG && kigyo[k - 1].y - (kigyo[k].y + ELEMNAGYSAG) == 0) {
                kigyo[k].irany = "d";
            }
            if (kigyo[k - 1].x - kigyo[k].x == -ELEMNAGYSAG && kigyo[k - 1].y - (kigyo[k].y + ELEMNAGYSAG) == 0) {
                kigyo[k].irany = "a";
            }
        }
    }
    kigyo.forEach(resz => { // végigmegy a kigyú testrészein és az iránynak megfelelően növeli vagy csökkenti a koordinátáit
        if (resz.irany == "s") {
            resz.y += ELEMNAGYSAG;
        }
        if (resz.irany == "w") {
            resz.y -= ELEMNAGYSAG;
        }
        if (resz.irany == "d") {
            resz.x += ELEMNAGYSAG;
        }
        if (resz.irany == "a") {
            resz.x -= ELEMNAGYSAG;
        }
    });
}

function halal() {
    for (let m = 1; m < kigyo.length; m++) { // végigmegy a kígyó testén
        if (kigyo[m].x == KIGYOFEJ.x && kigyo[m].y + (m * ELEMNAGYSAG) == KIGYOFEJ.y) { // ha a kígyó fejének a koordinátája megegyezik a testrész koordinátájával akkor vége a játéknak
            fut = false;
            el = false;
            VEGE.textContent = "VÉGE"; // kiírom hogy "VÉGE"
            document.getElementById("tarolo").append(VEGE); // hozzáadom a "tarolo"-hoz a vége feliratot
        }
    }
    if (KIGYOFEJ.x >= PALYASZELESSEG || KIGYOFEJ.x < 0 || KIGYOFEJ.y < 0 || KIGYOFEJ.y >= PALYAMAGASSAG) { // Ha a kígyófej a pályán kívülre esik akkor vége a játéknak
        el = false;
        fut = false;
        VEGE.textContent = "VÉGE"; // kiírom hogy "VÉGE"
        document.getElementById("tarolo").append(VEGE); // hozzáadom a "tarolo"-hoz a vége feliratot
    }
    if (pontok == (PALYAMAGASSAG / ELEMNAGYSAG) * (PALYASZELESSEG / ELEMNAGYSAG) - 4) { // Ha a pontok száma megegyezik a pálya magasságának és a pálya szélességének szorzatával - 4 akkor vége a játéknak
        el = false;
        fut = false;
        VEGE.textContent = "NYERTÉL"; // kiírom hogy "NYERTÉL"
        VEGE.style.left = "47.5%";
        document.getElementById("tarolo").append(VEGE); // hozzáadom a "tarolo"-hoz a vége feliratot
    }
}

function eszik() {
    if (KIGYOFEJ.x == alma.x * ELEMNAGYSAG && KIGYOFEJ.y == alma.y * ELEMNAGYSAG) { // Ha a kígyófej koordinátája megegyezik az alma koordinátájával akkor növelem a pontszámot és randomizálom az almát
        pontok += 1;
        pont.textContent = `${pontok}`;
        kigyo.push(document.createElement("div")); // belerakom a farkat a kigyo testrészeihez
        kigyo[kigyo.length - 1].x = kigyo[kigyo.length - 2].x;
        kigyo[kigyo.length - 1].y = kigyo[kigyo.length - 2].y - ELEMNAGYSAG;
        kigyo[kigyo.length - 1].style.left = kigyo[kigyo.length - 1].x;
        kigyo[kigyo.length - 1].style.top = kigyo[kigyo.length - 1].y;
        kigyo[kigyo.length - 1].style.backgroundSize = "contain";
        kigyo[kigyo.length - 1].style.width = ELEMNAGYSAG + "px";
        kigyo[kigyo.length - 1].style.height = ELEMNAGYSAG + "px";
        kigyo[kigyo.length - 1].style.position = "relative";
        JATEKMEZO.append(kigyo[kigyo.length - 1]); // Hozzáadom a farkat a JATEKMEZO-höz
        random_alma();
    }
}

function rajzol() {
    for (let l = 0; l < kigyo.length; l++) { // végig megyek a kígyó összes testrészén és irányának megfelelően megrajzolom
        if (l == 0) { // Fej
            if (kigyo[l].irany == "s") {
                kigyo[l].style.backgroundImage = elemek.FEJ_LE;
            }
            if (kigyo[l].irany == "w") {
                kigyo[l].style.backgroundImage = elemek.FEJ_FEL;
            }
            if (kigyo[l].irany == "a") {
                kigyo[l].style.backgroundImage = elemek.FEJ_BALRA;
            }
            if (kigyo[l].irany == "d") {
                kigyo[l].style.backgroundImage = elemek.FEJ_JOBBRA;
            }
        }
        if (l < kigyo.length - 1 && l > 0) { // test
            if (kigyo[l - 1].irany == "s" && kigyo[l].irany == "d") {
                kigyo[l].style.backgroundImage = elemek.TEST_SAROK3;
            }
            if (kigyo[l - 1].irany == "s" && kigyo[l].irany == "a") {
                kigyo[l].style.backgroundImage = elemek.TEST_SAROK1;
            }
            if (kigyo[l - 1].irany == "s" && kigyo[l].irany == "s") {
                kigyo[l].style.backgroundImage = elemek.TEST_FUGGOLEGES;
            }
            if (kigyo[l - 1].irany == "w" && kigyo[l].irany == "d") {
                kigyo[l].style.backgroundImage = elemek.TEST_SAROK4;
            }
            if (kigyo[l - 1].irany == "w" && kigyo[l].irany == "a") {
                kigyo[l].style.backgroundImage = elemek.TEST_SAROK2;
            }
            if (kigyo[l - 1].irany == "w" && kigyo[l].irany == "w") {
                kigyo[l].style.backgroundImage = elemek.TEST_FUGGOLEGES;
            }
            if (kigyo[l - 1].irany == "d" && kigyo[l].irany == "w") {
                kigyo[l].style.backgroundImage = elemek.TEST_SAROK1;
            }
            if (kigyo[l - 1].irany == "d" && kigyo[l].irany == "s") {
                kigyo[l].style.backgroundImage = elemek.TEST_SAROK2;
            }
            if (kigyo[l - 1].irany == "d" && kigyo[l].irany == "d") {
                kigyo[l].style.backgroundImage = elemek.TEST_VIZSZINTES;
            }
            if (kigyo[l - 1].irany == "a" && kigyo[l].irany == "w") {
                kigyo[l].style.backgroundImage = elemek.TEST_SAROK3;
            }
            if (kigyo[l - 1].irany == "a" && kigyo[l].irany == "s") {
                kigyo[l].style.backgroundImage = elemek.TEST_SAROK4;
            }
            if (kigyo[l - 1].irany == "a" && kigyo[l].irany == "a") {
                kigyo[l].style.backgroundImage = elemek.TEST_VIZSZINTES;
            }
        }
        farok(); // farok
        kigyo[l].style.left = kigyo[l].x + "px"; // frissítem a testrészek x koordinátáját
        kigyo[l].style.top = kigyo[l].y + "px"; // frissítem a testrészek y koordinátáját
    }
}

function farok() {
    let farok_index = kigyo.length - 1; // megadom a jelenlegi farok indexét
    if (kigyo[farok_index].x == kigyo[kigyo.length - 2].x && kigyo[farok_index].y == kigyo[kigyo.length - 2].y - ELEMNAGYSAG) { // Ha a jelenlegi farok és az előző farok koordinátája megegyezik akkor a jelenlegi farok az előző farok lesz
        farok_index = kigyo.length - 2; // azért hogy amikor növekszik a kígyó az utolsó eleme farok legyen nem pedig test
    }
    // A farok irányának megfelelően adom meg a képét
    if (kigyo[farok_index - 1].irany == "s") { 
        kigyo[farok_index].style.backgroundImage = elemek.FAROK_LE;
    }
    if (kigyo[farok_index - 1].irany == "w") {
        kigyo[farok_index].style.backgroundImage = elemek.FAROK_FEL;
    }
    if (kigyo[farok_index - 1].irany == "a") {
        kigyo[farok_index].style.backgroundImage = elemek.FAROK_BALRA;
    }
    if (kigyo[farok_index - 1].irany == "d") {
        kigyo[farok_index].style.backgroundImage = elemek.FAROK_JOBBRA;
    }
}