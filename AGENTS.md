# AGENTS.md

Instrucciones para el agente de IA que abra este repositorio (Claude Code, Cursor, Codex, Copilot, Gemini). Se cargan solas: no hay que pegar nada en ningun chat.

## Que es este repositorio

Es el codigo base de un reto de aprendizaje de Pragma: **Implementación de operaciones CRUD de órdenes en DynamoDB**.

| | |
|---|---|
| Tema | Persistir ordenes en DynamoDB desde la interfaz |
| Nivel | advanced-l2 |
| Chapter | Frontend |
| Especialidad | React |
| Stack | TypeScript / React 19 |
| Patron arquitectonico | patrón contenedor/presentacional con hooks personalizados |
| Tiempo estimado | 8 horas |

## Mapa de componentes

El repo tiene una carpeta por componente. Cada uno se instala y verifica dentro de la suya.

| Componente | Carpeta | Rol | Capa | Track | Tecnologias |
|---|---|---|---|---|---|
| `api` | `api/` | practice | server | Node | DynamoDB |
| `client` | `client/` | chapter, support | client | React | React |
| `infra` | `infra/` | support | infra | Terraform (AWS) | Terraform |
| `infra-local` | (raiz) | support | infra | Compose local | DynamoDB |

## Orden de arranque

1. `docker compose up -d` (en la raiz) — levanta la infraestructura local.
2. `cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate` — componente `infra` (support).
3. `cd api && npm install && npm run build` — componente `api` (practice).
4. `cd client && npm install && npm run build` — componente `client` (chapter, support).

### Contratos entre componentes

- `api` expone http (api: http://localhost:3000):
  - `POST /orders`
  - `GET /orders/:id`
  - `PUT /orders/:id`
  - `DELETE /orders/:id`

## Herramientas

- **Terraform**: Herramienta de trabajo del candidato: usala en la fase donde se depura o se prueba la solucion (no es una dependencia del proyecto).

## Receta del stack

Esqueleto obligatorio:

- `package.json, vite.config.ts y tsconfig.json en la raiz`
- `src/main.tsx como entry point`
- `src/app con el arbol de rutas`
- `src/features con componentes contenedores y sus hooks`
- `src/shared con componentes presentacionales`
- `src/services con los clientes HTTP`

Trampas conocidas:

- No inventes versiones de npm: una version inexistente hace fallar `npm install` con ETARGET. `@types/react-router-dom` ya no se publica para v6+, React Router trae sus tipos.
- El `package.json` tiene que ser JSON valido y UNICO: nada despues de la llave de cierre.

Dependencias:

- react 19.0.0
- react-dom 19.0.0
- react-router-dom 6.22.3
- @tanstack/react-query 5.28.9
- axios 1.6.8
- typescript 5.7.0
- vite 5.2.7
- eslint 8.57.0
- prettier 3.2.5
- @types/react 18.2.74
- @types/react-dom 18.2.24

## Tu tarea

Dejar este proyecto en estado **verificable**: que el comando de verificacion corra sin errores. Escribi los archivos en disco, en este repositorio. No generes ZIPs ni archivos adjuntos.

En orden:

1. Segui el orden de arranque del mapa de componentes (infraestructura local primero) y corre `(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q` desde la raiz: mira que falla.
2. Completa lo que falte de la lista de abajo: manifiesto de dependencias, punto de entrada, capa de interfaz y las capas del patron declarado.
3. Arregla SOLO los errores que impiden compilar o arrancar.
4. Volve a correr `(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q` hasta que pase.
5. Pará ahí.

## Regla dura: las fases son trabajo del humano

**PROHIBIDO implementar los entregables de las fases.** El valor del reto esta en que la persona los resuelva. Tu trabajo es que tenga un proyecto que arranca; el hueco pedagogico se queda como esta.

No resuelvas nada de esto:

- **Fase 1 — Configuración del entorno y persistencia básica de órdenes**: Entorno de desarrollo configurado y funcionalidad básica de CRUD para órdenes en DynamoDB.
- **Fase 2 — Actualización y eliminación de órdenes**: Funcionalidad completa de CRUD para órdenes en DynamoDB, incluyendo actualización y eliminación.
- **Fase 3 — Manejo de errores y notificación al usuario**: Sistema con manejo completo de errores de conexión a DynamoDB y notificación al usuario.

Distincion operativa:

- **Arreglar** (si): import faltante, tipo que no existe, dependencia sin declarar, error de sintaxis, archivo referenciado que no existe.
- **No tocar** (no): logica de negocio incompleta, validaciones ausentes, secretos hardcodeados, APIs deprecadas que funcionan, concurrencia insegura, patrones mejorables. Eso es lo que la persona tiene que encontrar.

## Lo que falta y tenes que completar

### 1. Referencias colgando (5)

Salieron de un analisis estatico del codigo que SI esta en el repo. Cada una rompe la compilacion:

- [ ] `api/src/domain/entities/order.entity.ts` — `OrderProduct.reduce`
      Se invoca `reduce` sobre `OrderProduct`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `api/src/application/dtos/create-order.dto.ts` — `OrderProductDto.map`
      Se invoca `map` sobre `OrderProductDto`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `api/src/application/dtos/create-order.dto.ts` — `OrderProductDto.filter`
      Se invoca `filter` sobre `OrderProductDto`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `api/src/infrastructure/repositories/order.repository.impl.ts` — `OrderProduct.map`
      Se invoca `map` sobre `OrderProduct`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `client/src/features/orders/components/OrderList.tsx` — `OrderEntity.map`
      Se invoca `map` sobre `OrderEntity`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.

### Presentes (56)

- `api/src/app.module.ts`
- `api/package.json`
- `api/tsconfig.json`
- `api/src/main.ts`
- `api/src/domain/entities/order.entity.ts`
- `api/src/domain/repositories/order.repository.ts`
- `api/src/application/dtos/create-order.dto.ts`
- `api/src/application/dtos/update-order.dto.ts`
- `api/src/infrastructure/controllers/order.controller.ts`
- `api/src/infrastructure/repositories/order.repository.impl.ts`
- `api/src/infrastructure/config/dynamodb.config.ts`
- `api/src/infrastructure/repositories/catalog.repository.impl.ts`
- `api/src/common/exceptions/order-exists.exception.ts`
- `api/src/common/exceptions/product-not-found.exception.ts`
- `api/src/common/exceptions/dynamodb-connection.exception.ts`
- `api/src/common/interceptors/logging.interceptor.ts`
- `api/src/common/filters/http-exception.filter.ts`
- `api/src/application/services/order.service.ts`
- `api/src/domain/repositories/catalog.repository.ts`
- `api/src/domain/repositories/catalog-product.interface.ts`
- `client/package.json`
- `client/vite.config.ts`
- `client/tsconfig.json`
- `client/src/main.tsx`
- `client/src/app/App.tsx`
- `client/index.html`
- `client/src/app/routes.tsx`
- `client/src/features/orders/OrdersPage.tsx`
- `client/src/features/orders/components/OrderForm.tsx`
- `client/src/features/orders/components/OrderList.tsx`
- `client/src/features/orders/components/OrderItem.tsx`
- `client/src/features/orders/hooks/useOrders.ts`
- `client/src/services/order.service.ts`
- `client/src/utils/errorHandler.ts`
- `client/src/types/order.ts`
- `client/src/shared/components/ErrorNotification.tsx`
- `client/src/shared/components/ErrorNotification.css`
- `client/src/index.scss`
- `client/src/features/orders/components/OrderItem.css`
- `client/src/setupTests.ts`
- `infra/providers.tf`
- `infra/variables.tf`
- `infra/modules/dynamodb/variables.tf`
- `infra/modules/iam/variables.tf`
- `infra/versions.tf`
- `infra/README.md`
- `infra/main.tf`
- `infra/outputs.tf`
- `infra/environments/dev/terraform.tfvars`
- `infra/modules/dynamodb/main.tf`
- `infra/modules/dynamodb/outputs.tf`
- `infra/modules/iam/main.tf`
- `infra/modules/iam/outputs.tf`
- `docker-compose.yml`
- `infra-local/README.md`
- `infra-local/dynamodb/create-tables.sh`

### Capas del patron declarado

Cada una tiene que existir como directorio real con al menos un archivo. Codigo plano en la raiz no satisface el patron.

- `api`
- `api/src/domain/entities`
- `api/src/domain/repositories`
- `api/src/application/services`
- `api/src/application/dtos`
- `api/src/infrastructure/controllers`
- `api/src/infrastructure/repositories`
- `api/src/infrastructure/config`
- `api/src/common/exceptions`
- `api/src/common/interceptors`
- `api/src/common/filters`
- `client`
- `client/src/app`
- `client/src/features/orders`
- `client/src/features/orders/components`
- `client/src/features/orders/hooks`
- `client/src/shared/components`
- `client/src/services`
- `client/src/utils`
- `client/src/types`
- `infra`
- `infra/modules/dynamodb`
- `infra/modules/iam`

## Verificacion

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q
```

Ese comando pasando es la definicion de "terminado" para vos.

## Convenciones que tenes que respetar

- Un solo ecosistema: no declares librerias de otro lenguaje ni mezcles gestores de paquetes.
- Toda libreria que uses tiene que estar declarada en el manifiesto de dependencias.
- Todo import declarado tiene que usarse; todo tipo usado tiene que existir o venir de una dependencia declarada.
- Cada componente vive en su carpeta: instala y compila dentro de ella, y no muevas archivos entre componentes.
- Respeta los contratos entre componentes (endpoints, topics) tal como estan declarados en el mapa de componentes.
- El patron es **patrón contenedor/presentacional con hooks personalizados**: los contratos (interfaces, puertos) los define la capa interna y los implementa la externa, nunca al revés.
- Los archivos que crees llevan implementacion real, no stubs: sin `TODO`, sin cuerpos vacios, sin `// getters y setters`.

## Contexto del candidato

Sirve para calibrar el nivel del codigo, no para resolver las fases.

- Perfil: Chapter Frontend, Especialidad Desarrollador, Tecnología React, Advanced L2
- Brecha que el reto ataca: CRUD de ordenes en DynamoDB desde la interfaz (corrida e2e 20261109213213585), Implementa operaciones CRUD de ordenes en DynamoDB desde la interfaz y versiona la infraestructura
- Mision: Gestionar ordenes

---

*Generado por Challenge Generator — Pragma. `README.md` tiene el enunciado completo del reto para la persona. `PROMPT_MEJORA.md` es la variante para pegar en un chat, si se prefiere ese flujo.*
