# StudyManager API 

Atividade concernente à disciplina de Desenvolvimento de API Back-end, associada à implementação de uma API RESTful para gerenciamento de usuários, cursos e matrículas, construída com TypeScript, Express e Prisma ORM sobre os princípios de Arquitetura Limpa e Clean Code. 

---

## Stack

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js 18+ |
| Linguagem | TypeScript 5 (`strict: true`) |
| Framework HTTP | Express 4 |
| ORM | Prisma 5 |
| Banco de dados | SQLite (trocável para PostgreSQL/MySQL alterando apenas o `datasource`) |
| Validação | Zod |

---

## Como executar

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env

# 3. Criar o banco e aplicar as migrações
npm run db:migrate

# 4. Gerar o Prisma Client (tipos do banco)
npm run db:generate

# 5. Subir a API em desenvolvimento (hot reload via ts-node-dev)
npm run dev

# ou, em produção: compilar e rodar o JavaScript gerado
npm run build
npm start
```

A API sobe em `http://localhost:3000/api`.

Scripts disponíveis:

| Script | O que faz |
|---|---|
| `npm run dev` | Sobe a API com hot reload direto do TypeScript |
| `npm run build` | Compila `src/` para `dist/` |
| `npm start` | Roda o build compilado (`dist/server.js`) |
| `npm run typecheck` | Verifica tipos sem gerar arquivos |
| `npm run db:migrate` | Cria e aplica migração |
| `npm run db:studio` | Abre o Prisma Studio |

Verificação rápida:

```bash
curl http://localhost:3000/api/health
```

---

## Estrutura de pastas

```
study-manager-api/
├── prisma/
│   ├── schema.prisma                 # Modelagem: User, Course, Enrollment
│   └── migrations/                   # Histórico versionado do banco
├── src/
│   ├── domain/                       # Camada mais interna, com regras e contratos
│   │   ├── entities/                 #   User.ts, Course.ts, Enrollment.ts
│   │   ├── errors/                   #   AppError, NotFoundError, ConflictError, ValidationError
│   │   └── repositories/             #   IUserRepository, ICourseRepository, IEnrollmentRepository
│   │
│   ├── application/                  # Casos de uso que orquestram as regras de negócio
│   │   ├── dtos/                     #   Tipos de entrada e saída dos casos de uso
│   │   └── usecases/
│   │       ├── user/                 #   Create, List, GetById, Update, Delete, GetUserCourses
│   │       ├── course/               #   Create, List, GetById, Update, Delete
│   │       └── enrollment/           #   Create, List, Delete
│   │
│   ├── infrastructure/               # Detalhes técnicos e implementações concretas
│   │   ├── database/prismaClient.ts  #   Instância única do Prisma
│   │   ├── mappers/                  #   Conversão de registro do ORM para entidade de domínio
│   │   └── repositories/             #   PrismaUserRepository, PrismaCourseRepository, ...
│   │
│   ├── presentation/                 # Camada de entrega HTTP
│   │   ├── controllers/              #   Adaptam requisição e resposta, sem regra de negócio
│   │   ├── routes/                   #   Declaração de endpoints
│   │   ├── middlewares/              #   validateRequest, asyncHandler, errorHandler, notFoundHandler
│   │   ├── validators/               #   Schemas Zod de entrada
│   │   └── http/                     #   ApiResponse (envelope JSON) e leitura de params
│   │
│   ├── container.ts                  # Composition root, com injeção de dependências
│   ├── app.ts                        # Montagem do Express (sem iniciar o servidor)
│   └── server.ts                     # Bootstrap, porta e shutdown gracioso
├── dist/                             # Saída do build (gerada por `npm run build`)
├── tsconfig.json
└── .env
```

### Justificativa da organização

A estrutura segue a regra de dependência da Arquitetura Limpa: as dependências apontam sempre de fora para dentro, nunca o contrário. O `domain`, formado por entidades e interfaces de repositório, é o núcleo e não importa Express, Prisma nem qualquer biblioteca externa, o que o torna testável isoladamente e imune a trocas de tecnologia. O `application` contém um caso de uso por operação, cada um dependendo apenas das interfaces declaradas no domínio; é ali que vivem as regras de negócio (e-mail único, matrícula não duplicada, existência de usuário e curso). O `infrastructure` implementa essas interfaces com Prisma e traduz registros do ORM em entidades de domínio através de mappers, isolando o restante do sistema do formato do banco. O `presentation` apenas adapta HTTP: valida a entrada, delega ao caso de uso e formata a resposta. Com TypeScript a regra deixa de ser convenção e passa a ser verificada pelo compilador, já que `PrismaUserRepository implements IUserRepository` quebra o build se o contrato for violado e nenhum arquivo de `domain` ou `application` importa tipos de Express ou do Prisma. Como toda a ligação entre abstrações e implementações concretas acontece em um único ponto (`container.ts`), trocar o SQLite por PostgreSQL, ou o Prisma por outro ORM, exige alterar somente a camada de infraestrutura, sem tocar em nenhuma regra de negócio.

---

## Modelagem do banco

```
┌──────────────────┐         ┌──────────────────────┐         ┌──────────────────┐
│      users       │         │     enrollments      │         │     courses      │
├──────────────────┤         ├──────────────────────┤         ├──────────────────┤
│ id          PK   │1       *│ id              PK   │*       1│ id          PK   │
│ name             ├────────►│ user_id         FK   │◄────────┤ title            │
│ email    UNIQUE  │         │ course_id       FK   │         │ description      │
│ created_at       │         │ enrolled_at          │         │ workload  (horas)│
└──────────────────┘         │ UNIQUE(user_id,      │         └──────────────────┘
                             │        course_id)    │
                             └──────────────────────┘
```

Relacionamentos:

- Um usuário possui muitas matrículas (`1:N`)
- Um curso possui muitas matrículas (`1:N`)
- Uma matrícula pertence a um usuário e a um curso
- `Enrollment` é a tabela associativa que resolve o `N:N` entre usuários e cursos
- A restrição `@@unique([userId, courseId])` garante, no nível do banco, que não existe matrícula duplicada
- `onDelete: Cascade` remove as matrículas quando o usuário ou o curso é excluído

---

## Endpoints

Prefixo comum: `/api`

### Health

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/health` | Verifica se a API está no ar |

### Usuários

| Método | Rota | Descrição | Sucesso |
|---|---|---|---|
| `POST` | `/api/users` | Cadastra usuário | `201` |
| `GET` | `/api/users` | Lista usuários | `200` |
| `GET` | `/api/users/:id` | Busca usuário por id | `200` |
| `PUT` | `/api/users/:id` | Atualiza usuário | `200` |
| `DELETE` | `/api/users/:id` | Remove usuário | `200` |
| `GET` | `/api/users/:id/courses` | Consulta relacional: usuário e cursos matriculados | `200` |

### Cursos

| Método | Rota | Descrição | Sucesso |
|---|---|---|---|
| `POST` | `/api/courses` | Cadastra curso | `201` |
| `GET` | `/api/courses` | Lista cursos | `200` |
| `GET` | `/api/courses/:id` | Busca curso por id | `200` |
| `PUT` | `/api/courses/:id` | Atualiza curso | `200` |
| `DELETE` | `/api/courses/:id` | Remove curso | `200` |

### Matrículas

| Método | Rota | Descrição | Sucesso |
|---|---|---|---|
| `POST` | `/api/enrollments` | Matricula usuário em curso | `201` |
| `GET` | `/api/enrollments` | Lista matrículas | `200` |
| `DELETE` | `/api/enrollments/:id` | Cancela matrícula | `200` |

---

## Exemplos de uso

### Criar usuário

`POST /api/users`

```json
{
  "name": "Ana Perini",
  "email": "ana@exemplo.com"
}
```

`201 Created`

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "name": "Ana Perini",
    "email": "ana@exemplo.com",
    "created_at": "2026-09-07T20:16:42.117Z"
  }
}
```

### Criar curso

`POST /api/courses`

```json
{
  "title": "Clean Architecture",
  "description": "Curso sobre arquitetura limpa aplicada a APIs.",
  "workload": 40
}
```

### Criar matrícula

`POST /api/enrollments`

```json
{
  "user_id": 1,
  "course_id": 1
}
```

`409 Conflict` quando a matrícula já existe:

```json
{
  "success": false,
  "message": "User is already enrolled in this course",
  "data": null
}
```

### Consulta relacional

`GET /api/users/1/courses`

```json
{
  "success": true,
  "message": "User courses retrieved successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "Ana Perini",
      "email": "ana@exemplo.com",
      "created_at": "2026-09-07T20:16:42.117Z"
    },
    "courses": [
      {
        "id": 1,
        "title": "Clean Architecture",
        "description": "Curso sobre arquitetura limpa aplicada a APIs.",
        "workload": 40,
        "enrolled_at": "2026-09-07T20:16:42.324Z"
      }
    ]
  }
}
```

> A consulta usa o relacionamento do ORM (`include: { enrollments: { include: { course: true } } }`), resolvendo usuário, matrículas e cursos em uma única ida ao banco.

---

## Padronização de respostas e erros

Toda resposta, de sucesso ou de falha, usa o mesmo envelope, construído em um único lugar (`ApiResponse`):

```json
{
  "success": false,
  "message": "User not found",
  "data": null
}
```

Erros de validação incluem o campo extra `errors` com o detalhe por atributo:

```json
{
  "success": false,
  "message": "Invalid request data",
  "data": null,
  "errors": [
    { "field": "name",  "message": "name must have at least 3 characters" },
    { "field": "email", "message": "email must be a valid address" }
  ]
}
```

### Códigos HTTP utilizados

| Código | Situação |
|---|---|
| `200 OK` | Consulta, atualização ou remoção bem-sucedida |
| `201 Created` | Recurso criado |
| `400 Bad Request` | JSON malformado ou violação de chave estrangeira |
| `404 Not Found` | Recurso ou rota inexistente |
| `409 Conflict` | E-mail já cadastrado ou matrícula duplicada |
| `422 Unprocessable Entity` | Payload ou parâmetro de rota inválido |
| `500 Internal Server Error` | Falha inesperada (detalhes ficam no log, nunca na resposta) |

### Como o tratamento de erros funciona

1. Os casos de uso lançam erros de domínio (`NotFoundError`, `ConflictError`, `ValidationError`), que já carregam o status HTTP correspondente.
2. O `asyncHandler` encaminha qualquer promise rejeitada para o middleware de erro, evitando requisições penduradas.
3. O `errorHandler` é o único ponto que converte exceção em resposta HTTP. Ele também traduz erros conhecidos do Prisma (`P2002` unicidade, `P2025` registro inexistente, `P2003` chave estrangeira) para erros de aplicação.
4. Erros não previstos viram `500` genérico: a mensagem interna vai para o log, nunca para o cliente.

---

## Regras de negócio implementadas

- E-mail de usuário é único, validado no caso de uso e garantido por constraint no banco
- E-mails são normalizados (`trim` e `lowercase`) pela entidade `User`
- Matrícula não pode ser duplicada para o mesmo par usuário e curso
- Matrícula exige que usuário e curso existam
- Carga horária do curso precisa ser um inteiro positivo
- Atualização parcial (`PUT`) exige ao menos um campo válido
- Excluir usuário ou curso remove as matrículas associadas (cascade)

---

## Clean Code aplicado

- Nomes reveladores de intenção: `ensureEmailIsAvailable`, `ensureEnrollmentIsNotDuplicated`, `findUserOrFail`
- Métodos curtos com responsabilidade única, já que cada caso de uso expõe um único `execute`
- Controllers sem regra de negócio: leem a requisição, delegam e devolvem a resposta
- Sem duplicação: envelope de resposta, validação e tratamento de erro centralizados
- Inversão de dependência: casos de uso recebem repositórios por construtor e conhecem apenas a interface
- Erros expressivos em vez de códigos mágicos espalhados pelo código
- Tipagem estática como contrato: `strict: true`, interfaces de repositório verificadas em compilação, tipos de entrada derivados dos schemas Zod (`z.infer`) e tipos do banco gerados pelo Prisma
