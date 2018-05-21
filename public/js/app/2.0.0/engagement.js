
if (! window.page) window.page = {};


window.cuertocs.engagement = function(action, regs) {

	
	/**
	 * Liste des regroupements pouvant être intégrés
	 */
	this.regs = new t41.object.collection(regs);

	this.action = action;

	this.engagement = t41.object.factory(action.obj);
	
	this.tr, this.mid, this.alert;
	
	this.table = jQuery('#listeregs');
	
	
	/**
	 * Initialisation du composant
	 */
	this.init = function() {
			
		this.table.find(':checkbox[id=""]').bind('change DOMSubtreeModified', jQuery.proxy(this, 'toggleReg'));
		this.table.find(':checkbox[id!=""]').bind('change', jQuery.proxy(this, 'waitBeforeToggle'));
	};

	
	this.displayWidget = function() {
		
		var c = new t41.view.component({id:'weng',title:'Engagement'});
		
		var content = 'Fournisseur :<br/>' + this.engagement.get('fournisseur') + '<br/>'
					+ 'Marché :<br/>' + this.engagement.get('marche') + '<br/>'
					+ 'Compte :<br/>' + this.engagement.get('compte') + '<br/>'
					+ 'Total : <span id="total">' + t41.view.format(0,t41.view.currency) + '</span>';
		c.addContent(content).render('left');
	};
	
	
	/**
	 * Affiche la liste des commandes d'un regroupement
	 */
	this.detailRegroupement = function() {
	
		var mid = jQuery(t41.view.caller).closest('tr').data('member');
		var commandes = this.regs.getMember(mid).get('commandes');
		
		var c = [];
		for (var i in commandes.members) {
			var m = commandes.members[i];
			c[c.length] = {
							uuid:m.uuid, 
							props:{
									creation:{value:m.get('creation'),type:'Date'},
									classe:{value:m.get('classe'),type:'String'},
									total:{value:m.get('total'),type:'Currency'}

								  }
						  };
		}
		var table = new t41.view.table({display:{creation:{value:'Date de création',type:'Date'},classe:{type:'String',value:'Classe'},total:{type:'Currency',value:'Total'}}, collection:c});
		var html = table.asHTML();
	
		new t41.view.alert(html, {title:'Commandes du regroupement',buttons:{close:true}});
	};
	
	
	
	this.detailCommande = function() {
		
		var c = this._getCommande(t41.view.caller);		
		var l = c.get('lignes');
		
		html = new t41.view.table({display:[l.members[0].get('produit')], collection:l.members});
		this.alert = new t41.view.alert(html, {title: 'Commande du ' + c.get('creation')});
	};
	
	
	this.generer = function(obj) {
		
		var regs = this.getCheckboxes(true);
		if (regs.length == 0) {
			
			new t41.view.alert("Veuillez sélectionner au moins un regroupement", {timer:5});
			return false;
		}
		var html = "Vous vous apprétez à générer un engagement incluant tous les regroupements sélectionnés";
		this.alert = new t41.view.alert(html,{
												title:'Demande de confirmation', 
												buttons:{confirm:true, abort:true}, 
		 									  }
									   );
		t41.view.bindLocal(jQuery('#confirm'), 'click', jQuery.proxy(this,'callGenerer'));		
	};
	
	
	this.callGenerer = function(obj) {
		
		if (obj && obj.status) {
			
			switch (obj.status) {
			
				case t41.core.status.ok:
					// suppression des regroupements convertis
					this.getCheckboxes(true).each(function(i) { jQuery(this).closest('tr').remove(); });
					
					// si plus de lignes, retour à l'écran précédent
					if (this.getCheckboxes().length == 0) {
						new t41.view.alert("L'engagement a été créé", {defer:true});
						document.location.replace(document.referrer);
					} else {
						new t41.view.alert("L'engagement a été créé");
					}
					break;
				
				default:
					break;
			}
			return;
		}
		
		regs = [];
		this.getCheckboxes(true).each(function(i) { 
			regs[regs.length] = jQuery(this).closest('tr').data('member');
		});
		
		t41.core.call({action:'action/creation', callback:jQuery.proxy(this,'callGenerer'), data:{uuid:this.action.data.uuid, regs:regs}});
	};
	
	
	this._getRegroupement = function(caller) {
		
		this.tr = jQuery(caller).closest('tr');
		this.mid = this.tr.data('member');
		return this.regs.getMember(this.mid);
	};
	
	
	
	this.waitBeforeToggle = function() {

		// Si la boite détectée est la globale, attendre la fin d'exécution de son callback (5ms)
		setTimeout(jQuery.proxy(this,'toggleReg'),5);
	};
	
	
	this.toggleReg = function(obj) {
				
		total = 0;
		paniers = this.regs;
		tpanier = 0;

		this.getCheckboxes(false).each(function() {

			var tr = jQuery(this).closest('tr');
			
			switch (this.checked) {
			
			case true:
				tr.attr('style', 'background-color:orange');
				tpanier++;
				var id = tr.data('member');
				total += paniers.getMember(id).get('total');
				break;
				
			case false:
				tr.attr('style', 'background-color:white');
				break;
			}
		});
		
		jQuery('#total').html(t41.view.format(total, t41.view.currency));
	};
	
	
	/**
	 * Renvoie les boites cochées (défaut) ou non cochées
	 */
	this.getCheckboxes = function(checked) {
		
		return this.table.find(checked ? ':checked' : ':checkbox').not('[id!=""]');
	};
	
	
	this.rejeterRegroupement = function(obj) {

		this.reg = this._getRegroupement(t41.view.caller);
		
		if (! this.reg) {
			return false;
		}
		
		var html = "Vous vous apprétez à rejeter ce regroupement et toutes les commandes qu'il contient";
		this.alert = new t41.view.alert(html,{
												title:'Demande de confirmation', 
												buttons:{confirm:true, abort:true}, 
		 									  }
									   );
		t41.view.bindLocal(jQuery('#confirm'), 'click', jQuery.proxy(this,'callRejeterRegroupement'));		
	};
	
	
	this.callRejeterRegroupement = function(obj) {
		
		if (obj && obj.status) {
			
			switch (obj.status) {
			
				case t41.core.status.ok:

					new t41.view.alert("Le regroupement a été rejeté");
					this.tr.remove();

					// On sort de l'écran si plus de regroupement
					if (this.table.find('tr').length == 1) {
						t41.core.redirect('/finances/engagement/creation');
					}
					
					this.toggleReg();
					break;
				
				default:
					break;
			}
			return;
		}
		
		t41.core.call({action:'action/rejet', callback:jQuery.proxy(this,'callRejeterRegroupement'), data:{uuid:this.action.data.uuid, regroupement:this.reg.uuid}});
	};
	
	
	// constructor
	this.displayWidget();
	this.init();
};
