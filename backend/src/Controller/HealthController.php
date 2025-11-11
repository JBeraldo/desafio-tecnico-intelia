<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

final class HealthController extends AbstractController
{
    public function __construct(private ValidatorInterface $validator,private TranslatorInterface $translator) {
    }
    #[Route('/ping', name: 'app_ping')]
    public function index(): JsonResponse
    {
        return $this->json([
            'message' => 'running',
        ]);
    }
}
