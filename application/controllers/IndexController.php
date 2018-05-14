<?php

use t41\Core;
use t41\View;
use t41\ObjectModel\Collection;

class IndexController extends \Zend_Controller_Action {

	public function init()
	{
		View::setTemplate('default.html');
	}

	public function indexAction()
	{
		$this->_session = new \Zend_Session_Namespace('user');
		if ($this->_session->operateur instanceof Operateur) {
			$this->_redirect('/dashboard');
		}

		if (true) {
			$c = new View\TemplateComponent();
			$c->load('selecteur_role.html');
			$c->register();
		} else {

	}
}
}