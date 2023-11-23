const grid = document.getElementById("grid");
let buttons = [];
for (let i = 0; i < 9; i++) { // végigmegy egy for ciklus 3x3-szor és létrehoz gombokat
    buttons.push(document.createElement("button")); // berakja a gombokat a "buttons" listába
    buttons[i].style.width = "145px"; // a 3x3-as tábla elemeinek a szélessége
    buttons[i].style.height = "145px"; // a 3x3-as tábla elemeinek a magassága
    buttons[i].style.fontSize = "40px";
    buttons[i].style.boxSizing = "border-box"; // a körvonalhoz kell hogy ne legyen több, mint 1 ahol találkoznak a gombok
    buttons[i].style.boxShadow = "0 0 0 1px black";
    buttons[i].onclick = csere; // ha valamelyik gombot lenyomjuk ez a függvény fut le
    grid.append(buttons[i]);
}
var korok = 0;
var kor = "X";
var vege = false;
var nyertes = "";

document.getElementById("kor").innerHTML = `"${kor}" következik!`; // kiírjuk hogy ki kezd "X" vagy "O"

function csekk() { // buttons[0 1 2
//                            3 4 6
//                            7 8 9]
// ha a jelenlegi játékosnak a szimbólumával megegyezik egy sor akkor ő nyert, véget ér a játék és kiírjuk a nyertest
    if (buttons[0].value == kor && buttons[1].value == kor && buttons[2].value == kor || buttons[3].value == kor && buttons[4].value == kor && buttons[5].value == kor || buttons[6].value == kor && buttons[7].value == kor && buttons[8].value == kor || buttons[0].value == kor && buttons[3].value == kor && buttons[6].value == kor || buttons[1].value == kor && buttons[4].value == kor && buttons[7].value == kor || buttons[2].value == kor && buttons[5].value == kor && buttons[8].value == kor || buttons[2].value == kor && buttons[4].value == kor && buttons[6].value == kor || buttons[0].value == kor && buttons[4].value == kor && buttons[8].value == kor) {
        nyertes = kor;
        vege = true;
        document.getElementById("nyertes").innerHTML = `"${nyertes}" nyert!`;
    }
    else if (korok == 9) { // ha ez az utolsó kör és senki nem nyert akkor döntetlen
        document.getElementById("nyertes").innerHTML = "Döntetlen!";
    }

}

function csere() {
    if (vege == false) { // ha nincs vége a játéknak
        if (this.innerHTML == "" && kor == "O") { // megnézzük hogy amelyik gombot megnyomtuk üres-e és "O" következik vagy nem
            this.innerHTML = "O"; // ha nem üres akkor átállíjuk a jelenlegi szimbólumra, növeljük a körök számát, megnézzük hogy nyert-e, ha nem akkor jön a következő játékos
            this.value = "O"; // a "this" az a lenyomott gomb
            korok += 1;
            csekk();
            kor = "X";
            document.getElementById("kor").innerHTML = `"${kor}" következik!`;
        }
        else if (this.innerHTML == "" && kor == "X") { // ugyanaz mint az előző csak "X"-el
            this.innerHTML = "X";
            this.value = "X";
            korok += 1;
            csekk();
            kor = "O";
            document.getElementById("kor").innerHTML = `"${kor}" következik!`;
        }
    }
}

document.getElementById("ujra").onclick = function () { // ha lenyomjuk az "ujra" gombot akkor mindent visszaállítunk a kezdeti értékekre
    buttons.forEach(button => { // végigmegy az összes gombon és kiszedi az értékeit
        button.innerHTML = "";
        button.value = "";
    })
    document.getElementById("nyertes").innerHTML = "";
    korok = 0;
    kor = "X";
    vege = false;
    nyertes = "";
    document.getElementById("kor").innerHTML = `"${kor}" következik!`;
}