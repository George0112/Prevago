<?php

namespace App\Http\Controllers;

/*use App\User;
use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;*/
use Illuminate\Http\Request;
use DB;
use Auth;
use Validator;
use Hash;
use App\User;

class userController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth')->except('activateUser');
    }

	public function addFavoriteHotel(Request $request)
	{
		$user = Auth::user();
		$hotelId = $request['h'];
		$memo = $request['m'];
		if(!$hotelId && !$roomId) return 'fail';
		$result = DB::table('favorites')->insert([
			['userId' => $user['id'], 'hotelId' => $hotelId, 'memo' => $memo, "created_at" =>  \Carbon\Carbon::now('Asia/Taipei') ]
		]);
		if($result) return 'success';
		else return 'fail';
	}

	public function addFavoriteRoom(Request $request)
	{
		$user = Auth::user();
		$roomId = $request['r'];
		$memo = $request['m'];
		if(!$hotelId && !$roomId) return 'fail';
		$result = DB::table('favorites')->insert([
			['userId' => $user['id'], 'roomId' => $roomId, 'memo' => $memo, "created_at" =>  \Carbon\Carbon::now('Asia/Taipei') ]
		]);
		if($result) return 'success';
		else return 'fail';
	}

	public function deleteFavoriteHotel(Request $request)
	{
		$user = Auth::user();
		$hotelId = $request['h'];
		$result = DB::table('favorites')->where('hotelId', $hotelId)->where('userId', $user['id'])->delete();
		if($result) return 'success';
		else return 'fail';
	}
	
	public function deleteFavoriteRoom(Request $request)
	{
		$user = Auth::user();
		$roomId = $request['r'];
		$result = DB::table('favorites')->where('roomId', $roomId)->where('userId', $user['id'])->delete();
		if($result) return 'success';
		else return 'fail';
	}

	public function getFavorites(Request $request)
	{
		$user = Auth::user();
		$result = DB::table('favorites')->where('userId', $user['id'])->get();
		return json_encode($result);
	}

	public function getUserPage(Request $request)
	{
		$user = Auth::user();
		$favoriteHotels = DB::table('favorites')->where('userId', $user['id'])->whereNotNull('hotelId')->get();
		$favoriteRooms = DB::table('favorites')->where('userId', $user['id'])->whereNotNull('roomId')->get();
		$history = DB::table('history')->where('userId' , $user['id'])->orderBy('updated_at', 'desc')->get();

		return view('profile', ['phone'=>$user['phone'],'name'=>$user['name'],'favoriteHotels' => $favoriteHotels, 'favoriteRooms' => $favoriteRooms, 'history' => $history, 'email' => $user['email']]);
	}

	public function updateEmail(Request $request)
	{
		$email = $request['email'];
		$user = Auth::user();
		if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    		return 'fail';
		}
		DB::table('users')->where('id', $user['id'])->update(['email'=>$email]);
	}
	public function updatePhone(Request $request)
	{
		$phone = $request['phone'];
		$user = Auth::user();
		DB::table('users')->where('id', $user['id'])->update(['phone'=>$phone]);
	}

	public function activateUser(Request $request)
	{
		$token = $request['t'];
		$email = $request['e'];
		$user = DB::table('users')->where('email', $email)->get();
		if(!$token || !$email) return abort('404');
		if($user[0]->token == $token)
			$result = DB::table('users')->where('email', $email)->update(['status' =>  1]);
		if($result) return view('activateAccount');
		else return abort('404');
	}

	public function addHistory(Request $request)
	{
		$user = Auth::user();
		if(!$user) return 'fail';
		$id = $request['id'];
		$duplicate = DB::table('history')->where('userId', $user['id'])->where('hotelId', $id)->update(['updated_at' => \Carbon\Carbon::now()]);
		if(!$duplicate)
		$result = DB::table('history')->insert([
			['hotelId' => $id, 'userId' => $user['id'], 'created_at' => \Carbon\Carbon::now(), 'updated_at' => \Carbon\Carbon::now()]
		]);
		if($duplicate || $result) return 'success';
		else return 'fail';
	}
	public function updatePassword(Request $request){

		if(Auth::Check())
		{
		  $request_data = $request->All();
		  $validator = $this->admin_credential_rules($request_data);
		  if($validator->fails())
		  {	
			// $fail=array('error' => $validator->getMessageBag()->toArray());
			// return response()->json(array('error' => $validator->getMessageBag()->toArray()), 400);
		    return redirect('/user')->with('fail', 'The password confirmation and password must match.');
		  }
		  else
		  {  
			$current_password = Auth::User()->password;           
			if(Hash::check($request_data['current-password'], $current_password))
			{           
			  $user_id = Auth::User()->id;                       
			  $obj_user = User::find($user_id);
			  $obj_user->password = Hash::make($request_data['password']);;
			  $obj_user->save(); 
			  return redirect('/user')->with('status', 'Password updated!');
			}
			else
			{           
			//   $error = array('current-password' => 'Please enter correct current password');
			  //return response()->json(array('error' => $error), 400);   
			  return redirect('/user')->with('fail', 'Please enter correct current password');
			}
		  }        
		}
		else
		{
		  return redirect()->to('/');
		}
	}
	function admin_credential_rules(array $data)
	{
		$messages = [
			'current-password.required' => 'Please enter current password',
			'password.required' => 'Please enter password',
		];

		$validator = Validator::make($data, [
			'current-password' => 'required',
			'password' => 'required|same:password',
			'password_confirmation' => 'required|same:password',     
		], $messages);

		return $validator;
	}  

}
