
if (! window.cuertocs) window.cuertocs = {};

window.cuertocs.repartition = function(obj) {

	this.uuid = obj.data.uuid;
	
	this.action = obj.action;
	
	this.budget = obj.data.budget;
	
	this.budgets = obj.data.budgets.collection;
	
	this.grid;
	
	
	this.expandBudgets = function(collection) {

		var collection2 = {};
		
		// on clone la propriété disponible pour gérer le reste à répartir !
		this.budget.props.arepartir = jQuery.extend({},this.budget.props.disponible);
		this.budget.props.arepartir.value = this.calculRepartir();
		
		for (var i in collection) {
			
			var index = parseInt(i)+1;
			collection2[index] = collection[i];
			
			// ajoute une colonne affectation à chaque ligne de budget de classe
			collection2[index].props['affectation'] = {value:0,type:'Currency'};
		}
		
		return collection;
	};
	
	
	/**
	 * Retourne le reste à répartir de l'école
	 * @return float
	 */
	this.calculRepartir = function(total) {
					
		var reparti = total || 0;
		
		for (var i in this.budgets) {
			
			reparti += this.budgets[i].props.budget.value;
		}

		return parseFloat(this.budget.props.budget.value - reparti);
	};
	
	
	
	this.renderGrid = function() {
	
		if (this.grid != null) return;
		
		var component = new t41.view.component({id:'bloc',title:"Répartition budgétaire"});
		component.render(jQuery('#default'));
		
		var params = {
						display:{
								classe:{value:' ',type:'String'},
								budget:{value:'Budget',type:'Currency'},
								totalcom:{value:'Commandes',type:'Currency'},
								totalpan:{value:'Paniers',type:'Currency'},
								disponible:{value:'Disponible',type:'Currency'},
								affectation:{value:'Affectation',type:'Currency',event:'affecte'}
								},
						collection:this.expandBudgets(this.budgets)
					 };
		
		this.grid = new t41.view.table(params);
		this.grid.render(jQuery('#bloc .content'));
		
		var bouton = new t41.view.button("Appliquer la répartition", {icon:'calc',size:'large'});
		t41.view.bindLocal(bouton, 'click', jQuery.proxy(this,'repartir'), 'budget');
		
		jQuery('#arepartir').html(t41.view.format(this.calculRepartir(),t41.view.currency));

		var ligne = '<tr><td></td><td></td><td></td><td></td><td></td><td id="actions" style="text-align:right"></td></tr>';
		jQuery('#lignes').append(ligne);
		jQuery("#actions").append(bouton);
	};
	
	
	/*
	 * Valide qu'une affectation ne met pas la classe concernée à découvert
	 */
	this.affectationValide = function(classe, montant) {
		
		var budget = parseFloat(this.budgets[classe].props.budget.value);
		return (budget + montant >= 0);
	};
	
	
	/**
	 * Valide si le total des montants à répartir est conforme au solde disponible de l'école
	 */
	this.repartitionValide = function(total) {
	
		return parseFloat(this.budget.props.arepartir.value.toFixed(2)) >= total;
	};
	
	
	this.affiche = function(montants) {
		
		var total = 0;
		
		for (var i in montants) {
			
			if (montants[i].value == 0) continue;
			
			var props = this.budgets[i].props;
			
			// mise à jour du budget
			var budget = parseFloat(props.budget.value) + montants[i].value;
			this.changeValue(this.grid.cellSelector(parseInt(i), 'budget'), budget);
			
			// mise à jour du disponible
			var disponible = budget - (parseFloat(props.totalcom.value) + parseFloat(props.totalpan.value));
			this.changeValue(this.grid.cellSelector(parseInt(i), 'disponible'), disponible);
			
			total += montants[i].value;
		}
		
		// maj du disponible à répartir
		jQuery('#arepartir').html(t41.view.format(this.calculRepartir(total),t41.view.currency));
	};
	
	
	/**
	 * Change le contenu de la cellule passée en stockant l'ancienne valeur
	 */
	this.changeValue = function(cell, value) {
		
		cell.fadeOut('slow', function() {
			cell.attr('data-previous', cell.html());
			cell.html(t41.view.format(value, 'Currency', {dec:2}));
		});
		cell.fadeIn('slow');
	};
	
	
	this.resetValue = function(cell) {
		
		cell = jQuery(cell);
		
		cell.fadeOut('slow', function() {
			cell.html(cell.attr('data-previous'));
			cell.removeAttr('data-previous');
		});
		cell.fadeIn('slow');
	};
	
	
	this.rollback = function() {
		
		jQuery('#' + this.grid.id + ' td[data-previous]')
			.each(function(cell) { 
				cell = jQuery(cell);
				cell.fadeOut('slow', function() {
					cell.html(cell.attr('data-previous'));
					cell.removeAttr('data-previous');
				});
				cell.fadeIn('slow');
			});
		
		// reset du disponible à répartir
		//this.resetValue(this.grid.cellSelector(0, 'disponible'));		
	};
	
	
	/**
	 * enregistre les modifications de valeurs des budgets
	 */
	this.commit = function(data) {
		
		for (var i in data) {
			
			this.budgets[i].props.budget.value = parseFloat(data[i].budget);
		}
		
		this.budget.props.arepartir.value = this.calculRepartir();
		//this.changeValue(this.grid.cellSelector(0, 'disponible'), this.calculRepartir());
	};
	
	
	/**
	 * Fonction appelée au clic sur le bouton de répartition
	 */
	this.repartir = function(obj) {
		
		var montants = {};
		var total = 0;
		var size = 0;
			
		// récupération des sommes saisies
		for (var i in this.budgets) {
				
			var classe = this.budgets[i];
				
			var cell = this.grid.cellSelector(parseInt(i), 'affectation');
			var val = parseFloat(cell.find(':input').val().replace(',','.'));
			if (val == 0 || val == '' || val == 'NaN') {
				continue;
			}
				
			if (this.affectationValide(i,val) == false) {
				
				var message = "Impossible de retrancher " 
							+ t41.view.format(val,'Currency',{entities:'no'}) 
							+ ' à la classe ' + classe.props.classe.value;
				new t41.view.alert(message,{title:'Erreur',timer:5000});
				return false;
			}
				
			montants[i] = {uuid:classe.uuid, value:val};
			size++;
			total += val;
				
			// reset du champ de saisie
			cell.find(':input').val(0);
		}
			
		if (size == 0) {
			return;
		}
			
		
		if (this.repartitionValide(total) != true) {
				
			new t41.view.alert("Le total à affecter de " + t41.view.format(total,'Currency', {entities:'no'}) + ' dépasse le disponible');
			return false;
		}
			
		// afficher les affectations
		this.affiche(montants);
			
		var data = {uuid:this.uuid, montants:montants};
		try {
			t41.core.call({action:'action' + this.action, data:data, callback:jQuery.proxy(this,'update'),context:obj.data.caller});
		} catch(e) {
			alert(e);
		}
	};
	
	
	this.update = function(obj) {
		
		switch (obj.status) {
		
		case t41.core.status.ok:
			// enregistrement des changements
			this.commit(obj.data);
			break;
			
		case t41.core.status.nok:
			// affiche le message
			
			// rollback du pré-affichage
			this.rollback();
			
			break;
			
		case t41.core.status.err:
			// affiche l'erreur
			
			// rollback du pré-affichage
			this.rollback();
			break;
		}
	};
	
	
	// constructor
	this.renderGrid();
};
