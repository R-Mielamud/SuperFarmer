import { NotificationManager } from "react-notifications";

export const error = (message: string, timeout: number = 3000): void => {
	return NotificationManager.error(message, "Error", timeout);
};
