<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateHotelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hotels', function (Blueprint $table) {
            $table->increments('id');
            $table->string('hotelId')->default('-1');
            $table->string('hotelName')->default('-1');
            $table->string('hotelUrl')->default('-1');
            $table->string('cityName')->default('-1');
            $table->double('latitude')->default('-1');
            $table->double('longitude')->default('-1');
            $table->string('images')->default('-1');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hotels');
    }
}
