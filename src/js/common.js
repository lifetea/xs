(function(){
	function addCookie(name,value,expiresHours){ 
		var cookieString=name+"="+escape(value); 
		//判断是否设置过期时间 
		if(expiresHours>0){ 
			var date=new Date(); 
			date.setTime(date.getTime+expiresHours*3600*1000); 
			cookieString=cookieString+"; expires="+date.toGMTString(); 
		} 
		document.cookie=cookieString; 
	}
	function getCookie(name){ 
		var strCookie=document.cookie; 
		var arrCookie=strCookie.split("; "); 
		for(var i=0;i<arrCookie.length;i++){ 
		var arr=arrCookie[i].split("="); 
		if(arr[0]==name)return arr[1]; 
		} 
		return ""; 
	} 
	
	var current = document.getElementById("current");
	if(!!current){
		var href = current.getAttribute("href");
		var title= current.getAttribute("title");
		addCookie("title",title,10000);
		addCookie("href",href,10000);
	}
	var readding = document.getElementById("readding");
	if(!!readding){
		var t =  unescape(getCookie("title"));
		var h = getCookie("href");
		var a = document.createElement('a'); 
	    var text = document.createTextNode(t); 
	    var j = document.createTextNode("继续阅读:");
	    var s = document.createElement('span'); 
	    s.className = "btn-text";
	    s.appendChild(j);
	    a.appendChild(s);
	    a.appendChild(text);
	    a.href = h;
	    readding.appendChild(a);
	}

})();