$.tzGET = function(action, data, callback){
	$.get('/static/sharemotion/php/twitterstream.php?action='+action,data,callback,'json');
}

var twitter = {

	date : '',
	lovtotal : 0,
	angtotal : 0,
	sortotal : 0,
	featotal : 0,
	joytotal : 0,

	init : function() {
		twitter.updateDate();
		twitter.getCount('love', '', 0, twitter.date);
		twitter.getCount('hate+OR+angry', '', 0, twitter.date);
		twitter.getCount('sad+OR+depressed', '', 0, twitter.date);
		twitter.getCount('happy+OR+joy', '', 0, twitter.date);
		twitter.getCount('scared+OR+afraid', '', 0, twitter.date);
	},
	
	getCount : function(hashtag, since_id, total, date) {
		var rid = since_id;
		var rtotal = total;
		$.tzGET('getCount', { hashtag:hashtag, since_id:since_id, date:date }, function(r) {
			if (r && r.length > 0) {
				rid = r[0]['id_str'];
				rtotal += r.length;
				var result = '';
				for (var i = 0; i < r.length; i++) {
					result +='<div class="row">';
					result += '<img src="'+ r[i]['user']['profile_image_url']+'">';
					result += '<section>' + r[i]['user']['screen_name'] + ': ' + r[i]['text'] +'</section></div><br>';
				}
				if (hashtag == 'love') {
					$('#lovetweets').html(result + $('#lovetweets').html());
					twitter.lovtotal = rtotal;
				} else if (hashtag == 'hate+OR+angry') {
					$('#angrytweets').html(result + $('#angrytweets').html());
					twitter.angtotal = rtotal;
				} else if (hashtag == 'sad+OR+depressed') {
					$('#sadtweets').html(result + $('#sadtweets').html());
					twitter.sortotal = rtotal;
				} else if (hashtag == 'happy+OR+joy') {
					$('#happytweets').html(result + $('#happytweets').html());
					twitter.joytotal = rtotal;
				} else if (hashtag == 'scared+OR+afraid') {
					$('#feartweets').html(result + $('#feartweets').html());
					twitter.featotal = rtotal;
				}			
			}
			if (date == twitter.date) {
				var rantime = Math.floor(Math.random() * (10000)) + 30000;
				setTimeout(function() {twitter.getCount(hashtag, rid, rtotal, date)}, rantime);
			}
		});
	},

	updateDate : function() {
		d = new Date().getFullYear() + '-' + (parseInt(new Date().getMonth(), 10) + 1) + '-' + new Date().getDate();
		if (d != twitter.date) {
			twitter.date = d;
			twitter.init();
			return false;
		}
		setTimeout(function() {twitter.updateDate()}, 30000);
	},

	getLove : function() {
		return twitter.lovtotal;
	},

	getAnger : function() {
		return twitter.angtotal;
	},

	getSorrow : function() {
		return twitter.sortotal;
	},

	getFear : function() {
		return twitter.featotal;
	},

	getJoy : function() {
		return twitter.joytotal;
	}
};
