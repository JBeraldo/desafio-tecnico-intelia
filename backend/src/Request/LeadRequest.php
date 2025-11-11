<?php

namespace App\Request;

use Symfony\Component\Validator\Constraints as Assert;
use App\Validator\Constraints as Rule;

class LeadRequest
{
    #[Rule\Required(groups: ['address','contact'])]
    public ?string $uuid = null;
    #[Rule\Required(groups: ['personal'])]
    #[Assert\Length(max: 255, groups: ['personal'])]
    public ?string $full_name = null;
    #[Rule\Required(groups: ['personal'])]
    public ?\DateTimeImmutable $birth_date = null;
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
        constraints: [new Rule\Required(groups: ['address']),new Assert\Length(max: 255, groups: ['personal'])]
    )]
    public ?string $street_number = null;
    #[Assert\When(
        expression: 'this.step === 1',
        constraints: [new Rule\Required(groups: ['address'])]
    )]
    public ?string $postal_code = null;
    #[Assert\When(
        expression: 'this.step === 1',
        constraints: [new Rule\Required(groups: ['address'])]
    )]
    public ?string $state = null;
    #[Assert\When(
        expression: 'this.step === 1',
        constraints: [new Rule\Required(groups: ['address'])]
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
