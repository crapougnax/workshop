<?php

use t41\View;
use t41\View\SimpleComponent;
use Workshop\Livre;

class IndexController extends \Zend_Controller_Action {

	public function init()
	{
		View::setTemplate('default.html');
	}

	public function indexAction()
	{
		$bloc = new SimpleComponent();
		$bloc->setTitle("On joue avec le backend...");
		$bloc->register();

		$livre = new Livre(1);

		$bloc->setContent(
			sprintf("Le titre du livre no %d est <b>%s</b>. L'auteur est <i>%s</i>.",
				$livre->getIdentifier(),
				$livre->getLabel(),
				$livre->getAuteur()
			)
		);
	}
}