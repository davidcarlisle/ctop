var mm = document.getElementsByTagName('math');
function ctop (){
    for (var i = 0; i< mm.length;i++){
	ctopAT (mm[i],0); 
    }
}

function ctopAT(n,p) {
    if (n.nodeType==1) {
	if(ctopT[n.localName]) {
	    ctopT[n.localName](n,p);
	} else {
	    for(var j=0;j<n.childNodes.length; j++ ) {
		ctopAT(n.childNodes[j],p);
	    }
	}
    }
}
var mmlns = "http://www.w3.org/1998/Math/MathML";
var ctopT= [];

ctopT["ci"] = function(n,p) {
    ctopToken(n,'mi');
}

// need to handle sep
ctopT["cn"] = function(n,p) {
    ctopToken(n,'mn');
}


function ctopToken(n,s) {
    var np=n.parentNode;
    if(n.childNodes.length==1 && n.childNodes[0].nodeType==3) {
	var m=document.createElementNS(mmlns,s);
	m.textContent=n.textContent;
	np.replaceChild(m,n);
    } else {
	var mrow=document.createElementNS(mmlns,'mrow');
	np.replaceChild(mrow,n);
	for(var j=0;j<n.childNodes.length; j++ ) {
	    if (n.childNodes[j].nodeType==3) {
		var m=document.createElementNS(mmlns,s);
		m.textContent=n.childNodes[j].textContent;
		mrow.appendChild(m);
	    }else{
  		mrow.appendChild(n.childNodes[j])
		ctopAT(mrow.childNodes[j]);
	    }
	}
    }
}

ctopT["apply"] = function(n,p) {
    var f=null;
    var a=[];
    for(var j=0;j<n.childNodes.length; j++ ) {
	if(n.childNodes[j].nodeType==1) {
	    if(f==null){
		f=n.childNodes[j];		
	    } else {
		a[a.length]=n.childNodes[j];
	    }
	}
    }
    if(f) {
	var nm = f.localName;
	nm=(nm=="csymbol") ? f.textContent : nm;
	if(ctopTapply[nm]) {
	    ctopTapply[nm](n,f,a,p);
	} else {
	    var mrow=document.createElementNS(mmlns,'mrow');
	    n.parentNode.replaceChild(mrow,n);
	    var mi=document.createElementNS(mmlns,'mi');
	    mi.textContent=nm;
	    mrow.appendChild(mi);
	    mrow.appendChild(ctopfa.cloneNode(true));
	    var mf = document.createElementNS(mmlns,'mfenced');
	    for(var j=0;j<a.length; j++ ) {
		var z= a[j].cloneNode(true);
  		mf.appendChild(z)
		ctopAT(z,0);
	    }
	    mrow.appendChild(mf);
	    
	}
    } else {
	var mrow=document.createElementNS(mmlns,'mrow');
	n.parentNode.replaceChild(mrow,n);
    }
}

ctopT["reln"] = ctopT["apply"];

var ctopTapply = [];



var ctopfa=document.createElementNS(mmlns,'mo');
ctopfa.textContent='\u2061';



function ctopB(n,tp,p,m,a) {
    var mf = document.createElementNS(mmlns,'mrow');
    if(tp>p || (tp==p && m=="-")) {
        var mo=ctopfa.cloneNode(true);
	mo.textContent="(";
	mf.appendChild(mo);
    }
    
    
    var z= a[0].cloneNode(true);
    mf.appendChild(z)
    ctopAT(z,p);
    
    var mo=ctopfa.cloneNode(true);
    mo.textContent=m;
    mf.appendChild(mo);
    var z= a[1].cloneNode(true);
    mf.appendChild(z)
    ctopAT(z,p);

    if(tp>p || (tp==p && m=="-")) {
	var mo=ctopfa.cloneNode(true);
	mo.textContent=")";
	mf.appendChild(mo);
    }
    n.parentNode.replaceChild(mf,n);
}


ctopTapply["plus"] = function(n,f,a,p)  {
    var mf = document.createElementNS(mmlns,'mrow');
    if(p>2) {
        var mo=ctopfa.cloneNode(true);
	mo.textContent="(";
	mf.appendChild(mo);
    }
    for(var j=0;j<a.length; j++ ) {
	var z= a[j].cloneNode(true);
	if(j>0) {
            var mo=ctopfa.cloneNode(true);
	    mo.textContent="+";
	    mf.appendChild(mo);
	}
  	mf.appendChild(z)
	ctopAT(z,p);
    }
    if(p>2) {
        var mo=ctopfa.cloneNode(true);
	mo.textContent=")";
	mf.appendChild(mo);
    }
    n.parentNode.replaceChild(mf,n);
}




ctopTapply["divide"] = function(n,f,a,p)  {ctopB(n,3,p,"/",a)}
ctopTapply["minus"] = function(n,f,a,p)  {ctopB(n,2,p,"-",a)}
ctopTapply["rem"] = function(n,f,a,p)  {ctopB(n,3,p,"mod",a)}
ctopTapply["implies"] = function(n,f,a,p)  {ctopB(n,3,p,"\u21D2",a)}
ctopTapply["factorof"] = function(n,f,a,p)  {ctopB(n,3,p,"\u21D2",a)}
ctopTapply["in"] = function(n,f,a,p)  {ctopB(n,3,p,"\u22D8",a)}
ctopTapply["notin"] = function(n,f,a,p)  {ctopB(n,3,p,"\u2209",a)}
ctopTapply["notsubset"] = function(n,f,a,p)  {ctopB(n,2,p,"\u2288",a)}
ctopTapply["notprsubset"] = function(n,f,a,p)  {ctopB(n,2,p,"\u2284",a)}
ctopTapply["setdiff"] = function(n,f,a,p)  {ctopB(n,2,p,"\u2216",a)}
ctopTapply["tendsto"] = function(n,f,a,p)  {
    var t;
    if(f.localName=='tendsto') {
	t=f.getAttribute('type');
    } else {
	t=a[0].textContent;
	a[0]=a[1];
	a[1]=a[2];
    }
    var m = (t=='above')? '\u2198' :
        (t=='below')? '\u2198' : '\u2192' ;
    ctopB(n,2,p,m,a)}


