import { proxy, useSnapshot } from "valtio";
import { addVerifiedCarbon, getVerifiedCarbonForProject, removeVerifiedCarbon } from "./contract";

export const projects = proxy({
  list: []
});

export const useProjects = () => useSnapshot(projects);

export async function loadVerifiedKg() {
  const verifiedKg = await getVerifiedCarbonForProject(project.id);
  project.verifiedKg = verifiedKg;
}

export function setName(name) {
  project.name = name;
}

export function setImage(image) {
  project.image = image;
}

export function setPriceKg(priceKg) {
  project.priceKg = priceKg;
}

export async function setVerifiedKg(verifiedKg) {
  if (verifiedKg >= project.verifiedKg) {
    const response = await addVerifiedCarbon(project.id, verifiedKg-project.verifiedKg);
  } else {
    const response = await removeVerifiedCarbon(project.id, project.verifiedKg-verifiedKg);
  }
}