<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::get('/hotels/num', ['uses' => 'agodaController@getHotelsQuantity']);
Route::get('/hotels/info', 'agodaController@getHotelInfo');
// input hotelId
Route::get('/rooms/num', ['uses' => 'agodaController@getRoomsQuantity']);
Route::get('/prices/num', ['uses' => 'agodaController@getPricesQuantity']);
//Route::post('/hotels/result', ['uses' => 'agodaController@getHotelsResult']);
		//input c = cityId, o = objectId
		//output = hotel list
Route::get('/rooms/result',['uses' => 'agodaController@getRoomsResult']);
        //input h = hotelId
Route::get('/prices/result', ['uses' => 'agodaController@getPricesResult']);
        //input r = roomId, c = check in date  E.G. 2018-10-10
Route::get('/city/id',['uses' => 'agodaController@getCityId']);
		//input t = searchText
		//output search result
Route::post('/user/profile/email', ['uses' => 'UserController@updateEmail']);
		//input email = new email
Route::get('/hotel/id', ['uses' => 'agodaController@getHotelData']);
		//input hotelId = hotelId
