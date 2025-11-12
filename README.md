## 📋 Sobre o Projeto

Este é um sistema de cadastro de leads em múltiplas etapas para o evento Intelia 2025. A aplicação utiliza uma arquitetura full-stack containerizada com:

- **Frontend**: Angular 20 com Material Design 3, Tailwind CSS
- **Backend**: Symfony 7.3 com Doctrine ORM
- **Database**: MariaDB 11.4.8
- **Proxy**: Nginx 1.24/1.28
- **Runtime**: PHP 8.4 FPM com OPCache JIT

---

## 🚀 Quick Start

### ⚙️ Pré-requisitos

- Docker & Docker Compose instalados
- Make instalado
- Git

### 📦 Instalação e Execução

#### **Opção 1: Com Make (Recomendado)**

```bash
# Clone o repositório
git clone <seu-repo>
cd desafio-tecnico-intelia

#clone as variaveis de ambiente padrão e as altere os valores se nescessário
cp backend/.env backend/.env.local

# Inicie em modo desenvolvimento
make dev

# Para parar os containers
make stop

# Inica em modo produção(Angular estático + Backend Otimizado)
make prod
---

## 🛠️ Configuração

### Variáveis de Ambiente

Crie .env.local:

```env
APP_ENV=dev
APP_DEBUG=1
APP_SECRET=seu-secret-aleatorio

DB_USERNAME=default_user
DB_DATABASE=default_database
DB_PASSWORD=!changeMe!
DB_ROOT_PASSWORD=!changeMe!

DEFAULT_URI=http://localhost
CORS_ALLOW_ORIGIN='^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$'
```

**Para Produção** (`APP_ENV=prod`):
- Defina `APP_DEBUG=0`
- Use senhas fortes para o banco de dados
- Configure um `APP_SECRET` seguro

---

## 🌐 Acesso à Aplicação

Depois de executar `make dev`, acesse:

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | `http://localhost:4200` | Aplicação Angular |
| **API** | `http://localhost/api/v1` | Backend Symfony |
| **Nginx** | `http://localhost` | Proxy reverso |
| **MariaDB** | `localhost:3306` | Banco de dados |

---

## 📁 Estrutura do Projeto

```
├── frontend/                      # Angular 20 app
│   ├── src/
│   │   ├── app/
│   │   │   ├── features/         # Módulos de features
│   │   │   ├── shared/           # Componentes compartilhados
│   │   │   └── layouts/          # Layouts reutilizáveis
│   │   └── styles/               # Estilos globais (SCSS)
│   └── package.json
│
├── backend/                       # Symfony 7.3 API
│   ├── src/
│   │   ├── Controller/           # Endpoints REST
│   │   ├── Service/              # Lógica de negócio
│   │   ├── Entity/               # Entidades Doctrine
│   │   ├── Repository/           # Acesso ao banco
│   │   └── Mapper/               # Resources e conversão
│   ├── migrations/               # Migrations Doctrine
│   ├── config/                   # Configuração Symfony
│   └── composer.json
│
├── docker/                        # Configurações Docker
│   ├── nginx/                    # Configs Nginx
│   └── php/                      # Configs PHP/FPM
│
├── docker-compose.yml            # Produção
├── docker-compose.dev.yml        # Desenvolvimento
├── Makefile                       # Automação
└── README.md
```

---

## 🎯 Fluxo da Aplicação

A aplicação segue um fluxo multi-step para registro de leads:

### **Step 1: Dados Pessoais**
- Nome Completo
- Email
- Data de Nascimento

### **Step 2: Endereço**
- CEP (com busca automática via ViaCEP)
- Rua
- Número
- Cidade
- Estado (UF)

### **Step 3: Contato**
- Celular (obrigatório)
- Telefone Fixo (opcional)

### **Step 4: Confirmação**
- Resumo e confirmação do cadastro

---

## 🔌 API REST

### Endpoints Principais

#### **POST** `/api/v1/lead` - Criar Lead
```bash
curl -X POST http://localhost/api/v1/lead \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "João Silva",
    "email": "joao@example.com",
    "birth_date": "1990-05-15",
    "step": 0
  }'
```

**Response (201 Created):**
```json
{
  "message": "Sucesso",
  "uuid": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### **PUT** `/api/v1/lead` - Atualizar Lead
```bash
curl -X PUT http://localhost/api/v1/lead \
  -H "Content-Type: application/json" \
  -d '{
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "full_name": "João Silva",
    "email": "joao@example.com",
    "birth_date": "1990-05-15",
    "street": "Rua A",
    "street_number": "123",
    "postal_code": "01310100",
    "city": "São Paulo",
    "state": "SP",
    "step": 1
  }'
```

#### **GET** `/api/v1/lead/{uuid}` - Buscar Lead
```bash
curl http://localhost/api/v1/lead/550e8400-e29b-41d4-a716-446655440000
```

**Response (200 OK):**
```json
{
  "message": "Sucesso",
  "lead": {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "full_name": "João Silva",
    "email": "joao@example.com",
    "birth_date": "1990-05-15",
    "step": 0
  }
}
```
### Backend (Symfony)

```bash
# Acessar container PHP
docker compose exec backend bash

# Rodar migrations
php bin/console doctrine:migrations:migrate

# Limpar cache
php bin/console cache:clear
```

---

## 📊 Banco de Dados

### Schema Principal: `lead`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT | Primary Key |
| `uuid` | UUID | Identificador único (v6) |
| `full_name` | VARCHAR(255) | Nome completo |
| `birth_date` | DATETIME | Data de nascimento |
| `email` | VARCHAR(255) | Email do lead |
| `street` | VARCHAR(255) | Nome da rua/avenida |
| `street_number` | VARCHAR(10) | Número do endereço |
| `postal_code` | VARCHAR(8) | CEP |
| `city` | VARCHAR(255) | Cidade |
| `state` | VARCHAR(2) | UF |
| `cellphone` | VARCHAR(11) | Celular |
| `landline` | VARCHAR(10) | Telefone fixo |
| `created_at` | DATETIME | Data de criação |
| `updated_at` | DATETIME | Data de atualização |

## 📚 Tecnologias Utilizadas

### Frontend
- **Angular 20** - Framework JavaScript moderno
- **Angular Material 20** - Componentes UI
- **Tailwind CSS 4** - Utility-first CSS
- **TypeScript 5.9** - Tipagem estática
- **RxJS 7.8** - Programação reativa
- **ngx-mask** - Máscaras de entrada
- **date-fns** - Manipulação de datas

### Backend
- **Symfony 7.3** - Framework PHP
- **Doctrine ORM 3.5** - Object-relational mapping
- **PHP 8.4** - Runtime
- **Composer 2.7** - Gerenciador de dependências

### Infraestrutura
- **Docker & Docker Compose** - Containerização
- **Nginx 1.24/1.28** - Proxy reverso
- **MariaDB 11.4.8** - Banco de dados
- **PHP-FPM** - FastCGI Process Manager

---

## 📄 Licença

Proprietary - Desenvolvido para Intelia

