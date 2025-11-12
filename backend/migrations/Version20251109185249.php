<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251109185249 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE lead CHANGE street street VARCHAR(255) DEFAULT NULL, CHANGE postal_code postal_code VARCHAR(8) DEFAULT NULL, CHANGE state state VARCHAR(255) DEFAULT NULL, CHANGE cellphone cellphone VARCHAR(11) DEFAULT NULL, CHANGE city city VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE lead CHANGE street street VARCHAR(255) NOT NULL, CHANGE postal_code postal_code VARCHAR(8) NOT NULL, CHANGE state state VARCHAR(255) NOT NULL, CHANGE cellphone cellphone VARCHAR(11) NOT NULL, CHANGE city city VARCHAR(255) NOT NULL');
    }
}
