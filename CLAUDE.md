# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Phoenix Gym is an ASP.NET Core 7.0 gym-management system (client academic project, Spanish domain
language: `Cliente`, `Entrenador`, `Recepcionista`, `Administrador`, `Rutina`, `Mensualidad`, etc.).
It ships as two separately-runnable web apps plus two internal class libraries, all in one solution:

- **API** (`API/`) — ASP.NET Core Web API, JWT-secured, this is where almost all business logic is
  actually invoked from. Runs on `https://localhost:7053`.
- **MVC** (`MVC/`) — ASP.NET Core MVC app that serves the Razor views/HTML shell. Its controllers
  mostly just `return View()`; the real data operations happen client-side: static JS under
  `MVC/wwwroot/js/Pages/<Role>/*.js` calls the API via `fetch` against `API_URL_BASE =
  "https://localhost:7053/api"`. Runs on `https://localhost:7021`.
- **BusinessLayer** — business logic (`*Manager` classes), one per domain entity.
- **DataAccess** — data access (`Crud/*CrudFactory`, `Mapper/*Mapper`, `Dao/SqlOperation`), talks to
  SQL Server via stored procedures.
- **DTO** — shared plain data classes referenced by every other layer.

Project reference graph (note the direction): `API → BusinessLayer → DataAccess → DTO`, and
`MVC → DataAccess → DTO` directly (MVC does not reference BusinessLayer). Unusually,
`BusinessLayer` also references `MVC` (for `MVC.Models`), and `API` controllers reference
`MVC.Models` too — so MVC is a project dependency, not just a top-level app.

## Build / run

Requires the .NET 7 SDK and Visual Studio-style user secrets configured per project (no `dotnet`
CLI was available in this sandbox to verify build output — check tool availability before assuming
these commands work as-is).

```bash
# Restore + build the whole solution
dotnet restore Proyecto2.PhoenixFitness.sln
dotnet build Proyecto2.PhoenixFitness.sln

# Run the API (must be running for MVC pages that call it to work)
dotnet run --project API/API.csproj

# Run the MVC front end (separate terminal/process)
dotnet run --project MVC/MVC.csproj
```

There is no test project in the solution and no lint config — there is nothing to run for
"test"/"lint" tasks.

### Required secrets / config

`API`, `MVC`, and `DataAccess` each declare a `UserSecretsId` in their `.csproj`. At minimum, the
data layer needs a SQL Server connection string secret named `_connectionString` (see
`DataAccess/Properties/serviceDependencies.local.json`, which points at an Azure SQL database
`PhoenixFitness`). `Jwt:Key` (referenced in `API/Program.cs`) is also expected as a secret/config
value and is not present in `appsettings.json`.

**Note:** `API/appsettings.json` and `MVC/appsettings.json` currently contain live-looking
Cloudinary and PayPal (sandbox) credentials committed in plaintext. Treat these as already
compromised/rotate-worthy rather than copying the pattern for new secrets — use user secrets or
environment variables instead.

### Known gap

`DataAccess/Dao` only contains `SqlOperation.cs`. Every `*CrudFactory` (in `DataAccess/Crud/`)
references a `SqlDao` class (e.g. `SqlDao.GetInstance()`, `dao.ExecuteStoredProcedure(...)`) that
does not exist anywhere in this repo. The DataAccess project will not compile until that class is
added/restored — check for it before assuming a fresh `dotnet build` will succeed.

## Architecture: the CRUD pipeline

Every domain entity (Cliente, Entrenador, Rutina, Mensualidad, Pago, Sinpe, ...) follows the same
four-layer pattern. Reading one full vertical slice (e.g. `Cliente`) is the fastest way to
understand how to add or modify any other entity:

1. **Controller** (`API/Controllers/<Entity>Controller.cs`) — `[Route("api/[controller]/[action]")]`
   ASP.NET controller. `new`s up a Manager directly per call (no DI container registration for
   these), calls a method, and wraps the result in `DTO/ApiResponse.cs` with a numeric
   `StatusCode` string and a `Message`. Return codes from the manager (`0`, `-1`, `-2`, ...) are
   translated into ad hoc HTTP-ish status strings/messages case-by-case — there's no shared
   convention beyond "0 is success."
2. **Manager** (`BusinessLayer/<Entity>Manager.cs`) — thin orchestration layer; `new`s up the
   matching `<Entity>CrudFactory` and calls it. This is where business rules (e.g. duplicate
   email/cédula checks) live, expressed as int return codes rather than exceptions.
3. **CrudFactory** (`DataAccess/Crud/<Entity>CrudFactory.cs`) — extends abstract `CrudFactory`
   (`DataAccess/Crud/CrudFactory.cs`), which defines a large fixed set of abstract
   `Create/Update/Delete/RetrieveXxx` methods (most entities only implement the subset they need
   and no-op/throw on the rest). Builds a `SqlOperation` via the entity's `Mapper`, then executes it
   through the shared `SqlDao` singleton (`dao.ExecuteStoredProcedure` /
   `ExecuteStoredProcedureWithQuery`).
4. **Mapper** (`DataAccess/Mapper/<Entity>Mapper.cs`) — implements `ICrudStatements` (builds a
   `SqlOperation` naming a stored procedure and its `@param`s) and `IObjectMapper` (turns a
   `Dictionary<string,object>` row back into a DTO). All persistence is via SQL Server **stored
   procedures**, never inline SQL/EF — the procedures themselves live as `.sql`/`.txt` scripts under
   `SQL/Scripts/` (named like `<TABLE>-<procName>-<date>.txt`) and must be applied to the DB
   manually; there is no migrations tool.
5. **DTO** (`DTO/<Entity>.cs`) — plain data class, usually extending `DTO/BaseClass.cs` (has `Id`)
   or `DTO/BaseUserClass.cs` (shared user fields: `Cedula`, `RolUsuario`, `Nombre`, `Email`,
   `Contrasena`, ...) for the four user-role entities (Cliente, Entrenador, Recepcionista, and the
   admin).

When adding a new entity end-to-end you'll touch all five layers plus a new stored procedure script
under `SQL/`.

## Auth model

Login issues a JWT (`API/Controllers/LogInController.cs` + `BusinessLayer/LogInManager.cs` +
`BusinessLayer/PasswordService.cs`, salted/hashed via `DTO/SaltData.cs` /
`DataAccess/Mapper/PasswordsMapper.cs`). There are four roles baked in throughout (`Cliente`,
`Entrenador`, `Recepcionista`, and an admin role), each with its own `MVC/Views/<Role>/` folder and
its own JS files under `MVC/wwwroot/js/Pages/<Role>/`. `DTO/SessionUser.cs` / `DTO/LoggedUser.cs`
carry the role/claims info extracted from the JWT on the MVC side
(`System.IdentityModel.Tokens.Jwt` + `System.Security.Claims`, parsed manually in controllers, not
via ASP.NET Identity).

## Third-party integrations

- **Cloudinary** (`BusinessLayer/CloudinaryService.cs`, `API/Controllers/CloudinaryUploadController.cs`) — image uploads (profile photos, ID scans).
- **PayPal** (`BusinessLayer/PayPalManager.cs`, `API/Controllers/PayPalController.cs`) — sandbox checkout for memberships; JS flow lives in `MVC/wwwroot/js/Pages/Cliente/CrearCuenta.js`.
- **SendGrid** (`BusinessLayer/EmailService.cs`, `API/Controllers/EmailController.cs`) — transactional email (password reset, etc.).
- **SINPE** (`SinpeManager`/`SinpeController`) — Costa Rican bank-transfer payment proof handling (manual receipt uploads), not a live payment gateway.
- **EvoCalendar** (`Calendario/`, vendored into `MVC/wwwroot/Calendario/`) — third-party JS calendar widget used for scheduling views (classes, trainer appointments); not first-party code, don't "fix" it like app code.

## Repository layout notes

- `SQL/Scripts/` — historical, incrementally-named stored procedure scripts (not idempotent
  migrations; apply manually against the target DB). `SQL/Model/` has the MySQL Workbench ER model
  (`.mwb`) despite the DB being SQL Server. `SQL/bacpacs/` has a DB export.
- `SPRINT 1/` — sample uploaded assets (ID scans, profile photos, payment receipts, exercise/machine
  photos) used for seeding/demoing the app; not code.
