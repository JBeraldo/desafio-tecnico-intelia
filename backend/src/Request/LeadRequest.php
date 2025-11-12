<?php

namespace App\Request;

use Symfony\Component\Validator\Constraints as Assert;
use App\Validator\Constraints as Rule;

class LeadRequest
{
    #[Rule\Required(groups: ['address','contact'])]
    #[Assert\Uuid(groups: ['address','contact'])]
    public ?string $uuid = null;
    #[Assert\Regex(
        pattern: '/\d/',
        match: false,
        groups: ['personal'],
        message: 'lead.name.no_digits',
    )]
    #[Rule\Required(groups: ['personal'])]
    #[Assert\Length(max: 255, groups: ['personal'])]
    public ?string $full_name = null;
    #[Rule\Required(groups: ['personal'])]
    #[Assert\DateTime(format:'Y-m-d',groups: ['personal'])]
    public ?string $birth_date = null;
    #[Rule\Required(groups: ['personal'])]
    #[Assert\Email(groups: ['personal'])]
    #[Assert\Length(max: 255, groups: ['personal'])]
    public ?string $email = null;
    #[Assert\When(
        expression: 'this.step === 1',
        constraints: [new Rule\Required(groups: ['address'])]
    )]
    public ?string $street = null;
    #[Assert\When(
        expression: 'this.step === 1',
        constraints: [
            new Rule\Required(groups: ['address']),
            new Assert\Length(max: 255, groups: ['personal']),
            new Assert\Regex(pattern: '/^\D+$/',match: false,groups: ['personal'], message: 'lead.regex.number')
        ]
    )]
    public ?string $street_number = null;
    #[Assert\When(
        expression: 'this.step === 1',
        constraints: [
            new Rule\Required(groups: ['address']),
            new Assert\Length(max: 8, groups: ['address']),
            new Assert\Regex(pattern: '/^\D+$/',match: false,groups: ['address'], message: 'lead.regex.number')
        ]
    )]
    public ?string $postal_code = null;
    #[Assert\When(
        expression: 'this.step === 1',
        constraints: [
            new Rule\Required(groups: ['address']),
            new Assert\Length(max: 2, groups: ['address']),
        ]
    )]
    public ?string $state = null;
    #[Assert\When(
        expression: 'this.step === 1',
        constraints: [
            new Rule\Required(groups: ['address']),
        ]
    )]
    public ?string $city = null;
    public ?string $landline = null;
    #[Assert\When(
        expression: 'this.step === 2',
        constraints: [new Rule\Required(groups: ['contact'])]
    )]
    public ?string $cellphone = null;
    #[Rule\Required]
    public int $step = 0;
}
