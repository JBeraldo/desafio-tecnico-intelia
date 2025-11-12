<?php

namespace App\Mapper;

use App\Resource\LeadResource;
use App\Entity\Lead;
use App\Request\LeadRequest;
use DateTimeImmutable;
use Symfony\Component\Uid\Uuid;

class LeadMapper
{
    /**
     * Maps a LeadRequest Resource to a Lead entity.
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
     * Maps a Lead entity to a LeadResource.
     */
    public static function fromEntity(Lead $lead): LeadResource
    {
        $resource = new LeadResource();

        $resource->uuid = $lead->getUuid()?->toString();
        $resource->full_name = $lead->getFullName();
        $resource->birth_date = $lead->getBirthDate()->format('Y-m-d');
        $resource->email = $lead->getEmail();
        $resource->street = $lead->getStreet();
        $resource->street_number = $lead->getStreetNumber();
        $resource->postal_code = $lead->getPostalCode();
        $resource->state = $lead->getState();
        $resource->city = $lead->getCity();
        $resource->landline = $lead->getLandline();
        $resource->cellphone = $lead->getCellphone();
        $resource->step = self::checkStep($resource);
        return $resource;
    }

    private static function checkStep(LeadResource $resource){
        $steps = 
        [
            "1" => !empty($resource->uuid),
            "2" => !empty($resource->street),
            "3" => !empty($resource->cellphone),
        ];

        $completed_steps = array_filter($steps, fn ($item) => !!$item);
        $max_step = max(array_keys($completed_steps));
        return $max_step;
    }   
}
