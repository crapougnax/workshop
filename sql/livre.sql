-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Lun 21 Mai 2018 à 18:09
-- Version du serveur :  5.7.18-0ubuntu0.16.04.1
-- Version de PHP :  7.0.18-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de données :  `workshop`
--

-- --------------------------------------------------------

--
-- Structure de la table `workshop_livre`
--

CREATE TABLE `workshop_livre` (
  `id` int(10) UNSIGNED NOT NULL,
  `label` varchar(100) NOT NULL,
  `auteur` varchar(100) DEFAULT NULL,
  `annee` year(4) DEFAULT NULL,
  `pages` smallint(5) UNSIGNED DEFAULT NULL,
  `description` text,
  `statut` enum('A','D','E') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `workshop_livre`
--

INSERT INTO `workshop_livre` (`id`, `label`, `auteur`, `annee`, `pages`, `description`, `statut`) VALUES
(1, 'La Grève', 'Ayn Rand', 2017, 1340, 'Pourquoi le monde semble-t-il se détraquer ?\r\nPourquoi, sans raison apparente, un sentiment de désespoir et de frustrations se répand-il partout ?\r\nPourquoi, dans les pires moments, entend-on ce nom, sans visage et sans origine ?\r\nQui est John Galt ?\r\n\r\nRoman d\'énigme, roman philosophique, roman politique, La Grève (Atlas Shrugged) a été traduit en dix-sept langues et est le livre le plus influent aux Etats-Unis après la Bible. Le voici enfin disponible en version poche.', 'D'),
(2, 'L\'oiseau d\'Amérique', 'Walter S. Tevis', 1980, 400, 'Au XXVe siècle, l\'humanité s\'éteint doucement, abreuvée de tranquillisants prescrits en masse par les robots qu\'elle a elle-même programmés à cette fin. Le monde repose désormais sur les épaules de Robert Spofforth, l\'androïde le plus perfectionné jamais conçu, qui possède des facultés inouïes... sauf, à son grand regret, celle de se suicider. Mais l\'humanité moribonde se fend d\'un dernier sursaut. Paul Bentley, petit fonctionnaire sans importance, découvre dans les vestiges d\'une bibliothèque l\'émerveillement de la lecture, depuis longtemps bannie, dont il partagera les joies avec Mary Lou, la jolie rebelle qui refuse ce monde mécanisé. Un robot capable de souffrir, un couple qui redécouvre l\'amour à travers les mots, est-ce là que réside l\'ultime espoir de l\'homme ?', 'D'),
(3, 'La gloire de mon père', 'Marcel Pagnol', 2004, 219, 'Un petit Marseillais d\'il y a un siècle: l\'école primaire ; le cocon familial ; les premières vacances dans les collines, à La Treille ; la première chasse avec son père...\r\n\r\nLorsqu il commence à rédiger ses Souvenirs d\'enfance, au milieu des années cinquante, Marcel Pagnol est en train de s\'éloigner du cinéma., et le théâtre ne lui sourit plus.\r\nLa Gloire de mon père, dès sa parution, en 1957, est salué comme marquant l\'avènement d\'un grand prosateur. Joseph, le père instituteur., Augustine, la timide maman., l\'oncle Jules, la tante Rosé, le petit frère Paul, deviennent immédiatement aussi populaires que Marius, César ou Panisse. Et la scène de la chasse à la bartavelle se transforme immédiatement en dictée d\'école primaire...\r\nLes souvenirs de Pagnol sont un peu ceux de tous les enfants du monde. Plus tard, paraît-il, Pagnol aurait voulu qu\'ils deviennent un film. C \'est Yves Robert qui, longtemps après la mort de l\'écrivain, le réalisera.\r\n\r\n« Je suis né dans la ville d\'Aubagne. sons le Garlaban couronné de chèvres au temps des derniers chevriers. »', 'D');

--
-- Index pour les tables exportées
--

--
-- Index pour la table `workshop_livre`
--
ALTER TABLE `workshop_livre`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `workshop_livre`
--
ALTER TABLE `workshop_livre`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;