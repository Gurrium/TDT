function loadTextFile(){
	httpObj = createXMLHttpRequest(displayData);
	if (httpObj){
		httpObj.open("GET","TDT.csv",true);
		httpObj.send(null);
	}
}

//WebKit（KHTML）におけるXMLHttpRequestのresponceText文字化け防止処理
var ajax_filter = function(t){return t};
if(navigator.appVersion.indexOf( "KHTML" ) > -1){
    ajax_filter = function(t){
        var esc = escape(t);
        return(esc.indexOf("%u") < 0 && esc.indexOf("%") > -1) ? decodeURIComponent(esc) : t
    }
}
 
function displayData(){
    if ((httpObj.readyState == 4) && (httpObj.status == 200)){
        main(ajax_filter(httpObj.responseText));
    }
}

function main(csv){
	setInterval(function(){disp(setup(csv));}, 1000, csv);
}

function setup(csv){//次回の発車時刻を特定しdepartureに代入
	var arrayed_csv = csv.split('\n');

	var time = new Date();
	var hour = time.getHours();
	var	minute = time.getMinutes();
	var second = time.getSeconds();

	var l = 0;
	var min_hour, min_minute, min_second;
	min_hour = 23;
	min_minute = min_second = 59;

	for(var j = 0;j < arrayed_csv.length;j++){
		var dif = Number(arrayed_csv[j].substring(0,2)) - hour;

		if(dif < 0){//発車時刻が過ぎていたら回避
			continue;
		}else{
			if(arrayed_csv[j].substring(3,5) <= minute && dif == 0){
				continue;
			}
			l = j;
			break;
		} 
	}
	
	var departure = arrayed_csv[l].split(',');
	for(var i = 0;i < departure.length;i++){
		departure[i] = Number(departure[i]);
	}

	console.log(departure);
	return departure;
}

function disp(departure){
	var time = new Date();
	var hour = time.getHours();
	var minute = time.getMinutes();
	var second = time.getSeconds();

	var hour_dif = Number(departure[0]) - hour;
	var minute_dif = Number(departure[1]) - minute - 1;
	var second_dif = 59 + Number(departure[2]) - second;
	
	if (second_dif < 0) {
		minute_dif--;
		second_dif += 60;
	}
	if (minute_dif < 0) {
		hour_dif--;
		minute_dif += 60;
	}

	var time_dif = zero_padding(hour_dif) + ":" + zero_padding(minute_dif) + ":" + zero_padding(second_dif);
	document.getElementById("TDT").innerHTML = time_dif;
}

function zero_padding(num){
	return ('0' + num).slice(-2);
}