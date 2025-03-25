const tabTenueStandart = ["tenueHommeStandardFace", "tenueHommeStandardDos", "tenueFemmeStandardFace", "tenueFemmeStandardDos"];
const tabTenuesCommandement = ["tenuesHommeCommandementFace", "tenueFemmeCommandementFace"];
const tabTenuesOperations = ["tenuesOperationsFace", "tenuesOperationsDos"];
let compteurTenuesStandart = 0;
let compteurTenuesCommandement = 0;
let compteurTenuesOperations = 0;

function setActifPlusTenuesStandards(){
    document.getElementById(tabTenueStandart[compteurTenuesStandart]).classList.remove('active');
    document.getElementById(tabTenueStandart[compteurTenuesStandart]).classList.add('inactif');
    if ((compteurTenuesStandart + 1) === 4) {
        compteurTenuesStandart = 0;
    }
    else {
        compteurTenuesStandart++;
    }
    document.getElementById(tabTenueStandart[compteurTenuesStandart]).classList.add('active');
    document.getElementById(tabTenueStandart[compteurTenuesStandart]).classList.remove('inactif');
}

function setActifMoinsTenuesStandards() {
    document.getElementById(tabTenueStandart[compteurTenuesStandart]).classList.remove('active');
    document.getElementById(tabTenueStandart[compteurTenuesStandart]).classList.add('inactif');
    if ((compteurTenuesStandart) === 0) {
        compteurTenuesStandart = 3;
    }
    else {
        compteurTenuesStandart--;
    }
    document.getElementById(tabTenueStandart[compteurTenuesStandart]).classList.add('active');
    document.getElementById(tabTenueStandart[compteurTenuesStandart]).classList.remove('inactif');
}

function setActifPlusTenuesCommandement(){
    document.getElementById(tabTenuesCommandement[compteurTenuesCommandement]).classList.remove('active');
    document.getElementById(tabTenuesCommandement[compteurTenuesCommandement]).classList.add('inactif');
    if ((compteurTenuesCommandement + 1) === 2) {
        compteurTenuesCommandement = 0;
    }
    else {
        compteurTenuesCommandement++;
    }
    document.getElementById(tabTenuesCommandement[compteurTenuesCommandement]).classList.add('active');
    document.getElementById(tabTenuesCommandement[compteurTenuesCommandement]).classList.remove('inactif');
}

function setActifMoinsTenuesCommandement() {
    document.getElementById(tabTenuesCommandement[compteurTenuesCommandement]).classList.remove('active');
    document.getElementById(tabTenuesCommandement[compteurTenuesCommandement]).classList.add('inactif');
    if ((compteurTenuesCommandement) === 0) {
        compteurTenuesCommandement = 1;
    }
    else {
        compteurTenuesCommandement--;
    }
    document.getElementById(tabTenuesCommandement[compteurTenuesCommandement]).classList.add('active');
    document.getElementById(tabTenuesCommandement[compteurTenuesCommandement]).classList.remove('inactif');
}

function setActifPlusTenueOperation(){
    document.getElementById(tabTenuesOperations[compteurTenuesOperations]).classList.remove('active');
    document.getElementById(tabTenuesOperations[compteurTenuesOperations]).classList.add('inactif');
    if ((compteurTenuesOperations + 1) === 2) {
        compteurTenuesOperations = 0;
    }
    else {
        compteurTenuesOperations++;
    }
    document.getElementById(tabTenuesOperations[compteurTenuesOperations]).classList.add('active');
    document.getElementById(tabTenuesOperations[compteurTenuesOperations]).classList.remove('inactif');
}

function setActifMoinsTenueOperation() {
    document.getElementById(tabTenuesOperations[compteurTenuesOperations]).classList.remove('active');
    document.getElementById(tabTenuesOperations[compteurTenuesOperations]).classList.add('inactif');
    if ((compteurTenuesOperations) === 0) {
        compteurTenuesOperations = 1;
    }
    else {
        compteurTenuesOperations--;
    }
    document.getElementById(tabTenuesOperations[compteurTenuesOperations]).classList.add('active');
    document.getElementById(tabTenuesOperations[compteurTenuesOperations]).classList.remove('inactif');
}