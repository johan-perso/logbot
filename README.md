# LogBot

LogBot est un selfbot pour Discord permettant de sauvegarder les messages qu'il reçoit mais aussi leur modification et leur suppression.

## Prérequis

* Un appareil sous Windows, MacOS, Linux ou ChromeOS (Avec Crostini)
* [nodejs et npm](https://nodejs.org) d'installé
* Un compte Discord à sacrifier (y'a des chances qu'il soit banni)


## Installation

Assure-toi d'avoir [Node.js et npm](https://nodejs.org) d'installer sur ton appareil puis suis ces étapes dans l'ordre (tu auras peut-être besoin de redémarrer ton terminal après l'installation pour l'utiliser) :

* Télécharger tous les fichiers nécessaires (index.js, package.json)
* Ouvrir un terminal et aller dans le dossier où se trouve les fichiers téléchargé lors de la dernière étape.
* Faire quelques commandes...
```
$ npm i
.......
$ npm link
```


## Utilisation

**Démarrer le selfbot :**
```
$ logbot

    Connecté à Discord en tant que ....#.... (ID : ..........)
    Le système de log est activé.
    [-----------------------------------------------]
    Que voulez vous faire ?
        Voir les logs
        Information
        Configuration
        Sortir
```

Une fois le selfbot démarré, il commencera à sauvegarder / logger les messages en arrière-plan. Vous pouvez également depuis le terminal voir les logs, configurer ou obtenir des informations sur le LogBot. (Si vous fermer le terminal, le selfbot s's'éteindra également.)


## Utilisé pour la création

* [Clipboardy](https://www.npmjs.com/package/) (Modifier le contenu du presse papier)
* [Conf](https://www.npmjs.com/package/) (Sauvegarder et modifier la configuration)
* [Discord.js@11.4.2](https://www.npmjs.com/package/) (Récuperer les messages Disocrd)
* [hastebin.js](https://www.npmjs.com/package/) (Crée un haste contenant les logs)
* [moment](https://www.npmjs.com/package/) (Obtenir l'heure et la date, affiché dans les logs)
* [node-fetch](https://www.npmjs.com/package/) (Obtenir l'état d'Hastebin avant la création d'haste)
* [open](https://www.npmjs.com/package/) (Ouvrir le hastebin automatiquement dans un navigateur)
* [prompt](https://www.npmjs.com/package/) (Demander quoi mettre dans la configuration)
* [terminal-kit](https://www.npmjs.com/package/) (Afficher des textes couleurs, menu et demande de texte)

* [Hastebin edit](https://hasteb.herokuapp.com)


## Licence

ISC © [Johan](https://johan-perso.glitch.me)