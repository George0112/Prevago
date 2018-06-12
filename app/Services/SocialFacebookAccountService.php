<?php

namespace App\Services;
use App\SocialFacebookAccount;
use App\User;
use Laravel\Socialite\Contracts\User as ProviderUser;

class SocialFacebookAccountService
{
    public function createOrGetUser(ProviderUser $providerUser, $provider)
    {
        $account = SocialFacebookAccount::whereProvider($provider)
            ->whereProviderUserId($providerUser->getId())
            ->first();

        if ($account) {
            return $account->user;
        } else {

            $account = new SocialFacebookAccount([
                'provider_user_id' => $providerUser->getId(),
                'provider' => $provider
            ]);

			$email = $providerUser->getEmail();
			if(!$email) $email = '';
            $user = User::whereEmail($providerUser->getEmail())->first();
			
            if (!$user) {
                $user = User::create([
                    'email' => $email,
                    'name' => $providerUser->getName(),
                    'password' => md5(rand(1,10000)),
					'provider' => $provider,
					'status' => 1,
                ]);
            }

            $account->user()->associate($user);
            $account->save();

            return $user;
        }
    }
    public function createOrGetGoogleUser(ProviderUser $providerUser)
    {
        $account = SocialFacebookAccount::whereProvider('google')
            ->whereProviderUserId($providerUser->getId())
            ->first();

        if ($account) {
            return $account->user;
        } else {

            $account = new SocialFacebookAccount([
                'provider_user_id' => $providerUser->getId(),
                'provider' => 'google'
            ]);

            $user = User::whereEmail($providerUser->getEmail())->first();

            if (!$user) {

                $user = User::create([
                    'email' => $providerUser->getEmail(),
                    'name' => $providerUser->getName(),
                    'password' => md5(rand(1,10000)),
					'status' => 1,
                ]);
            }

            $account->user()->associate($user);
            $account->save();

            return $user;
        }
    }
    public function createOrGetGithubUser(ProviderUser $providerUser)
    {
        $account = SocialFacebookAccount::whereProvider('github')
            ->whereProviderUserId($providerUser->getId())
            ->first();

        if ($account) {
            return $account->user;
        } else {

            $account = new SocialFacebookAccount([
                'provider_user_id' => $providerUser->getId(),
                'provider' => 'github'
            ]);

            $user = User::whereEmail($providerUser->getEmail())->first();

            if (!$user) {

                $user = User::create([
                    'email' => $providerUser->getEmail(),
                    'name' => $providerUser->getName(),
                    'password' => md5(rand(1,10000)),
					'status' => 1,
                ]);
            }

            $account->user()->associate($user);
            $account->save();

            return $user;
        }
    }
    public function createOrGetTwitterUser(ProviderUser $providerUser)
    {
        $account = SocialFacebookAccount::whereProvider('twitter')
            ->whereProviderUserId($providerUser->getId())
            ->first();

        if ($account) {
            return $account->user;
        } else {

            $account = new SocialFacebookAccount([
                'provider_user_id' => $providerUser->getId(),
                'provider' => 'twitter'
            ]);
			if(!$providerUser->getEmail()) return redirect('getEmail');
            $user = User::whereEmail($providerUser->getEmail())->first();

            if (!$user) {

                $user = User::create([
                    'email' => $providerUser->getEmail(),
                    'name' => $providerUser->getName(),
                    'password' => md5(rand(1,10000)),
					'status' => 1,
                ]);
            }

            $account->user()->associate($user);
            $account->save();

            return $user;
        }
    }
}
