<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    //return view('welcome');
	return redirect("/home");
});

Auth::routes();

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
Route::get('/searchList', 'agodaController@getHotelsResult')->name('searchList');
Route::get('/hotel', 'agodaController@getHotelInfo')->name('hotel');
Route::post('/user/addFavoriteHotel', ['uses' => 'userController@addFavoriteHotel']);
Route::post('/user/addFavoriteRoom', 'userController@addFavoriteRoom');
Route::post('/user/deleteFavoriteHotel', ['uses' => 'userController@deleteFavoriteHotel']);
Route::post('/user/deleteFavoriteRoom', ['uses' => 'userController@deleteFavoriteRoom']);
Route::get('/user/favorites', ['uses' => 'userController@getFavorites']);
Route::get('/user', ['uses' => 'userController@getUserPage']);
Route::get('/updateEmail',['uses' => 'userController@updateEmail']);
Route::get('test/sendEmail', 'agodaController@mailTest');
Route::get('user/activate', 'userController@activateUser');
Route::post('history/add', 'userController@addHistory');
Route::post('history/delete', 'userController@deleteHistory');
Route::get('auth/facebook', 'Auth\AuthController@redirectToProvider');
Route::get('auth/facebook/callback', 'Auth\AuthController@handleProviderCallback');
Route::get('auth/google', 'Auth\AuthController@redirectToGoogleProvider');
Route::get('auth/google/callback', 'Auth\AuthController@handleGoogleProviderCallback');
Route::get('auth/github', 'Auth\AuthController@redirectToGithubProvider');
Route::get('auth/github/callback', 'Auth\AuthController@handleGithubProviderCallback');
Route::get('auth/twitter', 'Auth\AuthController@redirectToTwitterProvider');
Route::get('auth/twitter/callback', 'Auth\AuthController@handleTwitterProviderCallback');
Route::get('/updatePhone',['uses' => 'userController@updatePhone']);
Route::post('/updatePassword',['uses'=>'userController@updatePassword']);
Route::get('/registed', function (){return view('registed');});
Route::get('/getEmail', function (){return view('getEmail');});
Route::get('/notFound', function (){return view('notFound');});
