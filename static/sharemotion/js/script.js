$(document).ready(function() {
	$('#emotion').hide();
	$('#bar').click(showHideBar);
	
	$('#post').click(function(){
    	var comment = $("#comment").val();
    	$("#comment").val('');
    	$("#errormessage").html('Your post will be up in a few seconds!');
    	var feeling = $("#feeling").html();
    	var name = $("#name").html();
    	$.get('/sharemotion/post/', {name:name, comment:comment, feeling:feeling}, function(data) {
    		$("#errormessage").html(data['message']);
    	});
    });
	$("#searchin").keyup(function() {
		findUser();
	});
});

function showHideBar() {
	if ($("#search").is(":visible")) {
		$("#search").fadeOut();
	} else {
		$("#search").fadeIn();
	}
}

function findUser(){
	var query =  $.trim($("#searchin").val());
	$('#result').html("");
	if (query != '') {
		$.get('find/', { query:query }, function(data) {
			for(var index in data) {
				$("#result").append("<div class='row' class='user'>\
				<div class='col-md-3'><a href = http://twitter.com/"+ data[index]['twittername'] + " target='_blank'><img src=" + data[index]['imageurl'] + "/></a></div>\
				<div class='col-md-5'>" + data[index]['name'] + " @" + data[index]['twittername'] + "</div></div>");
			}
    	});
	}
}