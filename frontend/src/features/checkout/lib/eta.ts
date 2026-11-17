import { DELIVERY_ETA_MINUTES } from "../../../lib/constants";

export const etaWords = (minutes = DELIVERY_ETA_MINUTES) => {
  if (minutes < 60) return `${minutes} minutes`;
  const hours = minutes / 60;
  return Number.isInteger(hours) ? `${hours} ${hours === 1 ? "hour" : "hours"}` : `${minutes} minutes`;
};

/** "within 2 hours" */
export const deliveryPromise = (minutes = DELIVERY_ETA_MINUTES) => `within ${etaWords(minutes)}`;

/** "3:40 PM" */
export const arriveBy = (from: Date | string, minutes = DELIVERY_ETA_MINUTES) =>
  new Intl.DateTimeFormat("en-PK", { hour: "numeric", minute: "2-digit" }).format(
    new Date(new Date(from).getTime() + minutes * 60000),
  );
