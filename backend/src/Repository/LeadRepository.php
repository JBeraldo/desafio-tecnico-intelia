<?php

namespace App\Repository;

use App\Entity\Lead;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\Types\ConversionException;
use Doctrine\Persistence\ManagerRegistry;
use Exception;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<Lead>
 */
class LeadRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Lead::class);
    }

    public function store(Lead $lead): string
    {
        $uuid = Uuid::v6();
        $lead->setUuid($uuid);
        $this->getEntityManager()->persist($lead);
        $this->getEntityManager()->flush();
        return $uuid->toString();
    }

    public function update(Lead $lead)
    {
        $this->getEntityManager()->persist($lead);
        $this->getEntityManager()->flush();
    }

    public function findOneByUuid($uuid): Lead | null 
    {
        try{
         
          $lead = $this->findOneBy(["uuid" => $uuid]);
        
          return $lead;
        }
        catch(ConversionException $e){
            return null;
        }
    }
}
