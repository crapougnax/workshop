# Atelier 1 : fondamentaux

t41 s'appuie sur le patron de conception MVC (Modèle / Vue / Contrôleur) pour découper une application. Appuyée partiellement sur Zend Framework 1, t41 diffère par sa capacité à permettre la manipulation facile d'objets (stockage, traitement et affichage)

Les fichiers sont stockés suivant la [recommandation PSR-4](https://www.php-fig.org/psr/psr-4/) afin de permettre de bénéficier des mécanismes d'autoload les plus courants.

## La structure du projet

Elle est proche d'une application Zend Framework.

```
application/
	configs/
	controllers/
	library/
	modules/
	views/
```

## Configuration générale

### Fichiers de configuration

Le dossier `configs/` contient les fichiers de configuration au format XML.

Les fichiers indispensables sont :

* `application.xml` contient les informations sur l'application, ses paramètres et ses environnements
* `backends.xml` contient les configurations vers les différents moyens de faire persister la donnée (base de données notamment)
* `objects.xml` contient la définition des objets manipulés dans l'application.

Les fichiers optionnels sont :

* `acl.xml` contient la définition des groupes d'utilisateurs
* `mappers.xml` contient les configurations optionnelles permettant de mettre en relation une donnée d'un backend avec un objet.

### Controleurs d'action

Les contrôleurs d'action permettent d'interagir directement avec l'utilisateur. Ils sont appelés par le contrôleur frontal (invoqué via le fichier `public/index.php` en utilisant les paramètres d'URI.

Par exemple, le contrôleur contenu dans le fichier `IndexController.php` contient une méthode `indexAction()` qui correspond à l'URI `/`.

Nous verrons ensuite comment associer une URI avec d'autres méthodes dans d'autres contrôleurs.

### Modèles

Le dossier `library/` contient les classes stockant les objets de l'application.

Ainsi, ce dossier contient un dossier `Workshop/` qui est le namespace par défaut de notre application. On trouvera à l'intérieur un fichier `Livre.php` qui ressemble à cela :

```php
<?php

namespace Workshop;

use t41\ObjectModel;

class Livre extends ObjectModel\BaseObject {
}

```

Nous reviendrons sur ce format mais nous pouvons remarquer immédiatement que nous retrouvons la définition de cet objet dans notre fichier `objects.xml` sous la forme :

```xml
<config>
  <objects>
    <object id="Workshop\Livre" extends="t41\Core\BaseObject">
			<properties>
				<property id="titre" type="string">
      		<label>Titre</label>
					<constraints>
						<mandatory />
					</constraints>
				</property>
				<property id="auteur" type="string">
					<label>Auteur</label>
					<constraints>
						<mandatory />
					</constraints>
				</property>
				<property id="description" type="string">
					<label>Description</label>
					<multilines>true</multilines>
				</property>
				<property id="annee" type="string">
					<label>Année</label>
				</property>
				<property id="pages" type="integer">
					<constraints>
						<minlength>4</minlength>
						<maxlength>4</maxlength>
						<digits>4</digits>
					</constraints>
					<label>Pages</label>
                </property>
                 <property id="statut" type="enum">
          <label>Statut</label>
          <values>
            <value id="A">
              <label>A paraître</label>
            </value>
            <value id="D">
            	<label>Disponible</label>
            </value>
            <value id="E">
            	<label>Epuisé</label>
            </value>
					</values>
					<defaultvalue>D</defaultvalue>
			</properties>
		</object>
	</objects>
</config>

```

Cette définion permet de disposer d'un objet prêt à l'emploi pour lequel toutes les opérations CRUD sont accessibles (sous réserve qu'un backend soit accessible)

### Modules

Les modules permettent de découper l'application en unités fonctionnelles indépendantes. Ils sont étudiés dans l'atelier 3.

### Vues

Les vues sont les modèles permettant d'afficher les données. Elles peuvent permettre un rendu HTML ou PDF notamment.

Nous verrons que la construction d'une vue est simplifiée par la mise à disposition de widgets couvrant les principaux besoins.
