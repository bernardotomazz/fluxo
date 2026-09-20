# Fluxo API

API REST local para gerenciamento financeiro pessoal. O projeto permite registrar receitas e despesas, organizar categorias, acompanhar metas e consultar um dashboard com dados consolidados.

## Tecnologias

- Java 21
- Spring Boot 3
- Spring Data JPA
- PostgreSQL
- Maven Wrapper
- JUnit 5 e Mockito

## Funcionalidades

- CRUD de transacoes, categorias e metas
- Filtros por nome, tipo, categoria, valor e periodo
- Dashboard com resumo mensal, comparativo de economia, gastos por categoria e ultimas transacoes
- Validacao de dados com Bean Validation
- Tratamento centralizado de erros
- Regra que impede usar uma categoria de despesa em uma receita, e vice-versa
- Regra que impede excluir uma categoria que ainda possui transacoes vinculadas

## Uso local

Esta API foi desenvolvida para uso local e nao possui autenticacao ou gestao de usuarios. O banco PostgreSQL pode permanecer local; nao ha necessidade de migrar para SQLite.

O CORS atual libera o frontend local em `http://localhost:5173`.

## Requisitos

- JDK 21
- PostgreSQL em execucao

Crie o banco de dados local:

```sql
CREATE DATABASE fluxo;
```

## Configuracao

Use `src/main/resources/application-exemplo.properties` como referencia e crie um arquivo local chamado `src/main/resources/application.properties` com suas credenciais:

```properties
spring.application.name=fluxo
spring.datasource.url=jdbc:postgresql://localhost:5432/fluxo
spring.datasource.username=SEU_USUARIO
spring.datasource.password=SUA_SENHA
spring.jpa.hibernate.ddl-auto=update
```

O arquivo `application.properties` esta no `.gitignore` e nao deve ser enviado ao GitHub.

## Executar

No diretorio do backend:

```powershell
.\mvnw.cmd spring-boot:run
```

A API inicia em `http://localhost:8080`.

## Testes

```powershell
.\mvnw.cmd test
```

Os testes unitarios usam Mockito para substituir repositorios e servicos dependentes, validando regras de negocio sem acessar o banco. O teste de contexto do Spring ainda inicia a aplicacao e requer o PostgreSQL local configurado.

## Endpoints principais

| Recurso | Rotas |
| --- | --- |
| Transacoes | `GET`, `POST` `/transacoes`; `GET`, `PUT`, `DELETE` `/transacoes/{id}` |
| Categorias | `GET`, `POST` `/categorias`; `GET`, `PUT`, `DELETE` `/categorias/{id}` |
| Metas | `GET`, `POST` `/metas`; `GET`, `PUT`, `DELETE` `/metas/{id}` |
| Dashboard | `GET /dashboard` |

Ao tentar excluir uma categoria com transacoes vinculadas, a API retorna `409 Conflict`.

## Estrutura

```text
controller/      Endpoints HTTP
service/         Regras de negocio
repository/      Persistencia com JPA
entity/          Entidades do banco
dto/             Contratos de entrada e saida
mapper/          Conversao entre DTOs e entidades
exceptions/      Excecoes e tratamento global
specification/   Filtros dinamicos
```
