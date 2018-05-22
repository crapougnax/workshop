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
			$this->redirect('/livre/index');
	}
}