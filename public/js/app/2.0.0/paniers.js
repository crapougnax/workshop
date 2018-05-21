var selection = {};

if (! window.page) window.page = {};

window.cuertocs.panier = function(obj, headers) {
	
	
	this._obj = obj;
	
	this._table = null;
	
	this._headers = headers;
	
	this._collection = obj.props.lignes.value;

	editRowId = null;
	
	// définition du callbak de l'ac
	//t41.view.registry['produit'].callbacks.select = jQuery.proxy(this,'ajouteLigne');

	
	this.totalLignes = function() {
	
		var total = 0;
		for (var i in this._collection) {
			
			if (this._collection[i].props) total++;
		}
		
		return total;
	};
	

	this.totalPanier = function() {
		
		var total = 0;
		for (var i in this._collection) {
			
			if (this._collection[i].props) total += this._collection[i].props.total.value;
		}
		return total;
	};
	
	
	this.afficheSelection = function(data) {

		selection = data.data.collection;
		
		// appel de la fonction d'affichage des suggestions en refournissant l'élément contexte
		t41('showProps', {"data":selection, "callback":jQuery.proxy(this,'ajouteLigne'), "context": this});
	};
	
	
	this.ajouteLigne = function(obj) {

		var memberId = jQuery(obj.target).parent('tr').data('id');
		var ac = t41.view.registry['produit'];
		
		// objet tarif sélectionné
		var tarif = ac.currentSuggestions[memberId];
		ac.resetValue();

		// une seule fois un produit par grille !
		for (var i in panier._collection) {
			if (panier._collection[i].props.produit.value.props.reference.value == tarif.props.produit.value.props.reference.value) {
				
				new t41.view.alert('Ce produit est déjà dans votre panier : Vous pouvez modifier la quantité');
				// focus sur le champ quantité
				jQuery('#lignes tr[data-id="' + i + '"] :input[name="quantite"]').focus();
				return false;
			}
		}
		
		// data = uuid du tarif
		var data = {uuid:panier._obj.uuid, 
					lignes:[
					        { "produit":tarif.props.produit.uuid
					        , "quantite":1
					        , "tarif":tarif.uuid
					        , "prix":tarif.props.prix.value
					        , "total":tarif.props.prix.value
					        }
					       ]
			   	  };
		
		t41.core.call({action:"object/update", data:data, callback:panier.retourAjouteLigne});
	};
	
	
	this.retourAjouteLigne = function(data) {
		
		switch (data.status) {
		
		case t41.core.status.ok:
			panier._obj = data.data.object;
			panier._collection = data.data.object.props.lignes.value;
			panier._table.refresh(panier._collection);
			
			// on donne le focus au champ quantité de la dernière ligne ajoutée
			jQuery('#lignes tr:last *[name="quantite"]').each(function(i,o){ o.focus(); });
			
			panier.afficheTotal();
			
			break;
			
		case t41.core.status.nok:
			new t41.view.alert("Impossible d'ajouter ce produit ");
			console.log(data.context.message);
			break;
			
		case t41.core.status.err:
			new t41.view.alert("erreur serveur : " + data.context.message);
			break;
		}
		
		jQuery(this).focus();
	};
	
	
	this.majLigne = function(data) {
		
		var field 	= jQuery(data.target);
		var tr		= field.parent().parent();
		var prop	= field.attr('name');

		var mid	= tr.attr('data-id');

		var qte = field.attr('value');
		if (isNaN(qte) || qte < 1) {
			field.val(field.prop('defaultValue')); 
			field.focus();
			new t41.view.alert("'" + qte + "' n'est pas une valeur acceptable.\nVeuillez saisir un nombre entier positif. Pour supprimer la ligne, cliquez sur la poubelle à droite", {level:'error'});
			return false;
		}
		
		data = {uuid:this._obj.uuid, lignes:{}};
		data.lignes[mid] = {action:'update', props:{}};
		data.lignes[mid].props[prop] = qte;
		
		t41.core.call({action:"object/update", data:data, callback:jQuery.proxy(this,'retourmajLigne')});
	};

	
	/**
	 * Fonction invoqué au retour de la demande de maj d'une ligne de la grille
	 */
	this.retourmajLigne = function(data) {
		
		switch (data.status) {
		
		case t41.core.status.ok:
			panier._obj = data.data.object;
			panier._collection = data.data.object.props.lignes.value;
			panier._table.refresh(panier._collection);
			panier.afficheTotal();
			break;
			
		case t41.core.status.nok:
			new t41.view.alert("Impossible de changer la quantité");
			break;
			
		case t41.core.status.err:
			new t41.view.alert("erreur serveur : " + data.context.message);
			break;
		}
		
		jQuery(this).focus();
	};
	
	
	/**
	 * Supprime une ligne du panier (propriété de type collection 'lignes')
	 */
	this.suppLigne = function(data) {
		
		var tr = jQuery(data.target).closest('tr');
		var mid	= tr.attr('data-id');

		editRowId = tr.attr('data-id');
		
		var data = {uuid:this._obj.uuid, lignes:{}};
		data.lignes[mid] = {action:'delete'};
		
		t41.core.call({action:"object/update", data:data, callback:jQuery.proxy(this,'retourSuppLigne')});		
	};

	
	this.retourSuppLigne = function(data) {
		
		switch (data.status) {
		
		case t41.core.status.ok:
			//panier._collection[editRowId] = data.data.object;
			// @todo regler ce probleme de references !
			
			panier._table.removeRow(editRowId);
			delete panier._collection[editRowId];
			
			panier.afficheTotal();
			break;
			
		case t41.core.status.nok:
			new t41.view.alert("Impossible de supprimer la ligne", {level:'warning'});
			break;
			
		case t41.core.status.err:
			new t41.view.alert("erreur serveur : " + data.context.message, {level:'error'});
			break;
		}
	};
	
	
	this.valider = function(obj) {
		
		// retour call
		if (obj && obj.status) {
			new t41.view.alert("Le panier a été transmis au directeur", {defer:true});
			document.location = document.referrer;
			return;
		}
		
		if (this.totalLignes() == 0) {
			
			new t41.view.alert("Ce panier est vide !");
			return false;
		}
		
		// Le total du panier doit être supérieur au minimum de la famille
		if (this.totalPanier() < this._obj.props.famille.value.props.minimum.value) {
			new t41.view.alert("Le total du panier est inférieur au minimum d'achat de " + t41.view.format(this._obj.props.famille.value.props.minimum.value, t41.view.currency) + ' requis pour cette famille.', {level:'error'});
			return false;			
		}
		
		t41.core.call({action:'object/update', data:{uuid:this._obj.uuid,statut:210}});
	};
	
	
	/**
	 * Fonction appelée lors d'un clic sur le bouton supprimer
	 */
	this.supprimer = function() {
		
		new t41.view.alert("Veuillez confirmer la suppression du panier", 
							{
								buttons:{
											confirm:true,
											abort:true
										}
							}
						  );
		t41.view.bindLocal(jQuery('#confirm'), 'click', jQuery.proxy(this,'callSupprimer'));
	};

	
	this.callSupprimer = function(obj) {
		
		// retour call
		if (obj && obj.status) {
			new t41.view.alert("Le panier a été supprimé", {defer:true});
			document.location = document.referrer;
			return;
		}
		
		t41.core.call({action:'object/delete', data:{uuid:this._obj.uuid,statut:210}});
	};
	
	
	this.insereGrille = function(appendAfter) {
		
		var events = {row:{}, cell:{}, table:{}};
		if (this._obj.props.statut.value < 300) {
		
			events.row[0] = {
								label:"Supprimer",
								callback:jQuery.proxy(this,'suppLigne'), 
								options:{nolabel:true,size:'small',icon:'trash'}
							};
		}
		var callbacks = {cell:jQuery.proxy(this,'majLigne')};
		
		this._table = new t41.view.table({display:this._headers, collection:this._collection, callbacks:callbacks, events:events});
		this._table.events = events;
		
		if (this._obj.props.statut.value >= 300) {

			// affichage temporaire du total
			var tr = document.createElement('tr');
			var td = document.createElement('td');
			td.setAttribute('colspan', '5');
			td.setAttribute('class','panier-total-prefixe');
			td.innerHTML = 'TOTAL';
			jQuery(tr).append(td);
		
			var td = document.createElement('td');
			td.setAttribute('id', 'total');
			td.setAttribute('class', 'panier-total-montant');
			jQuery(tr).append(td);
			jQuery(this._table.table).append(tr);
		}
		
		this._table.render(appendAfter);
		
		this.afficheTotal();
	};

	
	/**
	 * Récupère le total du panier et l'affiche dans tous les éléments selectionnés
	 */
	this.afficheTotal = function() {
		
		/* callback appelé après réponse du serveur */
		var callback = function(o) {
			jQuery('#total').each(function() {
				if (o.data) {
					jQuery(this).data('value',o.data.value);
					jQuery(this).html(t41.view.format(o.data.value,t41.view.currency));
				}
			});
		};
		
		/* appel serveur */
		t41.core.call({
						action:"object/get", 
						data:{
								property:'total', 
								uuid:this._obj.uuid, 
								save:true // force le serveur à rafraichir la valeur (ici calculée via une règle)
							 }, 
						callback:callback
					 });
	};
	
	
	// CONSTRUCTEUR
	
	// insertion de la grille à l'instanciation
	this.insereGrille('grille');
};


/**
 * Objet chargé de gérer la conversion de paniers en relation avec une table affichée (codée PHP pour l'instant)
 * @todo générer le tableau côté JS
 * 
 * @param id
 * @param paniers
 * @returns {window.cuertocs.panier.conversion}
 */
window.cuertocs.panier.conversion = function(id, paniers) {
	
	this.id = id;
	
	this.paniers = {};

	this.baseUrl = '/paniers/conversion/';
	
	this.table = jQuery('#'+this.id);
	
	this.total = 0;
	
	this.errors;
	
	this.bouton;
	
	
	/**
	 * Initialisation du composant
	 */
	this.init = function() {
			
		this.table.find(':checkbox[id=""]').bind('change DOMSubtreeModified', jQuery.proxy(this, 'togglePanier'));
		this.table.find(':checkbox[id!=""]').bind('change', jQuery.proxy(this, 'waitBeforeToggle'));
	};

	
	/**
	 * Renvoie les boites correspondant à des paniers
	 */
	this.getCheckboxes = function(checked) {
		
		return checked ? this.table.find(':checked').not('[id!=""]') : this.table.find(':checkbox').not('[id!=""]');
	};
	
	
	this.griserBloc = function(bouton) {
		
		this.bouton = bouton;
		
		//désactiver le bouton cliqué		
		jQuery(this.bouton).addClass('disabled').data('onclick', 'return false');

		this.table.closest('div').fadeTo('slow',0.25);
		this.table.find('a').hide();
	};

	
	this.degriserBloc = function() {
		
		// réactiver le bouton cliqué		
		jQuery(this.bouton).removeClass('disabled').data('onclick',null);

		this.table.closest('div').fadeTo('slow',1);
		this.table.find('a').show();
	};
	
	
	this.run = function(obj) {
			
		if (jQuery(':checked').not('[id!=""]').length == 0) {
			
			new t41.view.alert("Veuillez sélectionner une ou plusieurs commande(s) à convertir");
			return false;
		}
		
		this.errors = [];
		
		// griser bloc
		this.griserBloc(t41.view.caller);
		
		// si un budget existe, transferer son uuid
		var data = window.budget ? {budget:budget.uuid} : {}; 
		
		// déclarer une nouvelle session au serveur
		t41.core.ajax({url:this.baseUrl + 'start',data:data, success:jQuery.proxy(this, '_genererCommandes')});
	};
	
	
	/**
	 * Méthode appliquée après création réussie de la session
	 * Va générer les commandes côté serveur
	 */
	this._genererCommandes = function(obj) {

		if (obj) {
			
			if (! obj.status) {
				
				alert('erreur server');
				return false;
			}
			
			if (obj.status != t41.core.status.ok) {
				this.degriserBloc();
				new t41.view.alert(obj.alert, {title:"Erreur lors de la préparation de l'opération"});
				return false;
			}
		}

		// creer les commandes (synchrone)
		liste = this.paniers;
		ajdata = {
					url:this.baseUrl + 'commande', 
					async:false, 
					data:{}, 
					success:jQuery.proxy(this, '_retourCommandes'),
					error:jQuery.proxy(this, '_retourCommandes')
				 };
		
		errors = this.errors;
		jQuery(':checked').not('[id!=""]').each(function(i) { 
			if (errors.length == 0) {
				var id = jQuery(this).closest('tr').data('member');
				var params = ajdata;
				params.data.panier = liste[id].uuid;
				t41.core.ajax(params);
			}
		});
		
		
		if (this.errors.length == 0) {
			this._genererRegroupement();
		} else {
			
			this.degriserBloc();
		}
	};
	
	
	this._retourCommandes = function(obj) {
		
		if (! obj || ! obj.status || obj.status != t41.core.status.ok) {
				
			this.degriserBloc();
			new t41.view.alert(obj.error,{title:"Erreur lors de la génération d'une commande"});
			this.errors[this.errors.length] = obj;
			return false;
		};
	};
	
	
	/**
	 * Méthode appliquée en cas de création réussie des commandes
	 */
	this._genererRegroupement = function(obj) {
		
		// créer le regroupement
		t41.core.ajax({url:this.baseUrl + 'regroupement',success:jQuery.proxy(this,'_enregistrerConversion')});
	};
	
	
	this._enregistrerConversion = function(obj) {
		
		if (obj.status != t41.core.status.ok) {
			this.degriserBloc();
			new t41.view.alert("Erreur lors de la génération d'un regroupement", obj.error);
			return false;
		}
		
		if (this.errors.length == 0) {
			t41.core.ajax({url:this.baseUrl + 'enregistrement', success:jQuery.proxy(this,'_succesConversion')});
		} else {
			this.degriserBloc();
			new t41.view.alert("Erreur lors de la génération d'un regroupement", obj.error);			
		}
	};
	
	
	/**
	 * méthode appelée après la fin réussi du processus de conversion
	 */
	this._succesConversion = function(obj) {

		if (obj.status != t41.core.status.ok) {
			
			t41.view.alert('Erreur à la sauvegarde des données', obj.error);
			this.degriserBloc();
			return false;
		}
		
		var s = obj.data.regroupements>1 ? 's' : '';
		var msg = obj.data.regroupements + ' regroupement' + s + ' généré' + s + ' et transmis à la SVS\n';
		msg += 'pour un montant total de ' + t41.view.format(obj.data.total, t41.view.currency, {entities:'no'});

		new t41.view.alert(msg);
		
		// mettre à jour le budget de l'école
		if (window.budget) { budget.majDisponible(obj.data.total); }

		// mettre à jour les lignes des boites cochées
		this.getCheckboxes(true).each(function() {
			jQuery(this).closest('tr').attr('style', 'background-color:white');
			jQuery(this).closest('tr').find('a').each(function() { jQuery(this).remove();});
			jQuery(this).closest('td').html('<a class="element small icon"><span class="valid"/></a>');
		});
		
		// faire disparaitre le bloc si plus de cases, sinon le dégriser
		if (this.getCheckboxes(false).length == 0) {
		//	this.table.closest('div').slideUp('slow');
		} else {
			
			this.degriserBloc();
		}
		
	};
	
	
	this.waitBeforeToggle = function() {

		// Si la boite détectée est la globale, attendre la fin d'exécution de son callback (5ms)
		setTimeout(jQuery.proxy(this,'togglePanier'),5);
	};
	
	
	this.togglePanier = function(obj) {
				
		total = 0;
		paniers = this.paniers;
		tpanier = 0;

		this.getCheckboxes(false).each(function() {

			var tr = jQuery(this).closest('tr');
			
			switch (this.checked) {
			
			case true:
				tr.attr('style', 'background-color:orange');
				tpanier++;
				var id = jQuery(tr).attr('data-member');
				total += paniers[id].get('total');
				break;
				
			case false:
				tr.attr('style', 'background-color:white');
				break;
			}
		});
		
		this.total = total;

		var title = this.table.parent('div').prev('h4');
		var s = tpanier>1 ? 's' : '';
		jQuery(title).html(tpanier + ' panier' + s + ' pour un total de ' + t41.view.format(this.total,t41.view.currency));

		// mise à jour du budget si l'objet existe dans la page
		// @todo ajouter une fonction permettant de binder un callback à une méthode de classe
		// ex: .bind(budget.calcTotal,'togglePanier')
		if (window.budget) {
			budget.calcTotal();
		}

	};
	
	//  transformation des données en objets
	for (var i in paniers) {
		
		this.paniers[i] = t41.object(paniers[i]);
	}
};
