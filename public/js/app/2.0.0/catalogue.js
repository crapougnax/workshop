
if (! window.cuertocs) window.cuertocs = {};
if (! window.cuertocs.catalogue) window.cuertocs.catalogue = {};


window.cuertocs.catalogue = function(obj) {


	this.obj = obj;

	
	this.offset = 0;
	
	
	this.batch = 10;
	
	
	
	this.importer = function() {
		
		new t41.view.alert('Veuillez confirmer que vous souhaitez importer ce catalogue', 
						   {
								title:'Import CSV',
								buttons:{
											confirm:true,
											abort:true
										}});
		
		t41.view.bindLocal(jQuery('#confirm'), 'click', jQuery.proxy(this, 'doImport'));
	};
	
	
	
	this.doImport = function() {
		
		jQuery('#confirm').unbind('click').html('En cours');
		jQuery('#bimport').unbind('click');
		jQuery('#bimport').html('En cours');
		
		this.importSegment();
	};
	
	
	this.importSegment = function(obj)
	{		
		// on boucle par lot de n produits jusqu'à la fin (synchrone)
		t41.core.call({action:'action/import',data:{offset:this.offset,batch:this.batch,uuid:this.obj.data.uuid}, callback:jQuery.proxy(this,'retImportSegment')});
	};
	
	
	this.retImportSegment = function(obj)
	{
		if (obj.status == t41.core.status.ok) {

			if (obj.data.first == obj.data.last) {
				
				new t41.view.alert('Erreur');
				return;
			}
			new t41.view.alert("Lignes " + obj.data.first + ' à ' + obj.data.last + ' importées', {title:'Import CSV'});

			if (obj.data.left > 0) {
				this.offset += this.batch;
			
				this.importSegment();
			} else {
				
				new t41.view.alert("Import terminé, " + obj.data.last + ' produits créés', {title:'Import CSV',timer:10});
			}
		}
	};
};