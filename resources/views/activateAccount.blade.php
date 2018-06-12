@extends('layouts.master')
@section('style')
  <link rel="stylesheet" type="text/css" href="styles/login.css">
@endsection

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">{{ __('Login') }}</div>

                <div class="card-body">
                    <div class='main-body'>
                        <p>
                            You has successfully activate your account. Please click the button to login.
                        </p>
                        <a href='/login'>
                            <button class='btn btn-primary'>Login</button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
