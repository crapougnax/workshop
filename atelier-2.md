# Atelier 2 - Backends

Cet atelier permet de comprendre comment fonctionne les backends. Nous utiliserons le plus commun d'entre-eux, à savoir MySQL.

## Accès à MySQL

### En ligne de commande

Executez simplement `mysql -uroot -proot` pour accéder au serveur MySQL.

Pour vous faciliter la vie, vous pouvez créer un fichier `.my.cnf` dans votre répertoire home avec le contenu suivant :

```
[client]
user = root
password = root
database = workshop
```

Vous pourrez alors vous connecter en tapant simplement `mysql`.

### Avec PhpMyAdmin
 
Connectez-vous à la VM avec `vagrant ssh`. Tapez ensuite `sudo apt install phpmyadmin` et répondez aux questions posées par l'installeur (les réponses par défaut conviennent)

Vous devriez pouvoir afficher PhpMyAdmin à l'adresse `http://workshop.local/phpmyadmin/`.

### A partir d'un éditeur SQL sur votre poste

Notre serveur MySQL n'accepte que les connexions depuis la VM. Pour pouvoir y accéder d'un logiciel nous devons faire quelques modifications (à ne pas faire à la maison !)

#### Modifier l'adresse écoutée

* Faites un `vagrant ssh` pour accéder au serveur.

* Exécutez ensuite `sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf` (ou tout autre éditeur de votre choix)

* Recherchez et remplacez la ligne `bind-address = 127.0.0.1` par `bind-address = 0.0.0.0`.

* Sauvez et quittez.

* Redémarrez ensuite le serveur MySQL avec `sudo service mysql restart` 
* exécutez la commande suivante `/var/www/cli/grant-sql.sh` afin de donner les droit d'accès à `root` à partir de votre machine.

* Lancez ensuite l'éditeur SQL de votre choix.



## Le fichier `backends.xml`

Ouvrez le fichier `application/configs/backends.xml` et observons son contenu :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<config>
	<backends default="mysql0">
		<backend id="mysql0" type="sql">
			<uri>
				<adapter>pdo_mysql</adapter>
				<host>
					localhost
				</host>
				<username>
					<dev>root</dev>
				</username>
				<password>
					<dev>root</dev>
				</password>
				<port>3306</port>
				<url>
					<dev>workshop</dev>
				</url>
			</uri>
		</backend>
	</backends>
</config>
```

Un backend dont l'identifiant est `mysql0` et déclaré et défini comme étant le backend par défaut.

La configuration XML contient tous les paramètres que l'on pourrait retrouver dans un [DSN](https://fr.wikipedia.org/wiki/Data_Source_Name). Ici : `mysql://root:root@localhost:3306/workshop`.

Les objets dont la définition ne comporte pas d'argument `backend=` utiliserons donc ce backend.

## Mappage par défaut

Le mappage par défaut est très simple :

* à l'objet `Workspace\Livre` correspond une table `workshop_livre`,
* à la propriété label correspond un champ `label`, etc.


### Mappage avancé

Dans le cas où il est nécessaire de mapper des objets et des backends qui ne respectent pas cette convention (bases de données pré-existantes ou imposant des nomenclatures particulières, il est possible de renseigner les conversions devant être réalisées au niveau des noms dans le fichier `mappers.xml`. Ce point n'est pas couvert par l'atelier mais à titre d'exemple vous trouverez ci-dessous un fichier mappers.xml :

```xml
<config>
	<mappers>	
		<mapper id="mysql" type="backend">
			<object id="My\Namespace\MyClass" datastore="legacy_table_name" pkey="column_id:integer">
				<map>
					<property id="oneproperty">
						<datastorename>some_ugly_column_name</datastorename>
					</property>
					<property id="anotherproperty">
						<datastorename>some_uglier_column_name</datastorename>
					</property>
					...
				</map>
			</object>
		</mapper>		
	</mappers>
</config>
```

Plus d'informations sont fournies dans le [Wiki t41](https://github.com/crapougnax/t41/wiki/Backends)


## Création de la base de données `workshop`

La base de données de l'application n'existe pas encore. Nous allons la créer.

`CREATE DATABASE IF NOT EXISTS `workshop` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci`

## Création de la table `workshop_livre`

Pour finir cet atelier, nous allons créer la table nécessaire à notre objet `Workshop\Livre` dont le nom est `workshop_livre`.

vous trouverez sa structure SQL ainsi que quelques enregistrements dans le fichier `sql/livre.sql`. Executez-le avec la méthode d'accès au serveur MySQL qui vous convient.

Par exemple, en ligne de commande : `mysql workshop < /var/www/sql/livre.sql`. 

## Affichage d'un objet

Rendez-vous dans le fichier application/controllers/IndexController.php et observez les modifications.

Un objet s'obtient par son identifiant qui est par défaut un entier positif auto-incrémentable non signé (ligne 20)

Essayez d'appeler l'objet 4 et observez le comportement.

Il n'y a pas d'erreur car le point de vue de t41 est l'objet et pas la base de données. Pour vérifier que l'objet existe déjà dans un backend, vous pouvez utiliser la méthode `getIdentifier()` qui retournera zéro si l'objet n'est pas encore persisté.


