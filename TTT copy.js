function loadTextFile(){
	httpObj = createXMLHttpRequest(TTT);
	if (httpObj){
		httpObj.open("GET","TTT.csv",true);
		httpObj.send(null);
	}
}

function TTT(){
	if ((httpObj.readyState == 4) && (httpObj.status == 200)){
		//時刻を配列へ挿入
		insert(httpObj.responseText);
	}
}

var i = 0; //setup
function insert(csv){
	while(1){
		//setup ->
		if(i === 0){
			var n,TTT = [0,0,0][0,0];

			//改行コード
			csv = csv.replace(/\r\n/g,"\n");
			csv = csv.replace(/\r/g,"\n");

			for(var i = 0;i < csv.length;i += 10){
				var time = new Date();
				var hour = time.getHours();
				var min = 23,dif = csv.substring(i,i + 2) - hour;

				if(dif < 0)
					dif *= -1;
				if(min > dif)
					min = dif;
					n = i;
			}
		}
		// <-

		//改行位置
		var eor = csv.indexOf("\n",n); //8,18
			
		eod = n; //eod = 0,10

		for(var j = 0;j < 3;j++){
			//「,」の位置
			eod = csv.indexOf(",",eod); //eod = 12

			if(j === 2){
				TTT[j] = csv.substring(n + 3*j,eor);
				break;
			}

			TTT[j] = csv.substring(n + 3*j,eod);

		}
		//次の検索開始位置
		n += 10; //n = 10,
		
		if (n > csv.length) n = 0;

		do{
			var time = new Date();
			var hour = time.getHours();
			var	minute = time.getMinutes();
			var	second = time.getSeconds();
			setTimeout("disp(TTT,hour,minute,second)",1000);
		}while((TTT[0] - hour > 0) && (TTT[1] - hour > 0) && (TTT[2] - hour > 0))
	}
}

function disp(TTT,hour,minute,second){

	if((TTT[0] - hour > 0) && (TTT[1] - hour > 0) && (TTT[2] - hour > 0)){
		var hour_dif = String(TTT[0] - hour),
			minute_dif = String(TTT[1] - minute),
			second_dif = String(TTT[2] - second);
		var lastchild = document.body.lastChild,
			time_dif = document.createTextNode(hour_dif + ":" + minute_dif + ":" + second_dif);

		document.body.replaceChild(time_dif,lastchild);
	}

}