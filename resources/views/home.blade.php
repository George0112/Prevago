@extends('layouts.master')

@section('style')
  <link rel="stylesheet" type="text/css" href="styles/index.css">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">
@endsection

@section('content')
<div class="container">
  <h1 class="title">Prevago</h1>
  <p class="description">帶您再最合適的時間訂房!</p>
  <div class="row">
    <div class="col col-md-6">
      
        <input type="text" class="name-input left-input" placeholder="Country" />
          <div class="suggestList"></div>
        <input type="text" class="form-control date-input left-input"  id="fromDate" value="06/07/2018" readonly="readonly"/>
        <input type="text" class="room-input left-input" value="1間房間、2位大人、0位兒童" readonly="readonly"/>
          <div class="roomList">
            <div class="roomItem" id="rooms"><span class="minus">-</span>room<span class="plus">+</span></div>
            <div class="roomItem" id="adult"><span class="minus">-</span>大人<span class="plus">+</span></div>
            <div class="roomItem" id="children"><span class="minus">-</span>兒童<span class="plus">+</span></div>
          </div>
        <button class="Search-button">Search</button>
      
      <div class="moreSearch-toggle">More Search</div>
    </div>
    <div class="col col-md-6">
    
      <div class="more-search">
        <div class="more-search-item">
          <span class="search-text">每晚預算</span>
          <input type="range" min="0" max="10000" value="5000" class="budget-slider" id="myRange">
          <span class="search-text" id="budget-num">NT$5000</span>
        </div>
        <div class="more-search-item">
          <span class="search-text">評分</span>
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
          <span class="search-text">星級</span>
          <i class="fas fa-star fa-2x" id="s1"></i>
          <i class="fas fa-star fa-2x" id="s2"></i>
          <i class="fas fa-star fa-2x" id="s3"></i>
          <i class="fas fa-star fa-2x" id="s4"></i>
          <i class="fas fa-star fa-2x" id="s5"></i>
          <span class="search-text">以上</span>
        </div>
      </div>
    </div>
  </div>
</div>
@endsection

@section('script')
  <script src="./scripts/index.js"></script>
@endsection

