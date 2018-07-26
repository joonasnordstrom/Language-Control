/*
 * Kielituki,
 * käännöksiä tarvitseviin html elementteihin lisätään "data-globalize=[key]" attribuutti,
 * jota vastaava "key":"value" pari lisätään "globalization.json" tiedostoon,
 * tämä luokka lukee käännökset ja populoi ne elementteihinsä, sekä globaaliin translatioList muuttujaan query parametrissa määritetyn kielen mukaan

 * Muuttujat prefixoidaan asetettavan propertien mukaan {prefix}:
 * css muuttujat: {--}css-muuttuja,
 * js muuttujat: {js}-muuttuja,
 * html elementin teksti: {text}-muuttuja (HUOM! elementin sisällä ei saa olla muita elementtejä),
 * title attribuutti: {title}-muuttuja,
 * placeholder: {placeholder}-muuttuja
*/

// kielituki käännökset valitulle kielelle
var translationList = {};

// oletuskieli
const DEFAULT_LANG = "fi";
// polku
const JSON_DATA_PATH = "/Timepub/ResourcesDK/data/globalization.json";


$(document).ready(function () {
    LanguageControl.Init();
});

var LanguageControl = new function () {
    var dataByLang = null;
    var domain = window.location.origin;
    var url = domain + JSON_DATA_PATH;

    this.Init = function () {

        var lang = getQueryParameterByName("lang");

        $.getJSON(url, function (data) {
            dataByLang = (typeof data[lang] != "undefined") ? data[lang] : data[DEFAULT_LANG];
        })
            .success(function () {
                var prop = null;

                $.each(dataByLang, function (key, val) {
                    prop = key.split("-")[0];

                    translationList[key] = val;

                    // javascriptissä käytettävät muuttujat
                    if (prop === "js") {
                        return true;
                    }
                    // element text
                    else if (prop === "text") {
                        $("[data-globalization=" + key + "]").text(val);
                    }
                    // css muuttujat
                    else if (key.startsWith("--")) {
                        // asetetaan kaikki stringeinä
                        document.documentElement.style.setProperty(key, '\"' + val + '\"');
                    }
                    // attribuutit kuten: "title" tai "placeholder"
                    else {
                        $("[data-globalization=" + key + "]").prop(prop, val);
                    }
                });
            })
            .error(function (jqXHR, textStatus, errorThrown) {
                console.log("error " + textStatus);
                //console.log("incoming Text " + jqXHR.responseText);
            })
    }
}

// pöllitty stack overflowsta, aika pöljä
function getQueryParameterByName(name) {
    url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
