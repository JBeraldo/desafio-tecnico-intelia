<?php

namespace App\Mapper;

use App\Dto\LeadDto;
use App\Entity\Lead;
use App\Request\LeadRequest;
use Symfony\Component\Uid\Uuid;

class LeadMapper
{
    /**
     * Maps a LeadRequest DTO to a Lead entity.
     */
    public static function toEntity(LeadRequest $leadRequest, ?Lead $default = null): Lead
    {
        $lead = $default ? $default: new Lead();
        $lead->setFullName($leadRequest->full_name ?? '');
        $lead->setBirthDate($leadRequest->birth_date ?? null);
        $lead->setEmail($leadRequest->email ?? null);
        if ($leadRequest->step >= 1)
        {
            $lead->setUuid(Uuid::fromString($leadRequest->uuid ));
            $lead->setStreet($leadRequest->street ?? null);
            $lead->setStreetNumber($leadRequest->street_number ?? null);
            $lead->setPostalCode($leadRequest->postal_code ?? null);
            $lead->setState($leadRequest->state ?? null);
            $lead->setCity($leadRequest->city ?? null);
        }
        if($leadRequest->step == 2)
        {
            $lead->setLandline($leadRequest->landline ?? null);
            $lead->setCellphone($leadRequest->cellphone ?? null);
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
        $dto->step = ($dto->cellphone ? 3 : $dto->street) ? 2 : 1;

        return $dto;
    }
}
