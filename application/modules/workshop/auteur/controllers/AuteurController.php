<?php

use t41\View;
use t41\View\FormComponent;
use t41\View\SimpleComponent;
use t41\View\ListComponent;
use t41\View\FormComponent\Element\ButtonElement;
use t41\ObjectModel\Collection;
use t41\Core;
use Workshop\Auteur;

class Auteurs_AuteurController extends \Zend_Controller_Action {

	public function init()
	{
    View::setTemplate('default.html');
    View::addCoreLib(['core.js','object.js','locale.js']);
    View::addEvent("t41.locale.lang='fr'", 'js');

    $defaultMenu = Core\Layout::getMenu('main');

    $menu = new View\MenuComponent();
    $menu->setMenu($defaultMenu);

  //  $menu->setRole(new Core\Acl\Role('admin'));

    $menu->register('menu');
  }

  public function indexAction()
  {
      $auteur = new Auteur();

      $form = new FormComponent($auteur, [
        'display' => ['label','statut']
      ]);

      $form->setTitle("Rechercher un auteur");
      $form->setDecorator('search')->register('left');

      $bloc = new SimpleComponent();
      $bloc->setTitle("Actions");
      $bloc->setContent(ButtonElement::factory("Ajouter un auteur", "/auteurs/auteur/ajouter"));
      $bloc->register('left');

      $collection = new Collection('Workshop\Auteur');

      $list = new ListComponent($collection, [
        'columns' => ['identifier','label'],
      ]);

      $list->addRowAction(
        '/auteurs/auteur/modifier',
        'Modifier',
        ['icon' => 'tool-blue']
      );
      $list->addRemoveAction(['icon' => 'delete']);
      $list->setTitle("Mes auteurs")->register();

  }

  public function modifierAction()
  {
    $auteur = new Auteur($this->_getParam('id'));

    if (! $auteur->getIdentifier()) {
      throw new Exception("Auteur inconnu");
    }

    $form = new FormComponent($auteur);
    $form->setTitle("Modifier un auteur");
    $form->register();
  }

  public function ajouterAction()
  {
    $auteur = new Auteur();

    $form = new FormComponent($auteur);
    $form->setTitle("Ajouter un auteur");
    $form->register();
  }
}