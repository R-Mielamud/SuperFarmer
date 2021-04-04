type IDField = "id";

interface Identified {
	id: number;
}

type Unidentify<M> = Omit<M, IDField>;

namespace WebApi.Entity {
	interface User extends Identified {
		email: string;
		username: string;
		first_name?: string;
		last_name?: string;
		room?: string;
	}

	interface GameState extends Identified {
		user: number;
		rabbits: number;
		sheep: number;
		pigs: number;
		cows: number;
		horses: number;
	}

	interface Room extends Identified {
		game_states: GameState[];
		name: string;
		socket_id: string;
		connected: number;
	}
}

namespace WebApi.Requests {
	interface UserRegister extends Omit<Unidentify<WebApi.Entity.User>, "room"> {
		password: string;
	}

	interface UserLogin {
		email: string;
		password: string;
	}
}

namespace WebApi.Specific {
	interface AuthResult {
		user: WebApi.Entity.User;
		jwt_token: string;
	}
}
