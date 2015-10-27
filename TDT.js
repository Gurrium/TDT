flag = 0;

function createXMLHttpRequest(cbFunc){
    var XMLhttpObject = null;
    try{
        XMLhttpObject = new XMLHttpRequest();
    }catch(e){
        try{
            XMLhttpObject = new ActiveXObject("Msxml2.XMLHTTP");
        }catch(e){
            try{
                XMLhttpObject = new ActiveXObject("Microsoft.XMLHTTP");
            }catch(e){
                return null;
            }
        }
    }
    if (XMLhttpObject) XMLhttpObject.onreadystatechange = cbFunc;
    return XMLhttpObject;
}

function loadTextFile(){
	httpObj = createXMLHttpRequest(TDT);
	if (httpObj){
		httpObj.open("GET","TDT.csv",true);
		httpObj.send(null);
	}
	if ((httpObj.readyState == 4) && (httpObj.status == 200)){
		setup(httpObj.responseText);
	}
}

function setup(csv){//次回の発車時刻を特定しdepartureに代入
		var arrayed_csv = csv.split('\n');

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

		var departure = arrayed_csv[n].split(',');

		TDT(departure);
}

function TDT(departure){
	while(1){
		setTimeout("disp(departure)",1000);

		if(flag === 1)
			break;
	}
	loadTextFile();
}

function disp(departure){
	var time = new Date();
	var hour = time.getHours();
	var minute = time.getMinutes();
	var second = time.getSeconds();

	var hour_dif = String(departure[0] - hour),
		minute_dif = String(departure[1] - minute),
		second_dif = String(departure[2] - second);
	// var // lastchild = document.body.lastChild,
	// 	p = document.createElement('p');
	// 	time_dif = document.createTextNode("hour_dif" + ":" + "minute_dif" + ":" + "second_dif");

	// document.body.appendChild(p).appendChild(time_dif);
	// //document.body.replaceChild(time_dif,lastchild);
	console.log("hour_dif" + ":" + "minute_dif" + ":" + "second_dif");
	if((departure[0] == hour) && (departure[1] == minute) && (departure[2] == second))
		flag = 1;
}