
function gid(nm)
{
  return document.getElementById(nm);
}

var OPTS = {
  "Cereals": {
    "Basic 4": "www/images/basic4.jpg",
    "Captain Crunch": "www/images/captain_crunch.jpg",
    "Cinnamon Toast Crunch": "www/images/toast_crunch.jpg",
    "Golden Grahams": "www/images/golden_grahams.jpg",
    "Honey Nut Cheerios": "www/images/honey_nut.jpg",
    "Lucky Charms": "www/images/lucky_charms.jpg",
    "Wheaties": "www/images/wheaties.jpg"
  },
  "MN State Parks": {
    "Afton": "https://images.dnr.state.mn.us/destinations/state_parks/banners/spk00100.jpg",
    "Blue Mounds": "https://images.dnr.state.mn.us/destinations/state_parks/banners/spk00121.jpg",
    "Forestville": "https://images.dnr.state.mn.us/destinations/state_parks/banners/spk00148.jpg",
    "Gooseberry Falls": "https://images.dnr.state.mn.us/destinations/state_parks/banners/spk00172.jpg",
    "Jay Cooke": "https://images.dnr.state.mn.us/destinations/state_parks/banners/spk00187.jpg",
    "Lake Louise": "https://images.dnr.state.mn.us/destinations/state_parks/banners/spk00214.jpg",
    "Nerstrand Big Woods": "https://images.dnr.state.mn.us/destinations/state_parks/banners/spk00241.jpg",
    "Tettegouche": "https://images.dnr.state.mn.us/destinations/state_parks/banners/spk00269.jpg",
    "Whitewater": "https://images.dnr.state.mn.us/destinations/state_parks/banners/spk00280.jpg"
  }
};

function init()
{
  for(var opt in OPTS)
  {
    var newopt = document.createElement("OPTION");
    newopt.value = opt;
    newopt.innerHTML = opt;
    gid("whattorank").appendChild(newopt);
    
    
    var newdiv = document.createElement("DIV");
    newdiv.id = opt + "-div";
    newdiv.className = "width-12 hidden";
    
    
    for(var nm in OPTS[opt])
    {
      var newlabel = document.createElement("LABEL");
      var newcheckbox = document.createElement("INPUT");
      newcheckbox.type = "checkbox";
      newcheckbox.value = nm;
      newcheckbox.checked = true;
      var newspan = document.createElement("SPAN");
      newspan.innerHTML = nm;
      
      newlabel.appendChild(newcheckbox);
      newlabel.appendChild(newspan);
      newdiv.appendChild(newlabel);
    }
    gid("whichtorank").appendChild(newdiv);
  }
  
  gid("whattorank").addEventListener("change", changeOpts);
  changeOpts();
  
  gid("startranking").addEventListener("click", startRank);
  
  gid("button1").addEventListener("click", function(){rankIt(0.9, 1)});
  gid("button2").addEventListener("click", function(){rankIt(0.7, 1)});
  gid("button3").addEventListener("click", function(){rankIt(0.5, 0.5)});
  gid("button4").addEventListener("click", function(){rankIt(0.7, 0)});
  gid("button5").addEventListener("click", function(){rankIt(0.9, 0)});
}

function changeOpts()
{
  for(var opt in OPTS)
  {
    gid(opt + "-div").classList.add("hidden");
  }
  gid(gid("whattorank").value + "-div").classList.remove("hidden");
}

function startRank()
{
  if(whichToRank().length < 2)
  {
    gid("error").classList.remove("hidden");
    return false;
  }
  
  gid("error").classList.add("hidden");
  gid("row1").classList.add("hidden");
  gid("row2").classList.remove("hidden");
  gid("row3").classList.remove("hidden");
  gid("row4").classList.remove("hidden");
  newChoices();
}

function whichToRank()
{
  var choices = gid(gid("whattorank").value + "-div").getElementsByTagName("input");
  var out = [];
  for(var i=0; i < choices.length; i++)
  {
    if(choices[i].checked) out.push(choices[i].value);
  }
  return out;
}

function newChoices()
{
  var choices = whichToRank();
  var i1 = Math.floor(Math.random()*choices.length);
  var choice1 = choices.splice(i1, 1)[0];
  var i2 = Math.floor(Math.random()*choices.length);
  var choice2 = choices.splice(i2, 1)[0];
  
  gid("choice1img").src = OPTS[gid("whattorank").value][choice1];
  gid("choice2img").src = OPTS[gid("whattorank").value][choice2];
  gid("choice1p").innerHTML = choice1;
  gid("choice2p").innerHTML = choice2;
  gid("button1txt").innerHTML = choice1;
  gid("button2txt").innerHTML = choice1;
  gid("button4txt").innerHTML = choice2;
  gid("button5txt").innerHTML = choice2;
}

function makeRanks()
{
  var uniq = {};
  var trs = gid("results").getElementsByTagName("TR");
  for(var i = 0; i < trs.length; i++)
  {
    var tds = trs[i].getElementsByTagName("TD");
    uniq[tds[0].innerHTML] = 1 + (uniq[tds[0].innerHTML] || 0);
    uniq[tds[1].innerHTML] = 1 + (uniq[tds[1].innerHTML] || 0);
  }
  var nms = [];
  var n_i = [];
  var b = [];
  var matrix = [];
  for(var nm1 in uniq)
  {
    nms.push(nm1);
    n_i.push(0);
    b.push(0);
    var tmp = [];
    for(var nm2 in uniq)
    {
      tmp.push(0);
    }
    matrix.push(tmp);
  }
  for(var j=0; j < trs.length; j++)
  {
    var tds2 = trs[j].getElementsByTagName("TD");
    var m = nms.indexOf(tds2[0].innerHTML);
    var n = nms.indexOf(tds2[1].innerHTML);
    var mWon = Number(tds2[2].innerHTML);
    var k = Number(tds2[3].innerHTML);

    n_i[m] += 1;
    n_i[n] += 1;
    
    matrix[n][m] += k*(1 - mWon) + (1 - k)*mWon; // if n won, go to n with prob=k; else if m won, go with prob=(1-k)
    matrix[m][n] += k*mWon + (1 - k)*(1 - mWon);
    
    matrix[m][m] += k*mWon + (1 - k)*(1 - mWon);
    matrix[n][n] += k*(1 - mWon) + (1 - k)*mWon;
  }
  for(var l = 0; l < matrix.length; l++)
  {
    matrix[l] = math.dotDivide(matrix[l], n_i);
    matrix[l][l] -= 1;
  }
  for(var p = 0; p < matrix.length; p++)
  {
    matrix[matrix.length - 1][p] = 1;
  }
  b[b.length - 1] = 1;
  
  var ranks = math.lusolve(matrix, b);
  for(var q = 0; q < ranks.length; q++)
  {
    ranks[q][1] = nms[q];
  }
  ranks.sort(function(a, b){return b[0] - a[0];});
  return ranks;
}

function rankIt(howmuch, won)
{
  var choice1 = gid("choice1p").innerHTML;
  var choice2 = gid("choice2p").innerHTML;
  var tr = document.createElement("TR");
  var td1 = document.createElement("TD");
  td1.innerHTML = choice1;
  var td2 = document.createElement("TD");
  td2.innerHTML = choice2;
  var td3 = document.createElement("TD");
  td3.innerHTML = won;
  var td4 = document.createElement("TD");
  td4.innerHTML = howmuch;
  
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);
  gid("results").appendChild(tr);
  
  var ranks = makeRanks();
  gid("rankings").innerHTML = '';
  for(var i=0; i < ranks.length; i++)
  {
    var trr = document.createElement("TR");
    var tdd1 = document.createElement("TD");
    tdd1.innerHTML = ranks[i][1];
    var tdd2 = document.createElement("TD");
    tdd2.innerHTML = i + 1;
    var tdd3 = document.createElement("TD");
    tdd3.innerHTML = ranks[i][0].toFixed(4);
    
    trr.appendChild(tdd1);
    trr.appendChild(tdd2);
    trr.appendChild(tdd3);
    gid("rankings").appendChild(trr);
  }

  
  newChoices();
}


if(document.readyState === "complete")
{
  console.log("Document was ready");
  init();
} else
{
  document.addEventListener("DOMContentLoaded", init);
}