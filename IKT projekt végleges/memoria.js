import * as kepek from "./elemek.js"; // beimportálom a képeket az elemek.js fájlból (modulból)

const JATEKMEZO = document.getElementById("tarolo"); // A JATEKMEZO "változó" a tarolo div
const SZELESSEG = JATEKMEZO.clientWidth;
const MAGASSAG = JATEKMEZO.clientHeight;
const NAGYSAG = 4; // a tábla nagysága (4x4)
let elemek = []; // ebbe kerülnek bele a gombok
let hatterek = [kepek.BILLENTYUZET, kepek.BILLENTYUZET,kepek.EGER, kepek.EGER,kepek.FEJHALLGATO, kepek.FEJHALLGATO,kepek.GEPHAZ, kepek.GEPHAZ,kepek.MIKROFON, kepek.MIKROFON,kepek.MONITOR, kepek.MONITOR,kepek.USB, kepek.USB,kepek.WEBCAM, kepek.WEBCAM]; // ezek lesznek a hatterképek
let pontszam = 0;
let gridTemplateColumns = ""; // a tábla elrendezéséhez kell
let gridTemplateRows = ""; // a tábla elrendezéséhez kell
let elso = true;
let kattinthat = true;
let elozo; // eltárolja az előzőleg megnyomott gombot (az összehasonlításhoz kell)
let hatter; // a hátterek randomizálásához kell

start();

function start(){
    for (let i = 0; i < NAGYSAG * NAGYSAG; i++) { 
        elemek.push(document.createElement("button")); // 16 gombot hoz létre és belerakja az "elemek" listába 
        elemek[i].style.width = SZELESSEG / NAGYSAG + "px"; // gomb szélessége
        elemek[i].style.height = MAGASSAG / NAGYSAG * 1.5 + "px"; // gomb magassága
        hatter = hatterek[Math.floor(Math.random() * hatterek.length)]; // háttér randomizáció
        elemek[i].hatter = hatter; // háttér randomizáció
        hatterek.splice(hatterek.indexOf(hatter), 1); // háttér randomizáció
        elemek[i].style.background = "transparent"; // gomb háttere
        elemek[i].style.backgroundRepeat = "no-repeat"; // gomb háttere
        elemek[i].style.backgroundSize = "contain"; // gomb háttere
        elemek[i].style.border = "3px solid white"; // gomb körvonal
        elemek[i].style.borderRadius = "15px"; // gomb körvonal
        elemek[i].kattinthato = true; // azt tárolja, hogy meg-e lehet nyomni a gombot
        elemek[i].onclick = fordit; // ha megnyomja a gombot ez az eljárás fut le
        JATEKMEZO.append(elemek[i]); // hozzáadom a gombot a JATEKMEZO-höz
        if (i % NAGYSAG == 0) { // a táblán a gombok (kártyák) elhelyezéséhez kell (mekkora legyen a gombok közötti távolság)
            gridTemplateColumns += `${SZELESSEG / NAGYSAG * 1.2}px `;
            gridTemplateRows += `${MAGASSAG / NAGYSAG * 1.6}px `
        }
    }
    JATEKMEZO.style.gridTemplateColumns = gridTemplateColumns; // a táblán a gombok (kártyák) elhelyezéséhez kell (mekkora legyen a gombok közötti távolság)
    JATEKMEZO.style.gridTemplateRows = gridTemplateRows; // a táblán a gombok (kártyák) elhelyezéséhez kell (mekkora legyen a gombok közötti távolság)
}

function fordit(){
    if (this.kattinthato && elso && kattinthat){ // Beállítom az első gomb hátterét és kellő tulajdonságait
        elozo = this; // ez lesz az a gomb amivel a következőt összehasonlítom
        this.style.backgroundImage = this.hatter;
        this.style.backgroundSize = "contain";
        this.kattinthato = false;
        elso = false;
    }
    else if(this.kattinthato && this != elozo && kattinthat ){ // ha ez nem az első gomb, nem ugyanarra a gombra kattint és rá lehet nyomni a gombra
        if (this.hatter == elozo.hatter){ // ha megegyezik a két gomb háttere átállítom mindkettő hátterét, növelem a pontszámot, a két gombra már nem lehet kattintani
            this.style.backgroundImage = this.hatter;
            this.style.backgroundSize = "contain";
            elozo.kattinthato = false;
            this.kattinthato = false;
            pontszam += 1;
            document.getElementById("pontszam").textContent = `pontszám: ${pontszam}`
            elozo = "";
            elso = true;
        }
        else{ // ha nem egyezik meg a két gomb háttere akkor átállítom a megnyomott gomb hátterét
            kattinthat = false;
            this.style.backgroundImage = this.hatter;
            this.style.backgroundSize = "contain";
            setTimeout(() => { // állítok egy 500ms-os (millisecundum) időzítőt ami alatt nem lehet gombra kattintani és miután letelt visszaállítja a háttereket átlátszóra és újra lehet rájuk kattintani
                kattinthat = true;
                this.style.background = "transparent";
                elozo.style.background = "transparent";
                elozo.kattinthato = true;
                elozo = "";
                this.kattinthato = true;
                elso = true;
            }, 500);
        }
    }
    if(pontszam == 2*NAGYSAG){ // ha a pontszám a nagyság kétszerese vagyis meg van az összes pár akkor kiírom a nyertest
        document.getElementById("nyert").textContent = "NYERTÉL"
    }
}

document.getElementById("ujra").onclick = function(){ // Az ujra gomb lenyomásával kitörlöm az összes gombot és mindent visszaállítok kezdeti értékére
    while (JATEKMEZO.firstChild) {
        JATEKMEZO.removeChild(JATEKMEZO.firstChild);
    }
    pontszam = 0;
    gridTemplateColumns = "";
    gridTemplateRows = "";
    elso = true;
    kattinthat = true;
    elozo = "";
    hatter = "";
    hatterek = [kepek.BILLENTYUZET, kepek.BILLENTYUZET,kepek.EGER, kepek.EGER,kepek.FEJHALLGATO, kepek.FEJHALLGATO,kepek.GEPHAZ, kepek.GEPHAZ,kepek.MIKROFON, kepek.MIKROFON,kepek.MONITOR, kepek.MONITOR,kepek.USB, kepek.USB,kepek.WEBCAM, kepek.WEBCAM];
    document.getElementById("nyert").textContent = "";
    document.getElementById("pontszam").textContent = `pontszám: ${pontszam}`;
    start();
}