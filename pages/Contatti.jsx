import React, { useEffect, useState } from "react";
import volontariJson from "../data/volontari.json";

const STORAGE_KEY = "atd_volontari";

const emptyForm = {
  nome: "",
  cognome: "",
  ruolo: "Autista",
};

const Contatti = () => {
  const [volontari, setVolontari] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      setVolontari(JSON.parse(saved));
    } else {
      const iniziali = volontariJson.map((v) => ({
        ...v,
        ruolo: v.ruolo || "Volontario",
      }));
      setVolontari(iniziali);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(iniziali));
    }
  }, []);

  const salvaStorage = (next) => {
    setVolontari(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nome.trim() && !form.cognome.trim()) return;

    if (editingId) {
      const updated = volontari.map((v) =>
        v.id === editingId ? { ...v, ...form } : v,
      );

      salvaStorage(updated);
      setEditingId(null);
      setForm(emptyForm);
      return;
    }

    const nuovo = {
      id: Date.now(),
      nome: form.nome.trim(),
      cognome: form.cognome.trim(),
      ruolo: form.ruolo,
    };

    salvaStorage([...volontari, nuovo]);
    setForm(emptyForm);
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

  const elimina = (id) => {
    const conferma = window.confirm("Vuoi eliminare questo contatto?");
    if (!conferma) return;

    const filtered = volontari.filter((v) => v.id !== id);
    salvaStorage(filtered);
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
            {volontari.map((v) => (
              <tr key={v.id}>
                <td>{v.nome || "—"}</td>
                <td>{v.cognome || "—"}</td>
                <td>{v.ruolo || "Volontario"}</td>
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => modifica(v)}
                    >
                      Modifica
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => elimina(v.id)}
                    >
                      Elimina
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {volontari.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  Nessun contatto presente.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Contatti;
