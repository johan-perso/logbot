#!/usr/bin/env node

// Dépendences et quelques variables
const Discord = require('discord.js');
const client = new Discord.Client({restRequestTimeout: 45000, retryLimit: Infinity});
var term = require('terminal-kit').terminal;
const fs = require('fs');
const fetch = require('node-fetch');
const clipboardy = require('clipboardy');
const hastebin = require('hastebin.js');
const haste = new hastebin({url: 'https://hasteb.herokuapp.com'});
const moment = require('moment');
prompt = require('prompt');
const open = require('open');
const Conf = require('conf');
const config = new Conf();
var packagejson = require('./package.json')
var cd = new Set()
var prefix = ""

// Accès a la configuration
    // Get
    let token = config.get('token')
    let invisAuto = config.get('invisAuto')
    let cooldown = config.get('cooldown')

    // Mettre un statut par défaut
    if(!token) config.set('token', '')
    if(!invisAuto) config.set('invisAuto', 'true')
    if(!cooldown) config.set('cooldown', 'true')

// Fonction pour log
async function log(type, id, firstInfo, message, authorTag, authorId){
	// Voir si le fichier de l'id existe
    fs.access(__dirname + '/logs/' + id + '.txt', (err) => {
        if (err) {
			// Si il n'existe pas, le crée
			fs.writeFile(__dirname + '/logs/' + id + '.txt', firstInfo + '\n=============================================\nBEGINNING OF THE LOG START AFTER THIS LINE \n=============================================\n\n\n', function (err) {
				if (err) return term.red("\nImpossible de crée un fichier de log. Erreur : " + err);
			});
        } else {
			// Si il existe, ajouter du texte à ce dernier.
			fs.appendFile(__dirname + '/logs/' + id + '.txt', `\n[${type} ${moment().format('HH:mm:ss DD/MM/YYYY')}] <${authorTag}/${authorId}>: ${message}`, function (err) {
				if (err) return term.red("\nImpossible d'ajouter du texte dans un fichier de log'. Erreur : " + err);
			});
		}
	});
}

// Fonction pour crée un haste contenant les logs
function viewLog(id){
	// Supprimer la ligne contenant le "Veuillez patienter quelques instants..."
	term.deleteLine()

	// Vérifier si le site d'Hastebin est disponible
	fetch(haste.url, { method: 'GET', follow: 20, size: 500000000})
	.then(res => res.text())
	.catch(err => {
		if(err.message.startsWith("invalid json response body")) term.red("Hastebin n'a pas pu être trouvé.. : ") && term.cyan("Erreur d'API / de réseaux")
		if(!err.message.startsWith("invalid json response body")) term.red("Hastebin n'a pas pu être trouvé.. : ") && term.cyan(err.message)
		process.exit()
	})

	// Vérifier si le fichier de logs lié à l'ID est trouvé...
    fs.access(__dirname + '/logs/' + id + '.txt', (err) => {
        if (err) {
			// Si il n'existe pas, le dire
			term.red("\nLe fichier de logs lié à l'ID (" + id + ") n'a pas été trouvé.")
        } else {
			// Si il existe, crée un haste
			fs.readFile(__dirname + '/logs/' + id + '.txt', 'utf8', function(err, data) {
				// Regarder si le texte n'est pas trop long
				if(data.length > 200000) return term.red("Les logs du fichier sont trop longues. Vous pouvez tout de même ouvrir le fichier depuis votre ordinateur : ") && term.cyan(__dirname + '/logs/' + id + '.txt') && process.exit()

				// Crée le haste
				haste.post(data, "yaml").then(link => {
					// Donner le lien
					term("\nLes logs sont contenus ici : ")
					term.cyan(link.replace(".yaml",".txt"))
			
					// Copier dans le presse papier
					clipboardy.writeSync(link.replace(".yaml",".txt"))

					// Ouvrir le lien
					open(link.replace(".yaml", ".txt"));

					// Revenir au menu principal
					setTimeout(function(){ term.yellow("\n[-----------------------------------------------]") && showMenu() }, 1500)
				});
			});
		}
	});
}

// Fonction pour afficher la configuration
function showConfig(){
	// Liste des questions
	const properties = [
		{
			name: 'token',
			message: "Token utilisé pour le selfbot [Défaut : aucun]",
			warning: "Veuillez choisir un token Discord.",
			default: ''
		},
		{
			name: 'invisAuto',
			validator: /^(?:false|true)$/,
			message: "Mode invisible automatique [true/false] [Défaut : true]",
			warning: "Veuillez choisir si le mode automatique doit être activé (true) ou désactivé (false).",
			default: 'true'
		},
		{
			name: 'cooldown',
			validator: /^(?:false|true)$/,
			message: "Cooldown de 0.2 seconde entre chaque écriture de log [true/false] [Défaut : true]",
			warning: "Veuillez choisir si le cooldown doit être activé (true) ou désactivé (false).",
			default: 'true'
		}
	];
		
	// Demander des réponses
	prompt.start();

	// Obtenir les réponses
	prompt.get(properties, function (err, result) {
		if (err) return term.red("\n" + err) && process.exit()

		// Noter dans la config les réponses
		config.set('token', result.token);
		config.set('invisAuto', result.invisAuto);
		config.set('cooldown', result.cooldown);

		// Afficher les résultats
		console.log("Token Discord : " + result.token.slice(0, -45) + '*********************************************	');
		console.log("Mode invisible automatique : " + result.invisAuto);
		console.log("Cooldown de 0.2 seconde : " + result.cooldown + "\n\n");
		term.green("LogBot doit être redémarrer pour effectuer les modifications.") && process.exit()
	});
}

// Fonction pour afficher un menu
function showMenu(){
	// Afficher un menu
	term("\nQue voulez vous faire ?")
	term.singleColumnMenu(["Voir les logs", "Information", "Configuration", "Sortir"], function(error, response){
		// Option choisis
		if(response.selectedIndex === 0) var option = "viewLog"
		if(response.selectedIndex === 1) var option = "viewInfo"
		if(response.selectedIndex === 2) var option = "config"
		if(response.selectedIndex === 3) var option = "stop"

		// Si l'option est "viewLog"
		if(option === "viewLog"){
			term("\nID du salon de serveur / groupe : ")
			term.inputField( function(error, input){
				if(error) return term.red("Une erreur s'est produite et votre choix n'a pas pu être détecté.") && process.exit()
				term("\nVeuillez patienter quelques instants...")
				viewLog(input)
			});
		}

		// Si l'option est "viewInfo"
		if(option === "viewInfo"){
			term("\nLa version actuellement utilisé est la ")
			term.cyan(packagejson.version)
			term(". Vous pouvez télécharger les mises à jour via GitHub.")
			setTimeout(function(){ term.yellow("\n[-----------------------------------------------]") && showMenu() }, 1500)
		}

		// Si l'option est "config"
		if(option === "config"){
			showConfig()
		}

		// Si l'option est "stop"
		if(option === "stop"){
			client.destroy().then(() => process.exit())
		}
	});
}

// Event ready
client.on('ready', () => {
	// Se mettre en invisible
	if(invisAuto === "true") client.user.setStatus('invisible')

	// Le log dans le terminal
	term.green("Connecté à Discord en tant que ") 
	term.cyan(client.user.tag)
	term.green(" (ID : ")
	term.cyan(client.user.id)
	term.green(")")
	term.green("\nLe système de log est activé.")

	// Vérifier si il y a besoin de crée un dossiers logs
	if (!fs.existsSync(__dirname + "/logs")) {
		fs.mkdirSync(__dirname + "/logs");
	}

	// Afficher un menu
	term.yellow("\n[-----------------------------------------------]")
	showMenu()
});

// Event message
client.on('message', async message => {
	// Argument
	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	// Si un message de plus de un caractère / une image est détecté
	if(message.content.length > 1 || message.attachments.size !== 0){
		// Si l'auteur du message est limité (cooldown)
		if(cooldown === "true" && cd.has(message.author.id)) return;

		// Limiter l'auteur du message (cooldown)
		if(cooldown === "true"){
			cd.add(message.author.id);
			setTimeout(() => {
			  cd.delete(message.author.id);
			}, 200);
		}

		// Obtenir le nom du serveur / si c'est un groupe
		if(message.channel.type === "text") var firstInfo = `CHANNEL-NAME: #${message.channel.name} (ID: ${message.channel.id})\nSERVER-NAME: ${message.channel.guild.name} (ID: ${message.channel.guild.id})`
		if(message.channel.type === "dm") var firstInfo = `DM-NAME: ${message.author.tag} (ID: ${message.author.id})`
		if(message.channel.type === "group") var firstInfo = `GROUP-NAME: ${message.channel.name} (ID: ${message.channel.id})`
		if(message.channel.type !== "text" && message.channel.type !== "dm" && message.channel.type !== "group") var firstInfo = `${message.channel.type}: UNKNOWN INFORMATION`

		// Si le message contient un ou plusieurs attachements
		if(message.attachments.size !== 0) var attachement = "     |     " + message.attachments.map(m => m.url).join(' | ')
		if(message.attachments.size === 0) var attachement = ""

		// Ajouter le message au log
		log("NEW MESSAGE", message.channel.id, firstInfo, message.content + attachement, message.author.tag, message.author.id)
	}
});

// Message modifié
client.on('messageUpdate', (oldMessage, newMessage) => {
    // Il faut que le nouveau message soit de plus de un caractère
	if(newMessage.content.length < 1) return;

	// Obtenir le nom du serveur / si c'est un groupe
	if(newMessage.channel.type === "text") var firstInfo = `CHANNEL-NAME: #${newMessage.channel.name} (ID: ${newMessage.channel.id})\nSERVER-NAME: ${newMessage.channel.guild.name} (ID: ${newMessage.channel.guild.id})`
	if(newMessage.channel.type === "dm") var firstInfo = `DM-NAME: ${newMessage.author.tag} (ID: ${newMessage.author.id})`
	if(newMessage.channel.type === "group") var firstInfo = `GROUP-NAME: ${newMessage.channel.name} (ID: ${newMessage.channel.id})`
	if(newMessage.channel.type !== "text" && newMessage.channel.type !== "dm" && newMessage.channel.type !== "group") var firstInfo = `${newMessage.channel.type}: UNKNOWN INFORMATION`

	// Si le message contient un ou plusieurs attachements
	if(newMessage.attachments.size !== 0) var attachement = "     |     " + newMessage.attachments.map(m => m.url).join(' | ')
	if(newMessage.attachments.size === 0) var attachement = ""

	// Ajouter le message au log
	log("EDITED MESSAGE", newMessage.channel.id, firstInfo, oldMessage + "   ➔   " + newMessage.content + attachement, newMessage.author.tag, newMessage.author.id)
});

// Message supprimé
client.on('messageDelete', (message) => {
    // Il faut que le message soit de plus de un caractère
	if(message.content.length < 1) return;

	// Obtenir le nom du serveur / si c'est un groupe
	if(message.channel.type === "text") var firstInfo = `CHANNEL-NAME: #${message.channel.name} (ID: ${message.channel.id})\nSERVER-NAME: ${message.channel.guild.name} (ID: ${message.channel.guild.id})`
	if(message.channel.type === "dm") var firstInfo = `DM-NAME: ${message.author.tag} (ID: ${message.author.id})`
	if(message.channel.type === "group") var firstInfo = `GROUP-NAME: ${message.channel.name} (ID: ${message.channel.id})`
	if(message.channel.type !== "text" && message.channel.type !== "dm" && message.channel.type !== "group") var firstInfo = `${message.channel.type}: UNKNOWN INFORMATION`

	// Si le message contient un ou plusieurs attachements
	if(message.attachments.size !== 0) var attachement = "     |     " + message.attachments.map(m => m.url).join(' | ')
	if(message.attachments.size === 0) var attachement = ""

	// Ajouter le message au log
	log("DELETED MESSAGE", message.channel.id, firstInfo, message.content + attachement, message.author.tag, message.author.id)
});

// Ecouter les appuis de touche (pour arrêter le processus avec CTRL_Z et CTRL_C)
term.grabInput(true);
term.on('key', function(name, matches, data){
    if(name === 'CTRL_Z' || name === 'CTRL_C'){
		// Se mettre en mode en ligne (enlever le "invisible" du début du code)
		if(client && client.user && invisAuto === "true") client.user.setStatus('online')

		// Sauter quelques lignes
		if(client && client.user) console.log("\n\n\n")

		// Arrêter la connexion Discord
		if(client && client.user) client.destroy()

        // Arrêter le processus
        process.exit()
    } 
});

// Connecter le bot à Discord
client.login(token).catch(err => {
	if(err.message === "An invalid token was provided."){
		term.red("Le token Discord que vous avez entré est invalide..\n\n")
		showConfig()
	}

	if(err.message !== "An invalid token was provided."){
		term.red("Une erreur vous empêche de vous connecter à Discord... \n")
		term(err + "\n\n")
		showConfig()
	}
})