
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

function initSlide(){
  //budget
  $(function(){
  var bslide = $('.budget-slider');
  bg(bslide.val());
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
          $('#budget-num').text(`NT$${value}+`);
      }
      else{
          $('#budget-num').text(`NT$${value}`);
      }
      Info.budget = value;
      value = (value / 10000)*100;

      bslide.css({
        'background-image':'-webkit-linear-gradient(left ,#037d6a 0%,#037d6a '+value+'%,#fff '+value+'%, #fff 100%)'
      });
  }
  });

  //stars
  $(".fa-star").mouseover(function(){
      var s = parseInt($(this).attr('id').split('s')[1]);

      for(var i=1;i<=s;i++){
        $(`#s${i}`).css({"color":"#f99e00"});
      }
  });
  $(".fa-star").mouseout(function(){
      for(var i=1;i<=5;i++){
        $(`#s${i}`).css({"color":"#333"});
      };
      for(var i=1;i<=Info.stars;i++){
        $(`#s${i}`).css({"color":"#f99e00"});
      }
  });
  $(".fa-star").click(function(){
      var s = parseInt($(this).attr('id').split('s')[1]);
      Info.stars = s;
      for(var i=1;i<=s;i++){
        $(`#s${i}`).css({"color":"#f99e00"});
      }
  });
}
var callback = function(){
  console.log("callback");
}
function dynamicLoad(){

  $(".name-input").bind('input porpertychange',function(){
        var thisTxt=$(".name-input").val();
        $.ajax({
          async: true,
          url: `https://prevago.tk/api/city/id?t=${thisTxt}`,
          dataType : "json",
          type: "GET",
          success: function(data){
              console.log(data);
              suggestList(data.ViewModelList);
          },
          error:function(XMLHttpRequest, textStatus, errorThrown){  
              Info.ObjectId = 0;
              Info.CityId = 0;  
            } 
        });
    })
}
function suggestList(lists){
  $(".suggestList").empty();
  
  for(var i = 1;i< lists.length;i++){
      $(".suggestList").append(`<div class='suggestItem' id=${i}>`+lists[i].DisplayNames.Name+"</div>");
  }
  if(typeof(lists[1]) != 'undefined'){
    Info.CityId = lists[1].CityId;
    Info.ObjectId = lists[1].ObjectId;
    Info.searchType = lists[1].SearchType;
    if(lists[1].SearchType == 4){
      var url = lists[1].ResultUrl;
      Info.ResultUrl = url.split('hotel=')[1].split('&')[0];
      console.log(Info.ResultUrl);
    }
    /*var url = lists[1].ResultUrl;
    Info.ResultUrl = url.split('hotel=')[1].split('&')[0];
    conosle.log(Info.ResultUrl);*/
  
  }
  else{
    console.log("no result");
    Info.CityId = 0;
    Info.ObjectId = 0;
    Info.searchType = 0;
  //  console.log(Info);
  }
$(".suggestItem").on("click", function(e){
  var value = $(this).text();
  $(".name-input").val(value);
  $(".suggestList").hide();
  //load into Info
  var num = $(this).attr('id');
  Info.CityId = lists[num].CityId;
  Info.ObjectId = lists[num].ObjectId;
  if(lists[num].SearchType == 4){
    var url = lists[num].ResultUrl;
    Info.ResultUrl = url.split('hotel=')[1].split('&')[0];
    console.log(Info.ResultUrl);
    Info.searchType = 4;
  }

});
//too hard
  $(".name-input").on("click", function(e){

      $(".suggestList").show();
      
      $(document).one("click", function(){
          $(".suggestList").hide();
      });

      e.stopPropagation();
  });
  $(".suggestList").on("click", function(e){
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
/*
function chk(input)
{
  for(var i=0;i<document.form1.c1.length;i++)
  {
    document.form1.c1[i].checked = false;
  }
  Info.score =  input.value;
  console.log(Info.score);
  input.checked = true;
  return true;
}
*/
function initChk(){
  var ck1 = chk("ck1");
  var ck2 = chk("ck2");
  var ck3 = chk("ck3");
  $("#ck1").click(function(){
    ck1.clearAll();
    ck1.setChk();
  });
  $("#ck2").click(function(){
    ck2.clearAll();
    ck2.setChk();
  });
  $("#ck3").click(function(){
    ck3.clearAll();
    ck3.setChk();
  });
}
function chk(id)
{

  return{
    clearAll: function clearAll(){
      for(var i=0;i<document.form1.c1.length;i++)
      {
        document.form1.c1[i].checked = false;
      }

    },
    setChk: function setChk(){
      Info.score =  $(`#${id}`).val();
      $(`#${id}`).prop("checked", true);

    }
  } 
}
function submit(){
  $(".Search-button").click(function(){
    var date = $("#fromDate").val();
    var sentence = date.split('/');
    console.log(date);
    //Info.checkIn = sentence[2]+'-'+sentence[0]+'-'+sentence[1];
    Info.checkIn = date;
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
    

  
    if(Info.moreSearch == true){
      window.location.href=`./searchList?resultUrl=${Info.ResultUrl}&searchType=${Info.searchType}&objectId=${Info.ObjectId}&cityId=${Info.CityId}&adults=${Info.adult}&rooms=${Info.rooms}&children=${Info.children}&checkInDate=${Info.checkIn}
                            &starRating=${totalStars}&max=${Info.budget}&LocationScore=${Info.score}&page=1`;
    }
    else{
    console.log(Info);
        window.location.href=`./searchList?resultUrl=${Info.ResultUrl}&searchType=${Info.searchType}&objectId=${Info.ObjectId}&cityId=${Info.CityId}&adults=${Info.adult}&rooms=${Info.rooms}&children=${Info.children}&checkInDate=${Info.checkIn}&page=1`;
    }
    
  });
}  
function fb(){

  FB.getLoginStatus(function(response) {
    console.log(response);
  });
  
}

window.onload = function(){
  var Today=new Date();

  Info.checkIn = Today.getFullYear()+'-0'+(Today.getMonth()+1)+'-'+Today.getDate();
  $('#fromDate').val(Info.checkIn);
  //$(".date-input").datepicker();

  $(".moreSearch-toggle").click(function(){
    Info.moreSearch = !Info.moreSearch;
    $(".more-search").slideToggle("slow");
  });
  
  initSlide();
  
  $(".left-input").focus(function(){
    $(this).css({'border-bottom': '7px solid rgb(102,175,233)'});
  });
  $(".left-input").blur(function(){
    $(this).css({'border-bottom': '7px solid rgb(5,58,68)'});
  });
  
  dynamicLoad();
  roomChoose();
  submit();
  initChk();
  //fb();

}
