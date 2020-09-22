var city2;

function getLocation() {
    today = new Date();
    dy = today.getDate();
    mt = today.getMonth()+1;
    yr = today.getFullYear();

    if(mt>=12){
        mt=1;
    }
    if(mt>=1 && mt <= 9){
        mt="0"+mt;
    }
    if(dy>=1 && dy <= 9){
        dy="0"+dy;
    }
    
    var dateControl = document.querySelector('input[id="date"]');
    dateControl.value = yr+"-"+mt+"-"+dy;
    dateControl.setAttribute("min",yr+"-"+mt+"-"+dy);
    let d=new Date(yr,mt,dy);
    var Max=new Date();
    Max.setDate(d.getDate()+9);
    var NewDy = Max.getDate();
    var NewMt = Max.getMonth()+1;
    var NewYr = Max.getFullYear();
    if(NewMt>=1 && NewMt <= 9){
        NewMt="0"+NewMt;
    }
    if(NewDy>=1 && NewDy <= 9){
        NewDy="0"+NewDy;
    }
    dateControl.setAttribute("max",NewYr+"-"+NewMt+"-"+NewDy);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    document.getElementById("info1").innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
    var Lat=position.coords.latitude;
    var Lon=position.coords.longitude;
    CityFind(Lat,Lon);
}


function CityFind(lat,lon){
$.ajax({
    type:"get",
    dataType:"json",
    url: "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude="+lat+"&longitude="+lon+"&localityLanguage=pt",
    success: function(data){
        Previsor(data.city);
    },
    error: function(){
      document.getElementById("info1").innerHTML ="Cidade Não encontrada";
    }
});
}

function removeAcento (text)
{       
    text = text.toLowerCase();                                                         
    text = text.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
    text = text.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
    text = text.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
    text = text.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
    text = text.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
    text = text.replace(new RegExp('[Ç]','gi'), 'c');
    return text;                 
}

function CityChange(){
    var NewCity=document.querySelector('input[id=NewCity]');
    city=NewCity.value;
    Previsor(city);
}

function Previsor(city){
city2 = removeAcento(city);
$.ajax({
    type:"get",
    dataType:"json",    
    url: "https://api.hgbrasil.com/weather?format=json-cors&key=cb871511&city_name="+city2,
    success: function(dados){
        if(city2!="sao paulo" && dados.results.city=="São Paulo, SP"){
            document.getElementById("info1").innerHTML = "Não possível encontrar essa cidade" 
        }
        else{
        document.getElementById("info1").innerHTML ="Cidade:"+dados.results.city+"<br>Temperatura: "+dados.results.temp+" C°<br>Descrição Climatica: "+dados.results.description;
        }

        var li = document.getElementById("buttonDate");
        li.addEventListener("click", function(event) {
            var NewdateControl = document.querySelector('input[id="date"]');
            var NewdateValue=NewdateControl.value;
            var a=NewdateValue.split('-').reverse().join('/');
            var NewDate=a.replace("/"+yr,"");
            for(var i=0;i<=10;i++){
                if(NewDate==dados['results']['forecast'][i]['date']){
                    console.log(JSON.stringify(dados));
                    document.getElementById("info2").innerHTML ="Data: "+dados['results']['forecast'][i]['date']+"<br>Cidade:"+dados.results.city+"<br>Max: "+dados['results']['forecast'][i]['max']+" C°<br>Min: "+dados['results']['forecast'][i]['min']+" C°<br>Descrição Climatica: "+dados['results']['forecast'][i]['description'];
                    if(i==0){
                        if(dados.results.temp<=dados['results']['forecast'][i]['max'] && dados.results.temp>=dados['results']['forecast'][i]['min']){
                            document.getElementById("info2").innerHTML+="<br><br>A previsão de Temperatura estava:correta<br><br>";
                        }else{
                            document.getElementById("info2").innerHTML+="<br><br>A previsão de Temperatura estava:incorreta<br><br>";
                        }
                    }
                }
            }
        })
    },
    error: function(){
      document.getElementById("info1").innerHTML ="Error";
      document.getElementById("info2").innerHTML ="Error";
    }
});
}
