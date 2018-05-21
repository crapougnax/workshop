
if (! window.page) window.page = {};


window.cuertocs.regroupement = function(obj, action) {

	this.obj = t41.object.factory(obj);

	this.action = action;
	
	this.tr, this.mid, this.alert;
	

	this.detailCommande = function() {
		
		var c = this._getCommande(t41.view.caller);		
		var l = c.get('lignes');
		
		html = new t41.view.table({display:[l.members[0].get('produit')], collection:l.members});
		this.alert = new t41.view.alert(html, {title: 'Commande du ' + c.get('creation')});
	};
	
	
	this.rejeterCommande = function() {
		
		var c = this._getCommande(t41.view.caller);

		if (c.get('statut') != 420) {
			new t41.view.alert("Le statut actuel de cette commande ne permet pas d'exécuter cette action", {level:'error'});
			return false;
		}
		
		var html = "Veuillez confirmer que vous souhaitez rejeter cette commande<br/>" 
				 + c.get('total', true) + ' seront restitués à ' + this.obj.get('entite');
		
		this.alert = new t41.view.alert(html,{
												title:'Demande de confirmation', 
												buttons:{confirm:true, abort:true}, 
											 }
						  			   );
		t41.view.bindLocal(jQuery('#confirm'), 'click', jQuery.proxy(this,'callRejeterCommande'));
	};
	
	
	this.callRejeterCommande = function(obj) {
		
		if (obj.status) {
		
			if (obj.status == t41.core.status.ok) {
				
				if (obj.data._tr) jQuery('tr[data-member="' + obj.data._tr + '"]').remove();

				if (obj.data.termine) {
					
					new t41.view.alert("Dernière commande rejetée, le regroupement a été annulé");
				} else {
					new t41.view.alert("Commande rejetée");
				}
			}
			return;
		}
		
		t41.core.call({action:'action/rejetc', data:{uuid:this.action.data.uuid, mid:this.mid, _tr:this.mid}});
	};
	
	
	
	this.valider = function(obj) {
		
		var html = "Vous vous apprétez à valider ce regroupement et toutes les commandes qu'il contient";
		this.alert = new t41.view.alert(html,{
												title:'Demande de confirmation', 
												buttons:{confirm:true, abort:true}, 
		 									  }
									   );
		t41.view.bindLocal(jQuery('#confirm'), 'click', jQuery.proxy(this,'callValider'));		
	};
	
	
	this.callValider = function(obj) {
		
		if (obj && obj.status) {
			
			switch (obj.status) {
			
				case t41.core.status.ok:
					new t41.view.alert("Le regroupement a été validé");
					t41.core.redirect('/commandes/regroupement/validation');
					break;
				
				default:
					break;
			}
			return;
		}
		
		t41.core.call({action:'action/validation', data:{uuid:this.action.data.uuid}});
	};
	
	
	this.rejeter = function(obj) {
		
		var html = "Vous vous apprétez à rejeter ce regroupement et toutes les commandes qu'il contient";
		this.alert = new t41.view.alert(html,{
												title:'Demande de confirmation', 
												buttons:{confirm:true, abort:true}, 
		 									  }
									   );
		t41.view.bindLocal(jQuery('#confirm'), 'click', jQuery.proxy(this,'callRejeter'));		
	};
	
	
	this.callRejeter = function(obj) {
		
		if (obj && obj.status) {
			
			switch (obj.status) {
			
				case t41.core.status.ok:
					new t41.view.alert("Le regroupement a été rejeté");
					t41.core.redirect('/commandes/regroupement/validation');
					break;
				
				default:
					break;
			}
			return;
		}
		
		t41.core.call({action:'action/rejet', data:{uuid:this.action.data.uuid}});
	};
	
	
	this._getCommande = function(caller) {
		
		this.tr = jQuery(caller).closest('tr');
		this.mid = this.tr.data('member');
		return this.obj.get('commandes').getMember(this.mid);
	};
};
