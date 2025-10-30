<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Site extends Model
{
   // The primary key
   protected $primaryKey = 'sitenumber';

   // Disable auto-incrementing
   public $incrementing = false;

   // Sitenumber is a string (not numeric), set this to string
   protected $keyType = 'string';

   // Fillable columns
   protected $fillable = [
       'sitename',
       'sitenumber',
       'lat',
       'lon',
       'area',
       'installation_date',
   ];
}
