/**
 * Hook para scroll suave a secciones de la página por ID.
 */
export function useScrollTo() {
  return function scrollTo(id: string): void {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}
