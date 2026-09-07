"use client";

import { FilesModule } from "@mairie360/lib-components";
import { useCallback, useEffect, useState } from "react";
import type { ComponentProps } from "react";
import type { components } from "@/contracts/bff";
import { requestBff } from "@/lib/bff-client";

type Bootstrap = components["schemas"]["FilesBootstrap"];
type Upload = Parameters<NonNullable<ComponentProps<typeof FilesModule>["onUploadFile"]>>[0];

export default function FilesPage() {
  const [data, setData] = useState<Bootstrap | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [revision, setRevision] = useState(0);
  const load = useCallback(async (signal?: AbortSignal) => {
    const result = await requestBff<Bootstrap>("/files/bootstrap", { signal });
    setData(result);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal).catch((reason: Error) => { if (!controller.signal.aborted) setError(reason.message); });
    return () => controller.abort();
  }, [load]);

  async function mutate(path: string, init: RequestInit) {
    setPending(true);
    setError("");
    try { await requestBff(path, init); await load(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "L’opération a échoué."); }
    finally { setRevision((value) => value + 1); setPending(false); }
  }
  function upload(values: Upload) {
    const body = new FormData();
    body.set("file", values.file);
    body.set("category", values.category);
    void mutate("/files", { method: "POST", body });
  }
  return (
    <main className="min-h-screen bg-[#f5f3f0] text-[#172033] px-4 py-6 sm:px-6 lg:px-8">
      {error && <p role="alert" className="mb-4 rounded border border-red-200 bg-white p-4 text-red-700">{error}</p>}
      {pending || !data ? <p role="status">{pending ? "Opération en cours…" : error ? "Les fichiers sont indisponibles." : "Chargement des fichiers…"}</p> : (
        <FilesModule key={revision} className="mx-auto max-w-[1536px]" files={data.files.map((file) => ({ ...file, allowedActions: file.allowedActions.filter((action) => action !== "share") }))}
          categories={data.categories} currentUserName={data.currentUserName} canUpload={data.canUpload}
          onUploadFile={upload}
          onOpenFile={(file) => window.open(`/files/${encodeURIComponent(file.id)}/download`, "_blank", "noopener,noreferrer")}
          onDownloadFile={(file) => { window.location.href = `/files/${encodeURIComponent(file.id)}/download`; }}
          onDeleteFile={(file) => { void mutate(`/files/${encodeURIComponent(file.id)}`, { method: "DELETE" }); }} />
      )}
    </main>
  );
}
