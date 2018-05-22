<?php

use t41\View;
use t41\View\FormComponent;
use t41\View\SimpleComponent;
use t41\View\ListComponent;
use t41\View\FormComponent\Element\ButtonElement;
use t41\ObjectModel\Collection;
use t41\Core;
use Workshop\Livre;

class Livres_LivreController extends \Zend_Controller_Action {

	public function init()
	{
    View::setTemplate('default.html');
    View::addCoreLib(['core.js','object.js','locale.js']);
    View::addEvent("t41.locale.lang='fr'", 'js');

    $defaultMenu = Core\Layout::getMenu('main');

    $menu = new View\MenuComponent();
    $menu->setMenu($defaultMenu);

  //  $menu->setRole(new Core\Acl\Role('admin'));

    $menu->getMenu();
    $menu->register('menu');
  }

  public function indexAction()
  {
      $livre = new Livre();

      $form = new FormComponent($livre, [
        'display' => ['label','statut']
      ]);

      $form->setTitle("Rechercher un livre");
      $form->setDecorator('search')->register('left');

      $bloc = new SimpleComponent();
      $bloc->setTitle("Actions");
      $bloc->setContent(ButtonElement::factory("Ajouter un livre", "/livres/livre/ajouter"));
      $bloc->register('left');

      $collection = new Collection('Workshop\Livre');

      $list = new ListComponent($collection, [
        'columns' => ['identifier','label','auteur','annee','pages'],
      ]);

      $list->addRowAction(
        '/livre/modifier',
        'Modifier',
        ['icon' => 'tool-blue']
      );
      $list->addRemoveAction(['icon' => 'delete']);
      $list->setTitle("Mes livres")->register();

  }

  public function modifierAction()
  {
    $livre = new Livre($this->_getParam('id'));

    if (! $livre->getIdentifier()) {
      throw new Exception("Livre inconnu");
    }

    $form = new FormComponent($livre);
    $form->setTitle("Modifier un livre");
    $form->register();
  }

  public function ajouterAction()
  {
    $livre = new Livre();

    $form = new FormComponent($livre);
    $form->setTitle("Ajouter un livre");
    $form->register();
  }
}