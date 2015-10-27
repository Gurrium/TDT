flag = 0;

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
    if ((httpObj.readyState == 2) && (httpObj.status == 200)){
        var text = ajax_filter(httpObj.responseText);
        setup(text);
    }
}

function setup(csv){//次回の発車時刻を特定しdepartureに代入
		var arrayed_csv = csv.split('\n');
			arrayed_csv = String(arrayed_csv);

		var time = new Date();
		var l,m,n;
		l = m = n = 0;

		for(var j = 0;j < csv.length;j++){
			var hour = time.getHours();
			var min = 23,dif = arrayed_csv[j].substring(0,2) - hour;

			if(dif < 0)//発車時刻が過ぎていたら回避
				continue;
			if(min > dif){
				min = dif;
				l = j;
			}
		}
		for(var j = l;j < csv.length;j++){
			var minute = time.getMinutes();
			var min = 59,dif = arrayed_csv[j].substring(3,5) - minute;

			if(dif < 0)//発車時刻が過ぎていたら回避
				continue;
			if(min > dif){
				min = dif;
				m = j;
			}
		}
		for(var j = m;j < csv.length;j++){
			var second = time.getSeconds();
			var min = 59,dif = arrayed_csv[j].substring(6,8) - second;

			if(dif < 0)//発車時刻が過ぎていたら回避
				continue;
			if(min > dif){
				min = dif;
				n = j;
			}
		}
			arrayed_csv = String(arrayed_csv[n]);
		var departure = arrayed_csv[n].split(',');

		while(1){
			disp(departure);

			if(flag === 1)
				break;
		}

		displayData();
}

function disp(departure){
	var time = new Date();
	var hour = time.getHours();
	var minute = time.getMinutes();
	var second = time.getSeconds();

	var hour_dif = departure[0] - hour,
		minute_dif = departure[1] - minute,
		second_dif = departure[2] - second,
		text = document.getElementById("TDT"),
		time_dif = hour_dif + ":" + minute_dif + ":" + second_dif;
	
		text.innerHTML = "<div>" + time_dif + "</div>";
		// document.getElementById("TDT").innerHTML = time_dif;

	if((departure[0] == hour) && (departure[1] == minute) && (departure[2] == second))
		flag = 1;
}