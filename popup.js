'use strict';
var href;
chrome.tabs.query({'active': true, 'lastFocusedWindow': true, 'currentWindow': true}, function (tabs) {
    href = tabs[0].url;
});

chrome.storage.sync.get('source_lang', function(data) {
if (data.source_lang == undefined) {
      chrome.storage.sync.set({ source_lang : 'auto' });
      setTimeout(function(){
$("#source_lang").val('auto');
},200);
}
});
chrome.storage.sync.get('target_lang', function(data) {
if (data.target_lang == undefined) {
      chrome.storage.sync.set({ target_lang : 'en' });
      setTimeout(function(){
$("#target_lang").val('en');
},200);
}
});

//linkek működjenek
$(document).ready(function(){
   $('body').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });
});

// set select menus to their values at startup
chrome.storage.sync.get('source_lang', function(data) {
    var sourcelang = data.source_lang;
    $("#source_lang").val(sourcelang);
});
chrome.storage.sync.get('target_lang', function(data) {
    var targetlang = data.target_lang;
    $("#target_lang").val(targetlang);
});



document.getElementById('source_lang').addEventListener("change", function(){
var selected = document.getElementById('source_lang').options[document.getElementById('source_lang').selectedIndex].value;
chrome.storage.sync.set({ source_lang: selected });
setTimeout(function(){
window.close();
chrome.tabs.reload();
},1000);
});

document.getElementById('target_lang').addEventListener("change", function(){
var selected = document.getElementById('target_lang').options[document.getElementById('target_lang').selectedIndex].value;
chrome.storage.sync.set({ target_lang: selected });
setTimeout(function(){
window.close();
chrome.tabs.reload();
},1000);
});


// Blacklistes weboldalak

// a popup felnyitásakor áttekeri a jó helyre a toggle switcheket
chrome.storage.sync.get('disabled_sites', function(data) {
    if (data.disabled_sites.includes(href)) {
    	document.getElementById('bubble').checked = false;
    } else {
    	document.getElementById('bubble').checked = true;    	
	}
});


// változtatja a blacklistet
document.getElementById('bubble').addEventListener("change", function(){

if (document.getElementById('bubble').checked == true) {
var blacklist;
chrome.storage.sync.get('disabled_sites', function(data) {
	blacklist = data.disabled_sites;
    deleter();
});
function deleter() {
delete blacklist[blacklist.indexOf(href)];
chrome.storage.sync.set({ disabled_sites: blacklist });
}
setTimeout(function(){
chrome.tabs.reload();
},1000);
} else {
var blacklist;
chrome.storage.sync.get('disabled_sites', function(data) {
blacklist = data.disabled_sites;
adder();
});
function adder() {
blacklist.push(href);
chrome.storage.sync.set({ disabled_sites: blacklist });
setTimeout(function(){
chrome.tabs.reload();
},1500);
}
}

});

showimg_setup();
// a popup felnyitásakor áttekeri a jó helyre a toggle switcheket
function showimg_setup() {
chrome.storage.sync.get('show_images', function(data) {
    if (data.show_images) {
    	document.getElementById('bubble2').checked = true;
    } else {
    	document.getElementById('bubble2').checked = false;    	
	}
});
};

// változtatja a show_imagest
document.getElementById('bubble2').addEventListener("change", function(){
	if (document.getElementById('bubble2').checked == true) {
		chrome.storage.sync.set({ show_images : true });
	} else {
		chrome.storage.sync.set({ show_images : false });
	}
	setTimeout(function(){
chrome.tabs.reload();
},1500);
});
