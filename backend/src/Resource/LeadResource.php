<?php

namespace App\Resource;

class LeadResource
{
    public ?string $uuid = null;
    public ?string $full_name = null;
    public ?string $birth_date = null;
    public ?string $email = null;
    public ?string $street = null;
    public ?string $street_number = null;
    public ?string $postal_code = null;
    public ?string $state = null;
    public ?string $city = null;
    public ?string $landline = null;
    public ?string $cellphone = null;
    public int $step = 0;
}
