function Horloge() {
    const heureActuelle = new Date();
    let heures = heureActuelle.getHours().toString().padStart(2, '0');
    let minutes = heureActuelle.getMinutes().toString().padStart(2, '0');
    let secondes = heureActuelle.getSeconds().toString().padStart(2, '0');

    document.getElementById("heure").textContent= `${heures} : ${minutes} : ${secondes}`;
}
function DateDuJour() {
    const date = new Date();
    let afficheJour = "";
    let afficheMois = "";
    const jourDeLaSemaine = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const moisEnString = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];

    let jour = date.getDate();
    let mois = date.getMonth();

    afficheJour = jourDeLaSemaine[date.getDay() + 1];
    afficheMois = moisEnString[mois];

    const dateFormattee = `${afficheJour} ${jour} ${afficheMois}`;
    document.getElementById("dateHorloge").textContent = dateFormattee;

}
DateDuJour();
Horloge();
setInterval(Horloge, 1000);
setInterval(DateDuJour, 1000);