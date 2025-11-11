<?php

namespace App\Mapper;

use App\Dto\LeadDto;
use App\Entity\Lead;
use App\Request\LeadRequest;
use DateTimeImmutable;
use Symfony\Component\Uid\Uuid;

class LeadMapper
{
    /**
     * Maps a LeadRequest DTO to a Lead entity.
     */
    public static function toEntity(LeadRequest $source, ?Lead $target = null): Lead
    {
        $lead = $target ? $target: new Lead();
        if($source->uuid)
        {
            $lead->setUuid(Uuid::fromString($source->uuid));
        }
        $lead->setFullName($source->full_name ?? $lead->getFullName());
        $lead->setBirthDate(new DateTimeImmutable($source->birth_date) ?? $lead->getBirthDate());
        $lead->setEmail($source->email ?? $lead->getEmail());
        if ($source->step >= 1)
        {
            $lead->setStreet($source->street ?? $lead->getStreet());
            $lead->setStreetNumber($source->street_number ?? $lead->getStreetNumber());
            $lead->setPostalCode($source->postal_code ?? $lead->getPostalCode());
            $lead->setState($source->state ?? $lead->getState());
            $lead->setCity($source->city ?? $lead->getCity());
        }
        if($source->step == 2)
        {
            $lead->setLandline($source->landline ?? $lead->getLandline());
            $lead->setCellphone($source->cellphone ?? $lead->getCellphone());
        } 
        return $lead;
    }

    /**
     * Maps a Lead entity to a LeadDto.
     */
    public static function fromEntity(Lead $lead): LeadDto
    {
        $dto = new LeadDto();

        $dto->uuid = $lead->getUuid()?->toString();
        $dto->full_name = $lead->getFullName();
        $dto->birth_date = $lead->getBirthDate()->format('Y-m-d');
        $dto->email = $lead->getEmail();
        $dto->street = $lead->getStreet();
        $dto->street_number = $lead->getStreetNumber();
        $dto->postal_code = $lead->getPostalCode();
        $dto->state = $lead->getState();
        $dto->city = $lead->getCity();
        $dto->landline = $lead->getLandline();
        $dto->cellphone = $lead->getCellphone();
        $dto->step = self::checkStep($dto);
        return $dto;
    }

    private static function checkStep(LeadDto $dto){
        $steps = 
        [
            "1" => !empty($dto->uuid),
            "2" => !empty($dto->street),
            "3" => !empty($dto->cellphone),
        ];

        $completed_steps = array_filter($steps, fn ($item) => !!$item);
        $max_step = max(array_keys($completed_steps));
        return $max_step;
    }   
}
