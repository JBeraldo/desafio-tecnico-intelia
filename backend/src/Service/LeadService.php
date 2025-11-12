<?php

namespace App\Service;

use App\Dto\LeadDto;
use App\Mapper\LeadMapper;
use App\Repository\LeadRepository;
use App\Request\LeadRequest;

class LeadService {

    public function __construct(private LeadRepository $repository, private LeadMapper $mapper) {
    }

    function store(LeadRequest $leadRequest): string {
        $lead = $this->mapper::toEntity($leadRequest);
        $uuid = $this->repository->store($lead);
        return $uuid;
    }

    function update(LeadRequest $leadRequest): void {
        $lead = $this->repository->findOneBy(['uuid' => $leadRequest->uuid]);
        $lead = $this->mapper->toEntity($leadRequest,$lead);
        $this->repository->update($lead);
    }

    function find(string $uuid): LeadDto | null {
        $lead = $this->repository->findOneBy(['uuid' => $uuid]);
        $leadDto = $this->mapper::fromEntity($lead);
        return $leadDto;
    }
}