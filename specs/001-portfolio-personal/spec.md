# Feature Specification: Portfolio Personal

**Feature Branch**: `001-portfolio-personal`
**Created**: 2026-03-11
**Status**: Draft → Validated
**Input**: Spec completa provista por el usuario (schema DB, componentes, stores, animaciones)

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Visitante recorre el portfolio (Priority: P1)

Un profesional de recursos humanos o cliente potencial visita el portfolio para evaluar
el perfil y trabajo del dueño. Espera ver una presentación clara, proyectos reales con
links, certificaciones que avalen experiencia, y un modo de contacto.

**Why this priority**: Es el propósito principal del portfolio. Sin esta experiencia,
no existe el producto.

**Independent Test**: Se puede probar completamente accediendo a la URL raíz del
portfolio y recorriendo todas las secciones sin login. Entrega valor si la información
del perfil, proyectos y certificaciones son visibles.

**Acceptance Scenarios**:

1. **Given** que accedo a la URL raíz del portfolio, **When** la página carga, **Then** veo nombre, título, bio y avatar del dueño, además de links a LinkedIn, GitHub y email.
2. **Given** que hay proyectos publicados en el sistema, **When** hago scroll a la sección de proyectos, **Then** veo una grilla con imagen, título, descripción, tags y links de cada proyecto; los proyectos marcados como destacados se muestran de forma prominente.
3. **Given** que accedo desde un teléfono (pantalla de 375px), **When** navego el portfolio, **Then** todas las secciones se ven correctamente sin solapamientos ni texto cortado.
4. **Given** que el portfolio tiene proyectos, certificaciones y skills cargados, **When** hago scroll suave a través de la página, **Then** cada sección aparece con una animación visual fluida y no intrusiva.
5. **Given** que hay una sección de contacto visible, **When** hago click en el email del dueño, **Then** se abre el cliente de email predeterminado con la dirección precargada.

---

### User Story 2 — Admin accede al panel de gestión (Priority: P2)

El dueño del portfolio necesita acceder a un panel protegido donde pueda modificar
todo el contenido visible públicamente, sin necesidad de modificar código.

**Why this priority**: Sin autenticación segura, el panel de gestión no puede existir.
Es el prerequisito para las historias P3–P6.

**Independent Test**: Se puede probar accediendo a `/admin/login` con credenciales
correctas. Entrega valor si el login funciona y el panel es accesible.

**Acceptance Scenarios**:

1. **Given** que ingreso a `/admin/login` sin estar autenticado, **When** cargo la página, **Then** veo un formulario de email y contraseña, y NO veo el panel de gestión.
2. **Given** que ingreso credenciales correctas, **When** envío el formulario, **Then** soy redirigido al panel de gestión con acceso a todas las secciones.
3. **Given** que ingreso credenciales incorrectas, **When** envío el formulario, **Then** veo un mensaje de error claro y permanezco en la página de login.
4. **Given** que estoy autenticado y hago click en "Cerrar sesión", **When** confirmo la acción, **Then** soy redirigido a la página de login y no puedo acceder al panel sin autenticarme de nuevo.
5. **Given** que intento acceder a cualquier ruta `/admin/*` sin estar autenticado, **When** navego a esa URL, **Then** soy redirigido automáticamente a `/admin/login`.
6. **Given** que no existe ningún mecanismo de registro público, **When** un visitante intenta registrarse, **Then** no encuentra ninguna opción para hacerlo.

---

### User Story 3 — Admin gestiona proyectos (Priority: P3)

El dueño del portfolio quiere agregar, editar y eliminar proyectos, así como controlar
cuáles son visibles públicamente, sin tocar el código fuente.

**Why this priority**: Los proyectos son el contenido central del portfolio. Es la
gestión más crítica después del acceso al panel.

**Independent Test**: Se puede probar creando un proyecto desde el panel y verificando
que aparece en la página pública. Entrega valor si el ciclo create → publish → view funciona.

**Acceptance Scenarios**:

1. **Given** que estoy en el panel admin, **When** hago click en "Agregar proyecto", **Then** veo un formulario con campos para título, descripción, link a preview, link al repositorio, tags, imagen y opciones de destacado y publicación.
2. **Given** que completo y guardo un proyecto, **When** vuelvo a la lista de proyectos, **Then** el nuevo proyecto aparece en la lista.
3. **Given** que un proyecto está marcado como publicado, **When** visito la página pública, **Then** el proyecto aparece en la sección de proyectos para los visitantes.
4. **Given** que un proyecto está marcado como no publicado (borrador), **When** visito la página pública, **Then** el proyecto NO aparece para los visitantes, pero sí en el panel admin.
5. **Given** que selecciono un proyecto existente para editar, **When** modifico los datos y guardo, **Then** los cambios se reflejan en la vista pública inmediatamente.
6. **Given** que elimino un proyecto con confirmación, **When** el proceso finaliza, **Then** el proyecto desaparece de la lista de admin y de la página pública.
7. **Given** que subo una imagen para el proyecto, **When** guardo el proyecto, **Then** la imagen aparece como thumbnail en la tarjeta del proyecto en la vista pública.

---

### User Story 4 — Admin gestiona su perfil personal (Priority: P4)

El dueño quiere actualizar su información personal (bio, título, links, avatar) desde
el panel sin modificar archivos del proyecto.

**Why this priority**: El perfil es el primer contenido que ven los visitantes. Debe
poder actualizarse fácilmente cuando cambia el rol, bio o foto del dueño.

**Independent Test**: Se puede probar modificando el campo de bio en el panel y verificando
que el cambio se refleja en la sección Hero de la página pública.

**Acceptance Scenarios**:

1. **Given** que accedo a la sección de perfil en el panel admin, **When** cargo la página, **Then** veo un formulario con los valores actuales de nombre, título, bio, email, links a redes y avatar.
2. **Given** que modifico cualquier campo del perfil y guardo, **When** visito la página pública, **Then** los cambios se reflejan en la sección Hero.
3. **Given** que subo una nueva imagen de avatar, **When** guardo el perfil, **Then** la nueva imagen aparece en la sección Hero de la página pública.

---

### User Story 5 — Admin gestiona certificaciones (Priority: P5)

El dueño quiere agregar, editar y eliminar certificaciones y cursos completados,
agrupados por categoría.

**Why this priority**: Las certificaciones validan las habilidades declaradas. Son
complementarias a los proyectos.

**Independent Test**: Se puede probar creando una certificación y verificando que
aparece en la sección pública agrupada por su categoría.

**Acceptance Scenarios**:

1. **Given** que agrego una certificación con título, institución, fecha, link y categoría, **When** guardo y visito la página pública, **Then** la certificación aparece en la sección correcta agrupada por su categoría.
2. **Given** que elimino una certificación con confirmación, **When** visito la página pública, **Then** la certificación ya no aparece.

---

### User Story 6 — Admin gestiona skills (Priority: P6)

El dueño quiere agregar, editar y eliminar tecnologías y herramientas de su stack,
agrupadas por categoría.

**Why this priority**: Los skills complementan la presentación técnica del portfolio.

**Independent Test**: Se puede probar agregando un skill y verificando que aparece
en la sección pública agrupado por categoría.

**Acceptance Scenarios**:

1. **Given** que agrego un skill con nombre, categoría, ícono y nivel, **When** guardo y visito la página pública, **Then** el skill aparece en la categoría correcta en la sección de skills.
2. **Given** que reordeno los skills por categoría en el panel, **When** visito la página pública, **Then** el orden actualizado se refleja.

---

### User Story 7 — Visitante contacta al dueño (Priority: P7)

Un visitante interesado en contratar o colaborar con el dueño quiere ponerse en contacto
de forma directa y sencilla.

**Why this priority**: Baja prioridad porque el mailto es suficiente para el MVP.
La mejora con formulario es opcional.

**Independent Test**: Se puede probar haciendo click en el email de contacto. En su
versión avanzada, se prueba enviando el formulario y verificando que llega el email.

**Acceptance Scenarios**:

1. **Given** que accedo a la sección de contacto, **When** hago click en el botón de copiar email, **Then** el email del dueño se copia al portapapeles y aparece una confirmación visual.
2. **Given** que accedo a la sección de contacto, **When** hago click en el link de email, **Then** se abre el cliente de email predeterminado con la dirección precargada.
3. *(Mejora opcional)* **Given** que completo el formulario de contacto con nombre, email y mensaje, **When** envío el formulario, **Then** el dueño recibe un email con los datos y veo una confirmación de envío exitoso.

---

### Edge Cases

- ¿Qué ve el visitante si no hay proyectos publicados? → La sección muestra un mensaje de "Próximamente" sin errores.
- ¿Qué pasa si falla la carga del contenido desde el servicio externo? → Se muestra un estado de error con mensaje amigable, nunca una pantalla en blanco o error técnico expuesto.
- ¿Qué pasa si el visitante accede en una pantalla muy pequeña (< 375px)? → El contenido es legible aunque no perfectamente diagramado (mínimo viable).
- ¿Qué pasa si el admin intenta guardar un proyecto sin título? → El formulario muestra validación inline y no envía el formulario.
- ¿Qué pasa si sube una imagen mayor al límite permitido? → Ve un mensaje de error claro indicando el límite de tamaño antes de intentar el upload.
- ¿Qué pasa si el admin cierra el navegador sin cerrar sesión? → La sesión expira automáticamente tras un período de inactividad configurable.

---

## Requirements *(mandatory)*

### Functional Requirements

**Portfolio Público:**

- **FR-001**: El sistema DEBE mostrar la página pública del portfolio en la ruta raíz sin requerir autenticación.
- **FR-002**: El sistema DEBE mostrar perfil completo del dueño (nombre, título, bio, avatar, links sociales) en la sección principal.
- **FR-003**: El sistema DEBE mostrar solo los proyectos marcados como publicados a los visitantes no autenticados.
- **FR-004**: El sistema DEBE permitir a los visitantes navegar entre secciones mediante scroll suave desde la barra de navegación fija.
- **FR-005**: El sistema DEBE mostrar las secciones con animaciones de entrada al hacer scroll, sin afectar la legibilidad.
- **FR-006**: El sistema DEBE mostrar los proyectos "destacados" de forma más prominente que los demás en la sección de proyectos.
- **FR-007**: El sistema DEBE agrupar las certificaciones y skills por categoría en sus respectivas secciones.
- **FR-008**: El sistema DEBE proveer un botón de copiar email en la sección de contacto.
- **FR-009**: El sistema DEBE verse correctamente en dispositivos con pantalla de 375px de ancho o más (mobile-first).

**Autenticación Admin:**

- **FR-010**: El sistema DEBE proteger todas las rutas `/admin/*` y redirigir al login a usuarios no autenticados.
- **FR-011**: El sistema DEBE autenticar al admin mediante email y contraseña.
- **FR-012**: El sistema NO DEBE ofrecer registro público de ningún tipo.
- **FR-013**: La sesión del admin DEBE expirar automáticamente tras un período de inactividad.
- **FR-014**: El admin DEBE poder cerrar sesión explícitamente desde el panel.

**Panel Admin — Gestión de Contenido:**

- **FR-015**: El admin DEBE poder crear, editar y eliminar proyectos desde el panel.
- **FR-016**: El admin DEBE poder alternar el estado publicado/borrador de un proyecto sin editar todos sus datos.
- **FR-017**: El admin DEBE poder subir una imagen como thumbnail de proyecto y como imagen de certificación.
- **FR-018**: El admin DEBE poder crear, editar y eliminar certificaciones desde el panel.
- **FR-019**: El admin DEBE poder crear, editar y eliminar skills desde el panel.
- **FR-020**: El admin DEBE poder editar todos los campos del perfil personal incluyendo el avatar.
- **FR-021**: El sistema DEBE solicitar confirmación explícita antes de eliminar cualquier entidad.
- **FR-022**: El sistema DEBE mostrar el estado de carga durante operaciones async (guardar, cargar, subir imagen).

**Calidad y Performance:**

- **FR-023**: El sistema DEBE mostrar un estado de carga (skeleton o spinner) mientras se obtiene el contenido.
- **FR-024**: El sistema DEBE mostrar un mensaje de error amigable si falla la carga de contenido.
- **FR-025**: El sistema DEBE mostrar un estado vacío descriptivo si una sección no tiene contenido publicado.
- **FR-026**: Los formularios del panel admin DEBEN validar los campos requeridos antes de enviar y mostrar mensajes de error inline.

### Key Entities

- **Perfil**: Información personal del dueño — nombre, título, bio, email, links a redes sociales, avatar. Entidad singleton (siempre hay una sola).
- **Proyecto**: Trabajo demostrable — título, descripción, links a demo y repositorio, tags de tecnologías, imagen, estado (publicado/borrador), destacado.
- **Certificación**: Credencial de formación — título, institución, fecha, link al certificado, imagen, categoría.
- **Skill**: Tecnología o herramienta del stack — nombre, categoría, ícono, nivel de dominio.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un visitante puede ver toda la información del portfolio (perfil, proyectos, certificaciones, skills y contacto) en una sola página, sin requerir acciones adicionales.
- **SC-002**: La página pública carga completamente y muestra contenido visible en menos de 3 segundos en una conexión de velocidad estándar (4G).
- **SC-003**: El portfolio se visualiza sin errores de diseño (contenido cortado, solapamientos o texto ilegible) en pantallas de 375px, 768px y 1280px de ancho.
- **SC-004**: El admin puede agregar un nuevo proyecto (con imagen, tags y links) en menos de 2 minutos usando el panel.
- **SC-005**: Cualquier cambio de contenido realizado en el panel admin se refleja en la página pública en menos de 5 segundos sin requerir un nuevo deploy.
- **SC-006**: Un visitante no autenticado no puede acceder a ninguna ruta del panel admin bajo ninguna circunstancia.
- **SC-007**: El formulario de contacto (opción B) completa el envío de email en menos de 5 segundos cuando el servicio de correo está disponible.
- **SC-008**: Los 3 indicadores de rendimiento web (velocidad de carga perceptiva, estabilidad visual y respuesta a interacciones) alcanzan puntuaciones en el rango "Bueno" en herramientas de auditoría estándar.

---

## Assumptions

- El portfolio tiene un único dueño y un único usuario admin — no hay roles adicionales ni multi-usuario.
- El contenido del portfolio es siempre visible al público sin requerir autenticación.
- No se requiere soporte para múltiples idiomas en esta versión.
- Las imágenes subidas tienen un tamaño máximo de 2MB; imágenes más grandes deben ser redimensionadas por el usuario antes de subir.
- El formulario de contacto (FR-007, User Story 7) es una mejora posterior a la Opción A (mailto link); la Opción A es el MVP de contacto.
- Las animaciones son mejoras de experiencia: si fallan, el contenido es igualmente accesible y legible.
- No se requiere soporte offline — el portfolio requiere conexión a internet para cargar contenido.
