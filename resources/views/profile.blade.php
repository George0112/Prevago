@extends('layouts.master')

@section('style')
  <link rel="stylesheet" type="text/css" href="styles/profile.css">
  <script type="text/javascript">const favoriteHotels={!! json_encode($favoriteHotels)!!}</script>
  <script type="text/javascript">const favoriteRooms={!! json_encode($favoriteRooms)!!}</script>
  <script type="text/javascript">const history={!! json_encode($history)!!}</script>
@endsection

@section('content')

    <div class="container-fluid">
    <div class="row">
      <div class="left-area col-md-7 col-ms-12 col-xs-12">
        <div class="favoriteHotel_header">
          <p id="fav_hot" class="favoriteHotel_header_text">Favorite Hotels</p>
          
          <p id="his"    class="favoriteHotel_header_text">History</p>
        </div>

        <div class="favoriteHotelsList"></div>
        <div class="favoriteRoomsList"></div>
        <div class="historyList"></div>

      </div>
     
      <div class="account-area col-md-4 col-ms-12 col-xs-12">
          <h1 id="header_text">用戶詳細資料</h1>
          <div id="user_name" class ="name_card">
            <div class="col-md-2">
              <i class="user-coin">
                <span><?php
                    
                    echo" <p>$email[0]</p>"
    
                    ?></span>
              </i>
            </div>
            <div class="col-md-9 name_content">
              <h2 class="emailtext">大名</h2>
              <div class="name">
                <?php
                  
                echo" <p>$name</p>"

                ?>
              </div>
            </div>
          </div>

          <div id="user_email" class ="email_card flex">
            <div class="email_content col-md-10">
              <div>
                  <h2 class="emailtext">電子郵件</h2>
              </div>
              <div>
                  <?php     
                  echo" <p>$email</p>"
                  ?>
              </div>
            </div>
            <div class="email_edit col-md-2">
              <div class="email_edit_content">
                <span id="email_edit_text">Edit</span>
              </div>
            </div>
            <div class="email_editing">
              <h2 class="emailtext">編輯電子郵件</h2>
              <input type="text" class="email-input" value= "<?php  echo"$email" ?>"  />
              <button id="email_cancel" class="edit-button">Cancel</button>
              <button id="email_submit" class="edit-button">Submit</button>
            </div>
          </div>


          <div id="user_phone" class ="phone_card flex">
            <div class="phone_content col-md-10">
              <div>
                  <h2 class="phonetext">電話號碼</h2>
              </div>
              <div>
                  <?php     
                  echo" <p>$phone</p>"
                  ?>
              </div>
            </div>
            <div class="phone_edit col-md-2">
              <div class="phone_edit_content">
                <span id="phone_edit_text">Edit</span>
              </div>
            </div>
            <div class="phone_editing">
              <h2 class="phonetext">編輯電話號碼</h2>
              <input type="text" class="phone-input" value= "<?php  echo"$phone" ?>"  />
              <button id="phone_cancel" class="phone-button">Cancel</button>
              <button id="phone_submit" class="phone-button">Submit</button>
            </div>
          </div>
          
          <div id="user_password" class ="password_card flex">
          @if (!session('status'))
            <div class="password_content col-md-10">
              <div>
                  <h2 class="passwordtext">Password</h2>
              </div>
              <div>
                   <p>●●●●●●●●●●</p>

              </div>
            </div>
            @endif
            @if (session('status'))
            <div class="password_content col-md-6">
              <div>
                  <h2 class="passwordtext">Password</h2>
              </div>
              <div>
                   <p>●●●●●●●●●●</p>

              </div>
            </div>
            <div class="alert alert-success col-md-6">
                {{ session('status') }}
            </div>
             @endif
            <div class="password_edit col-md-2">
              <div class="password_edit_content">
                <span id="password_edit_text">Edit</span>
              </div>
            </div>
            <div class="col-md-5 password_editing">
              <form onsubmit="return check()"  id="form-change-password" role="form" method="POST" action="{{ url('https://prevago.tk/updatePassword') }}" novalidate class="form-horizontal" >
                <div >             
                  <label for="current-password" class="control-label">Current Password</label>
                  <div >
                    <div class="form-group">
                      <input type="hidden" name="_token" value="{{ csrf_token() }}"> 
                      <input type="password" class="form-control p1" id="current-password" name="current-password" placeholder="Password" required="required">
                    </div>
                  </div>
                  <label for="password" class="control-label">New Password</label>
                  <div >
                    <div class="form-group">
                      <input type="password" class="form-control p2" id="password" name="password" placeholder="Password" required="required">
                    </div>
                  </div>
                  <label for="password_confirmation" class="control-label">Re-enter Password</label>
                  <div >
                    <div class="form-group">
                      <input type="password" class="form-control p3" id="password_confirmation" name="password_confirmation" placeholder="Re-enter Password" required="required">
                    </div>
                  </div>
                </div>
                <div class="form-group-b">
                 
                    <button type="button" class="Cancel_pass ">Cancel</button>
                    <button type="submit" class="modify_pass ">Submit</button>
                  
                </div>
              </form>
            </div>
            <div class="col-md-5 password_editing2 error_message">
              @if (session('fail'))
                <div class="alert alert-danger">
                    {{ session('fail') }}
                </div>
              @endif
            </div>
          </div>

        </div>
          
          


          
    </div>

@endsection

@section('script')
  <script src="./scripts/profile.js"></script>
  <script>
  $(function () {
      @if (session('fail'))
        Modify_error();
      @endif
  });
  </script>
  <script>var email = "<?php echo $email; ?>";</script>
  <script>var phone = "<?php echo $phone; ?>";</script>
  
@endsection

