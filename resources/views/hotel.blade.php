@extends('layouts.master')

@section('style')
  <link rel="stylesheet" type="text/css" href="styles/hotel.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <script type="text/javascript">const hotelId={!! json_encode($hotelId)!!}</script>
  <script type="text/javascript">const checkInDate={!! json_encode($checkInDate)!!}</script>
  <script type="text/javascript">const hotelInfo={!! json_encode($hotelInfo)!!}</script>
  <script type="text/javascript">const isFavorite={!! json_encode($isFavorite)!!}</script>
@endsection

@section('content')
  <div class="loading">
    <span class="loading-text">Loading</span>
    <span class="al-1"></span>
    <span class="al-2"></span>
    <span class="al-3"></span>
    <span class="al-4"></span>
    <span class="al-5"></span>
    <span class="al-6"></span>
  </div>
  <div class="container-fluid gal-container">
    <div class="col-md-7 col-sm-12 co-xs-12 gal-item">
      <div class="box row1">
		<a href="#" data-toggle="modal" onclick="currentSlide(0)" data-target="#imageModal">
			<img src="" id="image0">
			<div class="middle">
				<div class="text"><span class="glyphicon glyphicon-search"></span> 查看所有相片</div>
			</div>
		</a>
      </div>
    </div>
    <div class="col-md-5 col-sm-6 co-xs-12 gal-item">
      <div class="box row1">
		<a href="#" data-toggle="modal" onclick="currentSlide(1)" data-target="#imageModal">
			<img src="" id="image1">
			<div class="middle">
				<div class="text"><span class="glyphicon glyphicon-search"></span> 查看所有相片</div>
			</div>
		</a>
      </div>
    </div>
    <div class="col-md-4 col-sm-6 co-xs-12 gal-item">
      <div class="box row2">
		<a href="#" data-toggle="modal" onclick="currentSlide(2)" data-target="#imageModal">
			<img src="" id="image2">
			<div class="middle">
				<div class="text"><span class="glyphicon glyphicon-search"></span> 查看所有相片</div>
			</div>
		</a>
      </div>
    </div>
    <div class="col-md-4 col-sm-6 co-xs-12 gal-item">
      <div class="box row2">
		<a href="#" data-toggle="modal" onclick="currentSlide(3)" data-target="#imageModal">
			<img src="" id="image3">
			<div class="middle">
				<div class="text"><span class="glyphicon glyphicon-search"></span> 查看所有相片</div>
			</div>
		</a>
      </div>
    </div>
    <div class="col-md-4 col-sm-6 co-xs-12 gal-item">
      <div class="box row2 search">
		<a href="#" data-toggle="modal" onclick="currentSlide(0)" data-target="#imageModal">
			<img src="styles/search.png" id="image4">
			<div class="middle4">
				<div class="text"><span class="glyphicon glyphicon-search"></span> 查看所有相片</div>
			</div>
		</a>
      </div>
    </div>
  </div>
  <div class="modal fade" id="imageModal" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title"></h4>
        </div>
        <div class="modal-body" id='slides'>
        </div>
        <div class="modal-footer" id='imageDemo'>
		  </div>
        </div>
      </div>
      
    </div>
  </div>
  <div class="container">
    <div class="row">
      <div class="col-sm-9" id="hotel">
		  <div class="hotelHeader">
		  <h2 class="hotelName"> </h2>
		  <div class="info hotelCity"><i class="material-icons">&#xe0c8;</i> </div>
		  </div>
		  <div class="row featureTable">
			<div class="featureTitle">
				人氣特色&服務
			</div>
		  </div>
		  <h3>客房選擇</h3>
		  <div class="info reviewTitle">旅客評分 <span></span></div>
		  
		  
		  
      </div>
      <div class="col-sm-3">
      <div class="panel panel-default text-center">
        <div class="panel-body">
          <p class="date"><strong>入住日期</strong> </p>
        </div>
        <div class="panel-footer">
          <a href="#" target="_blank" ><button class="btn btn-lg">預訂</button></a>
        </div>
      </div>
	  <div class="favorite">
		<a href="#" onclick='favorite()'><span class="label label-warning">加為最愛</span></a>
	  </div>
      </div>
    </div>
  </div>

  
  <div class="modal fade" id="priceModal" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title"></h4>
        </div>
        <div class="modal-body" id="chart">
			<div id="Plot"></div><!-- Price chart and Room chart will be drawn inside this DIV -->
        </div>
      </div>
      
    </div>
  </div>
  
@endsection

@section('script')
  <script src="./scripts/hotel.js"></script>
@endsection

