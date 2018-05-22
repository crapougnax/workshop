<?php

use t41\View;
use t41\View\FormComponent;
use t41\View\SimpleComponent;
use t41\View\ListComponent;
use t41\View\FormComponent\Element\ButtonElement;
use t41\ObjectModel\Collection;
use Workshop\Livre;

class LivreController extends \Zend_Controller_Action {

	public function init()
	{
    View::setTemplate('default.html');
    View::addCoreLib(['core.js','object.js','locale.js']);
    View::addEvent("t41.locale.lang='fr'", 'js');
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
      $bloc->setContent(ButtonElement::factory("Ajouter un livre", "/livre/ajouter"));
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