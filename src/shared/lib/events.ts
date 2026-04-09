// Custom event para notificar cambios de perfil entre componentes
// Ejemplo: cuando se sube un avatar en /dashboard/perfil, el header se actualiza instantáneamente

export const PROFILE_UPDATED_EVENT = "profile-updated";

export function emitProfileUpdated() {
  window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
}
