import React, { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase";
import {
  addVolontario,
  updateVolontario,
  deleteVolontario,
} from "../firebase/services";

const emptyForm = {
  nome: "",
  cognome: "",
  ruolo: "Autista",
};

const ConfirmDeleteModal = ({ open, contatto, onCancel, onConfirm }) => {
  if (!open) return null;

  const nomeCompleto = `${contatto?.nome || ""} ${
    contatto?.cognome || ""
  }`.trim();

  return (
    <>
      <div
        className="modal-backdrop fade show"
        onClick={onCancel}
        style={{ cursor: "pointer" }}
      />

      <div
        className="modal fade show d-block"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content shadow-lg border-0">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">Conferma eliminazione</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Chiudi"
                onClick={onCancel}
              />
            </div>

            <div className="modal-body">
              <p className="mb-0">
                Vuoi eliminare il contatto{" "}
                <strong>"{nomeCompleto || "selezionato"}"</strong>?
              </p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onCancel}
              >
                Annulla
              </button>

              <button
                type="button"
                className="btn btn-danger"
                onClick={onConfirm}
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Contatti = () => {
  const [volontari, setVolontari] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "volontari"), orderBy("cognome", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const dati = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setVolontari(dati);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
        alert("Errore nel caricamento dei volontari");
      },
    );

    return () => unsubscribe();
  }, []);

  const volontariOrdinati = useMemo(() => {
    return [...volontari].sort((a, b) => {
      const aText = `${a.cognome || ""} ${a.nome || ""}`.toLowerCase();
      const bText = `${b.cognome || ""} ${b.nome || ""}`.toLowerCase();
      return aText.localeCompare(bText);
    });
  }, [volontari]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nome.trim() && !form.cognome.trim()) return;

    const payload = {
      nome: form.nome.trim(),
      cognome: form.cognome.trim(),
      ruolo: form.ruolo,
    };

    try {
      if (editingId) {
        await updateVolontario(editingId, payload);
        setEditingId(null);
        setForm(emptyForm);
        return;
      }

      await addVolontario(payload);
      setForm(emptyForm);
    } catch (error) {
      console.error(error);
      alert("Errore nel salvataggio del contatto");
    }
  };

  const modifica = (volontario) => {
    setEditingId(volontario.id);
    setForm({
      nome: volontario.nome || "",
      cognome: volontario.cognome || "",
      ruolo: volontario.ruolo || "Volontario",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const elimina = async () => {
    if (!deleteTarget?.id) return;

    try {
      await deleteVolontario(deleteTarget.id);
      setDeleteTarget(null);
    } catch (error) {
      console.error(error);
      alert("Errore durante l'eliminazione del contatto");
    }
  };

  const annullaModifica = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <main className="container my-5">
      <h1 className="text-center mb-4">Contatti volontari</h1>

      <form className="card shadow-sm mb-5" onSubmit={handleSubmit}>
        <div className="card-body">
          <h4 className="mb-3">
            {editingId ? "Modifica contatto" : "Aggiungi contatto"}
          </h4>

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Nome</label>
              <input
                className="form-control"
                value={form.nome}
                onChange={(e) =>
                  setForm((p) => ({ ...p, nome: e.target.value }))
                }
                placeholder="Nome"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Cognome</label>
              <input
                className="form-control"
                value={form.cognome}
                onChange={(e) =>
                  setForm((p) => ({ ...p, cognome: e.target.value }))
                }
                placeholder="Cognome"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Ruolo</label>
              <select
                className="form-select"
                value={form.ruolo}
                onChange={(e) =>
                  setForm((p) => ({ ...p, ruolo: e.target.value }))
                }
              >
                <option value="Presidente">Presidente</option>
                <option value="Personale di sede">Personale di sede</option>
                <option value="Autista">Autista</option>
                <option value="Accompagnatore">Accompagnatore</option>
                <option value="Volontario">Volontario</option>
              </select>
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button className="btn btn-primary" type="submit">
              {editingId ? "Salva modifica" : "Aggiungi contatto"}
            </button>

            {editingId && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={annullaModifica}
              >
                Annulla
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Nome</th>
              <th>Cognome</th>
              <th>Ruolo</th>
              <th className="text-center" style={{ width: 160 }}>
                Azioni
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  Caricamento contatti...
                </td>
              </tr>
            )}

            {!loading &&
              volontariOrdinati.map((v) => (
                <tr key={v.id}>
                  <td>{v.nome || "—"}</td>
                  <td>{v.cognome || "—"}</td>
                  <td>{v.ruolo || "Volontario"}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => modifica(v)}
                      >
                        Modifica
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setDeleteTarget(v)}
                      >
                        Elimina
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && volontariOrdinati.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  Nessun contatto presente.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        contatto={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={elimina}
      />
    </main>
  );
};

export default Contatti;
