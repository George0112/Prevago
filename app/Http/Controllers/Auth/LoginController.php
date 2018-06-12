<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
		$this->redirectTo = url()->previous();
        $this->middleware('guest')->except('logout');
    }
	
	public function showLoginForm()
	{
    	if(!session()->has('url.intended'))
    	{
			if(parse_url(url()->previous(), PHP_URL_PATH) !== '/user/activate')
        	session(['url.intended' => url()->previous()]);
			//else 
        	//session(['url.intended' => '/']);
    	}
    	return view('auth.login');    
	}	

}
