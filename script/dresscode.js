const tabIDs = ["tenueHommeStandardFace", "tenueHommeStandardDos", "tenueFemmeStandardFace", "tenueFemmeStandardDos"]
let compteurID = 0;

function setActifPlus(){
    document.getElementById(tabIDs[compteurID]).classList.remove('active');
    document.getElementById(tabIDs[compteurID]).classList.add('inactif');
    if ((compteurID + 1) === 4) {
        compteurID = 0;
    }
    else {
        compteurID++;
    }
    document.getElementById(tabIDs[compteurID]).classList.add('active');
    document.getElementById(tabIDs[compteurID]).classList.remove('inactif');
}

function setActifMoins() {
    document.getElementById(tabIDs[compteurID]).classList.remove('active');
    document.getElementById(tabIDs[compteurID]).classList.add('inactif');
    if ((compteurID) === 0) {
        compteurID = 3;
    }
    else {
        compteurID--;
    }
    document.getElementById(tabIDs[compteurID]).classList.add('active');
    document.getElementById(tabIDs[compteurID]).classList.remove('inactif');
}