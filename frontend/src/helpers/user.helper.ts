export default function getFullName(user: WebApi.Entity.User) {
	if (user.first_name) {
		return `${user.username} (${user.first_name} ${user.last_name ? ` ${user.last_name}` : ""})`;
	}

	return user.username;
}
