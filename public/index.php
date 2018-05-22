<?php

use t41\Core;
use t41\Config;
use t41\View;

/**
 * This is your application bootstrap
 *
 * Its role is to:
 * - initiate environment: adjust include paths, load mandatory vendors modules, enable autoloader...
 * - load application configuration & modules
 * - route the user's request
 * - render view part
 */

ini_set('display_errors', true);

require '../vendor/autoload.php';

/* STEP 1: detect and load core components (t41 + zf) */
Core::setIncludePaths(substr(dirname(__FILE__), 0, strrpos(dirname(__FILE__), '/')+1), true);
Core::enableAutoloader([
	'Workshop' => Core::$basePath . 'application/library',
]);

Core::sendNoCacheHeaders();
error_reporting(E_ALL);

/* STEP 2: load application configuration and modules */
Core::init();
Core::$lang = 'fr';


/* STEP 3: route request */
$fcontroller = \Zend_Controller_Front::getInstance();
$fcontroller->throwExceptions(true);
$fcontroller->setParam('noViewRenderer', true);
$_routes = array();

foreach (Config::getPaths(Config::REALM_CONTROLLERS) as $controller) {
	list($path, $prefix) = explode(Config::PREFIX_SEPARATOR, $controller);
	$_routes[$prefix] = $path;
}

$fcontroller->setControllerDirectory($_routes);

try {
	$fcontroller->dispatch();
} catch (\Exception $e) {
	displayException($e, "Erreur Système");
}

/* STEP 4: prepare & execute view rendering */
echo View::display();

/**
 * Affiche les exceptions sous forme d'un composant
 * @param Exception $e
 * @param string $title
 */
function displayException($e, $title = '')
{
  if ($title) {
		$title .= ' : ';
	}
	View::resetObjects(View::PH_DEFAULT);
	$erreur = new View\SimpleComponent();
	$erreur->setTitle($title . $e->getMessage())->register();

	if (Core::$env != Core::ENV_PROD) {
		$erreur->setContent(
			sprintf('<blockquote style="font: 11px courier">%s</blockQuote>',
				nl2br($e->getTraceAsString())
			)
		);
	}
}
