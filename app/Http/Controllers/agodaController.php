<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use Auth;

use Mail;
Use App\Mail\Message;

class agodaController extends Controller
{
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('home');
    }
	public function getHotelsQuantity()
	{
		return DB::table('hotels')->select('id')->count();
	}
	public function getHotelInfo(Request $request)
	{
		$id = $request['hotelId'];
    $checkInDate = $request['checkInDate'];
    $isFavorite = 0;
		$hotelInfo = json_encode(DB::table('hotels')->where('hotelId', $id)->get());
    if($user = Auth::user()){
				$isFavorite = DB::table('favorites')->where('userId', $user['id'])->where('hotelId', $id)->count();
		}
    return view('hotel', ['isFavorite' => $isFavorite,'hotelId' => $id, 'checkInDate' => $checkInDate, 'hotelInfo' => $hotelInfo]);
	}
	public function getRoomsQuantity()
	{
		return DB::table('rooms')->select('id')->count();
	}
	public function getPricesQuantity()
	{
		return DB::table('prices')->select('id')->count();
	}
	public function getRoomsResult(Request $request)
	{
		//input h = hotelId, c = check in date. E.G. 2018-10-10
		$hotelId = $request['h'];
		$checkInDate = $request['c'];
		if(!$hotelId) return 'fail';
		$result = DB::table('rooms')
			->join('prices', 'rooms.id', '=', 'prices.roomId')
			->where('rooms.hotelId', $hotelId)->select('rooms.*')->distinct()->get();
		foreach ($result as $room)
		{
			// TODO highest and lowest prics.	
		}
		return json_encode($result);
	}
	public function getHotelsResult(Request $request)
	{
		//input c = cityId, o = objectId
		//output = hotel list
		$checkInDate = $request['checkInDate'];
		$objectId = $request['objectId'];
		$cityId = $request['cityId'];
		$adults = $request['adults'];
		$rooms = $request['rooms'];
		$children = $request['children'];
		$filter = $request['filter'];
		$hotelName = $request['hotelName'];
		$starRating = str_split($request['starRating']);
		$max = $request['max'];
		$locationScore = str_split($request['LocationScore']);
		$searchType = $request['searchType'];
		if(!$searchType)$searchType = 1;
		$str = $request['resultUrl'];
		parse_str($str, $output);
		if($searchType == 4)
			return redirect('/hotel?hotelId='.$str.'&checkInDate='.$checkInDate);
		$page = $request['page'];
		if(!$objectId && !$cityId) return view('notFound');
		$url = 'https://www.agoda.com/api/zh-tw/Main/GetSearchResultList';
		$ch=curl_init();

		$matchHotelId = DB::table('hotels')->where('hotelName', 'like', '%'.$hotelName.'%')->select('hotelId')->get();
		
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type: application/json;charset=utf-8'));	
		curl_setopt($ch , CURLOPT_URL , $url);
		$data=array("IsPollDmc"=>false,"SearchType"=>$searchType,"ObjectID"=>$objectId,"CityId"=> $cityId,"Latitude"=>0,"Longitude"=>0,"Radius"=>0,"RectangleSearchParams"=>null, "Filters" => ["HotelName" => "", "StarRating" => $starRating, "LocationScore" => $locationScore, "PriceRange" => ["Min" => 0,"Max" => $max,"IsHavePriceFilterQueryParamter" => false]], "PageNumber"=> $page, "PageSize"=>50,"SortOrder"=>1,"CountryId"=>140,"IsAllowYesterdaySearch"=>true,"CultureInfo"=>"zh-TW","UnavailableHotelId"=>0,"HasFilter"=>false,"Adults"=>$adults,"Children"=>$children,"Rooms"=>$rooms,"CheckIn"=>$checkInDate,"LengthOfStay"=>1,"ChildAges"=>[],"DefaultChildAge"=>8,
					"ChildAgesStr"=>null,"IsDateless"=>false,"CheckboxType"=>0);
		$postData=json_encode($data);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
		$result = curl_exec($ch);
		curl_close($ch);
		$jresult = json_decode($result,true);
		$jresult['info'] =  ['checkInDate' => $checkInDate, 'objectId' => $objectId, 'cityId' => $cityId, 'adults' => $adults, 'rooms' => $rooms, 'children' => $children, 'hotelName' => $hotelName, 'starRating' => $starRating,
			'max' => $max, 'locationScore' => $locationScore, 'page' => $page];
		if($matchHotelId);
		$jresult['matchHotelId'] = $matchHotelId;
		if($user = Auth::user()){
			foreach ($jresult['ResultList'] as $key=>$list){
				$isFavorite = DB::table('favorites')->where('userId', $user['id'])->where('hotelId', $list['HotelID'])->count();
				$jresult['ResultList'][$key]['isFavorite'] = $isFavorite;
			}
		}
		//return $jresult;
		if(!$user) $user = 0;
		else $user = 1;
		return view('searchList', ['result' => $jresult, 'isLogin' => $user]);
		
	}
	public function getPricesResult(Request $request)
	{
		$roomId = $request['r'];
		$checkInDate = $request['c'];
		if(!$roomId || !$checkInDate) return 'fail';
		$result = DB::table('prices')->where('roomId', $roomId)->select()->where('checkInDate', $checkInDate)->orderBy('checkInDate', 'desc')->get();
		return json_encode($result);
	}
	public function getCityId(Request $request)
	{
		$search=$request['t'];
		if(!$search) return 'fail';
		$ch = curl_init();
		$url='https://www.agoda.com/Search/Search/GetUnifiedSuggestResult/3/20/1/0/zh-tw/?searchText='.$search.'&guid=8adcd80d-c0ea-4311-800c-710cd2e8799e&origin=TW&cid=-1&pageTypeId=1&logtime=Mon%20Jun%2004%202018%2013%3A38%3A36%20GMT%2B0800%20(CST)&logTypeId=1&isHotelLandSearch=true';
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('x-requested-with: XML-HttpRequest'));
		curl_setopt($ch , CURLOPT_URL , $url);
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
		$result = curl_exec($ch);
		curl_close($ch);
		$json_a = json_decode($result, true);
		//echo $json_a['ViewModelList'][0]['ObjectId'];

		return $json_a;
	}
  public function getHotelData(Request $request)
	{
    $hotelId = $request['hotelId'];
    $ch = curl_init();
		$url='https://www.agoda.com/newsite/zh-tw/pageparams/property?hotel_id='.$hotelId;
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('x-requested-with: XML-HttpRequest'));
		curl_setopt($ch , CURLOPT_URL , $url);
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
		$result = curl_exec($ch);
		curl_close($ch);
		$json_a = json_decode($result, true);
    $result = [];
	if($json_a['aboutHotel'])
    $result['aboutHotel'] = $json_a['aboutHotel'];
	//if($json_a['essentialInfo'])
    //$result['essentialInfo'] = $json_a['essentialInfo'];
    $result['featuresYouLove'] = $json_a['featuresYouLove'];
	if(array_key_exists("masterRoomInfo", $json_a))
    $result['masterRoomInfo'] = $json_a['masterRoomInfo'];
    $result['hotelInfo'] = $json_a['hotelInfo'];
    $result['mosaicInitData'] = $json_a['mosaicInitData'];
    $result['reviews'] = $json_a['reviews'];

    return $result;
	}
	
}
