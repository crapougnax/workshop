jQuery(document).ready(function() {

	// Bloc préparatoire inscription
	jQuery('#js_alert').hide();

	jQuery('#dialog').dialog({
		position: ['',145],
		closeOnEscape: false,
		draggable: false,
		modal: false,
		resizable: false,
		minWidth: 970
	});

	var annee = jQuery('body').hasClass('annee_10')
		? 'annee_10'
		: (jQuery('body').hasClass('annee_1')
				? 'annee_1'
				: (jQuery('body').hasClass('annee_0')
						? 'annee_0'
						: 'annee_10'
				)
		);

	if (annee!='annee_10') jQuery('body .annee_10').remove();
	if (annee!='annee_0') jQuery('body .annee_0').remove();
	if (annee!='annee_1') jQuery('body .annee_1').remove();

	jQuery('#dialog').show();
	jQuery('#main').show();
	jQuery('.button').button();

	// Validation
	preform = jQuery('#preform').validate({
		highlight: function(element, errorClass) {
			jQuery(element).parents('div.field').addClass('warning');
		},
		unhighlight: function(element, errorClass) {
			jQuery(element).parents('div.field').removeClass('warning');
		},
		rules: {
            'adresse[cp]': { valueNotEquals: "default" }
	    },
	    messages: {
            'adresse[cp]': { valueNotEquals: "Please select an item!" }
	    },
	    errorPlacement: function(element) {

	    }
	});

	jQuery('#start').on('click', function (e) {
		if (preform.form()) {
			jQuery('#dialog').dialog('close');
			parseInput('form');
		} else {
			e.stopImmediatePropagation();
		}
	});

	jQuery('#tabs').data('tabs_last_id', 0).data('tabs_current_id', 0);

	// classes de controle des autocompleteurs
	jQuery('#_adresse_voie_').addClass('ac_check required');
	jQuery('#_eleve_commnaissance_').addClass('ac_check required');
	jQuery('#_fratrie_0__entite_').addClass('ac_check required');
	jQuery('#_eleve_depnaissance_').addClass('ac_check required');
	jQuery('#_responsable_1__adresse__cp_').addClass('ac_check required');
    jQuery('#_fratrie_1__entite_').addClass('ac_check required');
    jQuery('#_fratrie_2__entite_').addClass('ac_check required');
    jQuery('#_responsable_1__adresse__voie_').addClass('ac_check required');
    jQuery('#_derogation_entite_').addClass('ac_check required');

    jQuery('.ac_check').on('blur', function() {
    	jQuery(this).parents('div.field').removeClass('warning');
    });

	jQuery.validator.addClassRules({
		"text": {
			required: true,
			minlength: 3
		},
		"ac_check": {
			required: true,
			accheck: true,
			minlength: 2
		},
		"numeric": {
			number: true
		}
	});

	jQuery.validator.addMethod("valueNotEquals", function(value, element, arg) {
		return arg != value;
	}, "Value must not equal arg");

	jQuery.validator.addMethod('isDate', function(value, element, arg) {
	}, 'La valeur doit être une date');

	jQuery.validator.addMethod('accheck', function(value, element, arg) {
		var hval = jQuery(element).siblings('input[type=hidden]').val();
		var ival = jQuery(element).val();
		if (hval != '') {
			return true;
		} else {
			return false;
		}
	}, 'AC check');

	jQuery('input.required.99').mask('99', {placeholder:""});
	jQuery('input.required.9999').mask('9999', {placeholder:""});
	jQuery('input.tel').mask('99 99 99 99 99', {placeholder:""});

	formv = jQuery('#form').validate({
		highlight: function(element, errorClass) {
			jQuery(element).parents('div.field').addClass('warning');
		},
		unhighlight: function(element, errorClass) {
			jQuery(element).parents('div.field').removeClass('warning');
		},
		rules: {
            'adresse[cp]': { valueNotEquals: "default" },
			'responsable[0][situation]': { valueNotEquals: "default" }
	    },
	    messages: {
            'adresse[cp]': { valueNotEquals: "Please select an item!" },
            'responsable[0][situation]': { valueNotEquals: "Please select an item!" }
	    },
	    errorPlacement: function(element) {
	    }
	});

	jQuery('div.help').each(function() {
		var container = jQuery('<div></div>').addClass('helptext');
		var title = jQuery(this).children('h3').first().remove();
		jQuery(this).children().each(function () {
			jQuery(this).appendTo(container);
		});
		jQuery(title).appendTo(jQuery(this)).addClass('helptitle');
		jQuery(container).appendTo(jQuery(this));
	});

	jQuery('div.help h3.helptitle').on('click', function() {
		jQuery(this).siblings('div.helptext').slideToggle();
	});

	doc = {
		liste: {
			1:{
				id: 1,
				label: 'Livret de famille en entier ou acte de naissance de l\'enfant avec filiation'
                                //'Votre livret de famille en entier ou acte de naissance de l\'enfant avec filiation'
			}, 2:{
		    	id: 2,
		    	label: 'Justificatif de domicile récent'
			}, 3:{
				id: 3,
				label: 'Pièce d\'identité du responsable légal'
                                //'Votre pièce d\identité'
			//}, 4:{
				//id: 4,
				//label: 'Page de vaccination du carnet de santé DT Polio uniquement'
                                //'Les certificats de vaccination de votre enfant DT (Polio uniquement)'
			}, 5:{
				id: 5,
				label: 'Jugement de divorce ou Décision du Juge aux Affaires Familiales'
			}, 6:{
				id: 6,
				label: 'Décision du Juge aux Affaires Familiales'
			}, 7:{
				id: 7,
				label: 'Accord écrit des 2 parents sur le choix de la 1re adresse en cas de garde alternée',
				mandatory: false
			}, 8:{
				id: 8,
				label: 'Attestation sur l\'honneur d\'hébergement',
				help: 'Pour télécharger le modèle <a href="/medias/attestation_hebergement.pdf" target=_blank >cliquez ici</a>.'
			}, 9:{
				id: 9,
				label: 'Pièce d\'identité de l\'hébergeant'
                                //'Pièce d\'identité de la personne qui vous héberge'
			}, 10:{
				id: 10,
				label: 'Copie du justificatif de domicile récent de l\'hébergeant'
			}, 11:{
				id: 11,
				label: 'Décision du Juge des Enfants ou décision du juge des tutelles'
			}, 12:{
				id: 12,
				label: 'Attestation du Service d\'Aide Sociale à l\'Enfance'
			}, 13:{
				id: 13,
				label: 'Certificat de scolarité'
			}, 14:{
				id: 14,
				label: 'En cas de nom différent, acte de naissance ou livret de famille',
				mandatory: false
			}, 15:{
				id: 15,
				label: 'Dérogation accordée par le Maire de Marseille pour l\'inscription de cet enfant dans une école de la commune'
			}, 16:{
				id: 16,
				label: 'Certificat médical'
			}, 17:{
				id: 17,
				label: 'Attestation de l\'employeur avec mention des horaires et du lieu de travail'
			}, 18:{
				id: 18,
				label: 'Attestation sur l\'honneur de la personne assurant la garde de l\'enfant hors temps scolaire'
			}, 19:{
				id: 19,
				label: 'Justificatif de domicile établi au nom de la personne assurant la garde de l\'enfant hors temps scolaire'
			}, 20:{
				id: 20,
				label: 'Copie du livret de famille attestant du lien familial'
			}, 21:{
				id: 21,
				label: 'Contrat de travail ou attestation sur l\'honneur de la personne assurant la garde de l\'enfant hors temps scolaire'
			}
		},
		requirements: [{
			id: 0,
			label: 'Cas général',
			legend: 'Documents obligatoires dans tout les cas',
			doc: [1,2,3,4]
		},{
			id: 1,
			label: 'Documents en cas de divorce ou de séparation des parents',
			question: 'Êtes-vous divorcé ou séparé?',
			doc: [5,7]
		},{
			id: 2,
			label: 'Documents à fournir si le parent demandeur ou l\'enfant réside chez un tiers',
			question: 'L\'enfant et son responsable légal sont-ils hébergés par un tiers?',
                        //'Votre enfant et vous même êtes hébergés chez un tiers'
			doc: [8,9,10]
		},{
			id: 3,
			label: 'Document relatif au placement de l\'enfant en foyer ou en famille d\'accueil',
			question: 'L\'enfant est-il placé dans un foyer, dans une famille d\'accueil ou placé sous tutelle?',
			doc: [11]
		},{
			id: 4,
			label: 'Documents concernant un frère ou une soeur déjà scolarisé dans une école publique de Marseille',
			question: 'L\'enfant à inscrire a-t-il un frère ou une soeur déjà scolarisé?',
                        //'Avez vous un enfant déjà scolarisé dans une école publique de Marseille ?'
			doc: [13,14]
		}]
	};

	if (jQuery('body').hasClass('parent')) {

		recap = jQuery('#form_5');
		//jQuery('<legend>Pièces présentées</legend>').appendTo(recap);

		uploadfiles = {};
		// construction de la liste de checkboxes en fin de procédure
		for (var d in doc.liste) {
			var field = jQuery('<div>').addClass('field');
			jQuery('<label>').attr('for', 'form_5_doc_'+d).html(doc.liste[d].label).appendTo(field);
			jQuery('<input>').attr('type', 'checkbox').attr('id', 'form_5_checkbox_'+d).attr('name', 'dossier['+d+'][id]').addClass('required').addClass('invisible').val(d).appendTo(field);
			jQuery('<input>').attr('type', 'hidden').addClass('hiddenfilename').attr('name','dossier['+d+'][filename]').appendTo(field);
			jQuery('<div>').attr('id', 'form_5_doc_'+d).addClass('qq-upload-list').data('document_id', d).appendTo(field);
			jQuery('<div>').addClass('clear').appendTo(field);
			field.appendTo(recap);

			uploadfiles[d] = new italic.upload(jQuery('#form_5_doc_'+d), d);
		}

	}

	documentsInit();


	// Formulaires Dérogation

	jQuery('#form_1_motif').bind('change', function(e) {

		//console.log(e);
		jQuery('.form_1_motif').slideUp();
		var selected = parseInt(e.target.options.selectedIndex)-1;	//remplacement de srcElement par target modif cyril
			selected += '_doc'; // convert to string
		console.log('.form_1_motif_'+selected);
		jQuery('#form_1_motif_'+selected).slideDown();

		if (e.target.options.selectedIndex==10) {					//remplacement de srcElement par target modif cyril
			jQuery('#form_1_motif_autre').slideDown();
		} else {
			jQuery('#form_1_motif_autre').slideUp();
		}
	});

	// Navigation principale inscription/dérogation
	jQuery('#tabs').tabs({
		disabled: [1,2,3,4,5],
		select: function(event, ui) {
			return navigate(ui.index);
		},
		show: function(event, ui) {
			setTimeout("jQuery('form .warning').removeClass('warning');", 5);
		}
	});

	// on déclare le bloquage dans les accordions avant de les déclarer eux-même
	jQuery('.acc_tab_parent h3.label').on('click', function (e) {
		// si la validation du formulaire ne passe pas
		if (!formv.form()) {
			// on empêche la propagation du click, qui n'arrivera pas jusqu'au listener de l'accordion
			e.stopImmediatePropagation();
		}
	});

	jQuery('.acc_tab_parent').find('.acc_tab').not(':first').find(':input').prop('disabled', true);

	jQuery('.acc_tab_parent').accordion({
		autoHeight: false,
		changestart: function(event, ui) {
			ui.newContent.find(':input').prop('disabled', false);
			ui.newContent.find('span.radio').buttonset('enable');
		},
		change: function(event, ui) {
			// exceptions pour le resp. leg. 2
			if (ui.newContent.context.id=='subtab-2_label') {
				jQuery('#form_3_b_exists_field input').prop('checked', false);
				jQuery('#form_3_b_exists_1').prop('checked', true);
				jQuery('#form_3_b_exists_field span.radio').buttonset('refresh');
			} else if (ui.newContent.context.id=='subtab-2_label') {
				jQuery('#form_3_b_exists_field input').prop('checked', false);
				jQuery('#form_3_b_exists_0').prop('checked', true);
				jQuery('#form_3_b_exists_field span.radio').buttonset('refresh');
			}
		}
	});

	jQuery('.acc_tab').each(function() {
		var label = jQuery(this).prev('h3.label');
		var field = jQuery(this);
		field.find('.field input.label').on('change', function() {
			label.children('a').html(
				field.find('input.label.nom').val().toUpperCase() + ' ' + field.find('input.label.prenom').val().toUpperCase()
			);
		});
	});

	jQuery('a.abort').on('click', function () {
		jQuery(this).parents('.acc_tab_parent').accordion('activate', 0);
		jQuery(this).parents('.acc_tab').find(':input').prop('disabled', true);
		jQuery(this).parents('.acc_tab').find(':input[type="text"]').val('');
		jQuery(this).parents('.acc_tab').prev('h3').first().children('a').html('Saisie annulée');
	});

	jQuery('#btt_prev').button({
		icons: { primary: 'ui-icon-arrowthick-1-w' },
		disabled: true
	});

	jQuery('#btt_abort').button({
		icons: { primary: 'ui-icon-cancel' }
	});

	jQuery('#btt_next').button({
		icons: { secondary: 'ui-icon-arrowthick-1-e' }
	});

	jQuery('#btt_submit').button({
		icons: { secondary: 'ui-icon-circle-check' }
	}).hide();

	jQuery('#tabs div.field span.iconhelp').button({
		icons: { primary: 'ui-icon-help' },
		text: false
	});

	jQuery('.radio').buttonset();

	// Formulaires inscription
	jQuery('#form_2_pays input').on('click', function (e) {
		if (e.target.id=='form_2_pays_1' && e.target.checked==true) {
			jQuery('#form_2_dep_field').slideUp();
			jQuery('#form_2_city_100_field').hide();
			jQuery('#form_2_city_990_field').show();
		} else if (e.target.id=='form_2_pays_0' && e.target.checked==true) {
			jQuery('#form_2_dep_field').slideDown();
			jQuery('#form_2_city_990_field').hide();
			jQuery('#form_2_city_100_field').show();
		}
	});


	// Form folding
	jQuery('#form_3_a_adresse input').on('click', function (e) {
		if (e.target.id=='form_3_a_adresse_0' && e.target.checked==true) {
			jQuery('.hidden.form_3_a_adresse').slideUp();
		} else if (e.target.id=='form_3_a_adresse_1' && e.target.checked==true) {
			jQuery('.hidden.form_3_a_adresse').slideDown();
		}
		setTimeout("parseInput('form', false);", 300);
	});

	// Form folding
	jQuery('#form_3_b_adresse input').on('click', function (e) {
		if (e.target.id=='form_3_b_adresse_0' && e.target.checked==true) {
			jQuery('#form_3_b_pays_field').slideUp();
			jQuery('#form_3_b_city_field').slideUp();
			jQuery('#form_3_b_pays_hf_field').slideUp();
		} else if (e.target.id=='form_3_b_adresse_1' && e.target.checked==true) {
			jQuery('#form_3_b_pays_field').slideDown();
		}
		setTimeout("parseInput('form', false);", 300);
	});

	jQuery('#form_3_b_pays_field .radio input').on('click', function (e) {
		if (e.target.id=='form_3_b_pays_0' && e.target.checked==true) {
			// France
			jQuery('#form_3_b_city_field').slideDown();
			jQuery('#form_3_b_city_').slideDown();
			//jQuery('#form_3_b_cp_field').slideDown();
			jQuery('#form_3_b_pays_hf_field').slideUp();
			jQuery('#form_3_b_cp_hf_field').slideUp();
			jQuery('#form_3_b_cp_hors_field').slideUp();
			jQuery('#form_3_b_voie_hors').slideUp();
		} else if (e.target.id=='form_3_b_pays_1' && e.target.checked==true) {
			jQuery('#form_3_b_cp_hf_field').slideDown();
			jQuery('#form_3_b_city_field').slideDown();
			jQuery('#form_3_b_city_').slideUp();
			jQuery('#form_3_b_cp_field').slideDown();
			jQuery('#form_3_b_voie_hors').slideDown();
			jQuery('#form_3_b_adresse_1').prop('checked', true); // ?
			jQuery('#form_3_b_cp_select_field').slideUp();
			jQuery('#form_3_b_cp_hors_field').slideUp();
			jQuery('#form_3_b_pays_hf_field').slideDown();
			jQuery('#form_3_b_voie_ac').slideUp();
		}
		setTimeout("parseInput('form', false);", 300);
	});

	jQuery('#form_3_b_city input').on('click', function (e) {
		if (e.target.id=='form_3_b_city_0' && e.target.checked==true) {
			// marseille
			jQuery('#form_3_b_cp_field').show();
			jQuery('#form_3_b_cp_hors_field').hide(); // masquer le champs libre CP
			jQuery('#form_3_b_cp_select_field').show(); // afficher le select
			jQuery('#form_3_b_voie_ac').show();
			jQuery('#form_3_b_voie_hors').hide();
		} else if (e.target.id=='form_3_b_city_1' && e.target.checked==true) {
			// hors marseille
			jQuery('#form_3_b_cp_field').show();
			jQuery('#form_3_b_cp_select_field').hide();
			jQuery('#form_3_b_cp_hors_field').show();
			jQuery('#form_3_b_voie_hors').show();
			jQuery('#form_3_b_voie_ac').hide();
		}

		setTimeout("parseInput('form', false);", 300);
	});

	jQuery('#preform_doc_4_1, #preform_doc_4_0').on('click', function (e) {
		if (e.target.checked==true) {
			switch (e.target.id) {
			case 'preform_doc_4_1':
				// Non
				jQuery('#tabs-4 .no').show();
				jQuery('#tabs-4 .yes').hide();
				jQuery('#form_4_frat_acc').hide();
				break;

			case 'preform_doc_4_0':
				// Oui
				jQuery('#tabs-4 .yes').show();
				jQuery('#tabs-4 .no').hide();
				jQuery('#form_4_frat_acc').show();
				break;
			}
		}
	});

	// Form folding
	jQuery('#form_4_frat input').on('click', function (e) {
		if (e.target.id=='form_4_frat_1' && e.target.checked==true) {
			jQuery('#form_4_frat_acc').slideUp();
			jQuery('#form_4_a :input').val('');
			jQuery('#tabs').tabs('select', 4);
		} else if (e.target.id=='form_4_frat_0' && e.target.checked==true) {
			jQuery('#form_4_frat_acc').slideDown();
			jQuery('#form_4_frat_acc').find('.acc_tab').first().find(':input').prop('disabled', false);
			jQuery('#form_4_frat_acc').find('.acc_tab').first().find('span.radio').buttonset('enable');
			parseInput('form_4_a');
		}
		setTimeout("parseInput('form', false);", 300);
	});

	jQuery('#form_3_b_exists_field input').on('click', function (e) {

		if (e.target.id=='form_3_b_exists_0' && e.target.checked==true) {
			// Non
			jQuery('#subtab-2 input[type=text]').val('');
			jQuery('#subtab-2 .radio input').prop('checked', false);
			jQuery('#subtab-2 .radio').buttonset('refresh');

			navClicked({target: jQuery('#btt_next')});
		} else if (e.target.id=='form_3_b_exists_1' && e.target.checked==true) {
			// Oui
			jQuery('#subtab').accordion('activate', 1);
			setTimeout("parseInput('form', false);", 300);
		}

	});

	jQuery('#subtab2abort').on('click', function () {
		jQuery('#form_3_b_exists_field input').prop('checked', false);
		jQuery('#form_3_b_exists_0').prop('checked', true);
		jQuery('#form_3_b_exists_field span.radio').buttonset('refresh');
	});


	jQuery('#confirmation a.button').on('click', function (e) {
		switch (e.delegateTarget.id) {
		case 'conf_print':
			jQuery('#conf_step_1').show();
			break;
		case 'conf_go_derog_0': // derog oui
			// lien déjà présent sur le <a>
			break;
		case 'conf_go_derog_1': // derog non
			jQuery('#conf_step_2').show();
			break;
		case 'conf_go_recensement_0': // recensement oui
			jQuery('#confirmation').dialog('close');
			recensement.restart();
			break;
		case 'conf_go_recensement_1': // recensement non
			// lien déjà présent sur le <a>
			break;
		}
	});

	jQuery('.touppercase').on('keyup keydown', function() {
		var val = jQuery(this).val();
		jQuery(this).val(val.toUpperCase());
	});

	jQuery('#form_3_a_prenom, #form_3_a_nom').on('change', function () {
		var nom = jQuery('#form_3_a_nom').val();
		var prenom = jQuery('#form_3_a_prenom').val();

		jQuery('#subtab-1_label a').html(nom.toUpperCase() + ' ' + prenom.toUpperCase());
	});

	jQuery('#form_3_b_prenom, #form_3_b_nom').on('change', function () {
		var nom = jQuery('#form_3_b_nom').val();
		var prenom = jQuery('#form_3_b_prenom').val();

		jQuery('#subtab-2_label a').html(nom.toUpperCase() + ' ' + prenom.toUpperCase());
	});

	jQuery('#form_3_c_prenom, #form_3_c_nom').on('change', function () {
		var nom = jQuery('#form_3_c_nom').val();
		var prenom = jQuery('#form_3_c_prenom').val();

		jQuery('#subtab-3_label a').html(nom.toUpperCase() + ' ' + prenom.toUpperCase());
	});

	jQuery('a.ac_placeholder').on('click', function () {
		var input = jQuery(this).siblings('input');
		jQuery(this).html('').hide();
		input.val('').filter('.ac_input').show().focus();
	});

	jQuery('#form_3_a_status .radio input').on('change', function (e) {
		var input = e.target.id;

		switch (input) {
			case 'form_3_a_status_2': // Tuteur
				jQuery('#form_3_a_situation')
					.prop('disabled', true)
					.prop('selectedIndex', 0)
					.parent('.field')
						.slideUp();
			break;

			default:
				jQuery('#form_3_a_situation')
					.prop('disabled', false)
					.parent('.field')
						.slideDown();
			break;
		}
	});

	jQuery('#form_3_a_city input').on('change', function (e) {
		var input = e.target.id;
		jQuery('#form_3_a_cp_field').slideDown();

		switch (input) {
			case 'form_3_a_city_0': // Marseille
			console.log(input);
				jQuery('#form_3_a_cp_field .form_3_a_cp_select').prop('id', 'form_3_a_cp').show();
				jQuery('#form_3_a_cp_field .form_3_a_cp_input').prop('id', '').hide();
			break;

			case 'form_3_a_city_1': // Hors-Marseille
			console.log(input);
				jQuery('#form_3_a_cp_field .form_3_a_cp_input').prop('id', 'form_3_a_cp').show();
				jQuery('#form_3_a_cp_field .form_3_a_cp_select').prop('id', '').hide();
			break;
		}
	});

	// Tooltips
	jQuery('.iconhelp').tipsy({
		gravity: 'w',
		fade: true,
		delayOut: 500
	});

	jQuery('a.ac_placeholder').tipsy({
		gravity: 'w',
		fade: true
	}).prop('title', 'Cliquez pour modifier cette valeur');

	var locale = jQuery('body').hasClass('derogation')? 'derogation': 'inscription';

	// Navigation
	jQuery('#nav a, #nav span').live('click', function (e) {
		e.stopImmediatePropagation();
		navClicked(e);
	});

	jQuery('input[name*="nom"]').live('blur', function () {
		jQuery(this).val(
			jQuery(this).val().toUpperCase()
		);
	});

	jQuery('div.field').each(function () {
		var c = jQuery(this).find('.required');

		if (jQuery(this).parents('fieldset').prop('id')=='form_5') {
			var fac = '&nbsp;<em>le cas échéant</em>';
		} else {
			//var fac = '&nbsp;<em>facultatif</em>';
			var fac = '';
		}
		var rad = jQuery(this).find('span.radio');
		if (c.length==0 && rad.length==0 && jQuery(this).children(':input').length>0) {
			var val = jQuery(this).find('label').html();
			jQuery(this).find('label').html(fac + val);
		} else {
			jQuery(this).find('label').css({'font-weight':'bold'});
		}
	});

});

function documentsInit() {

	recap = jQuery('#form_5');
	if (jQuery('body').hasClass('bmdp')) {
		jQuery('<legend>Pièces présentées</legend>').appendTo(recap);
		// construction de la liste de checkboxes en fin de procédure
		for (var d in doc.liste) {
			var required = doc.liste[d].mandatory==false? '': 'required';
			var field = jQuery('<div>').addClass('field');
			jQuery('<label>').prop('for', 'form_5_doc_'+d).html(doc.liste[d].label).appendTo(field);
			jQuery('<input>').prop('type', 'checkbox').prop('id', 'form_5_doc_'+d).prop('name', 'dossier['+d+'][id]').addClass(required).val(d).appendTo(field);
			jQuery('<div>').addClass('clear').appendTo(field);
			field.appendTo(recap);
		}
	}

	documentsGeneral();

	var dialog = jQuery('#dialog');
	var particulier = jQuery('#cas-particulier');
	particulier.html('');

	jQuery('#preform_1_year input').attr('checked', false).prop('checked', false);
	jQuery('#preform_1_year').buttonset('refresh');

	jQuery('fieldset#anneescolaire input').on('change', function () {
		var val = jQuery(this).val();
		jQuery('#eleve_anneescolaire').val(val);
		jQuery('#tabs-6 > h3 > strong').html(anneescolaire[val].label);
	});


	jQuery('<legend></legend>').html('Autres situations').appendTo(particulier);

	// Construction des listes de documents pour chaque cas particulier
	for (var casid in doc.requirements) {

		if (casid!=0) {
			// cas particuliers
			var field = jQuery('<div></div>').addClass('field');
			jQuery('<label></label>').html(doc.requirements[casid].question).addClass('text').appendTo(field);
			var base = 'preform_doc_'+casid;
			var radio = jQuery('<span>').addClass('radio');

			jQuery('<input>')
				.prop('type', 'radio')
				.prop('name', base)
				.prop('id', base+'_0')
				.prop('value', 0)
				.addClass('required')
				.data('cas_id', casid)
				.appendTo(radio);

			jQuery('<label>')
				.prop('for', base+'_0')
				.html('Oui').appendTo(radio);

			jQuery('<input>')
				.prop('type', 'radio')
				.prop('name', base)
				.prop('id', base+'_1')
				.prop('value', 1)
				.attr('checked', true)
				.prop('checked', true)
				.addClass('required')
				.data('cas_id', casid)
				.appendTo(radio);

			jQuery('<label>')
				.prop('for', base+'_1')
				.html('Non')
				.appendTo(radio);

			radio.appendTo(field);
			field.appendTo(particulier);
			radio.buttonset('refresh');

			jQuery('<div class="clear"/>').appendTo(particulier);

		}

		jQuery('#cas-particulier div.field').each(function () {
			var c = jQuery(this).find('.required');
			var fac = '&nbsp;<em>facultatif</em>';
			var rad = jQuery(this).find('span.radio');
			if (c.length==0 && rad.length==0 && jQuery(this).children(':input').length>0) {
				var val = jQuery(this).find('label').html();
				jQuery(this).find('label').html(fac + val);
			} else {
				jQuery(this).find('label').css({'font-weight':'bold'});
			}
		});
		jQuery('#cas-particulier .radio').buttonset();
	}

	jQuery('#dialog fieldset#cas-general').on('click', function () {
		jQuery('#dialog fieldset#cas-particulier div.field').first().slideDown();
	});

	jQuery('#dialog fieldset#cas-particulier div.field span.radio input').on('click', function () {
		documentsDisplay(documentsChecked());
		jQuery(this).parents('div.field').nextAll('div.field').first().slideDown();
	});

	setTimeout(function() { documentsDisplay(documentsChecked()); }, 500);
};

// liste des documents
function documentsChecked() {
	checked = []; // CAS cochés
	docs = []; // Documents déduits des cas

	// déterminer quelles cases sont cochées sur "Oui"
	jQuery('#dialog fieldset#cas-particulier div.field input[value="0"]:checked').each(function () {
		checked.push(parseInt(jQuery(this).data('cas_id')));
	});

	// construire la liste des documents d'après les cases cochées
	jQuery(doc.requirements).each(function (i,o) {
		var id = o.id;
		var tmp = o.doc;

		if (jQuery.inArray(id, checked)!='-1') {
			docs = jQuery.merge(docs, tmp);
		}
	});
	return docs;
};

// affichage des documents
function documentsDisplay(D) {
	if (jQuery('body').hasClass('parent')) return;
	var str = '';
	var el = '';

	el = jQuery('#preform_doc_recap');
	el.html('');

	// pour chaque document connu
	for (var i in doc.liste) {
		var id = doc.liste[i].id; // id du doc

		if (jQuery.inArray(id, D) >= 0) { // id trouvé
			str += '- '+doc.liste[i].label;
			str += '<br />';
			// afficher ou masquer les éléments correspondant dans le dernier panneau du formulaire
			jQuery('#form_5_doc_'+i).parent('div.field').show();
			//console.log('showing '+i);
		} else if (jQuery.inArray(id, doc.requirements[0].doc)=='-1') {
			jQuery('#form_5_doc_'+i).parent('div.field').hide();
			//console.log('hiding '+i);
		}
	}

	// on stocke les valeurs dans un input hidden pour usage ultérieur
	D = jQuery.merge(D, doc.requirements[0].doc);
	jQuery('#dossier_checked').val(JSON.stringify(D));

	if (str.length==0) {
		str = 'Aucun';
	}


	el.html(str).slideDown();
};

function documentsGeneral() {

	var el = jQuery('#preform_doc_recap_general');
	var D = doc.requirements[0].doc;
	var str = '';

	for (var i in doc.liste) {
		var id = doc.liste[i].id;

		if (jQuery.inArray(id, D) >= 0) {
			str += '- '+doc.liste[i].label;
			str += '<br />';
			// afficher ou masquer les éléments correspondant dans le dernier panneau du formulaire
			jQuery('#form_5_doc_'+i).parent('div.field').show();
		} else {
			jQuery('#form_5_doc_'+i).parent('div.field').hide();
		}
	}

	el.html(str).slideDown();

};

var map = {
		// form 1: adresse
			form_1_num: 'form_61_num',
			'_adresse_voie_': {id:'form_61_voie', type:'autocomplete', source:'adresse_voie__display'},
			form_1_svoie: {id: 'form_61_bis', type: 'select'},
			form_1_comp: 'form_61_comp',
			form_1_cp: {id: 'form_61_cp', type:'select'},

		// form 2: enfant
			form_2_prenom: 'form_62_prenom',
			form_2_nom: 'form_62_nom',
			form_2_prenoms: {id:'form_62_prenoms', format:{prefix:'(', suffix:')'}},
			eleve_commnaissance__display: {id:'form_62_city', type:'span'},
			eleve_depnaissance__display: {id:'form_62_dep', type:'span', format:{prefix: ', '}},
			form_2_pays: {id:'form_62_pays', type:'radio'},
			form_2_day: 'form_62_day',
			form_2_month: 'form_62_month',
			form_2_year: 'form_62_year',
			'eleve[sexe]': {id:'form_62_sexe', type:'radio'},
			'eleve[paysnaissance]': {type:'radio', id:'form_62_pays'},

		// form 3a: resp 1
			'responsable[0][parente]': {id:'form_63a_status', type:'radio'},
			form_3_a_nom: 'form_63a_nom',
			form_3_a_prenom: 'form_63a_prenom',
			form_3_a_tel: 'form_63a_tel',
			form_3_a_cell: {type:'input', id:'form_63a_cell', format:{prefix:' - '}},
			form_3_a_mail: 'form_63a_mail',

		// form 3b: resp 2
			'responsable[1][parente]': {id:'form_63b_status', type:'radio'},
			form_3_b_nom: 'form_63b_nom',
			form_3_b_prenom: 'form_63b_prenom',
			form_3_b_tel: 'form_63b_tel',
			form_3_b_cell: {type:'input', id:'form_63b_cell', format:{prefix:' - '}},
			form_3_b_mail: 'form_63b_mail',

		// form 4a: fratrie 1
			form_4_a_nom: 'form_64a_nom',
			form_4_a_prenom: 'form_64a_prenom',
			fratrie_0__entite__display: {id:'form_64a_ecole', type:'span', format:{prefix:'Scolarisé(e) à '}},
			'fratrie[0][sexe]': {'id':'form_64a_sexe', 'type':'radio'},

		// form 4b: fratrie 2
			form_4_b_nom: 'form_64b_nom',
			form_4_b_prenom: 'form_64b_prenom',
			fratrie_1__entite__display: {id: 'form_64b_ecole', type:'span', format:{prefix:'Scolarisé(e) à '}},
			'fratrie[1][sexe]': {id:'form_64b_sexe', type:'radio'},

		// form 4c: fratrie 3
			form_4_c_nom: 'form_64c_nom',
			form_4_c_prenom: 'form_64c_prenom',
			fratrie_2__entite__display: {id:'form_64c_ecole', type:'span', format:{prefix:'Scolarisé(e) à '}},
			'fratrie[2][sexe]': {id:'form_64b_sexe', type:'radio'},

		// form 5: documents
			dossier: {type:'list', name:'dossier', id:'form_7', parent:'form_5'},

		// conditions d'affichage
			form_4_a_recap: {type:'display', id:'form_64a_recap', source:'form_4_a_prenom'},
			form_4_b_recap: {type:'display', id:'form_64b_recap', source:'form_4_b_prenom'},
			form_4_c_recap: {type:'display', id:'form_64c_recap', source:'form_4_c_prenom'},
			form_6_b_recap: {type:'display', id:'form_6_b_recap', source:'form_3_b_prenom'}
		};

function updaterecap() {
	// mises à jour automatiques du panneau récapitulatif
	for (var id in map) {
		var tr = map[id];
		val = jQuery('#'+id).val();
		var target = '#'+tr;

		if (typeof(tr)=='object') {
			target = '#'+tr.id;

			switch (tr.type) {
				case 'span':
					val = jQuery('#'+id).html();
					break;

				case 'select':
					val = jQuery('#'+id).children('option').filter(':selected').not(':first-child').html();
					break;

				case 'autocomplete':
					val = jQuery('#'+tr.source).html();
					break;

				case 'radio':
					// on cherche le bouton radio selectionné d'après sa prop name
					var fid = jQuery('*[name="'+id+'"]').filter(':checked').prop('id');
					// le bouton radio selectionné est ciblé sur son ID par un <label> qui contient le libellé en clair
					val = jQuery('*[for="'+fid+'"]').children('span').html();
					break;

				case 'list':
					val = '';
					jQuery('#'+tr.parent+' input[name^="'+tr.name+'"]').filter(':checked').each(function () {
						var fid = jQuery(this).prop('id');
						var str = jQuery(this).siblings('label[for="'+fid+'"]').html();
						if (str!=null && str!='undefined' && str!='' && typeof(str)!='undefined') {
							val += str+'<br />';
						}
					});
					break;

				case 'display':
					var val = jQuery('#'+tr.source).val();

					if (val!='') {
						jQuery('#'+tr.id).show();
					} else {
						jQuery('#'+tr.id).hide();
					}
					break;

				case 'input':
					val = jQuery('#'+id).val();
					break;
			}

			if (typeof(tr.format)!='undefined') {
				var format = tr.format;
				if (format.prefix && format.prefix!='') { val = format.prefix + val; }
				if (format.suffix && format.suffix!='') { val = val + format.suffix; }
			}
		}

		if (typeof(tr)!='undefined' && tr.type!='display') {
			jQuery(target).html(val);
		}
	}

	// mises à jour demandant un peu plus de conditions
	// adresse resp leg 2

	if (jQuery('#form_3_b_adresse_1').prop('checked')==true) {
		var rl2_voie = '';
		var rl2_numero = '';
		var rl2_numerobis = '';
		var rl2_commune = '';
		var rl2_pays = 'France';
		var rl2_comp = '';

		if (jQuery('#form_3_b_pays_0').prop('checked')==true) {
			// france
			if (jQuery('#form_3_b_city_0').prop('checked')==true) {
				// marseille
				rl2_commune = jQuery('#form_3_b_cp_select').children('option :selected').not(':first').html();
				rl2_voie = jQuery('#responsable_1__adresse__voie__display').html();
			} else {
				// hors-marseille
				rl2_commune = jQuery('#responsable_1__adresse__cp__display').html();
				rl2_voie = jQuery('#form_3_b_voie').val();
			}
		} else {
			// hors-france
			rl2_voie = jQuery('#form_3_b_voie').val();
			rl2_commune = jQuery('#form_3_b_cp_hf_input').val();
			rl2_pays = jQuery('#form_3_b_pays_hf').val();
		}
		rl2_numero = jQuery('#form_3_b_num').val();
		rl2_numerobis = jQuery('#form_3_b_svoie').children('option :selected').not(':first').html();
		rl2_comp = jQuery('#form_3_b_comp').val();
	} else {
            var rl2_voie = '';
            var rl2_numero = '';
            var rl2_numerobis = '';
            var rl2_commune = '';
            var rl2_pays = '';
            var rl2_comp = 'Même adresse que l\'enfant';
        }
	jQuery('#form_63b_numero').html(rl2_numero);
	jQuery('#form_63b_numerobis').html(rl2_numerobis);
	jQuery('#form_63b_voie').html(rl2_voie);
	jQuery('#form_63b_comp').html('('+rl2_comp+')');
	jQuery('#form_63b_commune').html(rl2_commune);
	jQuery('#form_63b_pays').html(rl2_pays);

};



function parseInput(parent_id, focus) {
	var focus = focus==false? false: true;
	jQuery('*[tabindex]').prop('tabindex', null);
	var total = 0;
	var visible = 0;
	var firstVisible = false;
	var lastIndexed = false;
	var parent = null;

	jQuery(':input, a').each(function () {
		total++;

		if (jQuery(this).is(':input') && jQuery(this).is(':visible') && jQuery(this).not('[type=hidden]')) {
			jQuery(this).prop('tabindex', total);
			visible++;
			if (firstVisible==false) {
				firstVisible = jQuery(this).prop('id');
				if (focus==true) {
					jQuery(this).focus();
				}
			}
			lastIndexed = jQuery(this);
		} else {
			jQuery(this).prop('tabindex', total+1000);
		}
	});

	var selected = jQuery('#tabs').tabs('option', 'selected');

	if (jQuery('body').hasClass('inscription')) {
		jQuery(lastIndexed).on('blur', function(e) {
			//console.log(e);
			if (selected!=2 && selected!=3) {
				// simuler un clic sur le bouton "Suivant"
				navClicked({target: jQuery('#btt_next')});
			} else {
				return false;
			}
		});
	}

};

function navClicked (e) {
	var target = jQuery(e.target).closest('a').prop('id');
	var selected = jQuery('#tabs').data('tabs_current_id');
	var locale = jQuery('body').hasClass('inscription')? 'inscription': 'derogation';
	var last = jQuery('#tabs').data('tabs_last_id');
	var last_id = jQuery('#tabs').data('tabs_last_id');


	switch (target) {
		case 'btt_next':
			if (formv.form()) {
				var next = (selected==5)? 5: selected+1;
				updateTabs(next);
				jQuery('#tabs').tabs('select', next);
			}
		break;

		case 'btt_prev':
			var next = selected==0? 0: selected-1;
			jQuery('#tabs').tabs('select', next);
		break;

		case 'btt_abort':
			// Alerte confirmation
			jQuery('#alertabort').dialog({
				closeOnEscape: false,
				draggable: false,
				modal: true,
				resizable: false
			});

			jQuery('#alertabort .close').on('click', function () {
				jQuery('#alertabort').dialog('close');
			});

			jQuery('#alertabort .return').on('click', function () {
				document.location.href = '/recensement/accueil/bmdp';
			});

			jQuery('#alertabort .restart').on('click', function () {
				jQuery('#alertabort').dialog('close');
				recensement.restart();
			});
		break;

		case 'btt_submit':
			if (jQuery('body').hasClass('inscription')) {
				recensement.enregistrer();
			}
			if (jQuery('body').hasClass('derogation')) {
				derogation.enregistrer();
			}
		break;
	}
};

function updateTabs(last) {
	var tabs = [];
	if (last > jQuery('#tabs').data('tabs_last_id')) {
		for (i=last+1; i<7; i++) {
			tabs.push(i);
		}
		jQuery('#tabs').tabs('option', 'disabled', tabs);
	}
};

function navigate(target) {
	var last = jQuery('#tabs').data('tabs_last_id');
	var current = jQuery('#tabs').data('tabs_current_id');

	// navigation en arrière autorisée sans conditions
	if (current>=target && current==last) {
		jQuery('#tabs').data('tabs_current_id', target);
		parseInput('form');
		if (jQuery('body').hasClass('inscription')) {
			if (target<5) {
				jQuery('#btt_next').show();
				jQuery('#btt_submit').hide();
			}
		}
		if (jQuery('body').hasClass('derogation')) {
			if (target<2) {
				jQuery('#btt_next').show();
				jQuery('#btt_submit').hide();
			}
		}
		return true;
	} else {
		// soumise à validation de l'onglet en cours
		//var validation = ;

		if (formv.form()) {
			updateTabs(target);
			updaterecap();

			jQuery('#form_'+current).children('div.field').removeClass('warning');

			jQuery('#tabs').data('tabs_current_id', target);
			if (target>last) {
				jQuery('#tabs').data('tabs_last_id', target);
			}

			if (target==0) {
				jQuery('#btt_prev').button('option', 'disabled', true).button('refresh');
			} else {
				jQuery('#btt_prev').button('option', 'disabled', false).button('refresh');
			}

			// dernier onglet, affichage du bouton de validation
			if (jQuery('body').hasClass('inscription')) {
				if (target==5) {
					jQuery('#btt_next').hide();
					jQuery('#btt_submit').show();
				}
			}
			if (jQuery('body').hasClass('derogation')) {
				if (target==2) {
					jQuery('#btt_next').hide();
					jQuery('#btt_submit').show();
				}
			}

			setTimeout("parseInput('form');", 30);
			return true;
		}
		return false;
	}

};
