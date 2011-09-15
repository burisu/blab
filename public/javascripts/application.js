// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults



$.behave("a[data-search]", "click", function () {
    var link = $(this), results = $('#' + link.attr("data-search"));
    $.ajaxDialog(link.attr("href"), {
	returns: {
	    zero: function (frame, data, textStatus, request) {
		results.html("<em>Nothing!</em>");
		frame.dialog("close");
	    },
	    one: function (frame, data, textStatus, request) {
		window.location.href = request.responseText;
	    },
	    many: function (frame, data, textStatus, request) {
		results.html($('ul', $("<div>"+request.responseText+"</div>")));
		frame.html(request.responseText);
	    }
	}
    });
    return false;
});