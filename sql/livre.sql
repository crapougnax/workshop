
--
-- Structure de la table `livre`
--

CREATE TABLE IF NOT EXISTS `workshop_livre` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `label` varchar(100) NOT NULL,
  `auteur` varchar(100) DEFAULT NULL,
  `annee` year(4) DEFAULT NULL,
  `pages` smallint(5) unsigned DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;