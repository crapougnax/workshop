
if (! window.page) window.page = {};
if (! window.cuertocs.finances) window.cuertocs.finances = {};

window.cuertocs.finances.ventilation = function(obj) {


	this.obj = obj;
	
	this.props = obj.props;
	
	this.comptes,this.nomenclatures;
	
	
	this.setComptes = function(obj) {
		
		this.comptes = obj.collection;
	};
	

	this.setNomenclatures = function(obj) {
		
		this.nomenclatures = obj.collection;
	};
	
	
	this.run = function(parent) {
		
		var parent = parent || jQuery('#default');
		
		var params = {id:'tbl', title:"Ventilation comptable des produits du marché " + this.obj.marche.props.label.value};
		var c = new t41.view.component(params);
		c.render(parent);
		c.addContent('<div id="tbl1"></div><div id="tools"></div><div id="tbl2"></div>');
		
		var tbl1 = jQuery('#tbl1');
		var tbl2 = jQuery('#tbl2');
		var tool = jQuery('#tools');

		tbl1.append(this.champSelect('pool',null,{multiple:"multiple",'class':"recipient"}));

		//c.addContent(this.champSelect('categories', this.obj.marche.props.categories.value));
		
		tbl2.append(this.champSelect('selection',null,{multiple:"multiple",'class':"recipient"}));
		
		this.infoMarche();
		this.getStats(this);
		
		this.toolbox();
		this.buttonbox();
		this.selectbox();
		this.savebox();
	};
	
	this.infoMarche = function() {
		var component = new t41.view.component({id:'infom',title:'Marché'});
		component.render(jQuery('#left'));
		var parent = jQuery('#infom .content');

		parent.append('<table>\
					   <tr><th>Nom</th><td>' + this.obj.marche.props.label.value + '</td></tr>\
					   <tr><th>Produits</th><td id="tp">0</td></tr>\
					   <tr><th>Ventilés</th><td id="tv">0</td></tr>\
					   <tr><th>A&nbsp;ventiler</th><td id="tnv">0</td></tr>\
					   </table>');
	};
	
	
	/**
	 * Demande les statistiques de ventilation du marché au serveur
	 * et les affiche dans le tableau
	 */
	this.getStats = function(obj) {
		
		if (obj != this) {
			jQuery('#tp').html(obj.data.total);
			jQuery('#tnv').html(obj.data.nv);
			jQuery('#tv').html(obj.data.total - obj.data.nv);
			return;
		}
		
		t41.core.call({
						action:'action/stats',
						data:{uuid:this.obj.data.uuid},
					 });
	};
	
	
	this.toolbox = function() {
		
		var component = new t41.view.component({id:'toolbox',title:'1. Recherche de produits'});
		component.render(jQuery('#tools'));

		var parent = jQuery('#toolbox .content');
		
		var input = document.createElement('input');
		input.setAttribute('id', 'query');
		input.setAttribute('type', 'text');
		input.setAttribute('style', 'width:200px;margin-bottom:5px');
		input.setAttribute('autocomplete','no');
		parent.append(input);
		
		parent.append('<ul><li><select id="mode">\
					   <option value="label">par libellé</option>\
					   <option value="ref">par référence</option>\
				       <option value="page">par numéro de page</option></select></li>\
	       			   <li><input type="checkbox" id="nv" checked="checked"/> Non ventilés</li></ul>');
		
		
		var button = new t41.view.button('Afficher les produits', {size:'medium', icon:'refresh'});
		parent.append(button);
		t41.view.bindLocal(button, 'click', jQuery.proxy(this,'getProduits'), this.obj);
	};
	

	this.buttonbox = function() {
		var component = new t41.view.component({id:'buttonbox',title:'2. Sélection de produits'});
		component.render(jQuery('#tools'));

		var parent = jQuery('#buttonbox .content');

		var button = new t41.view.button('Tous', {size:'medium'});
		t41.view.bindLocal(button, 'click', function() { 
			jQuery('#pool').find('option').each(function(i,o) { jQuery(o).attr('selected','selected'); }); });
		parent.append(button);
		
		var button2 = new t41.view.button('Inverser', {size:'medium'});
		t41.view.bindLocal(button2, 'click', function() { 
			jQuery('#pool').find('option').each(function(i,o) { 
				o=jQuery(o);
				if (o.attr('selected')) { 
					o.removeAttr('selected');
				} else { 
					o.attr('selected','selected'); 
				}
			}); 
		});
		parent.append(button2);
		
		var button = new t41.view.button('Aucun', {size:'medium'});
		t41.view.bindLocal(button, 'click', function() { 
			jQuery('#pool').find('option').each(function(i,o) { jQuery(o).removeAttr('selected'); }); });
		parent.append(button);
		
		parent.append('<br/>');
		var button = new t41.view.button('Retirer', {size:'medium',icon:''});
		t41.view.bindLocal(button, 'click', ventilation.deplace, {source:'selection',destination:'pool'});
		parent.append(button);

		var button = new t41.view.button('Prendre', {size:'medium',icon:''});
		t41.view.bindLocal(button, 'click', ventilation.deplace, {source:'pool',destination:'selection'});
		parent.append(button);
	};
	
		
	this.selectbox = function() {
		var component = new t41.view.component({id:'selectbox',title:'3. Sélection Cpte/Nmc'});
		component.render(jQuery('#tools'));

		var parent = jQuery('#selectbox .content');
		
		parent.append("Sélectionnez un compte<br/>");
		parent.append(this.champSelect('compte', this.comptes, {style:'width:240px'}));

		parent.append("<br/>Sélectionnez une nomenclature<br/>");
		parent.append(this.champSelect('nomenclature', this.nomenclatures, {style:'width:240px'}));
	};
	
	
	this.savebox = function() {
		var component = new t41.view.component({id:'savebox',title:'4. Sauvegarde'});
		component.render(jQuery('#tools'));

		var button = new t41.view.button('Enregistrer', {size:'medium',icon:'valid'});
		jQuery('#savebox .content').append(button);
		t41.view.bindLocal(button, 'click', ventilation.sauve, this.obj);
	};
	

	this.sauve = function(obj) {

		var compte = jQuery('#compte');
		var nomenclature = jQuery('#nomenclature');
		
		if (obj.status) {
			if (obj.status == t41.core.status.ok) {
				
				compte.attr('selectedIndex', -1);
				nomenclature.attr('selectedIndex', -1);
				jQuery('#selection option').each(function(i,o) { jQuery(o).remove(); });
				ventilation.getStats(ventilation); // @fixme

			} else {
				
				alert(obj.message);
			}
			return;
		}

		if (compte.val() == 0 || nomenclature.val() == 0) {
		
			alert('Veuillez sélectionner un compte et une nomenclature');
			return false;
		}
		
		var produits = {};
		jQuery('#selection option').each(function(i,o) {
			produits[i] = jQuery(o).val();
		});
		
		if (! produits[0]) {
			
			alert('Veuillez sélectionner un ou plusieurs produits');
			return false;
		}
		
		var options = { //callback:cuertocs.finances.ventilation.refresh, 
						action:'action/ventilation',
						data:{
								uuid:obj.data.caller.data.uuid, 
								compte:compte.val(),
								nomenclature:nomenclature.val(),
								produits:produits
							 }
					  };
		t41.core.call(options);
	};
	
	
	/**
	 * Action appelée au clic du bouton de la toolbox et recevant l'action en paramètre
	 */
	this.getProduits = function(obj) {

		if (obj.status) {
			
			var pool = jQuery('#pool');
			pool.find('option').remove();
				
			if (t41.core.transparent == false) {
				var c = new t41.object.collection();
				c.populate(obj.data.collection);
				obj = c;
			}
			
			jQuery.each(obj.members, function(i,produit) {
				
				var text = produit.get('reference') + ' | ' + produit.get('label');
				
				// on n'affiche l'élément que s'il n'est pas déjà affiché à droite
				if (jQuery('#selection').find('option:contains("' + produit.get('reference') + ' | ' + '")').length == 0) {
				
					var value = produit.uuid;
					pool.append(new Option(text,value));
				}
			});
			
			return;
		}
		
		var options = { //callback:jQuery.proxy(this,'getProduits'),
						action:'action/produits',
						data:{
								uuid:obj.data.caller.data.uuid, 
								query:jQuery('#query').val(), 
								nv:jQuery('#nv').prop('checked'),
								mode:jQuery('#mode').val()
							 }
			  };
		
		t41.core.call(options);
	};
	
	
	this.refreshPool = function(data) {
		
		var pool = jQuery('#pool');
		console.log(pool.find('option'));//.remove();
		
		for (var i in data) {
			
			var text = data[i].props.reference.value + ' ' + data[i].props.label.value;
			var value = data[i].uuid;
		
			pool.append(new Option(text,value));			
		}
	};

	
	this.deplace = function(obj) {
		
		destination = jQuery('#' + obj.data.caller.destination);
		jQuery('#' + obj.data.caller.source).find('option:selected').each(function(i,o) {
			
			destination.append(new Option(o.text,o.value));
			jQuery(o).remove();
		});
	};
	
	
	this.champSelect = function(id, options, attributes) {
		
		var select = document.createElement('SELECT');
		select.setAttribute('id', id);
		
		if (attributes) {
			
			for (var i in attributes) {
				select.setAttribute(i, attributes[i]);
			}
		}
		
		if (options) {
			select.add(new Option('Sélectionnez',0),null);

			for (var i in options) {
			
				var option = document.createElement('OPTION');
				option.text = options[i].props.code.value + ' ' + options[i].props.label.value;
				option.value = options[i].uuid; // options[i].props.code.value;
			
				select.add(option,null);
			}
		}
		
		return select;
	};
	
};
