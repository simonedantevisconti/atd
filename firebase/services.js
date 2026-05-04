// src/firebase/services.js
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

/* SERVIZI SETTIMANALI */

const serviziRef = collection(db, "servizi");

export async function addServizio(data) {
  const payload = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(serviziRef, payload);
  return docRef.id;
}

export async function updateServizio(id, data) {
  const ref = doc(db, "servizi", id);

  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteServizio(id) {
  const ref = doc(db, "servizi", id);
  await deleteDoc(ref);
}

/* VOLONTARI / CONTATTI */

const volontariRef = collection(db, "volontari");

export async function addVolontario(data) {
  const payload = {
    nome: data.nome || "",
    cognome: data.cognome || "",
    ruolo: data.ruolo || "Volontario",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(volontariRef, payload);
  return docRef.id;
}

export async function updateVolontario(id, data) {
  const ref = doc(db, "volontari", id);

  await updateDoc(ref, {
    nome: data.nome || "",
    cognome: data.cognome || "",
    ruolo: data.ruolo || "Volontario",
    updatedAt: serverTimestamp(),
  });
}

export async function deleteVolontario(id) {
  const ref = doc(db, "volontari", id);
  await deleteDoc(ref);
}
