<?php

use t41\View;
use t41\Core\Acl;
use Workshop\Operateur;

class LoginController extends \Zend_Controller_Action {

	public function init()
	{
		View::setTemplate('login.html');
	}

	public function userAction()
	{
		$operateur = new Operateur(2);
		$role = Acl::getRole('user');
		$this->_setSession($role, $operateur);
		$this->_redirect('/dashboard');
	}

	public function adminAction()
	{
		$operateur = new Operateur(2);
		$role = Acl::getRole('admin');
		$this->_setSession($role, $operateur);
		$this->_redirect('/dashboard');
	}

	public function guestAction()
	{
		$operateur = new Operateur(2);
		$role = Acl::getRole('guest');
		$this->_setSession($role, $operateur);
		$this->_redirect('/dashboard');
	}

	protected function _setSession($role, $operateur, $entite = null)
	{
		$session = new \Zend_Session_Namespace('user');
		$session->role = $role;
		$session->operateur = $operateur;
		$session->entite = $entite;
	}
}
