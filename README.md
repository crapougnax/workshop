# Workshop t41

## Pré-requis

Attention, les droits d'administrateur peuvent être requis pour l'installation des logiciels suivants.

* Télécharger et installer [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
* Télécharger et installer [Vagrant](https://www.vagrantup.com/downloads.html)
* Télécharger et installer [Git](https://git-scm.com/downloads)
* Editer le fichier hosts de votre machine et ajouter :

```
192.168.33.10		workshop.local
```

## Installation

### Cloner le dépôt de code du workshop
`git clone https://github.com/Quatrain/workshop.git && cd workshop`

puis se positionner sur l'atelier 1

`git checkout atelier-1`


### Provisionner la machine virtuelle

Exécuter la commande `vagrant up` pour :

* télécharger l'archive de la machine virtuelle
* la provisionner et la démarrer

Le dossier courant sera partagé avec la machine virtuelle et servira de base au serveur Apache.

### Se connecter à la machine virtuelle en SSH

`vagrant ssh`

### Installer les dépendances

`cd /var/www && composer install`


### Quitter la session SSH

`exit`

### Afficher l'application dans votre navigateur

Aller à l'adresse `http://workshop.local/`

### ajoutez le dossier de l'application à votre IDE

Votre machine et la VM partage le dossier. Toute modification locale sera accessible sur le serveur immédiatement.

## Déroulé

Rendez-vous dans le descriptif de l'[Atelier 1](atelier-1.md)

## Références

Vous trouverez des infos générales sur t41 dans son [Wiki](https://github.com/crapougnax/t41/wiki).