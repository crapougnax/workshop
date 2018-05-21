
if (! window.cuertocs) window.cuertocs = {};


window.cuertocs.budget = function(obj, params, classes) {

	this.params = params || {};

	this.uuid = obj.uuid;
	
	this.budget = t41.object.factory(obj);
	
	this.classes = new t41.object.collection(classes);
	
	
	/*
	 * Tableau d'objets à partir desquels un total peut être calculé
	 * (en invoquant la propriété total)
	 */
	this.sources = {};

	
	/**
	 * Retourne true si le montant est inférieur ou égal au disponible
	 */
	this.isDisponibleSuffisant = function(montant) {

		return (parseFloat(montant) < this.budget.get('disponible', false));
	};
	
	
	/**
	 * Affichage du montant disponible déduction faite du montant passé en paramètre
	 */
	this.majDisponible = function(montant) {
		
		var val = this.budget.get('disponible') - parseFloat(montant);
		jQuery('#disponible').html(t41.view.format(val, t41.view.currency))
							 .attr('style', val>=0 ? '' : 'color:red;weight:bold');
	};
	
	
	this.displayWidget = function(parent) {
		
		var params = {id:'budget_widget', title:'Finances'};

		params.display = {};
		
		for (var i in this.budget.props) {
			
			var prop = this.budget.props[i];
			
			params.display[i] = {label:'Colonne',type:prop.type};
		}
		
		var div = new t41.view.component(params);
		
		// @TODO détecter et effacer le #total pré-existant dans un contexte de module actif/inactif 
		
		div.render(jQuery('#'+parent));
		var html = '<table class="t41 list">\
		<tr><td>Budget</td><td id="budget" class="cellcurrency">'+ this.budget.get('budget',true) + '</td></tr>\
		<tr><td>Disponible</td><td id="disponible" class="cellcurrency">'+ this.budget.get('disponible',true) + '</td></tr>';
		
		if (this.params.arepartir) {
			html += '<tr><td>A répartir</td><td id="arepartir" class="cellcurrency"></td></tr>';
		}
		jQuery(div.domObject).append(html + '</table>');
	};
	
	
	this.displayClassesWidget = function(parent) {
		
		var params = {id:'budgetc_widget', title:'Disponible'};

		params.display = {};
		
		var html = '<table class="t41 list">';

		
		for (var i in this.classes.members) {
			
			var classe = this.classes.members[i];
			html += '<tr><td>' + classe.get('classe') + '</td><td class="cellcurrency">' + classe.get('disponible',true) + '</td</tr>';
		}
		
		var div = new t41.view.component(params);
		div.render(jQuery('#'+parent));
		jQuery(div.domObject).append(html + '</table>');
	};
	
	
	/**
	 * Fonction invoquée lorsqu'un événement est detecté
	 */
	this.calcTotal = function() {
		
		// temporisation pour permettre aux callbacks en amont de se terminer
		total = 0;
		for (var i in this.sources) {
			source = eval(this.sources[i]);
			if (typeof source == 'object') {
				total += source.total;
			}
			this.majDisponible(total);
		}
	};
	
	
	
	this.displayWidget('left');
	if (this.classes) this.displayClassesWidget('left');	
};


/**
 * Objet permettant d'afficher le budget d'une classe dont le disponible évolue en fonction des commandes
 * enregistrées et des paniers ouverts ou soumis.
 * @param obj
 * @returns {window.cuertocs.budget.classe}
 */
window.cuertocs.budget.classe = function(obj) {


	this.uuid = obj.uuid;
	
	this.budget = t41.object.factory(obj);
	
	this.disponible = this.budget.get('disponible');
	
	
	/**
	 * Retourne true si le montant est inférieur ou égal au disponible
	 */
	this.isDisponibleSuffisant = function(montant) {

		return (parseFloat(montant) < this.budget.props.disponible.value);
	};
	
	
	this.displayWidget = function(parent) {
		
		var params = {id:'budget_widget', title:'Finances'};

		params.display = {};
		
		for (var i in this.budget.props) {
			
			var prop = this.budget.props[i];
			
			params.display[i] = {label:'Colonne',type:prop.type};
		}
		
		var div = new t41.view.component(params);
		
		// @TODO détecter et effacer le #total pré-existant dans un contexte de module actif/inactif 
		
		div.render(jQuery('#'+parent));
		var html = '<table class="t41 list">\
		<tr><td>Budget</td><td id="budget" class="cellcurrency" data-help="Le budget total affecté à votre classe">\
	    '+ t41.view.format(this.budget.get('budget'), t41.view.currency) + '</td></tr>\
		<tr><td>Disponible</td><td id="disponible" class="cellcurrency" data-help="le total disponible tenant compte du panier affiché"></td></tr>\
		</table>';
		
		jQuery(div.domObject).append(html);
		this.majDomDisponible();
		
		// surveillance du total
		t41.view.bind({
						element:jQuery('#total'),
						event:'change DOMSubtreeModified',
						action:"object/get",
						data:{property:'disponible',uuid: this.uuid},
						callback:jQuery.proxy(this,'majDisponible')
					 });
	};
	
	
	this.majDisponible = function(obj) {
		
		if (obj && obj.status == t41.core.status.ok) {
			
			this.budget.set('disponible',obj.data.value);
			this.majDomDisponible();
		}
	};
	
	
	this.majDomDisponible = function() {
		
		var d = jQuery('#disponible');

		d.html(t41.view.format(this.budget.get('disponible'), t41.view.currency));
		d.attr('style', this.budget.get('disponible') > 0 ? '' : 'color:red;weight:bold');	
	};
	
	
	this.displayWidget('left');
};
