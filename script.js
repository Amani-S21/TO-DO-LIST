
const formulaire = document.getElementById("formulaire-tache");
const champTache = document.getElementById("champ-tache");
const listeTaches = document.getElementById("liste-taches");
const messageVide = document.getElementById("message-vide");

const total = document.getElementById("total");
const terminees = document.getElementById("terminees");
const restantes = document.getElementById("restantes");

// Restaurer les tâches sauvegardées.
let taches = [];

try {
    const donnees = localStorage.getItem("mes-taches");
    const resultat = donnees ? JSON.parse(donnees) : [];

    if (Array.isArray(resultat)) {
        taches = resultat.filter(
            tache =>
                tache &&
                typeof tache.id === "string" &&
                typeof tache.texte === "string" &&
                typeof tache.terminee === "boolean"
        );
    }
} catch (erreur) {
    console.error("Impossible de charger les tâches :", erreur);
}

// Sauvegarder les tâches.
function sauvegarderTaches() {
    try {
        localStorage.setItem("mes-taches", JSON.stringify(taches));
    } catch (erreur) {
        console.error("Impossible de sauvegarder les tâches :", erreur);
        alert("La sauvegarde a échoué dans ce navigateur.");
    }
}

// Afficher les tâches.
function afficherTaches() {
    listeTaches.replaceChildren();

    taches.forEach(function (tache) {
        const element = document.createElement("li");
        element.classList.add("tache");

        if (tache.terminee) {
            element.classList.add("terminee");
        }

        const caseTache = document.createElement("input");
        caseTache.type = "checkbox";
        caseTache.checked = tache.terminee;
        caseTache.setAttribute("aria-label", "Marquer comme terminée");

        const texte = document.createElement("span");
        texte.textContent = tache.texte;

        const boutonSupprimer = document.createElement("button");
        boutonSupprimer.textContent = "Supprimer";
        boutonSupprimer.classList.add("bouton-supprimer");
        boutonSupprimer.type = "button";

        // Marquer une tâche comme terminée ou non.
        caseTache.addEventListener("change", function () {
            tache.terminee = caseTache.checked;
            sauvegarderTaches();
            afficherTaches();
        });

        // Supprimer une tâche.
        boutonSupprimer.addEventListener("click", function () {
            taches = taches.filter(function (elementTache) {
                return elementTache.id !== tache.id;
            });

            sauvegarderTaches();
            afficherTaches();
        });

        element.append(caseTache, texte, boutonSupprimer);
        listeTaches.append(element);
    });

    // Actualiser les statistiques.
    const nombreTerminees = taches.filter(
        tache => tache.terminee
    ).length;

    total.textContent = taches.length;
    terminees.textContent = nombreTerminees;
    restantes.textContent = taches.length - nombreTerminees;

    messageVide.hidden = taches.length > 0;
}

// Ajouter une nouvelle tâche.
formulaire.addEventListener("submit", function (event) {
    event.preventDefault();

    const texte = champTache.value.trim();

    if (texte === "") {
        alert("Veuillez saisir une tâche.");
        return;
    }

    const nouvelleTache = {
        id: crypto.randomUUID(),
        texte: texte,
        terminee: false
    };

    taches.push(nouvelleTache);

    sauvegarderTaches();
    afficherTaches();

    formulaire.reset();
    champTache.focus();
});

// Afficher les tâches dès l'ouverture de la page.
afficherTaches();
