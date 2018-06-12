//google map api key AIzaSyDdYA15XwLUobPnwk5_db9F1IZGFZAb5-4 

var mobileTerm = false;
var favorite_hotel = {
  id: 0,
  hotelId: 0,
  memo: ''
}
var Info = {
  adult : 2,
  children : 0,
  rooms : 1,
  CityId : 0,
  ObjectId : 0,
  checkIn : "06/15/2018",
  moreSearch : false,
  budget : 0,
  score : 0,
  stars : 0 ,
  searchType : 1,
  ResultUrl : ""
};

$(window).load(function(){
   $(".loading").css({ "display" : "none"});
   $(".fixed-left").css({ "z-index" : "0"});
   $("#web-roomList").css({ "position" : "absolute"});
});

  console.log(isLogin);
  loadHotels();
  $(".date-input").datepicker();
  $(".mobile-date-input").datepicker();
  fixedSearchBar();
  $(".mobile-search-bar-toggle").click(function(){
      $(".mobile-search-pop-up").slideToggle("fast");
  });
  $(".mobile-pop-up-canael").click(function(e){
      e.preventDefault();
      $(".mobile-search-pop-up").slideToggle("fast");
  });
  init();
  mapControll();
  roomChoose();
  dynamicLoad();
  submit();
  initSlide();
  pageControll();
function init(){
    Info.adult = result.info.adults;
    Info.children = result.info.children;
    Info.rooms = result.info.rooms;
    Info.CityId = result.info.cityId;
    Info.ObjectId = result.info.objectId;
    var date = result.info.checkInDate.split('-');
    Info.checkIn = date[1]+'/'+date[2]+'/'+date[0];

    Info.budget = (result.info.max == undefined)?0:result.info.max;
    Info.score = (result.info.locationScore[0] == undefined)?0:result.info.locationScore[0];
    Info.stars = (result.info.starRating[result.info.starRating.length-1] == undefined)?0:result.info.starRating[result.info.starRating.length-1];
    console.log(Info);
    $(".name-input").val(result.ObjectName);
    //score slide init
    $(".score-checkbox").each(function(){
      if($(this).val() == Info.score){
          $(this).prop("checked", true);
      }
    });
    //budget slide init
    if(Info.budget == '10000'){
        $('.budget-num').each(function(){
          $(this).text(`NT$${Info.budget}+`);
        });
    }
    else{
      $('.budget-num').each(function(){
        $(this).text(`NT$${Info.budget}`);
      });
    }
    var value = (parseInt(Info.budget) / 10000)*100;

    $(".budget-slider").each(function(){
      $(this).val(parseInt(Info.budget));
      $(this).css({
        'background-image':'-webkit-linear-gradient(left ,#037d6a 0%,#037d6a '+value+'%,#fff '+value+'%, #fff 100%)'
      });
    });
    //stars init
    for(var i = 1;i<=parseInt(Info.stars);i++){
      $(`#ws${i}`).css({"color":"#f99e00"});
      $(`#s${i}`).css({"color":"#f99e00"});
    }
    //room-input init
    $(".room-input").each(function(){
      $(this).val(`${Info.rooms}間房間、${Info.adult}位大人、${Info.children}位兒童`);
    });
    //date init
    $(".date-input").each(function(){
      $(this).val(`${Info.checkIn}`);
    });
}
function pageControll(){
  $(".prev").click(function(){
    var totlaPage = result.TotalPage;
    var currentPage = result.PageNumber;
    if((currentPage-1) >= 1){
      var url = window.location.href.split(`page=${currentPage}`);
      var new_url = url[0]+`page=${currentPage-1}`;
      window.location.href = new_url;
    }  
  });
  $(".next").click(function(){
    var totlaPage = result.TotalPage;
    var currentPage = result.PageNumber;
    if((currentPage+1) <= totlaPage){
      var url = window.location.href.split(`page=${currentPage}`);
      var new_url = url[0]+`page=${currentPage+1}`;
      window.location.href = new_url;
    }  
  });
}
function submit(){
  $(".Search-button").click(function(){
    var date = $("#fromDate").val();
    var sentence = date.split('/');
    Info.checkIn = sentence[2]+'-'+sentence[0]+'-'+sentence[1];
    
    /*$.ajax({
      url: `http://140.114.79.72:8888/api/hotels/result`,
      type: "POST",
      data: {'objectId':Info.ObjectId,'cityId':Info.CityId,'adults':Info.adult,'rooms':Info.rooms,'children':Info.children,'checkInDate':Info.checkIn},
      success: function(data){
          console.log(data);
      },
    });*/
    

    var totalStars = 0;
    for (var i = 5;i >= Info.stars ; i--){
      totalStars = i+totalStars*10;
    }
    if(Info.budget == 0 && Info.score == 0 && Info.stars == 0){

      window.location.href=`./searchList?resultUrl=${Info.ResultUrl}&searchType=${Info.searchType}&objectId=${Info.ObjectId}&cityId=${Info.CityId}&adults=${Info.adult}&rooms=${Info.rooms}&children=${Info.children}&checkInDate=${Info.checkIn}&page=1`;
    }
    else{
      window.location.href=`./searchList?resultUrl=${Info.ResultUrl}&searchType=${Info.searchType}&objectId=${Info.ObjectId}&cityId=${Info.CityId}&adults=${Info.adult}&rooms=${Info.rooms}&children=${Info.children}&checkInDate=${Info.checkIn}
                            &starRating=${totalStars}&max=${Info.budget}&LocationScore=${Info.score}&page=1`;
    }
    
  });
}
function dynamicLoad(){
  
  
    $("#web-name-input").bind('input porpertychange',function(){
          var thisTxt=$("#web-name-input").val();
          $.ajax({
            async: true,
            url: `https://prevago.tk/api/city/id?t=${thisTxt}`,
            dataType : "json",
            type: "GET",
            success: function(data){
                console.log(data)
                websuggestList(data.ViewModelList);
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){  
                    console.log(XMLHttpRequest.status);  
                    console.log(XMLHttpRequest.readyState);  
                    console.log(textStatus);  
              } 
          });
      });
      $("#mobile-name-input").bind('input porpertychange',function(){
            var thisTxt=$("#mobile-name-input").val();
            $.ajax({
              async: true,
              url: `https://prevago.tk/api/city/id?t=${thisTxt}`,
              dataType : "json",
              type: "GET",
              success: function(data){
                  console.log(data)
                  mobilesuggestList(data.ViewModelList);
              },
              error:function(XMLHttpRequest, textStatus, errorThrown){  
                      console.log(XMLHttpRequest.status);  
                      console.log(XMLHttpRequest.readyState);  
                      console.log(textStatus);  
                } 
            });
        })
  
}
function websuggestList(lists){
  $("#web-suggestList").empty();
  for(var i = 1;i < lists.length ; i++){
      $("#web-suggestList").append(`<div class='suggestItem' id=${i}>`+lists[i].ResultText+"</div>");
  }
  if(lists[i]!= 'undefined'){
    Info.CityId = lists[1].CityId;
    Info.ObjectId = lists[1].ObjectId;
    Info.searchType = lists[1].SearchType;
    if(lists[1].SearchType == 4){
      var url = lists[1].ResultUrl;
      Info.ResultUrl = url.split('hotel=')[1].split('&')[0];
      console.log(Info.ResultUrl);
    }
  }
$(".suggestItem").on("click", function(e){
  var value = $(this).text();
  $("#web-name-input").val(value);
  $("#web-suggestList").hide();
  //load into Info
  var num = $(this).attr('id');
  Info.CityId = lists[num].CityId;
  Info.ObjectId = lists[num].ObjectId;
  Info.searchType = lists[num].SearchType;
  if(lists[num].SearchType == 4){
    var url = lists[num].ResultUrl;
    Info.ResultUrl = url.split('hotel=')[1].split('&')[0];
    console.log(Info.ResultUrl);
  }
  console.log(Info);
});
//too hard
  $("#web-name-input").on("click", function(e){

      $("#web-suggestList").show();
      
      $(document).one("click", function(){
          $("#web-suggestList").hide();
      });

      e.stopPropagation();
  });
  $("#web-suggestList").on("click", function(e){
      e.stopPropagation();
  });
  

}
function mobilesuggestList(lists){
  $("#mobile-suggestList").empty();
  for(var i=1;i< lists.length;i++){
      $("#mobile-suggestList").append(`<div class='suggestItem' id=${i}>`+lists[i].ResultText+"</div>");
  }
  if(lists[i]!= 'undefined'){
    Info.CityId = lists[1].CityId;
    Info.ObjectId = lists[1].ObjectId;
    Info.searchType = lists[1].SearchType;
    if(lists[1].SearchType == 4){
      var url = lists[1].ResultUrl;
      Info.ResultUrl = url.split('hotel=')[1].split('&')[0];
      console.log(Info.ResultUrl);
    }
  }
$(".suggestItem").on("click", function(e){
  var value = $(this).text();
  $("#mobile-name-input").val(value);
  $("#mobile-suggestList").hide();
  //load into Info
  var num = $(this).attr('id');
  Info.CityId = lists[num].CityId;
  Info.ObjectId = lists[num].ObjectId;
  Info.searchType = lists[num].SearchType;
  if(lists[num].SearchType == 4){
    var url = lists[num].ResultUrl;
    Info.ResultUrl = url.split('hotel=')[1].split('&')[0];
    console.log(Info.ResultUrl);
  }
  console.log(Info);
});
//too hard
  $("#mobile-name-input").on("click", function(e){

      $("#mobile-suggestList").show();
      
      $(document).one("click", function(){
          $("#mobile-suggestList").hide();
      });

      e.stopPropagation();
  });
  $("#mobile-suggestList").on("click", function(e){
      e.stopPropagation();
  });
  

}
function roomChoose(){
  $(".roomList").hide();
  $(".room-input").on("click", function(e){
    $(".roomList").show();
  });
  
  //too hard
    $(".room-input").on("click", function(e){
  
        $(".roomList").show();
        
        $(document).one("click", function(){
            $(".roomList").hide();
        });
  
        e.stopPropagation();
    });
    $(".roomList").on("click", function(e){
        e.stopPropagation();
    });
    
  //minus&plus
  $(".minus").on("click", function(e){
      var which = $(this).parent().attr('id');
      if(Info[which] > 0){
            Info[which] -- ;
      }
      $('.room-input').val(`${Info.rooms}間房間、${Info.adult}位大人、${Info.children}位兒童`);
  });
  $(".plus").on("click", function(e){
      var which = $(this).parent().attr('id');
      Info[which] ++ ;
      $('.room-input').val(`${Info.rooms}間房間、${Info.adult}位大人、${Info.children}位兒童`);
  });
}
function loadHotels(){
  console.log(result);
  //favorite-submit&cancel
  $(".favorite-pop-up-cancel").click(function(){
    $.ajaxSetup({
      headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
      }
    });
    $.ajax({
      url: `https://prevago.tk/user/deleteFavoriteHotel`,
      data: {'h':favorite_hotel.hotelId},
      type: "POST",
      success: function(data){
          console.log(data)
      }
    });
    var id = parseInt(favorite_hotel.id.split('hotel')[1]);
    result.ResultList[id].isFavorite = 0;
    $(`#${favorite_hotel.id}`).find(".fa-heart").css({ "color" : "rgb(195,195,195)"});
    $(".favorite-pop-up").slideToggle("fast");
    $("#favorite-hotel").empty();
  });
  
  $(".favorite-pop-up-submit").click(function(){
    favorite_hotel.memo = $("#favorite-memo").val();
    $("#favorite-memo").val('');
    $.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
    }
    });
    $.ajax({
      url: `https://prevago.tk/user/addFavoriteHotel`,
      data: {'h':favorite_hotel.hotelId,'m':favorite_hotel.memo},
      type: "POST",
      success: function(data){
          console.log(data)
      }
    });
    var id = parseInt(favorite_hotel.id.split('hotel')[1]);
    result.ResultList[id].isFavorite = 1;
    $(`#${favorite_hotel.id}`).find(".fa-heart").css({ "color" : "rgb(206,0,0)"});
    $(".favorite-pop-up").slideToggle("fast");
    $("#favorite-hotel").empty();
  });
  
  ////////////////////////////////
  for(var hotel in result.ResultList){
      var tearget = result.ResultList[hotel];
      var id = `hotel${hotel}`;
      var hotel_photo = tearget.galleryContainerProps;
      var hotel_name = tearget.HotelDisplayName;
      var hotel_location = tearget.LocationFullText;
      var hotel_stars = parseInt(tearget.StarRating);
      $(".hotels-list").append(`<div class="card" id="${id}">
                                  <div class="row ">
                                    <div class="col-md-4 l-card">
                                        <img class="title-img" src="${hotel_photo.mainImages[0].imageItemProps.url}" height="250" width="250">
                                    </div>
                                    <div class="col-md-6 m-card">
                                          <h4 class="card-title favorite-tooltip">
                                            <i class="fas fa-heart"></i>
                                            <span class="favorite-tooltiptext">添加為最愛</span>
                                            ${hotel_name}
                                          </h4>
                                          <p class="card-text">${hotel_location}</p>
                                          <div class="other-photo"></div>
                                          <div class="icon-collection"></div>
                                    </div>
                                    <div class="col-md-2 r-card">
                                        <p class="r-text">評分</p> 
                                        <div>${tearget.ReviewScore}</div>
                                        <p class="r-text">星級</p>
                                        <div class="stars"></div>
                                        <div class="read-more"><button class="read-more-btn">Read More</button></div>
                                    </div>
                                  </div>
                                </div>`);
        // favorite
        if(isLogin == 1 && tearget.isFavorite == 1){
          $(`#${id}`).find(".fa-heart").css({ "color" : "rgb(206,0,0)"});
          console.log(tearget.HotelDisplayName);
        }

        (function(i,t){
          $(`#${i}`).find(".fa-heart").click(function(){
            
            if(isLogin == 0){
                window.location.href=`./login`;
            }
            else if(t.isFavorite == 1){
              $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
              });
              $.ajax({
                url: `https://prevago.tk/user/deleteFavoriteHotel`,
                data: {'h':t.HotelID},
                type: "POST",
                success: function(data){
                    console.log(data)
                }
              });
              $(`#${i}`).find(".fa-heart").css({ "color" : "rgb(195,195,195)"});
              var id = parseInt(i.split('hotel')[1]);
              result.ResultList[id].isFavorite = 0;

            }
            else{
              $(".favorite-pop-up").slideToggle("fast");
              $("#favorite-hotel").append(`<div class="row">
                                              <div class="col-md-4 favorite-img"><img src="${t.galleryContainerProps.mainImages[0].imageItemProps.url}" height="125" width="125"></div>
                                              <div class="col-md-8 favorite-text">${t.HotelDisplayName}<div>
                                           </div>`);
            
              favorite_hotel.hotelId = t.HotelID;
              favorite_hotel.id = i;
            }
            
          });
        })(id,tearget);
        
        (function(i,t){
          $(`#${i}`).find(".read-more-btn").click(function(){
          /*  if(isLogin == 1){
                console.log(t.HotelID);
              $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                }
              });
              $.ajax({
                url: `https://prevago.tk/history/add`,
                data: {'id':t.HotelID},
                type: "POST",
                success: function(data){
                    console.log(data);
                }
              });
            }*/
      
            
            window.location.href=`./hotel?hotelId=${t.HotelID}&checkInDate=${result.info.checkInDate}`;
            
          });
        })(id,tearget);
        
        hotel_photo.thumbnails.map(function(obj){
          $(`#${id}`).find(".other-photo").append(`<div class="photo-tooltip">
                                                      <img src="${obj.url}" height="60" width="60">
                                                      <img class="photo-tooltiptext" src="${obj.url}" height="250" width="250">
                                                    </div>`);
        });
        if(tearget.FreeWifi){
          $(`#${id}`).find(".icon-collection").append(`<div class="icon-tooltip">
                                                        <i class="fas fa-wifi fa-lg"></i>
                                                        <span class="icon-tooltiptext">免費WIFI</span>
                                                       </div>`);
        }
        if(tearget.IsFreeCancellation){
          $(`#${id}`).find(".icon-collection").append(`<div class="icon-tooltip">
                                                        <i class="fab fa-creative-commons-nc"></i>
                                                        <span class="icon-tooltiptext">免費取消訂房</span>
                                                      </div>`);
        }
        if(tearget.IsBreakfastIncluded){
          $(`#${id}`).find(".icon-collection").append(`<div class="icon-tooltip">
                                                        <i class="fas fa-utensils"></i>
                                                        <span class="icon-tooltiptext">提供早餐</span>
                                                      </div>`);
        }
        if(tearget.IsNoCreditCardRequired){
          $(`#${id}`).find(".icon-collection").append(`<div class="icon-tooltip">
                                                        <i class="far fa-credit-card"></i>
                                                        <span class="icon-tooltiptext">無需使用信用卡</span>
                                                      </div>`);
        }
        for(var i = 0;i < hotel_stars;i++){
          $(`#${id}`).find(".stars").append(`<i class="fas fa-star"></i>`);
        }
        

      }
}
function fixedSearchBar(){
  console.log("fixedSearchBar");
  var width = $(window).width();
  if(width <= 991 && mobileTerm == false){
    mobileTerm = true;
    console.log(mobileTerm);
    $(".search-bar").css({ "display" : "none"});
    $(".mobile-search-bar").slideToggle("normal");
  }
  else if (width > 991 && mobileTerm == true){
    mobileTerm = false;
    $(".mobile-search-bar").css({ "display" : "none"});
    $(".search-bar").slideToggle("normal");
  }
  
  window.onscroll = function(){
    var navHeight = $('nav').height();
    var scrollHeight = $(document).scrollTop();
    if(scrollHeight >= navHeight){
      $(".search-bar").css({
        "position": "fixed",
        "top": "0",
        "left": "0"
      });
    }
    else{
      $(".search-bar").css({
        "position": "static",
      });
    }
    
  };
  window.onresize = function(){
    var width = $(window).width();
    if(width <= 991 && mobileTerm == false){
      mobileTerm = true;
      console.log(mobileTerm);
      $(".search-bar").css({ "display" : "none"});
      $(".mobile-search-bar").slideToggle("normal");
    }
    else if (width > 991 && mobileTerm == true){
      mobileTerm = false;
      $(".mobile-search-bar").css({ "display" : "none"});
      $(".search-bar").slideToggle("normal");
    }
  };
}
function mapControll(){
  $(".map-icon").click(function(){
      $(".map-pop-up").slideToggle("fast");
  });
  $(".map-pop-up-canael").click(function(e){
      e.preventDefault();
      $(".map-pop-up").slideToggle("fast");
  });
  $(".mobile-map-search-bar-toggle").click(function(){
      $(".map-pop-up").slideToggle("fast");
  });
  //load maps
  var mapOptions = {
          center: { lat: result.CenterLatitude, lng: result.CenterLongitude},
          zoom: 15
        };
  var map = new google.maps.Map(
          document.getElementById('map-canvas'),
          mapOptions);
  var markers=[];
  var infowindows=[];
  //load hotel hotelList
  for(let hotel in result.ResultList){
      var tearget = result.ResultList[hotel];
      var id = `map-hotel${hotel}`;
      var hotel_photo = tearget.galleryContainerProps;
      var hotel_name = tearget.HotelDisplayName;
      var hotel_location = tearget.LocationFullText;
      var hotel_stars = parseInt(tearget.StarRating);
      $("#map-hotels-list").append(`<div class="map-card" id="${id}">
                                  <div class="row ">
                                    <div class="col-md-5 map-l-card">
                                        <img src="${hotel_photo.mainImages[0].imageItemProps.url}" height="150" width="150">
                                    </div>
                                    <div class="col-md-7 map-m-card">
                                          <h4 class="card-title">${hotel_name}</h4>
                                          <p class="card-text">${hotel_location}</p>
                                          <div class="map-read-more"><button class="map-read-more-btn">Read More</button></div>
                                    </div>
                            
                                  </div>
                                </div>`);
     var contentString = `<div class="map-content">
                             <div class="map-content-img">
                                 <img src="${hotel_photo.mainImages[0].imageItemProps.url}" height="75" width="75">
                             </div>
                             <div class="map-content-text">
                                   <h4>${hotel_name}</h4>
                             </div>
                          </div>`;
    

     (function(i,t){
       $(`#${i}`).find(".map-read-more-btn").click(function(){
         window.location.href=`./hotel?hotelId=${t.HotelID}&checkInDate=${result.info.checkInDate}`;
         
       });
     })(id,tearget);
     
     infowindows[hotel] = new google.maps.InfoWindow({
       content: contentString,
       maxWidth:220,
       position: {lat: tearget.Latitude, lng: tearget.Longitude}
     });
     markers[hotel] = new google.maps.Marker({
            position: {lat: tearget.Latitude, lng: tearget.Longitude},
            map: map
      });
      markers[hotel].addListener('mouseover', function(){
        infowindows[hotel].open(map, markers[hotel]);
      });
      markers[hotel].addListener('mouseout', function(){
        infowindows[hotel].close(map, markers[hotel]);
      });
      
      //clousure
      (function(i){
        markers[hotel].addListener('click', function(){
          document.getElementById(`${i}`).scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      })(id);
      

      //clousure
      (function(t){
        $(`#${id}`).click(function(){
          map.panTo({lat: t.Latitude, lng: t.Longitude});
        });
        $(`#${id}`).mouseover(function(){
          infowindows[hotel].open(map, markers[hotel]);
        });
        $(`#${id}`).mouseout(function(){
          infowindows[hotel].close(map, markers[hotel]);
        });
      })(tearget);
      
    }
    

}
function clickMapList(map, lat,lng){
  var marker = new google.maps.Marker({
              position: {lat: lat, lng: lng},
              map: map
              });
  map.panTo({lat: lat, lng: lng});
}
function initSlide(){
  //budget
  $(function(){
  var bslide = $('.budget-slider');
  bg(parseInt(Info.budget));
  bslide.on('mouseenter',function(){
    var value = bslide.val();
    bslide.on('click',function(){
      value = bslide.val();
      bg(value);
    });
    bslide.on('mousemove',function(){
      value = bslide.val();
      bg(value);
    });
  });
  function bg(value){
    console.log(value);
      if(value == 10000){
          $('.budget-num').text(`NT$${value}+`);
      }
      else{
          $('.budget-num').text(`NT$${value}`);
      }
      Info.budget = value;
      value = (value / 10000)*100;

      bslide.css({
        'background-image':'-webkit-linear-gradient(left ,#037d6a 0%,#037d6a '+value+'%,#ccc '+value+'%, #ccc 100%)'
      });
  }
  });
  //budget
  $(function(){
  var bslide = $('#myRange2');
  bg(parseInt(Info.budget));
  bslide.on('mouseenter',function(){
    var value = bslide.val();
    bslide.on('click',function(){
      value = bslide.val();
      bg(value);
    });
    bslide.on('mousemove',function(){
      value = bslide.val();
      bg(value);
    });
  });
  function bg(value){
    
      if(value == 10000){
          $('.budget-num').text(`NT$${value}+`);
      }
      else{
          $('.budget-num').text(`NT$${value}`);
      }
      Info.budget = value;
      value = (value / 10000)*100;

      bslide.css({
        'background-image':'-webkit-linear-gradient(left ,#037d6a 0%,#037d6a '+value+'%,#ccc '+value+'%, #ccc 100%)'
      });
  }
  });
  //stars
  $(".mobile-star").mouseover(function(){
      var s = parseInt($(this).attr('id').split('s')[1]);

      for(var i=1;i<=s;i++){
        $(`#s${i}`).css({"color":"#f99e00"});
      }
  });
  $(".mobile-star").mouseout(function(){
      for(var i=1;i<=5;i++){
        $(`#s${i}`).css({"color":"#333"});
      };
      for(var i=1;i<=Info.stars;i++){
        $(`#s${i}`).css({"color":"#f99e00"});
      }
  });
  $(".mobile-star").click(function(){
      var s = parseInt($(this).attr('id').split('s')[1]);
      Info.stars = s;
      for(var i=1;i<=s;i++){
        $(`#s${i}`).css({"color":"#f99e00"});
      }
  });
  //web-stars
  $(".web-star").mouseover(function(){
      var s = parseInt($(this).attr('id').split('s')[1]);
      console.log(s);
      for(var i=1;i<=s;i++){
        $(`#ws${i}`).css({"color":"#f99e00"});
      }
  });
  $(".web-star").mouseout(function(){
      for(var i=1;i<=5;i++){
        $(`#ws${i}`).css({"color":"#333"});
      };
      for(var i=1;i<=Info.stars;i++){
        $(`#ws${i}`).css({"color":"#f99e00"});
      }
  });
  $(".web-star").click(function(){
      var s = parseInt($(this).attr('id').split('s')[1]);
      Info.stars = s;
      for(var i=1;i<=s;i++){
        $(`#ws${i}`).css({"color":"#f99e00"});
      }
  });
}
function chk(input)
{

  $(".score-checkbox").prop("checked", false);
  Info.score =  input.value;

  input.checked = true;
  return true;
}