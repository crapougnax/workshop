
if (! window.cuertocs) window.cuertocs = {};

window.cuertocs.classe = function(obj) {


	this.obj = obj;
	
	this.container;

};


window.cuertocs.classe.supprimer = function(data) {

	
	if (data.obj.get('supprimable') != 'oui') {
		
		new t41.view.alert("Ce poste n'est pas supprimable", {level:'error'});
		return false;
	}
	
	new t41.view.alert('Veuillez confirmer la suppression de la classe ' + data.obj.get('label'), 
					   {
						title:'Confirmation requise',
						buttons:{
								 confirm:true,
								 abort:true
								}
					   	});
	
	if (data.container) cuertocs.classe.container = data.container;
	
	t41.view.bind({
					element:jQuery('#confirm'), 
					action:'action/suppression', 
					data:{
							uuid:grid.backend.data.uuid,
							classe:data.obj.uuid,
							_mid:data.mid
						 },
					callback:cuertocs.classe.retSupprimer
				});
};


/**
 * Fonction appelée au retour d'une requête serveur de suppression de classe
 * @param obj
 * @returns {Boolean}
 */
window.cuertocs.classe.retSupprimer = function(obj) {
	
	if (obj.status != t41.core.status.ok) {
		
		new t41.view.alert(obj.context.err, {level:'error'});
		return false;
	}
	
	new t41.view.alert("La classe a été supprimée");
	if (cuertocs.classe.container) {
		
		cuertocs.classe.container.remove();
		cuertocs.classe.container = null;
	}
	return true;
};
