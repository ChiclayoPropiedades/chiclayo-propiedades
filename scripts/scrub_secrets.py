"""
Scrub one-shot de credenciales filtradas en docs/.

Reemplaza valores literales de secretos (PAT GitHub revocado, password reusado,
password Gmail, Supabase Anon Key) por marcadores `<REDACTED-...>` en los 6
archivos identificados por la auditoria Fase 1.

NO toca el historial de git: el scrub limpia el working tree para futuros commits.
Para limpiar history, ejecutar `git filter-repo` manualmente (queda fuera de scope
de esta sesion, ver plan splendid-growing-blum.md Fase 0).

Uso:
    python scripts/scrub_secrets.py        # ejecuta el scrub
    python scripts/scrub_secrets.py --dry  # solo reporta cuantos matches encontraria

Salida: imprime por archivo la cantidad de reemplazos por cada secreto.
"""
from __future__ import annotations

import sys
from pathlib import Path

# Secretos a sustituir. Llave = string literal expuesto, valor = marcador.
#
# Nota: la Supabase Anon Key (eyJ...anon...) NO se incluye aqui porque por diseno
# es publica: cada Vercel deploy la envia a cada browser via
# NEXT_PUBLIC_SUPABASE_ANON_KEY, y todo el control de acceso vive en RLS. Redactarla
# de docs no aporta seguridad real. Si en algun momento se decide rotarla, se agrega
# aqui el JWT viejo.
SECRETS: dict[str, str] = {
    "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": "<REDACTED-GH-PAT-REVOKED>",
    "Wr#EpJW2TM.5!?b": "<REDACTED-PASSWORD-ROTATE-PENDING>",
    "propiedades2324": "<REDACTED-GMAIL-PASSWORD-ROTATE-PENDING>",
}

# Archivos candidatos. Solo paths bajo docs/ y la raiz.
FILES: list[Path] = [
    Path("docs/PROYECTO_CONTEXTO.md"),
    Path("docs/SESION_DESARROLLO.md"),
    Path("docs/HANDOFF.md"),
    Path("docs/AUDITORIA POR FASES/fase1_audit.md"),
    Path("docs/AUDITORIA POR FASES/fase10_audit.md"),
    Path("docs/AUDITORIA POR FASES/AUDITORIA_SISTEMA.md"),
]


def scrub(dry_run: bool) -> int:
    """Reemplaza cada secreto. Retorna 0 si OK, 1 si algun archivo no existe."""
    repo_root = Path(__file__).resolve().parent.parent
    total = 0
    errors = 0

    for rel_path in FILES:
        file_path = repo_root / rel_path
        if not file_path.exists():
            print(f"[MISS] {rel_path} no existe")
            errors += 1
            continue

        original = file_path.read_text(encoding="utf-8")
        scrubbed = original
        per_secret: dict[str, int] = {}

        for secret, marker in SECRETS.items():
            count = scrubbed.count(secret)
            if count:
                scrubbed = scrubbed.replace(secret, marker)
                per_secret[marker] = count

        if per_secret:
            details = ", ".join(f"{k}: {v}" for k, v in per_secret.items())
            tag = "[DRY]" if dry_run else "[FIX]"
            print(f"{tag} {rel_path} -> {details}")
            total += sum(per_secret.values())
            if not dry_run:
                file_path.write_text(scrubbed, encoding="utf-8")
        else:
            print(f"[OK ] {rel_path} sin matches")

    verbo = "encontrados" if dry_run else "reemplazados"
    print(f"\nTotal: {total} secretos {verbo} en {len(FILES)} archivos")
    return 1 if errors else 0


if __name__ == "__main__":
    is_dry = "--dry" in sys.argv
    sys.exit(scrub(dry_run=is_dry))
