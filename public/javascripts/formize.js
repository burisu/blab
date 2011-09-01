/*jslint devel: true, browser: true, sloppy: true, vars: true, white: true, maxerr: 50, indent: 2 */

var Formize = {
    
    uniqueID: function() {
     	var uid = 'u'+((new Date()).getTime() + "" + Math.floor(Math.random() * 1000000)).substr(0, 18);
	return uid;
    }

};


Formize.Overlay = {
    
    count: 0,
    
    add: function (body) {
        var overlay = $('#overlay')[0];
        if (overlay === null || overlay === undefined) {
            overlay = $(document.createElement('div'));
	    overlay.attr({id: 'overlay', style: 'position:fixed; top:0; left: 0; display: none'});
            $('body').append(overlay);
	    this.resize();
	    overlay.fadeIn('fast');
    	}
        this.count += 1;
    	overlay.css('z-index', this.zIndex());
        return overlay;
    },

    resize: function () {
        var height = $(document).height(), width = $(document).width();
        var overlay = $('#overlay');
	overlay.css({width: width+'px', height: height+'px'});
    },
    
    remove: function() {
        this.count -= 1;
        var overlay = $('#overlay');
    	if (overlay !== null) {
            if (this.count <= 0) {
    		overlay.fadeOut(400, function() { $(this).remove(); });
    	    } else {
    		overlay.css('z-index', this.zIndex());
    	    }
        }
        return this.count;
    },
    
    // Computes a big z-index with interval in order to intercalate dialogs
    zIndex: function() {
    	return (10*this.count + 10000);
    }
};





Formize.Dialog = {

    // Opens a div like a virtual popup
    open: function (url, updated, ratio) {
        var height = $(document).height(), width = $(document).width();
        var dialog_id = 'dialog'+Formize.Overlay.count;
        if (isNaN(ratio)) { ratio = 0.6; }
	
        Formize.Overlay.add();

        $.ajax(url, {
            data: {dialog: dialog_id},
            success: function(data, textStatus, jqXHR) {
		var dialog = $(document.createElement('div'));
                dialog.attr({id: dialog_id, 'data-ratio': ratio, 'data-dialog-update': updated, flex: '1', 'class': 'dialog', style: 'z-index:'+(Formize.Overlay.zIndex()+1)+'; position:fixed; display: none;'});
                $('body').append(dialog);
                dialog.html(data);
		Formize.Dialog.resize(dialog);
		dialog.fadeIn(400, function() { 
		    $(document).trigger("dom:update", dialog.attr('id')); 
		});
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("FAILURE (Error "+textStatus+"): "+errorThrown);
                Formize.Overlay.remove();
            }
        });
    },

    resize: function (dialog) {
        var width = $(window).width(), height = $(window).height();
	var ratio = parseFloat(dialog.attr('data-ratio'));
        var w = dialog.width();
        var h = dialog.height();
        if (ratio > 0) {
            w = ratio*width;
	    h = ratio*height;
        }
        dialog.animate({left: ((width-w)/2)+'px', top: ((height-h)/2)+'px', width: w+'px', height: h+'px'});
        return true;
    },

    // Close a virtual popup
    close: function(dialog) {
        dialog = $('#'+dialog);
        dialog.fadeOut(400, function() { $(this).remove(); });
        Formize.Overlay.remove();
        return true;
    },

    submitForm: function(form) {
        var dialog_id = form.attr('data-dialog');
        var dialog = $('#'+dialog_id);
	
        var field = $(document.createElement('input'));
	field.attr({ type: 'hidden', name: 'dialog', value: dialog_id });
        form.append(field);

	$.ajax(form.attr('action'), {
	    type: form.attr('method') || 'POST',
	    data: form.serialize(),
	    success: function(data, textStatus, request) {
		var record_id = request.getResponseHeader("X-Saved-Record-Id");
                if (record_id === null) {
                    // No return => validation error
                    dialog.html(request.responseText);
		    $(document).trigger("dom:update", dialog.attr('id'));
                } else {
                    // Refresh element with its refresh URL
                    var updated = $('#'+dialog.attr('data-dialog-update'));
                    if (updated[0] !== undefined) {
			var url = updated.attr('data-refresh');
			$.ajax(url, {
			    data: {selected: record_id},
			    success: function(data2, textStatus2, request2) {
				updated.replaceWith(request2.responseText);
				$(document).trigger("dom:update");
			    }
			});
                    }
                    // Close dialog
                    Formize.Dialog.close(dialog_id);
                }
	    }
	});
        return false;
    }

};


Formize.refreshDependents = function (event) {
    var element = $(this);
    var dependents = element.attr('data-dependents');
    var params = {};
    if (element.val() !== null && element.val() !== undefined) {
        params[element.attr('id')] = element.val();
        $(dependents).each(function(index, item) {
            // Replaces element
            var url = $(item).attr('data-refresh');
            if (url !== null) {
                $.ajax(url, {
                    data: params,
                    success: function(data, textStatus, response) {
			// alert("Success: "+response.responseText);
                        $(item).replaceWith(response.responseText);
			$(document).trigger("dom:update");
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
			alert("FAILURE (Error "+textStatus+"): "+errorThrown);
                    }
                });
            }
        });
        return true;
    }
    return false;
}



/**
 * Special method which is a sharthand to bind every element
 * concerned by the selector now and in the future. It correspond
 * to a lack of functionnality of jQuery on 'load' events.
 */
$.rebindeds = [];
function behave(selector, eventType, handler) {
    if (eventType == "load") {
	$(document).ready(function(event) {
	    $(selector).each(handler);
	    $(selector).attr('data-already-bound', 'true');
	});
	$.rebindeds.push({selector: selector, handler:handler});
    } else {
	$(selector).live(eventType, handler);
    }
}

// Rebinds unbound elements on DOM updates.
$(document).bind('dom:update', function(event, element_id) {
    var rebinded;
    for (var i=0; i<$.rebindeds.length; i++) {
	rebinded = $.rebindeds[i];
	$(rebinded.selector).each(function(x, element){
	    if ($(element).attr('data-already-bound') !== 'true') {
		rebinded.handler.call($(element));
		$(element).attr('data-already-bound', 'true');
	    }
	});
    }
});


//(function($, undefined) {


// function initializeWidgets(event) {    }

// $(document).ready(initializeWidgets);
// $(document).bind('dom:update', initializeWidgets);
// $(document).ready(function(event) {
// $(document).bind('ready', initializeWidgets);

// Initializes unroll inputs
behave('input[data-unroll]', 'load', function() {
    //    $('input[data-unroll]').each(function(i) {
    var element = $(this), choices, paramName;
    // alert(element.attr('data-value-container'));

    //if (element.autocompleteType !== null && element.autocompleteType !== undefined) { 
    //return false;
    //}
    
    element.unrollCache = element.val();
    element.autocompleteType = "text";
    element.valueField = $('#'+element.attr('data-value-container'))[0];
    if ($.isEmptyObject(element.valueField)) {
	alert('An input '+element.id+' with a "data-unroll" attribute must contain a "data-value-container" attribute');
	element.autocompleteType = "id";
    }
    element.maxResize = parseInt(element.attr('data-max-resize'));
    if (isNaN(element.maxResize) || element.maxResize === 0) { element.maxResize = 64; }
    element.size = (element.unrollCache.length < 32 ? 32 : element.unrollCache.length > element.maxResize ? element.maxResize : element.unrollCache.length);
    
    element.autocomplete({
	source: element.attr('data-unroll'),
	minLength: 1,
	select: function(event, ui) {
	    var selected = ui.item;
	    element.valueField.value = selected.id;
	    element.unrollCache = selected.label;
	    element.attr("size", (element.unrollCache.length < 32 ? 32 : element.unrollCache.length > element.maxResize ? element.maxResize : element.unrollCache.length));
	    $(element.valueField).trigger("emulated:change");
	    return true;
	}
	
    });
});



// Initializes date fields
behave('input[data-datepicker]', "load", function() {
    var element = $(this);
    var locale = element.attr("data-locale");
    var options = $.datepicker.regional[locale];
    if (element.attr("data-date-format") !== null) {
	options['dateFormat'] = element.attr("data-date-format");
    }
    options['altField'] = '#'+element.attr("data-datepicker");
    options['altFormat'] = 'yy-mm-dd';
    options['defaultDate'] = element.val();
    element.datepicker(options);
});

// Initializes resizable text areas
// Minimal size is defined on default size of the area
behave('textarea[data-resizable]', "load", function() {
    var element = $(this);
    element.resizable({ 
	handles: "se",
	minHeight: element.height(),
	minWidth: element.width(),
	create: function (event, ui) { $(this).css("padding-bottom", "0px"); },
	stop: function (event, ui) { $(this).css("padding-bottom", "0px"); }
    });
});

// Opens a dialog for a ressource creation
behave("a[data-add-item]", "click", function() {
    var element = $(this);
    var list_id = element.attr('data-add-item');
    var url = element.attr('href');
    Formize.Dialog.open(url, list_id);
    return false;
});

// Closes a dialog
behave("a[data-close-dialog]", "click", function() {
    var dialog_id = element.attr('data-close-dialog');
    Formize.Dialog.close(dialog_id);
    return false;
});

// Submits dialog forms
behave("form[data-dialog]", "submit", function() {
    return Formize.Dialog.submitForm($(this));
});

behave("*[data-dependents]", "change", Formize.refreshDependents);
behave("select[data-dependents]", "keypress", Formize.refreshDependents);
behave("*[data-dependents]", "emulated:change", Formize.refreshDependents);

// Resizes the overlay automatically
$(window).resize(function() {
    Formize.Overlay.resize();
    $('.dialog').each(function(i, dialog) {
	Formize.Dialog.resize($(dialog));
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
// 	overlay.setStyle({'z-index': this.zIndex()});
//         return overlay;
//     },

//     remove: function() {
//         this.count -= 1;
//         var overlay = $('overlay');
// 	if (overlay !== null) {
//             if (this.count <= 0) {
// 		overlay.remove();
// 	    } else {
// 		overlay.setStyle({'z-index': this.zIndex()});
// 	    }
//         }
//         return this.count;
//     },

//     // Computes a big z-index with interval in order to intercalate dialogs
//     zIndex: function() {
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
//                 var dialog = new Element('div', {id: dialog_id, 'data-ratio': ratio, 'data-dialog-update': updated, flex: '1', 'class': 'dialog', style: 'z-index:'+(Formize.Overlay.zIndex()+1)+'; position:fixed; opacity: 1'});
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
