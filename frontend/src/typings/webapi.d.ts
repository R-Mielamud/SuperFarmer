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
		is_room_admin: boolean;
		number_in_room: number;
	}

	interface GameState extends Identified {
		user: number;
		rabbits: number;
		sheep: number;
		pigs: number;
		cows: number;
		horses: number;
		has_small_dog: boolean;
		has_big_dog: boolean;
	}

	interface Room extends Identified {
		name: string;
		socket_id: string;
		connected: number;
		admin?: number;
	}

	interface DetailedRoom extends Room {
		game_states: GameState[];
		opponents: number[];
	}
}

namespace WebApi.Requests {
	interface UserRegister {
		email: string;
		username: string;
		first_name?: string;
		last_name?: string;
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
