@extends('layouts.app')
@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">{{ __('Register') }}</div>

                <div class="card-body">
					<p>We have sent an email to your email address. <br>
						Please activate your account through that email.<br>
						Thanks.
					</p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
