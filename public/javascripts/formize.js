/*jslint devel: true, browser: true, sloppy: true, vars: true, white: true, maxerr: 50, indent: 2 */





var Formize = {

    uniqueID: function() {
     	var uid = 'u'+((new Date()).getTime() + "" + Math.floor(Math.random() * 1000000)).substr(0, 18);
	return uid;
    }

};











//(function($, undefined) {


$(function(event) {
    
    // Initializes date fields
    $('input[data-datepicker]').each(function(i) {
	var element = $(this);
	var altField = '#'+element.attr("data-datepicker"), dateFormat = element.attr("data-date-format");
	var locale = element.attr("data-locale");
	element.datepicker($.datepicker.regional['fr']);
	element.datepicker("option", "altField", altField);
	element.datepicker("option", "altFormat", 'yy-mm-dd');
    });

    // Initializes resizable text areas
    $('*[data-resize-in]').each(function(i) {
	var element = $(this);
	element.resizable({ handles: "se" });
    });

    // Initializes unroll inputs
    $('input[data-unroll]').each(function(i) {
	var element = $(this), choices, paramName;
	if (element.autocompleteType !== null && element.autocompleteType !== undefined) { 
	    return false;
	}
	
	element.unrollCache = element.val();
	element.autocompleteType = "text";
	element.valueField = $(element.attr('data-value-container'));
	if (element.valueField === null) {
	    alert('An input '+element.id+' with a "data-unroll" attribute must contain a "data-value-container" attribute');
	    element.autocompleteType = "id";
	}
	element.maxResize = parseInt(element.attr('data-max-resize'));
	if (isNaN(element.maxResize) || element.maxResize === 0) { element.maxResize = 64; }
	element.size = (element.unrollCache.length > element.maxResize ? element.maxResize : element.unrollCache.length);
	
	element.autocomplete({
	    source: element.attr('data-unroll'),
	    minLength: 1,
            appendTo: element.parentNode,
	    select: function(event, ui) {
		var selected = ui.item;
		element.val(selected.label);
		element.valueField.val(selected.value);
		rails.fire(element.valueField, "emulated:change");
		element.unrollCache = element.val();
		element.attr("size", (element.unrollCache.length > element.maxResize ? element.maxResize : element.unrollCache.length));
		return false;
	    }
	});
    });
});
    // })( jQuery );


    // var Formize = {};

    // Formize.Overlay = {
    
    //     count : 0,

    //     add : function (body) {
    //         body = body || document.body || document.getElementsByTagName("BODY")[0];
    //         var dims   = document.viewport.getDimensions();
    //         var height = dims.height, width = dims.width, overlay = $('overlay');
    //         if (overlay === null) {
    //             overlay = new Element('div', {id: 'overlay', style: 'position:fixed; top:0; left 0; width:'+width+'px; height: '+height+'px; opacity: 0.5'});
    //             body.appendChild(overlay);
    // 	}
    //         this.count += 1;
    // 	overlay.setStyle({'z-index': this.z_index()});
    //         return overlay;
    //     },
    
    //     remove: function() {
    //         this.count -= 1;
    //         var overlay = $('overlay');
    // 	if (overlay !== null) {
    //             if (this.count <= 0) {
    // 		overlay.remove();
    // 	    } else {
    // 		overlay.setStyle({'z-index': this.z_index()});
    // 	    }
    //         }
    //         return this.count;
    //     },
    
    //     // Computes a big z-index with interval in order to intercalate dialogs
    //     z_index: function() {
    // 	return (10*this.count + 10000);
    //     }
    // };


    // Formize.Dialog = {

    //     /* Opens a div like a virtual popup*/
    //     open: function (url, updated, ratio) {
    //         var body   = document.body || document.getElementsByTagName("BODY")[0];
    //         var dims   = document.viewport.getDimensions();
    //         var height = dims.height; 
    //         var width  = dims.width;
    //         var dialog_id = 'dialog'+Formize.Overlay.count;
    //         if (isNaN(ratio)) { ratio = 0.6; }
    
    //         Formize.Overlay.add();
    
    //         return new Ajax.Request(url, {
    //             method: 'get',
    //             parameters: {dialog: dialog_id},
    //             evalScripts: true,
    //             onSuccess: function(response) {
    //                 var dialog = new Element('div', {id: dialog_id, 'data-ratio': ratio, 'data-dialog-update': updated, flex: '1', 'class': 'dialog', style: 'z-index:'+(Formize.Overlay.z_index()+1)+'; position:fixed; opacity: 1'});
    //                 body.appendChild(dialog);
    //                 dialog.update(response.responseText);
    //                 var w = ratio*width;
    //                 var h = ratio*height;
    //                 if (ratio <= 0) {
    //                     var dialogDims = dialog.getDimensions();
    //                     w = dialogDims.width;
    //                     h = dialogDims.height;
    //                 }
    //                 dialog.setStyle('left:'+((width-w)/2)+'px; top:'+((height-h)/2)+'px; width:'+w+'px; height: '+h+'px');
    //                 return dialog.resize(w, h);
    //             },
    //             onFailure: function(response) {
    //                 alert("FAILURE (Error "+response.status+"): "+response.reponseText);
    //                 Formize.Overlay.remove();
    //             }
    //         });
    //     },

    //     /* Close a virtual popup */
    //     close: function (dialog) {
    //         dialog = $(dialog);
    //         dialog.remove();
    //         Formize.Overlay.remove();
    //         return true;
    //     }


    // };


    // Formize.Partials = {

    //     refresh: function (event, element) {
    //         var dependents = element.readAttribute('data-dependents').split(',');
    //         var params = new Hash();
    //         if (element.value !== null && element.value !== undefined) {
    //             params.set(element.id, element.value);
    //             dependents.each(function(item_id) {
    //                 // Replaces element
    //                 var item = $(item_id);
    //                 if (item) {
    //                     var url = item.readAttribute('data-refresh');
    //                     if (url !== null) {
    //                         new Ajax.Request(url, {
    //                             method: 'get',
    //                             asynchronous:true,
    //                             evalScripts:true,
    //                             parameters: params,
    //                             onSuccess: function(response) {
    //                                 item.replace(response.responseText);
    // 				$(item_id).fire("dom:loaded");
    //                             },
    //                             onFailure: function(response) {
    //                                 alert("ERROR FAILURE\n"+response.status+" "+response.statusText);
    //                             }
    //                         });
    //                     }
    //                 }
    //             });
    //             return true;
    //         }
    //     },

    //     submitDialogForm: function(event, form) {
    //         var dialog_id = form.readAttribute('data-dialog');
    //         var dialog = $(dialog_id);

    //         var field = new Element('input', { type: 'hidden', name: 'dialog', value: dialog_id });
    //         form.insert(field);

    //         new Ajax.Request(form.readAttribute('action'), {
    //             method:      form.readAttribute('method') || 'post',
    //             parameters:  Form.serialize(form),
    //             asynchronous: true,
    //             evalScripts: true,
    //             onLoaded:  function(request){ form.fire("layout:change"); }, 
    //             onSuccess: function(request){
    //                 if (request.responseJSON === null) {
    //                     // No return => validation error
    //                     dialog.update(request.responseText);
    // 		    dialog.fire("layout:change");
    //                 } else {
    //                     // Refresh element with its refresh URL
    //                     var updated =$(dialog.readAttribute('data-dialog-update'));
    //                     if (updated !== null) {
    // 			var url = updated.readAttribute('data-refresh');
    // 			new Ajax.Request(url, {
    // 			    method: 'GET',
    //                             asynchronous:true,
    //                             evalScripts:true,
    // 			    parameters: {selected: request.responseJSON.id},
    // 			    onSuccess: function(request) { 
    // 				updated.replace(request.responseText); 
    // 				updated.fire("layout:change");
    // 			    }
    // 			});
    //                     }
    //                     // Close dialog
    //                     Formize.Dialog.close(dialog);
    //                 }
    //             }
    //         });
    //         event.stop();
    //         return false;
    //     },

    //     uniqueID: function() {
    // 	var uid = 'u'+((new Date()).getTime() + "" + Math.floor(Math.random() * 1000000)).substr(0, 18);
    // 	return uid;
    //     },

    //     initializeUnroll: function(element) {
    // 	var choices, paramName;
    // 	if (element.valueField !== null && element.valueField !== undefined) { 
    // 	    return false;
    // 	}

    // 	choices = element.readAttribute('data-choices-container');
    // 	if (choices === null) {
    // 	    choices = new Element('div', {
    // 		'id': this.uniqueID(),
    // 		'class': "unroll-choices",
    // 		'style': "display: none"
    // 	    });
    // 	    element.insert({after: choices});
    // 	    element.writeAttribute('data-choices-container', choices.id);
    // 	}
    
    // 	element.unrollCache = element.value;
    // 	element.valueField = $(element.readAttribute('data-value-container'));
    // 	if (element.valueField === null) {
    // 	    alert('An input '+element.id+' with a "data-unroll" attribute must contain a "data-value-container" attribute');
    // 	}
    // 	element.maxResize = parseInt(element.readAttribute('data-max-resize'));
    // 	if (isNaN(element.maxResize) || element.maxResize === 0) { element.maxResize = 64; }
    // 	element.size = (element.unrollCache.length > element.maxResize ? element.maxResize : element.unrollCache.length);
    
    // 	new Ajax.Autocompleter(element, choices, element.readAttribute('data-unroll'), {
    // 	    method: 'GET',
    // 	    paramName: 'search',
    // 	    afterUpdateElement: function(element, selected) {
    // 		var model_id = /(\d+)$/.exec(selected.id)[1];
    // 		element.valueField.value = model_id;
    // 		element.valueField.fire("emulated:change");
    // 		element.unrollCache = element.value;
    // 		element.size = (element.unrollCache.length > element.maxResize ? element.maxResize : element.unrollCache.length);
    //             }
    // 	});
    //     }

    // };







    // (function() {
    //     "use strict";

    //     // Refreshes dependent elements
    //     document.on("change", "*[data-dependents]", Formize.Partials.refresh);
    //     document.on("emulated:change", "*[data-dependents]", Formize.Partials.refresh);

    //     // Opens a dialog for a ressource creation
    //     document.on("click", "a[data-add-item]", function(event, element) {
    //         var list_id = element.readAttribute('data-add-item');
    //         var url = element.readAttribute('href');
    //         Formize.Dialog.open(url, list_id);
    //         event.stop();
    //     });

    //     // Closes a dialog
    //     document.on("click", "a[data-close-dialog]", function(event, element) {
    //         var dialog_id = element.readAttribute('data-close-dialog');
    //         Formize.Dialog.close(dialog_id);
    //         event.stop();
    //     });

    //     // Submits dialog forms
    //     document.on("submit", "form[data-dialog]", Formize.Partials.submitDialogForm);

    //     // Manage unroll
    //     // this is the only found way to work with dom:loaded

    //     Event.observe(window, "dom:loaded", function(event) {
    // 	$$('input[data-unroll]').each(function(element) {
    // 	    Formize.Partials.initializeUnroll(element);
    // 	});
    //     });

    //     document.on("focusin", "input[data-unroll]", function(event, element) {
    // 	if (element.unrollCache === undefined) {
    // 	    element.unrollCache = element.value;
    // 	}
    //     });


    //     // if (1) {
    //     // 	if (this.value != this.unrollCache) { 
    //     // 	    this.valueField.value = ''; 
    //     // 	}
    //     // } else {
    //     // 	this.value = this.unrollCache;
    //     // }
    //     document.on("change", "input[data-unroll]", function(event, element) {
    //         window.setTimeout(function () {
    // 	    if (this.value != this.unrollCache) { 
    // 		this.valueField.value = ''; 
    // 		this.valueField.fire("emulated:change");
    // 	    }
    // 	}.bind(element), 200);
    //     });

    //     document.on("keypress", "input[data-unroll]", function(event, element) {
    // 	if (event.keyCode === Event.KEY_RETURN) {
    // 	    event.stop();
    // 	    return false;
    // 	} else { return true; }
    //     });

    // })();
