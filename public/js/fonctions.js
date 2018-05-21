function calculeAge(nomchamp,limite,contexte) {

        //l = limite.split('/');
	l = [2012, 12, 31];
        f = document.M;
        annee = f.elements[nomchamp + '[0]'].value;
        mois  = f.elements[nomchamp + '[1]'].value;
        jour  = f.elements[nomchamp + '[2]'].value;

        if(mois.length == 1) { document.getElementById(nomchamp + '[1]').value = '0' + mois; }
        if(jour.length == 1) { document.getElementById(nomchamp + '[2]').value = "0" + jour; }

        if(annee < 5 && annee > 0) { annee = 2000 + parseInt(annee); f.elements[nomchamp + '[0]'].value = annee; }
        else if(annee < 100 && annee > 0) { annee = 1900 + parseInt(annee); f.elements[nomchamp + '[0]'].value = annee; }

        if(jour > 0 && mois > 0 && mois < 13 && annee > 1969)
                {
                if(jour > 31)
                        {
                        txt = "<font color=red><b>Données jour et mois incohérentes</b></font>";
                        }
                else if(jour > 30 && (mois == 4 || mois == 6 || mois == 9 || mois == 11))
                        {
                        txt = "<font color=red><b>Ce mois ne comporte que 30 jours</b></font>";
                        }
                else if(jour > 29 && mois == 2 && Bissextile(annee) == true)
                        {
                        txt = "<font color=red><b>Le mois de février de cette année comportait 29 jours</b></font>";
                        }
                else if(jour > 28 && mois == 2 && Bissextile(annee) == false)
                        {
                        txt = "<font color=red><b>Le mois de février de cette année comportait 28 jours</b></font>";
                }
                else
                        {
                        ddn = new Date(annee,mois,jour);
                        ddr = new Date(l[2],l[1],l[0]);

                        agedays = Math.floor((ddr - ddn) / 24 / 60 / 60 / 1000);
                age  = parseInt((ddr - ddn) / 24 / 60 / 60 / 1000 / 365.25);
                        extra = parseInt((agedays-(age*365.25))/30);
                        if(age > 0) { txt = age + " ans"; }
                        if(extra > 0)
                                {
                                if(age > 0) { txt += " et "; }
                                txt += extra + " mois";
                                }
                        txt += " au " + limite;
                        if((age < 3 || age > 12) && contexte!=6)
                                {
                                txt = "<font color=red><b>" + txt + "</b></font>";
                                document.M.elements["sys_submit"].disabled = true;
                                alert("CET ENFANT NE PEUT PAS ETRE INSCRIT !\n\nL'âge de l'enfant doit être compris entre\n3 ans et 13 ans inclus au " + limite + ".");
                                }
                        else
                                {
                                document.M.elements["sys_submit"].disabled = false;
                                }
                        }
                }
        else
                {
                txt = "Données manquantes";
                }
        document.getElementById(nomchamp + '_infozone').innerHTML = txt;
}
        
function Bissextile(annee) {

    return (annee%4 == 0 || (annee%4 == 0 && annee%100 == 0 && annee%400 == 0));
}

function Majuscule(objet) {
        if (objet.value != "") { objet.value = objet.value.toUpperCase(); }
}

function NomPropre(objet) {
        if (objet.value != "") {
                base = objet.value;
                base = base.replace(";"," ");
                base = base.replace(","," ");
                base = base.replace("  "," ");
                if(base.substring(0,1) == " ") { base = base.substring(1,base.length); }
                if(base.substring(base.length-1,1) == " ") { base = base.substring(0,base.length-1); }
                chaine = "";
                tmp = base.split(" ");
                for(i = 0 ; i < tmp.length ; i++)
                        {
                        if(i > 0) { chaine += " "; }
                        tmp2 = tmp[i].split("-");
                        if(tmp2.length > 1)
                                {
                                for(j = 0 ; j < tmp2.length ; j++)
                                        {
                                        if(j > 0) { chaine += "-"; }
                                        chaine += tmp2[j].substring(0,1).toUpperCase() + tmp2[j].substring(1,tmp2[j].length).toLowerCase();
                                        }
                                }
                        else
                                {
                                chaine += tmp[i].substring(0,1).toUpperCase() + tmp[i].substring(1,tmp[i].length).toLowerCase();
                                }
                        }
                objet.value = chaine;
                }
}
        
function Telephone(objet) {

        if (objet.value != "") {
                base = objet.value;
                while(base.search(" ") >= 0) { base = base.replace(" ",""); }

                if (base.length != 10) {
                        alert("Un numéro de téléphone doit comporter 10 chiffres !");
                        return false;
                }
                
                if (isNaN(parseInt(base))) {
                        alert("Un numéro de téléphone ne peut comporter que des valeurs numériques !");
                        objet.value="";
                        return false;
                } else {
                        if(base.substring(0,1) != "0" && base.length < 10) { base = "0" + base; }
                        objet.value = base;
                        return true;
                }
        }
}
