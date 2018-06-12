console.log(favoriteHotels);

console.log(history);
function editemail(){
    
    $("#email_edit_text").on("click",function(e){
        $(".email-input").val(email);
        $(".email_content").css({'opacity': 1,'display': 'none'});
        $(".email_edit").css({'opacity': 1,'display': 'none'});
        $(".email_editing").css({'opacity': 1,'display': 'block'});
    })
    $("#email_cancel").on("click",function(e){
        $(".email_editing").css({'opacity': 1,'display': 'none'});
        $(".email_content").css({'opacity': 1,'display': 'block'});
        $(".email_edit").css({'opacity': 1,'display': 'block'});
        
    })
    $("#email_submit").on("click",function(e){
        var r=confirm("Sure about this?");
        if(r==true){
            var email_val = $('.email-input');
            var val=email_val.val();
            $.ajax({
                async: true,
                url: `https://prevago.tk/updateEmail?email=${val}`,
                type: "GET",
                success: function(data){
                    console.log(data);
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){  
                        console.log(XMLHttpRequest.status);  
                        console.log(XMLHttpRequest.readyState);  
                        console.log(textStatus);  
                } 
            });
        
            alert("Edit Success!");
            $(".email_editing").css({'opacity': 1,'display': 'none'});
            $(".email_content").css({'opacity': 1,'display': 'block'});
            $(".email_edit").css({'opacity': 1,'display': 'block'});
            window.location.reload();
        }
        
    })
};
function editPhone(){
    
    $("#phone_edit_text").on("click",function(e){
        $(".phone-input").val(phone);
        $(".phone_content").css({'opacity': 1,'display': 'none'});
        $(".phone_edit").css({'opacity': 1,'display': 'none'});
        $(".phone_editing").css({'opacity': 1,'display': 'block'});
    })
    $("#phone_cancel").on("click",function(e){
        $(".phone_editing").css({'opacity': 1,'display': 'none'});
        $(".phone_content").css({'opacity': 1,'display': 'block'});
        $(".phone_edit").css({'opacity': 1,'display': 'block'});
        
    })
    $("#phone_submit").on("click",function(e){
        var phone_val = $('.phone-input');
        var val=phone_val.val();
        if(val.length==10){
            var r=confirm("Sure about this?");
            if(r==true){
                
                
                $.ajax({
                    async: true,
                    url: `https://prevago.tk/updatePhone?phone=${val}`,
                    type: "GET",
                    success: function(data){
                        console.log(data);
                    },
                    error:function(XMLHttpRequest, textStatus, errorThrown){  
                            console.log(XMLHttpRequest.status);  
                            console.log(XMLHttpRequest.readyState);  
                            console.log(textStatus);  
                    } 
                });
            
                alert("Edit Success!");
                $(".phone_editing").css({'opacity': 1,'display': 'none'});
                $(".phone_content").css({'opacity': 1,'display': 'block'});
                $(".phone_edit").css({'opacity': 1,'display': 'block'});
                window.location.reload();
            }
        }
        else{
            alert("Phone format error(length error)");
        }
    })
};
function editpassword(){
    
    
    $("#password_edit_text").on("click",function(e){
        $("#user_password").css({'height':'350px'});
        $(".password_content").css({'opacity': 1,'display': 'none'});
        $(".password_edit").css({'opacity': 1,'display': 'none'});
        $(".password_editing").css({'opacity': 1,'display': 'block'});
    })
    $(".Cancel_pass").on("click",function(e){
        $(".password_editing").css({'opacity': 1,'display': 'none'});
        $(".password_content").css({'opacity': 1,'display': 'block'});
        $(".password_edit").css({'opacity': 1,'display': 'block'});
        $("#user_password").css({'height':'140px'});
        $(".error_message").css({'opacity': 1,'display': 'none'});
        $(".p1").css({'box-shadow':'4px 4px 20px rgba(0, 0, 0, 0)'});
        $(".p2").css({'box-shadow':'4px 4px 20px rgba(0, 0, 0, 0)'});
        $(".p3").css({'box-shadow':'4px 4px 20px rgba(0, 0, 0, 0)'});
        $('.p1').val("");
        $('.p2').val("");
        $('.p3').val("");

        
    })
};
function Modify_check(){
    var val1=$('.p1').val();
    var val2=$('.p2').val();
    var val3=$('.p3').val();
    $(".p1").css({'box-shadow':'4px 4px 20px rgba(0, 0, 0, 0)'});
    $(".p2").css({'box-shadow':'4px 4px 20px rgba(0, 0, 0, 0)'});
    $(".p3").css({'box-shadow':'4px 4px 20px rgba(0, 0, 0, 0)'});

    if(val1=="" || val2=="" || val3==""){

        if(val1==""){
            $(".p1").css({'box-shadow':'4px 4px 20px rgba(200, 0, 0, 0.85)'});
        }
        if(val2==""){
            $(".p2").css({'box-shadow':'4px 4px 20px rgba(200, 0, 0, 0.85)'});
        }
        if(val3==""){
            $(".p3").css({'box-shadow':'4px 4px 20px rgba(200, 0, 0, 0.85)'});
        }

        return false;
    }else{
        var r=confirm("Sure about this?");
        console.log(r);
        return r;
    }
    
}

function Modify_error(){
    
    $("#user_password").css({'height':'350px'});
    $(".password_content").css({'opacity': 1,'display': 'none'});
    $(".password_edit").css({'opacity': 1,'display': 'none'});
    $(".password_editing").css({'opacity': 1,'display': 'block'});
    $(".password_editing2").css({'opacity': 1,'display': 'block'});
    alert("Modify Password fail!");
}
function list_favoritesHotels(){
    //console.log(favoriteHotels);
    var result;
    var lt = /</g, 
    gt = />/g, 
    ap = /'/g, 
    ic = /"/g;

    for(var i in favoriteHotels){
        console.log(i);
        (function(id){
        $.ajax({
            async: true,
            url: `https://prevago.tk/api/hotel/id?hotelId=${favoriteHotels[id].hotelId}`,
            type: "GET",
            success: function(data){
                console.log(data);
                var memo=(favoriteHotels[id].memo==null)?"":favoriteHotels[id].memo.toString().replace(lt, "&lt;").replace(gt, "&gt;").replace(ap, "&#39;").replace(ic, "&#34;");;
                $(".favoriteHotelsList").append(`
					<div id="fav_${id}" class="fav_list_item row">
						<div class='col-md-4'>
							<img class='img img-responsive' src='https:${data.mosaicInitData.images[0].location}'>
						</div>                     
                    	<div class="col-md-8 favorite-text">
                            <div class='title'>${data.hotelInfo.name}</div>
                            <div class="memo">${memo}</div>

							<div class='des'>
								<a href='#'>
                                    <i class='fav_readmore'>Read More&nbsp;&nbsp;</i>
                                   
                                </a>
                                
                                <a href='#'>
                                   
                                    <i class='fav_remove'  >Delete</i>
                                 </a>
							</div>
						</div>
                    </div>
                `);
                $(`#fav_${id}`).find(".fav_readmore").click(function(){
                    var Today=new Date();
                    var c_date = Today.getFullYear()+'-'+(Today.getMonth()+1)+'-'+Today.getDate();
                    window.location.href=`https://prevago.tk/hotel?hotelId=${favoriteHotels[id].hotelId}&checkInDate=${c_date}`;
                })
                $(`#fav_${id}`).find(".fav_remove").click(function(){
                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                        }
                      });
                    $.ajax({
                        async: true,
                        url: `https://prevago.tk/user/deleteFavoriteHotel`,
                        data: {'h':favoriteHotels[id].hotelId},
                        type: "POST",
                        success: function(data){
                            console.log(data);
                            window.location.reload();
                        },
                        error:function(XMLHttpRequest, textStatus, errorThrown){  
                                console.log(XMLHttpRequest.status);  
                                console.log(XMLHttpRequest.readyState);  
                                console.log(textStatus);  
                        } 
                    });
                })
            },
            
            error:function(XMLHttpRequest, textStatus, errorThrown){  
                    console.log(XMLHttpRequest.status);  
                    console.log(XMLHttpRequest.readyState);  
                    console.log(textStatus);  
            } 
        });
        })(i);
    }
}
// function list_favoritesRooms(){
//     //console.log(favoriteHotels);
//     var result;
//     for(var i in favoriteHotels){
        
//         $.ajax({
//             async: true,
//             url: `https://prevago.tk/api/hotel/id?hotelId=${favoriteHotels[i].hotelId}`,
//             type: "GET",
//             success: function(data){
//                 console.log(data);
//                 $(".favoriteHotelsList").append(`
// 					<div id="fav_${i}" class="fav_list_item row">
// 						<div class='col-md-4'>
// 							<img class='img img-responsive' src='https:${data.mosaicInitData.images[0].location}'>
// 						</div>                     
//                     	<div class="col-md-8 favorite-text">
// 							<div class='title'>${data.hotelInfo.name}</div>
// 							<div class='des'>
// 								<a href='#'>
// 									<i class='fav_readmore'>Read More</button>
// 								</a>
// 							</div>
// 						</div>
//                     </div>
// 				`);
                
//             },
//             error:function(XMLHttpRequest, textStatus, errorThrown){  
//                     console.log(XMLHttpRequest.status);  
//                     console.log(XMLHttpRequest.readyState);  
//                     console.log(textStatus);  
//             } 
//         });
        
//     }
// }
function list_history(){
    var result;
    for(var i in history){
        (function(id){
        $.ajax({
            async: true,
            url: `https://prevago.tk/api/hotel/id?hotelId=${history[id].hotelId}`,
            type: "GET",
            success: function(data){
                console.log(data);
                $(".historyList").append(`
					<div id="his_${id}" class="fav_list_item row">
						<div class='col-md-4'>
							<img class='img img-responsive' src='https:${data.mosaicInitData.images[0].location}'>
						</div>                     
                    	<div class="col-md-8 favorite-text">
							<div class='title'>${data.hotelInfo.name}</div>
							<div class='des'>
								<a href='#'>
									<i class='fav_readmore'>Read More</i>
								</a>
							</div>
						</div>
                    </div>
                `);
                $(`#his_${id}`).find(".fav_readmore").click(function(){
                    var Today=new Date();
                    var c_date = Today.getFullYear()+'-'+(Today.getMonth()+1)+'-'+Today.getDate();
                    window.location.href=`https://prevago.tk/hotel?hotelId=${history[id].hotelId}&checkInDate=${c_date}`;
                });
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){  
                    console.log(XMLHttpRequest.status);  
                    console.log(XMLHttpRequest.readyState);  
                    console.log(textStatus);  
            } 
       
        });
    })(i);
    }

}
function changeList(){
    $("#his").on("click",function(e){
        $("#fav_hot").css({'color': 'rgba(192,192,192,0.5)'});
        $("#his").css({'color': 'black'});
        $(".favoriteHotelsList").css({'opacity': 1,'display': 'none'});
        $(".historyList").css({'opacity': 1,'display': 'block'});
    })
    $("#fav_hot").on("click",function(e){
        $("#his").css({'color': 'rgba(192,192,192,0.5)'});
        $("#fav_hot").css({'color': 'black'});
        $(".favoriteHotelsList").css({'opacity': 1,'display': 'block'});
        $(".historyList").css({'opacity': 1,'display': 'none'});
    })
}
function empty(){
    $(".favoriteHotelsList").empty();
    $(".historyList").empty();
}


window.onload=function(){
    
    editemail();
    editPhone();
    editpassword();

    empty();
    list_favoritesHotels();
    //list_favoritesRooms();
    list_history();
    changeList();
}
