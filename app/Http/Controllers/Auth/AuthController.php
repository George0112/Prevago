<?php

namespace App\Http\Controllers\Auth;

use Socialite;
use App\Http\Controllers\Controller;
use App\Services\SocialFacebookAccountService;

class AuthController extends Controller
{
    /**
     * Redirect the user to the GitHub authentication page.
     *
     * @return Response
     */
    public function redirectToProvider()
    {
        return Socialite::driver('facebook')->redirect();
    }
    public function redirectToGoogleProvider()
    {
        return Socialite::driver('google')->redirect();
    }
    public function redirectToGithubProvider()
    {
        return Socialite::driver('github')->redirect();
    }
    public function redirectToTwitterProvider()
    {
        return Socialite::driver('twitter')->redirect();
    }

    /**
     * Obtain the user information from GitHub.
     *
     * @return Response
     */
    public function handleProviderCallback(SocialFacebookAccountService $service)
    {
        $user = $service->createOrGetUser(Socialite::driver('facebook')->user(), 'facebook');
		auth()->login($user);
		return redirect('/home');
        // $user->token;
    }
    public function handleGoogleProviderCallback(SocialFacebookAccountService $service)
    {
        $user = $service->createOrGetUser(Socialite::driver('google')->user(), 'google');
		auth()->login($user);
		return redirect('/home');
        // $user->token;
    }
    public function handleGithubProviderCallback(SocialFacebookAccountService $service)
    {
        $user = $service->createOrGetUser(Socialite::driver('github')->user(), 'github');
		auth()->login($user);
		return redirect('/home');
        // $user->token;
    }
    public function handleTwitterProviderCallback(SocialFacebookAccountService $service)
    {
        $user = $service->createOrGetUser(Socialite::driver('twitter')->user(), 'twitter');
		auth()->login($user);
		return redirect('/home');
        // $user->token;
    }
}
