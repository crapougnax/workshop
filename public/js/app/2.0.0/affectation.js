if (! window.cuertocs) window.cuertocs = {};


window.cuertocs.affectation = function(action, classes) {

	this.obj = action;
	
	this.classes = new t41.object.collection();
	this.classes.populate(classes.collection);
	
	this.current;

	
	this.resetMdp = function() {
		
		var tr = jQuery(t41.view.caller).closest('tr');
		
		var options = { 
						title:"Changement de mot de passe", 
						buttons:{
									confirm:true,
									abort:true
								},
						callbacks:{
									confirm:jQuery.proxy(this, 'doResetMdp')
								  }
					  };
		alert = new t41.view.alert("Vous vous apprétez à regénérer le mot de passe de <b>" + tr.find('td:first').html() + '</b>', options);
		t41.view.bind({
						element:alert.buttons.confirm,
						action:'action/mdp',
						callback:jQuery.proxy(this, 'doResetMdp'),
						data:{uuid:this.obj.data.uuid,id:tr.data('member')}
					 });
	};
	
	
	this.doResetMdp = function(obj) {
		if (obj) {
			if (obj.status == t41.core.status.ok) {
				new t41.view.alert("Le nouveau mot de passe est : " + obj.data.pwd, {title:'Changement effectué'});
			} else {
				new t41.view.alert("Une erreur s'est produite", {level:'error'});
			}
		}
	};
	
	
	this.debut = function(obj) {
		
		var msg = "<span>Veuillez saisir l'identifiant de l'enseignant que vous souhaitez ajouter à votre effectif.<br>";
		msg += "Si celui-ci n'en dispose pas, il doit en demander un par mél à l'adresse <a href='mailto:page@cime.org'>page@cime.org</a>.<br/></span><br/>";
		msg += '<input type="text" id="identifiant"/>';
		
		var options = { 
						title:"Ajout d'un enseignant", 
						buttons:{confirm:true,abort:true},
						callbacks:{
									confirm:jQuery.proxy(this,'debut2')
								 }
					  };
		
		alert = new t41.view.alert(msg, options);
		alert.run();
		jQuery('#identifiant').focus();
		t41.view.bindLocal(alert.buttons.confirm,'click',jQuery.proxy(this,'debut2'));
	};
	
	this.debut2 = function() {
		
		var identifiant = jQuery('#identifiant');
		if (! identifiant.val()) {
			identifiant.focus();
			return;
		};
		
		t41.core.call({
						action:'action/debut',
						callback:jQuery.proxy(this, 'debut3'),
						data:{
								uuid:this.obj.data.uuid,
								identifiant:identifiant.val()
							 }
		 			 });
	};
	
	
	this.debut3 = function(obj) {
		
		if (obj.status != t41.core.status.ok) {
			
			new t41.view.alert(obj.context.err, {level:'error'});
			return;
		}
		
		var msg = '<span><input type="checkbox" id="confirmation"> Je confirme que je souhaite ajouter<br>\
				  <b>' + obj.data.nom + ' ' + obj.data.prenom + '</b> \
				  à mon école.<br/><br/>\
			      Sélectionnez sa classe dans le menu déroulant :<br/>\
				  <select id="classe" name="classe"><option label="" value=""></option>';
		
		for (var i in this.classes.members) {
			var classe = this.classes.members[i];
			//console.log(classe);
			msg += '<option label="" value="' + classe.uuid +'">' + classe.get('label') + '</option>';
		}
		
		msg += '</select><br/>';

		var params = {title:"Confirmation de début d'activité", buttons:{confirm:true,abort:true}};
		alert = new t41.view.alert(msg, params);
		
		t41.view.bindLocal(alert.buttons.confirm,'click',jQuery.proxy(this,'debut4'), obj);
	};
	
	
	this.debut4 = function(obj) {

		if (jQuery('#confirmation').prop('checked') != true) {
			return false;
		}
		
		// unbind bouton
		jQuery('#confirm').html('En cours...').unbind();
		
		t41.core.call({
			action:'action/debut2',
			callback:jQuery.proxy(this, 'doDebut'),
			data:{uuid:this.obj.data.uuid, id:obj.data.caller.data.id, classe:jQuery('#classe').val()}
		 });
	};
	
	
	this.doDebut = function(obj) {
		
		if (obj.status != t41.core.status.ok) {
			new t41.view.alert(obj.context.err, {level:'error'});
			return;			
		}
		
		new t41.view.alert("Affectation réalisée");
		window.location.reload(true);
	};
	
	
	this.fin = function(obj) {
		
	//	new t41.view.alert('fonction temporairement suspendue');
	//	return;
		
		var tr = jQuery(t41.view.caller).closest('tr');
		this.current = tr;
		
		var options = { 
						title:"Fin d'affectation", 
						callbacks:{
									confirm:jQuery.proxy(this, 'doFin')
								  }
					  };
		alert = new t41.view.alert.confirm("Vous vous apprétez à déclarer la fin à l'activité de<br/><b>" + tr.find('td:first').html() + '</b> à votre école.', options);

		t41.view.bind({
						element:alert.buttons.confirm,
						callback:jQuery.proxy(this, 'doFin'),
						action:'action/fin',
						data:{uuid:this.obj.data.uuid,id:tr.data('member')}
					 });
	};
	
	
	/**
	 * Fonction appelée au retour d'une demande de fin d'affectation
	 */
	this.doFin = function(obj) {
		if (obj && obj.status) {
			if (obj.status == t41.core.status.ok) {
				new t41.view.alert("Fin d'activité enregistrée");
				jQuery(this.current).remove();
				this.current = null;
			} else {
				new t41.view.alert(obj.context.err, {level:'error'});
			}
		} else {
			t41.core.call({action:'action/fin',data:{uuid:this.obj.data.uuid,id:this.current.data('member')}});
		}
	};
};

