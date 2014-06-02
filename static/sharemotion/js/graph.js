var EMOS = [];
var MARKS = [];
var ISMUTE = false;

$(document).ready(function() {
	$('#mute').click(muteSound);
	twitter.init();
	var r = Raphael("holder", 1000, 550),
		R = 200,
		init = true,
		param = {stroke: "#fff", "stroke-width": 30},
		hash = document.location.hash,
		marksAttr = {fill: hash || "lightgrey", stroke: "none"},
		show = true,
		key = ["happy", "sad", "angry", "love", "fear"],
		html = [
			document.getElementById(key[0]),
			document.getElementById(key[1]),
			document.getElementById(key[2]),
			document.getElementById(key[3]),
			document.getElementById(key[4])
		],
		txt = [
			r.text(550, 150, key[0]).attr({fill: Raphael.hsb( 1, 1, .75), stroke: "none", opacity: 1, "font-size": 80, "text-anchor": "start"}),
			r.text(550, 200, key[1]).attr({fill: Raphael.hsb(.8, 1, .75), stroke: "none", opacity: 1, "font-size": 80, "text-anchor": "start"}),
			r.text(550, 250, key[2]).attr({fill: Raphael.hsb(.6, 1, .75), stroke: "none", opacity: 1, "font-size": 80, "text-anchor": "start"}),
			r.text(550, 300, key[3]).attr({fill: Raphael.hsb(.4, 1, .75), stroke: "none", opacity: 1, "font-size": 80, "text-anchor": "start"}),
			r.text(550, 350, key[4]).attr({fill: Raphael.hsb(.2, 1, .75), stroke: "none", opacity: 1, "font-size": 80, "text-anchor": "start"})
		];

	r.customAttributes.arc = function (value, total, R) {
		var alpha = 360 * value / total,
			a = (90 - alpha) * Math.PI / 180,
			x = 300 + R * Math.cos(a),
			y = 300 - R * Math.sin(a),
			color = "hsb(".concat(Math.round(R) / 200, ",", value / total, ", .75)"),
			path;
		if (total == value) {
			path = [["M", 300, 300 - R], ["A", R, R, 0, 1, 1, 299.99, 300 - R]];
		} else {
			path = [["M", 300, 300 - R], ["A", R, R, 0, +(alpha > 180), 1, x, y]];
		}
		return {path: path, stroke: color};
	};

	MARKS.push.apply(MARKS, drawMarks(R, 60));
	var joy = r.path().attr(param).attr({arc: [0, 60, R]});

	R -= 40;
	MARKS.push.apply(MARKS, drawMarks(R, 60));
	var sor = r.path().attr(param).attr({arc: [0, 60, R]});
	
	R -= 40;
	MARKS.push.apply(MARKS, drawMarks(R, 60));
	var ang = r.path().attr(param).attr({arc: [0, 60, R]});
	
	R -= 40;
	MARKS.push.apply(MARKS, drawMarks(R, 60));
	var lov = r.path().attr(param).attr({arc: [0, 60, R]});
	
	R -= 40;
	MARKS.push.apply(MARKS, drawMarks(R, 60));
	var fea = r.path().attr(param).attr({arc: [0, 60, R]});

	EMOS.push(joy);
	EMOS.push(sor);
	EMOS.push(ang);
	EMOS.push(lov);
	EMOS.push(fea);

	mouseevent(joy, 0, txt, key);
	mouseevent(sor, 1, txt, key);
	mouseevent(ang, 2, txt, key);
	mouseevent(lov, 3, txt, key);
	mouseevent(fea, 4, txt, key);

	function updateVal(value, total, R, id) {
		var color = "hsb(".concat(Math.round(R) / 200, ",", value / total, ", .75)");
		if (init) {
			EMOS[id].animate({arc: [value, total, R]}, 900, ">");
		} else {
			if (!value || value == total) {
				value = total;
				EMOS[id].animate({arc: [value, total, R]}, 750, "bounce", function () {
					EMOS[id].attr({arc: [0, total, R]});
				});
			} else {
				EMOS[id].animate({arc: [value, total, R]}, 750, "elastic");
			}
		}
		var oldvalue = html[id].innerHTML;
		html[id].innerHTML = value;
		if (value != oldvalue && !ISMUTE) {
			$('#aud'+id)[0].play();
		}
		html[id].style.color = Raphael.getRGB(color).hex;
	}

	function drawMarks(R, total) {
		var color = "hsb(".concat(Math.round(R) / 200, ", 1, .75)"),
			out = r.set();
		for (var value = 0; value < total; value++) {
			var alpha = 360 / total * value,
				a = (90 - alpha) * Math.PI / 180,
				x = 300 + R * Math.cos(a),
				y = 300 - R * Math.sin(a);
			out.push(r.circle(x, y, 2).attr(marksAttr));
		}
		return out;
	}

	(function () {
		var total = twitter.getJoy() + twitter.getSorrow() + 
		twitter.getLove() + twitter.getAnger() + twitter.getFear();

		updateVal(twitter.getJoy(), total, 200, 0);
		updateVal(twitter.getSorrow(), total, 160, 1);
		updateVal(twitter.getAnger(), total, 120, 2);
		updateVal(twitter.getLove(), total, 80,  3);
		updateVal(twitter.getFear(), total, 40,  4);

		setTimeout(arguments.callee, 20000);
		init = false;
	})();
});

function mouseevent(e, index, txt, key) {
	e.click(function () {
		if (this.clicked) {
			this.clicked = false;
			$('#emotion').hide();
			return;
		}
		for (var i = 0; i < EMOS.length; i++) {
			EMOS[i].clicked = false;
		}
		this.clicked = true;
		$('.tweets').hide();
		$('#feeling').html(key[index]);
		$('#'+key[index]+'tweets').mCustomScrollbar({
			theme:"rounded-dots"
		});
		$('#'+key[index]+'tweets').show();
		$('#emotion').show();
	});
	
	e.mouseover(function () {
		this.animate({"stroke-width": 35}, 100);
		for (var i = 0; i < txt.length; i++) {
			txt[i].stop().animate({opacity: 0}, 100);
		}
		txt[index].stop().animate({opacity: 1}, 100, "elastic");
	});

	e.mouseout(function () {
		for (var i = 0; i < EMOS.length; i++) {
			if (EMOS[i].clicked) {
				txt[i].stop().animate({opacity: 1}, 100);
			} else {
				txt[i].stop().animate({opacity: 0}, 100);
			}
			EMOS[i].animate({"stroke-width": 30}, 100);
		} 
	});
}

function muteSound() {
	if (ISMUTE) {
		ISMUTE = false;	
	} else {
		ISMUTE = true;
	}
}