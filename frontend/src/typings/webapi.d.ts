type IDField = "id";

interface Identified {
	[key: IDField]: number;
}

type Unidentify<M> = Omit<M, IDField>;

namespace WebApi.Entity {
	interface User extends Identified {
		email: string;
		username: string;
		first_name?: string;
		last_name?: string;
	}
}

namespace WebApi.Requests {
	interface UserRegister extends Unidentify<WebApi.Entity.User> {
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
