# Implementación de operaciones CRUD de órdenes en DynamoDB

El sistema permite a los usuarios gestionar órdenes a través de una interfaz, persistiendo los datos en DynamoDB. Los usuarios pueden crear, leer, actualizar y eliminar órdenes. Cada orden tiene un identificador único, un estado, una fecha de creación y una lista de productos. El sistema debe validar que no se creen órdenes con identificadores duplicados y que los productos listados existan en el catálogo. En caso de falla de la conexión a DynamoDB, el sistema debe registrar el error y notificar al usuario.

## Informacion General

| Campo | Valor |
|-------|-------|
| **Tema** | Persistir ordenes en DynamoDB desde la interfaz |
| **Nivel** | advanced-l2 |
| **Tipo** | practical |
| **Tiempo estimado** | 8 horas |

## Fases del Reto

### Fase 0: Configuración del Proyecto

**Objetivo:** Obtener el proyecto base funcional enviando el Código Base a un asistente de IA, que lo analizará, corregirá errores y entregará cada archivo con su ruta.

**Tiempo estimado:** 15-30 minutos

**Instrucciones:**

- Asegúrate de tener instalado para ejecutar el proyecto: Node.js 18+, npm, VS Code o similar.
- Copia todo el contenido del campo **Código Base** de este reto — incluyendo el texto de instrucciones que aparece al inicio.
- Abre un asistente de IA (Claude en claude.ai, ChatGPT o Gemini — se recomienda Claude), pega el contenido copiado en el chat y envíalo.
- El asistente analizará los archivos, corregirá errores y entregará cada archivo con su ruta. Guárdalos en la carpeta donde quieras trabajar, respetando las rutas.
- Ejecuta `npm install && npm run build` (o `npm start`). Si no hay errores, estás listo.

**Entregable:** El proyecto compila/arranca sin errores.

<details>
<summary>Pistas de conocimiento</summary>

- Copia el Código Base completo incluyendo el texto de instrucciones al inicio — esas instrucciones le indican al asistente exactamente qué hacer con los archivos.
- Si el asistente no entrega todos los archivos al terminar el análisis, escríbele: "entrégame todos los archivos con su ruta".
- Si el proyecto tiene errores al arrancar, comparte el mensaje de error con el mismo asistente para que lo corrija.

</details>

### Fase 1: Configuración del entorno y persistencia básica de órdenes

**Objetivo:** Configurar el entorno de desarrollo y permitir la persistencia básica de órdenes en DynamoDB.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Configurar el entorno de desarrollo utilizando Terraform.
- Implementar la funcionalidad para crear y leer órdenes en DynamoDB.
- Validar que no se creen órdenes con identificadores duplicados.

**Entregable:** Entorno de desarrollo configurado y funcionalidad básica de CRUD para órdenes en DynamoDB.

<details>
<summary>Pistas de conocimiento</summary>

- Utilizar Terraform para gestionar la infraestructura.
- Manejo de errores de conexión a DynamoDB.

</details>

### Fase 2: Actualización y eliminación de órdenes

**Objetivo:** Implementar la funcionalidad para actualizar y eliminar órdenes en DynamoDB.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Implementar la funcionalidad para actualizar el estado y los productos de una orden.
- Implementar la funcionalidad para eliminar una orden.
- Validar que los productos listados en una orden existan en el catálogo.

**Entregable:** Funcionalidad completa de CRUD para órdenes en DynamoDB, incluyendo actualización y eliminación.

<details>
<summary>Pistas de conocimiento</summary>

- Validación de existencia de productos en el catálogo.
- Manejo de casos borde al actualizar y eliminar órdenes.

</details>

### Fase 3: Manejo de errores y notificación al usuario

**Objetivo:** Implementar el manejo de errores de conexión a DynamoDB y notificar al usuario.

**Tiempo estimado:** 2 horas

**Instrucciones:**

- Implementar el manejo de errores de conexión a DynamoDB.
- Notificar al usuario en caso de falla de conexión.
- Registrar los errores en un log para posterior análisis.

**Entregable:** Sistema con manejo completo de errores de conexión a DynamoDB y notificación al usuario.

<details>
<summary>Pistas de conocimiento</summary>

- Uso de logs para registrar errores.
- Notificación al usuario de forma clara y concisa.

</details>

## Dimensiones Evaluadas

- **queEs**: ¿Qué son las operaciones CRUD y por qué son importantes en este contexto?
- **paraQueSirve**: ¿Para qué sirve validar la unicidad del identificador de la orden y la existencia de los productos en el catálogo?
- **comoSeUsa**: ¿Cómo se usa Terraform para configurar el entorno de desarrollo?
- **erroresComunes**: ¿Cuáles son los errores comunes al implementar operaciones CRUD en DynamoDB y cómo se pueden evitar?
- **queDecisionesImplica**: ¿Qué decisiones implica el manejo de errores de conexión a DynamoDB y la notificación al usuario?

## Criterios de Evaluacion

- Configuración correcta del entorno de desarrollo utilizando Terraform.
- Implementación de la funcionalidad para crear y leer órdenes en DynamoDB.
- Validación de la unicidad del identificador de la orden.
- Implementación de la funcionalidad para actualizar y eliminar órdenes en DynamoDB.
- Validación de la existencia de productos en el catálogo.
- Manejo correcto de errores de conexión a DynamoDB.
- Notificación clara y concisa al usuario en caso de falla de conexión.
- Registro de errores en un log para posterior análisis.

## Como trabajar con un asistente de IA

Hay dos caminos, elegi uno:

- **AGENTS.md** (recomendado) — instrucciones nativas del repo. Abri esta carpeta con tu agente local (Claude Code, Cursor, Codex, Copilot, Gemini) y las carga solo. Sabe que archivos faltan y con que comando se verifica, y completa el scaffold escribiendo en disco.
- **PROMPT_MEJORA.md** — para copiar y pegar en un chat (claude.ai, ChatGPT) si no tenes un agente en el IDE. Declara lo mismo que AGENTS.md; los archivos que te devuelva el chat los guardas en esta carpeta respetando las rutas.

Ninguno de los dos resuelve las fases del reto: eso es tu trabajo.

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

## Verificacion

El proyecto esta listo para trabajar cuando este comando corre sin errores:

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q
```

---

*Reto generado automaticamente por Challenge Generator - Pragma*
