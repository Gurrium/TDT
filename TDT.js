var flag = 0,m = 0,csv_text = '';

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
        csv_text = ajax_filter(httpObj.responseText);
        main(csv_text);
    }
}

function delay(){
	var departure = setup(csv_text);
	disp(departure);
}

function main(csv){
	setInterval(function(){
		var next_train_time = setup(csv);
		console.log(next_train_time);
		var departure = next_train_time.split(',');
		console.log(departure);
		for(var i = 0;i < 3;i++){
			departure[i] = Number(departure[i]);
		}
		disp(departure);

	    //再読み込み	
	    // if (flag === 1){
	    	// m++;
			// var departure = setup(csv_text);
	    	// flag = 0;
	  //   }
	}, 1000, csv);

}

function setup(csv){//次回の発車時刻を特定しdepartureに代入
	var arrayed_csv = csv.split('\n');

	var time = new Date();
	var hour = time.getHours();
	var	minute = time.getMinutes();
	var second = time.getSeconds();

	var l = 0;
	var min_hour,min_minute,min_second;
	min_hour = 23;min_minute = min_second = 59;

	for(var j = 0;j < arrayed_csv.length;j++){
		var dif = Number(arrayed_csv[j].substring(0,2)) - hour;

		if(dif < 0){//発車時刻が過ぎていたら回避
			continue;
		}else {
			if(arrayed_csv[j].substring(3,5) <= minute && dif == 0){
				continue;
			}
			l = j;
			break;
		} 
	}
	
	console.log(String(arrayed_csv[l]))
	return String(arrayed_csv[l]);
}

function disp(departure){
	var time = new Date();
	var hour = time.getHours();
	var minute = time.getMinutes();
	var second = time.getSeconds();

	var second_dif = 59 + (Number(departure[2]) - second);
	var minute_dif = Number(departure[1]) - minute - 1;
	var hour_dif = Number(departure[0]) - hour;
	if (second_dif < 0) {
		minute_dif--;
		second_dif += 60;
	}
	if (minute_dif < 0) {
		hour_dif--;
		minute_dif += 60;
	}

	var	text = document.getElementById("TDT"),
		time_dif = hour_dif + ":" + minute_dif + ":" + second_dif;
	
		text.innerHTML = time_dif;
		console.log(departure);
}