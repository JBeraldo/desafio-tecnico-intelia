<?php

namespace App\Controller;

use App\Request\LeadRequest;
use App\Service\LeadService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

final class LeadController extends AbstractController
{

    public function __construct(private LeadService $service) {
    }

    #[Route('/lead', name: 'app_lead_store', methods: ['POST'])]
    public function store(#[MapRequestPayload(validationGroups: ['personal'])] LeadRequest $leadRequest): JsonResponse
    {
        $uuid = $this->service->store($leadRequest);

        return $this->json(["message" => 'Sucesso',"uuid"=>$uuid],Response::HTTP_CREATED);
    }

    #[Route('/lead/{uuid}', name: 'app_lead_find', methods: ['GET'])]
    public function find(string $uuid): JsonResponse
    {
        $lead = $this->service->find($uuid); 
        if($lead){
            return $this->json(["message" => 'Sucesso',"lead"=>$lead], Response::HTTP_OK);
        }
        return $this->json(["message" => 'Não Encontrado'], Response::HTTP_NOT_FOUND);
    }

    #[Route('/lead', name: 'app_lead_update', methods: ['PUT'])]
    public function update(#[MapRequestPayload(validationGroups: ['personal','address','contact'])] LeadRequest $leadRequest): JsonResponse
    {
        $this->service->update($leadRequest);

        return $this->json(["message" => 'Sucesso'],Response::HTTP_OK);
    }
}
