"use client";

/**
 * Copia texto al portapapeles.
 *
 * `navigator.clipboard` no existe fuera de un contexto seguro —el mismo
 * http:// del servidor de desarrollo en la red local—, así que queda el
 * respaldo del `<textarea>` oculto: viejo, pero funciona en todos lados.
 */
export async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    // Sin portapapeles moderno: sigue el respaldo.
  }

  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  document.execCommand("copy");
  field.remove();
}
