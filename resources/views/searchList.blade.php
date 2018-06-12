@extends('layouts.master')

@section('style')
  <link rel="stylesheet" type="text/css" href="styles/searchList.css">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">
  <script type="text/javascript">const result={!! json_encode($result)!!}</script>
  <script type="text/javascript">const isLogin={!! json_encode($isLogin)!!}</script>
  <script type="text/javascript"
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDdYA15XwLUobPnwk5_db9F1IZGFZAb5-4">
  </script>
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <script type="text/javascript" src="https://unpkg.com/default-passive-events"></script>
@endsection

@section('content')
  <div class="loading">
    <span class="loading-text">Loading</span>
    <span class="l-1"></span>
    <span class="l-2"></span>
    <span class="l-3"></span>
    <span class="l-4"></span>
    <span class="l-5"></span>
    <span class="l-6"></span>
  </div>
  <div class="search-bar">
  
      <input type="text" class="name-input" id="web-name-input" placeholder="Country" autocomplete="off"/>
        <div class="suggestList" id="web-suggestList"></div>
      <input type="text" class="form-control date-input"  id="fromDate" value="06/15/2018" readonly="readonly"/>
      <input type="text" class="room-input" id="web-room-input" value="1間房間、2位大人、0位兒童" readonly="readonly"/>
        <div class="roomList" id="web-roomList">
          <div class="roomItem" id="rooms"><span class="minus">-</span>room<span class="plus">+</span></div>
          <div class="roomItem" id="adult"><span class="minus">-</span>大人<span class="plus">+</span></div>
          <div class="roomItem" id="children"><span class="minus">-</span>兒童<span class="plus">+</span></div>
        </div>
      <button id="web-Search-button" class="Search-button">Search</button>
    
  </div>
  <div class="mobile-search-bar">
    <div class="mobile-search-bar-toggle">More Search</div>
    <div class="mobile-map-search-bar-toggle">Map Search</div>
    <div class="mobile-search-pop-up">
      <button class="mobile-pop-up-canael">X</button>
      <input type="text" class="name-input" id="mobile-name-input" placeholder="Country" autocomplete="off"/>
        <div class="suggestList" id="mobile-suggestList"></div>
      <input type="text" class="form-control mobile-date-input"  id="fromDate" value="06/15/2018" readonly="readonly"/>
      <input type="text" class="room-input" id="mobile-room-input" value="1間房間、2位大人、0位兒童" readonly="readonly"/>
        <div class="roomList" id="mobile-roomList">
          <div class="roomItem" id="rooms"><span class="minus">-</span>room<span class="plus">+</span></div>
          <div class="roomItem" id="adult"><span class="minus">-</span>大人<span class="plus">+</span></div>
          <div class="roomItem" id="children"><span class="minus">-</span>兒童<span class="plus">+</span></div>
        </div>
        <div class="more-search">
          <div class="mobile-search-text">進階搜尋</div>
          <div class="more-search-item">
            <div class="mobile-search-text"><span>每晚預算</span><span class="budget-num">NT$5000</span></div>
            <input type="range" min="0" max="10000" value="5000" class="budget-slider" id="myRange">
            
          </div>
          <div class="more-search-item">
            <div class="mobile-search-text">評分</div>
            <form name="form1" class="score-checkbox-list">
              <input class="score-checkbox" type="checkbox" name="c1" value="7" onclick="return chk(this);">
              <span class="checkbox-text">7+</span>
              <input class="score-checkbox" type="checkbox" name="c1" value="8" onclick="return chk(this);">
              <span class="checkbox-text">8+</span>
              <input class="score-checkbox" type="checkbox" name="c1" value="9" onclick="return chk(this);">
              <span class="checkbox-text">9+</span>
            </form>
          </div>
          <div class="more-search-item">
            <div class="mobile-search-text">星級</div>
            <i class="fas fa-star fa-2x mobile-star" id="s1"></i>
            <i class="fas fa-star fa-2x mobile-star" id="s2"></i>
            <i class="fas fa-star fa-2x mobile-star" id="s3"></i>
            <i class="fas fa-star fa-2x mobile-star" id="s4"></i>
            <i class="fas fa-star fa-2x mobile-star" id="s5"></i>
          </div>
        </div>
      <button id="mobile-Search-button" class="Search-button">Search</button>
    </div>
  </div>
  <div class="container">
    <div class="row">
        <div class="col col-md-3 left-side">
          <div class="fixed-left">
          <div class="more-search">
            <div class="search-text">進階搜尋</div>
            <div class="more-search-item">
              <span class="search-text">每晚預算</span><span class="search-text budget-num" >NT$5000</span>
              <input type="range" min="0" max="10000" value="5000" class="budget-slider" id="myRange2">
              
            </div>
            <div class="more-search-item">
              <div class="search-text">評分</div>
              <form name="form1" class="score-checkbox-list">
                <input class="score-checkbox" type="checkbox" name="c1" value="7" onclick="return chk(this);">
                <span class="checkbox-text">7+</span>
                <input class="score-checkbox" type="checkbox" name="c1" value="8" onclick="return chk(this);">
                <span class="checkbox-text">8+</span>
                <input class="score-checkbox" type="checkbox" name="c1" value="9" onclick="return chk(this);">
                <span class="checkbox-text">9+</span>
              </form>
            </div>
            <div class="more-search-item">
              <div class="search-text">星級</div>
              <i class="fas fa-star fa-2x web-star" id="ws1"></i>
              <i class="fas fa-star fa-2x web-star" id="ws2"></i>
              <i class="fas fa-star fa-2x web-star" id="ws3"></i>
              <i class="fas fa-star fa-2x web-star" id="ws4"></i>
              <i class="fas fa-star fa-2x web-star" id="ws5"></i>
            </div>
          </div>
          <p class="map-text">地圖找房</p>
          <div class="map-icon"></div>
          
        </div>
          <div class="map-pop-up">
              <button class="map-pop-up-canael">X</button>
              <div class="container">
                <div id="map-hotels-list" class="col col-md-5"></div>
                <div id="map-canvas" class="col col-md-7" style="height:90vh"></div>
              </div>
          </div>
        </div>
        <div class="col-md-9 right-side">
          <div class="hotels-list">
            <div class="favorite-pop-up">
                <div id="favorite-hotel"></div>
                <textarea id="favorite-memo" rows="4" cols="50" placeholder="Write some texts here..."></textarea>
                <div>
                  <button class="favorite-pop-up-submit">加為最愛</button>
                  <button class="favorite-pop-up-cancel">取消最愛</button>
                </div>
            </div>
          </div>
        </div>

        </div>
        <div class="pagenation">
          <button class="prev">Prev Page</button>
          <button class="next">Next Page</button>
        </div>
        </div>
    </div>
  </div>
@endsection

@section('script')
  <script src="./scripts/searchList.js"></script>
@endsection

