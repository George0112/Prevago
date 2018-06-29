var Info = JSON.parse(hotelInfo);
var roomId = 1;
var roomTitle = "";
function drawResult(agodaPriceX, agodaPriceY, bookingPriceX, bookingPriceY, pricelinePriceX, pricelinePriceY, agodaRoomX, agodaRoomY, bookingRoomX, bookingRoomY, pricelineRoomX, pricelineRoomY) {
    var d3 = Plotly.d3;

    var WIDTH_IN_PERCENT_OF_PARENT = 90,
        HEIGHT_IN_PERCENT_OF_PARENT = 80;

    var gd3 = d3.select('#Plot')
        .style({
            width: WIDTH_IN_PERCENT_OF_PARENT + '%',
            'margin-left': (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',

            height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh'
            //'margin-top': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
        });
    var gd = gd3.node();
    var trace1 = {
      x: agodaPriceX,
      y: agodaPriceY,
      mode: 'lines+markers',
      name: 'Agoda Price',
      marker: {
        size: 15,
		color: 'rgb(31,119,180)'
      },
      line: {
        width: 5,
		color: 'rgb(31,119,180)'
      },
	  type: 'scatter'
    };

    var trace2 = {
      x: bookingPriceX,
      y: bookingPriceY,
      mode: 'lines+markers',
      name: 'Booking Price',
      marker: {
        size: 12,
		color: 'rgb(255,127,14)'
      },
      line: {
        width: 3,
		color: 'rgb(255,127,14)'
      },
	  type: 'scatter'
    };

    var trace3 = {
      x: pricelinePriceX,
      y: pricelinePriceY,
      mode: 'lines+markers',
      name: 'Priceline Price',
      marker: {
        size: 5,
		color: 'rgb(44,160,44)'
      },
      line: {
        width: 1,
		color: 'rgb(44,160,44)'
      },
	  type: 'scatter'
    };
	var trace4 = {
      x: agodaRoomX,
      y: agodaRoomY,
      name: 'Agoda Room',
	  type: 'bar',
	  yaxis: 'y2',
	  marker: {
		color: 'rgb(31,119,180)',
		opacity: 0.5
	  }
    };

    var trace5 = {
      x: bookingRoomX,
      y: bookingRoomY,
      name: 'Booking Room',
      type: 'bar',
	  yaxis: 'y2',
	  marker: {
		color: 'rgb(255,127,14)',
		opacity: 0.5
	  }
    };

    var trace6 = {
      x: pricelineRoomX,
      y: pricelineRoomY,
      name: 'Priceline Room',
      type: 'bar',
	  yaxis: 'y2',
	  marker: {
		color: 'rgb(44,160,44)',
		opacity: 0.5
	  }
    };

    var data = [ trace1, trace2, trace3, trace4, trace5, trace6 ];
	
	var roomList = agodaRoomY.concat(bookingRoomY, pricelineRoomY);
	//console.log(roomList);
	var limit = Math.max(...roomList)*3;
	//console.log(limit);
	
    var layout = {
      title: roomTitle,
      xaxis: {
        title: 'Date'
      },
      yaxis: {
        title: 'Price'
      },
	  yaxis2: {
		title: 'Room',
		titlefont: {color: 'rgb(148, 103, 189)'},
		tickfont: {color: 'rgb(148, 103, 189)'},
		overlaying: 'y',
		side: 'right',
		range: [0, limit]
	  }
    };

    Plotly.newPlot(gd, data, layout);
    window.onresize = function() {
        Plotly.Plots.resize(gd);
    };
}
function setRoomId(id, title){
	$("#demo").hide();
	$("#Plot").html("請稍等...");
	roomId = id;
	roomTitle = title;
	//console.log(checkInDate);
	setTimeout(function(){ 
		//$(".loading").css({ "display" : "none"});
		requestResult(); 
		}, 500);
}
function requestResult(){
    $.ajax({
        async: true,
        url: `https://prevago.tk/api/prices/result?r=${roomId}&c=${checkInDate}`,
        dataType : "json",
        type: "GET",
        success: function(data){
          console.log(data);
		  $("#Plot").html("");
		  loadResultData(data);
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){  
              console.log(XMLHttpRequest.status);  
              console.log(XMLHttpRequest.readyState);  
              console.log(textStatus);  
        } 
    });
}
function loadResultData(resultList){
	//$('#chart').append('<div id="Plot"></div>');
	var Prices = {
		agodaPriceX: [],
		agodaPriceY: [],
		bookingPriceX: [],
		bookingPriceY: [],
		pricelinePriceX: [],
		pricelinePriceY: []
	}
	var Rooms = {
		agodaRoomX: [],
		agodaRoomY: [],
		bookingRoomX: [],
		bookingRoomY: [],
		pricelineRoomX: [],
		pricelineRoomY: []
	}
	for(var i in resultList){
		//console.log(resultList[i]);
		if(resultList[i].supplier == "Agoda.com"){
			Prices.agodaPriceX.push(resultList[i].queryDate.split("-").join("."));
			Prices.agodaPriceY.push(resultList[i].price);
			Rooms.agodaRoomX.push(resultList[i].queryDate.split("-").join("."));
			Rooms.agodaRoomY.push(resultList[i].roomLeft);
		}
		else if(resultList[i].supplier == "Booking.com"){
			Prices.bookingPriceX.push(resultList[i].queryDate.split("-").join("."));
			Prices.bookingPriceY.push(resultList[i].price);
			Rooms.bookingRoomX.push(resultList[i].queryDate.split("-").join("."));
			Rooms.bookingRoomY.push(resultList[i].roomLeft);
		}
		else if(resultList[i].supplier == "Priceline.com"){
			Prices.pricelinePriceX.push(resultList[i].queryDate.split("-").join("."));
			Prices.pricelinePriceY.push(resultList[i].price);
			Rooms.pricelineRoomX.push(resultList[i].queryDate.split("-").join("."));
			Rooms.pricelineRoomY.push(resultList[i].roomLeft);
		}
	}
	//console.log(Prices);
	if(Prices.agodaPriceY.length==0&&Prices.bookingPriceY.length==0&&Prices.pricelinePriceY.length==0){
	  $("#Plot").html("很抱歉這段期間並無空房");
	}
	else{
	  $("#demo").show();
	  drawResult(Prices.agodaPriceX, Prices.agodaPriceY, Prices.bookingPriceX, Prices.bookingPriceY, Prices.pricelinePriceX, Prices.pricelinePriceY, Rooms.agodaRoomX, Rooms.agodaRoomY, Rooms.bookingRoomX, Rooms.bookingRoomY, Rooms.pricelineRoomX, Rooms.pricelineRoomY);
	}
}
function requestRooms(){
    $.ajax({
        async: true,
        url: `https://prevago.tk/api/rooms/result?h=${hotelId}`,
        dataType : "json",
        type: "GET",
        success: function(data){
          console.log(data);
		  loadRooms(data);
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){  
              console.log(XMLHttpRequest.status);  
              console.log(XMLHttpRequest.readyState);  
              console.log(textStatus);  
        } 
    });
}
var isInDatabase = true;
function loadRooms(data){
	var htmlText = "";
	if(data.length!=0){
		htmlText = htmlText + "<h5>現有"+data.length+"種房型</h5>";
		for(var i in data){
			htmlText = htmlText + '<div class="container room shadow"><div class="row roomName">';
			htmlText = htmlText + '<h4>'+data[i].roomName+'</h4>';
			htmlText = htmlText + `</div>
				<div class="row roomInfo">
					<div class="col-sm-3 roomCol">
						<img class="roomImage" src='styles/notFound.png'>
					</div>
					<div class="col-sm-3 roomDetail">
					</div>
					<div class="col-sm-3 roomCapacity">`;
			htmlText = htmlText + '<a href="#" data-toggle="tooltip" data-html="true" title="<div>最多'+data[i].adults+'位大人<br>'+data[i].kidForFree+'位0-6歲兒童可免費同住</div>">';
			htmlText = htmlText + `<div class="limit">人數限制</div>
						<div class="row left-table">
							<div class="col-sm-6">`;
			htmlText = htmlText + '<div class="capacity"></div>';
			htmlText = htmlText +'<img src="styles/person.png">x'+data[i].adults;
			htmlText = htmlText +`</div>
							<div class="col-sm-6">`;
			htmlText = htmlText + '<div class="capacity"></div>';
			htmlText = htmlText + '<img src="styles/child.png">x'+data[i].kidForFree;
			htmlText = htmlText + `</div>
						</div>
						</a>
					</div>
					<div class="col-sm-3 price roomCol">`;
			htmlText = htmlText + '<div><a href="#" class="chartLink" data-toggle="modal" onclick="setRoomId('+data[i].id+','+"'"+`${data[i].roomName}`+"'"+')" data-target="#priceModal"><span class="label label-info" >價格走向&空房率</span></a></div></div></div></div>';
		}
		$("#hotel").append(htmlText);
		$('[data-toggle="tooltip"]').tooltip();
	}
	else{
		isInDatabase = false;
		//console.log("沒有房間");
	}
	requestProperty();
}
function requestProperty(){
	$.ajax({
        async: true,
        url: `https://prevago.tk/api/hotel/id?hotelId=${hotelId}`,
        dataType : "json",
        type: "GET",
        success: function(data){
          console.log(data);
		  loadProperty(data);
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){  
              console.log(XMLHttpRequest.status);  
              console.log(XMLHttpRequest.readyState);  
              console.log(textStatus);  
        } 
    });
}
function loadProperty(data){
	
	$(".modal-title").text(data.hotelInfo.name);
	$(".hotelName").html(data.hotelInfo.name+$(".hotelName").html());
	$(".panel-footer a").attr('href', data.hotelInfo.canonicalUrl);
	
	var starRating = data.hotelInfo.starRating.value;
	//console.log(starRating);
	for(var i=0;i<parseInt(starRating);i++){
		$(".hotelName").append('<i class="fa fa-star"></i>');
	}
	$(".hotelCity").append(data.hotelInfo.address.full);
	$(".hotelCity").append('<div class="locationScore">位置得分 <span></span></div>')
	$(".locationScore span").text(data.mosaicInitData.rating.locationRating);
	$(".reviewTitle span").text(data.reviews.score);
	var hotFeatures = data.featuresYouLove.features;
	for(var j in hotFeatures){
		$(".featureTable").append('<div class="feature">'+hotFeatures[j].text+'</div>');
	}
	$('.feature').css('width', (100.0/hotFeatures.length)+'%');
	
	
	console.log(data.mosaicInitData.images);
	var imageList = data.mosaicInitData.images;
	for(var i in imageList){
		var imageUrl = imageList[i].location;
		//console.log(imageUrl);
		$("#image"+i).attr("src", imageUrl);
		if(i==3){
			break;
		}
	}
	var htmlText = "";
	for(var j in imageList){
		htmlText = htmlText + '<div class="mySlides">';
		var num = parseInt(j)+1;
		htmlText = htmlText + '<div class="numbertext">'+num+' / '+imageList.length+'</div>';
		htmlText = htmlText + '<img src="'+imageList[j].location+'" style="width:100%"></div>';
	}
	htmlText = htmlText + `<a class="prev" onclick="plusSlides(-1)">&#10094;</a>
			<a class="next" onclick="plusSlides(1)">&#10095;</a>`;
	$('#slides').append(htmlText);
	var colText = "";
	for(var k in imageList){
		colText = colText + '<div class="column">';
		colText = colText + '<img class="demo" src="'+imageList[k].location+'" width="60" height="60" onclick="currentSlide('+k+')"></div>';
	}
	$('#imageDemo').append(colText);
	
	var roomInfo = data.masterRoomInfo;
	console.log(roomInfo);
	//console.log('hi');
	//load room
	if(!isInDatabase){
		var htmlText = "";
		if(roomInfo){
			htmlText = htmlText + "<h5>現有"+roomInfo.length+"種房型</h5>";
			for(var i in roomInfo){
				htmlText = htmlText + '<div class="container room shadow"><div class="row roomName">';
				htmlText = htmlText + '<h4>'+roomInfo[i].name+'</h4>';
				htmlText = htmlText + `</div>
					<div class="row roomInfo">
						<div class="col-sm-3 roomCol">
							<img class="roomImage" src='styles/notFound.png'>
						</div>
						<div class="col-sm-3 roomDetail">
						</div>
				`;
				htmlText = htmlText + '<div class="col-sm-3 price roomCol"><div><a class="chartLink"><span class="label label-info" >很抱歉我們沒有這裡的歷史價格資料</span></a></div></div></div></div>';
			}
			$("#hotel").append(htmlText);
		}
		else{
			$("#hotel").append("<div class='row'><div class='col-sm-12 noRoom'>很抱歉我們沒有這裡的房間資訊</div></div>");
		}
	}
	
	for(var k in roomInfo){
		var room = $("h4:contains('"+roomInfo[k].name+"')").parent().parent();
		//console.log(roomInfo[k].name);
		//$("h4:contains('"+roomInfo[k].name+"')").css('background-color', 'yellow');
		//console.log(room);
		//console.log(roomInfo[k].images[0]);
		room.find(".roomImage").attr('src', roomInfo[k].images[0]);
		if(roomInfo[k].bedConfigurationSummary){
			room.find(".roomDetail").append('<div><i class="fa fa-asterisk"></i> '+roomInfo[k].bedConfigurationSummary.title+'</div>');
		}
		var roomFeature = roomInfo[k].features;
		for(var l in roomFeature){
			room.find(".roomDetail").append('<div><i class="fa fa-asterisk"></i> '+roomFeature[l].title+'</div>');
		}
		//room.find(".roomDetail").append('<div><i class="fa fa-asterisk"></i> 20平方公尺/215平方英尺</div>');
	}
	
	$(".loading").css({ "display" : "none"});
}
function loadHotelData(){
	//console.log(Info);
	//$(".modal-title").text(Info[0].hotelName);
	//$(".hotelName").html(Info[0].hotelName+$(".hotelName").html());
	//$(".hotelCity").append(Info[0].cityName);
	$(".panel-body .date").append(checkInDate);
	//$(".panel-footer a").attr('href', 'https://www.agoda.com'+Info[0].hotelUrl);
	console.log(isFavorite);
	if(isFavorite){
		$('.favorite span').text("取消最愛");
	}
	/*
	$.ajax({
        async: true,
        url: `https://prevago.tk/hotelPhoto/${hotelId}.json`,
        dataType : "text",
        type: "GET",
        success: function(data){
          //console.log(data);
		  loadImages(data);
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){  
              console.log(XMLHttpRequest.status);  
              console.log(XMLHttpRequest.readyState);  
              console.log(textStatus);  
        }
    });*/
}

function loadImages(data){
	var str = data.split("{u'").join("{'");
	str = str.split(" u'").join(" '");
	str = str.split("'").join("\"");
	//console.log(str);
	console.log(JSON.parse(str));
	resultList = JSON.parse(str);
	for(var i in resultList){
		//console.log(resultList[i].imageItemProps.url);
		var imageUrl = resultList[i].imageItemProps.url.replace("?s=450x450","")
		//console.log(imageUrl);
		$("#image"+i).attr("src", imageUrl);
		if(i==3){
			break;
		}
	}
	/*
	if(resultList.length<4){
		
	}
	*/
	var htmlText = "";
	for(var j in resultList){
		htmlText = htmlText + '<div class="mySlides">';
		var num = parseInt(j)+1;
		htmlText = htmlText + '<div class="numbertext">'+num+' / '+resultList.length+'</div>';
		htmlText = htmlText + '<img src="'+resultList[j].imageItemProps.url+'" style="width:100%"></div>';
	}
	htmlText = htmlText + `<a class="prev" onclick="plusSlides(-1)">&#10094;</a>
			<a class="next" onclick="plusSlides(1)">&#10095;</a>`;
	$('#slides').append(htmlText);
	var colText = "";
	for(var k in resultList){
		colText = colText + '<div class="column">';
		colText = colText + '<img class="demo" src="'+resultList[k].imageItemProps.url.replace("?s=450x450","?s=60x60")+'" width="60" height="60" onclick="currentSlide('+k+')"></div>';
	}
	$('#imageDemo').append(colText);
}

var slideIndex = 0;
//showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  if (n > slides.length-1) {slideIndex = 0}
  if (n < 0) {slideIndex = slides.length-1}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex].style.display = "block";
  dots[slideIndex].className += " active";
}
function favorite(){
	console.log($('.favorite').html());
	if($('.favorite span').text() == "加為最愛"){
		console.log('favorite');
		
		$.ajaxSetup({
			headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
		}
		});
		$.ajax({
		  url: `https://prevago.tk/user/addFavoriteHotel`,
		  data: {'h':hotelId,'m':''},
		  type: "POST",
		  success: function(data){
			  console.log(data);
			  $('.favorite span').text("取消最愛");
		  },
		  error: function(data){
			console.log(data);
			window.location = "/login";
		  }
		});
		
	}
	if($('.favorite span').text() == "取消最愛"){
		$.ajaxSetup({
			headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
		}
		});
		$.ajax({
		  url: `https://prevago.tk/user/deleteFavoriteHotel`,
		  data: {'h':hotelId},
		  type: "POST",
		  success: function(data){
			  console.log(data);
			  $('.favorite span').text("加為最愛");
		  }
		});
		
	}
}
loadHotelData();
requestRooms();
$.ajaxSetup({
	headers: {
		'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
	}
  });
  $.ajax({
	url: `https://prevago.tk/history/add`,
	data: {'id':hotelId},
	type: "POST",
	success: function(data){
		console.log(data);
	}
});
