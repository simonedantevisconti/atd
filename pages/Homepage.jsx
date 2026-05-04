import React, { useState, useRef, useEffect } from "react";
import WeekNavigator from "../components/WeekNavigator";
import WeekSheet from "../components/WeekSheet";
import ExportWeekPDF from "../components/ExportWeekPDF";

/* FIREBASE */
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import {
  addServizio,
  updateServizio,
  deleteServizio,
} from "../firebase/services";

/* UTILITIES */
const getLunedi = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const formatDate = (date) =>
  date.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const normalizeLunedi = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0];
};

const Homepage = () => {
  const [servizi, setServizi] = useState([]);
  const [volontari, setVolontari] = useState([]);

  const [settimanaCorrente, setSettimanaCorrente] = useState(
    getLunedi(new Date()),
  );

  const tableRef = useRef(null);

  /* LETTURA VOLONTARI DA FIRESTORE */
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
      },
      (error) => {
        console.error(error);
        alert("Errore nel caricamento dei volontari");
      },
    );

    return () => unsubscribe();
  }, []);

  /* LETTURA SERVIZI DA FIRESTORE */
  useEffect(() => {
    const settimanaKey = normalizeLunedi(settimanaCorrente);

    const q = query(
      collection(db, "servizi"),
      where("settimana", "==", settimanaKey),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const dati = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setServizi(dati);
      },
      (error) => {
        console.error(error);
        alert("Errore nel caricamento dei servizi");
      },
    );

    return () => unsubscribe();
  }, [settimanaCorrente]);

  return (
    <div className="container">
      <h1 className="text-center my-3">Calendario Servizi Settimanali</h1>

      <ExportWeekPDF
        tableRef={tableRef}
        settimanaCorrente={settimanaCorrente}
        formatDate={formatDate}
      />

      <WeekNavigator
        settimanaCorrente={settimanaCorrente}
        setSettimanaCorrente={setSettimanaCorrente}
        formatDate={formatDate}
      />

      <div ref={tableRef}>
        <WeekSheet
          servizi={servizi}
          settimanaCorrente={settimanaCorrente}
          formatDate={formatDate}
          volontari={volontari}
          onAdd={addServizio}
          onUpdate={updateServizio}
          onDelete={deleteServizio}
        />
      </div>
    </div>
  );
};

export default Homepage;
