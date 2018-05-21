<?php

use t41\View;
use t41\View\SimpleComponent;

class IndexController extends \Zend_Controller_Action {

	public function init()
	{
		View::setTemplate('default.html');
	}

	public function indexAction()
	{
		$bloc = new SimpleComponent();
		$bloc->setTitle("Bienvenue au workshop !");
		$bloc->setContent("Ce bloc est positionné dans l'emplacement par défaut");
		$bloc->register();
	}
}