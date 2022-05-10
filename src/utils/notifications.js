import { showNotification } from "@mantine/notifications";
import { Check, InfoCircle, X } from "tabler-icons-react";

export function showSuccessNotification(title, message) {
  showNotification({
    title,
    message,
    icon: <Check size={18} />
  })
}

export function showErrorNotification(title, message) {
  showNotification({
    title,
    message,
    color: "red",
    icon: <X size={18} />
  })
}

export function showInfoNotification(title, message) {
  showNotification({
    title,
    message,
    icon: <InfoCircle size={18} />
  })
}