import { TokenType } from "../components/GameToken";

export const getStateKey = (type: TokenType): keyof WebApi.Entity.GameState => {
	switch (type) {
		case TokenType.Sheep:
			return "sheep";
		case TokenType.Pig:
			return "pigs";
		case TokenType.Cow:
			return "cows";
		case TokenType.Horse:
			return "horses";
		case TokenType.SmallDog:
			return "has_small_dog";
		case TokenType.BigDog:
			return "has_big_dog";
		case TokenType.Rabbit:
		default:
			return "rabbits";
	}
};

export const getDiceStringTokenType = (type: TokenType): string => {
	switch (type) {
		case TokenType.Fox:
			return "fox";
		case TokenType.Wolf:
			return "wolf";
		default:
			return getStateKey(type);
	}
};

export const getTokenTypeByKey = (key: string): TokenType => {
	switch (key) {
		case "sheep":
			return TokenType.Sheep;
		case "pigs":
			return TokenType.Pig;
		case "cows":
			return TokenType.Cow;
		case "horses":
			return TokenType.Horse;
		case "has_small_dog":
			return TokenType.SmallDog;
		case "has_big_dog":
			return TokenType.BigDog;
		case "fox":
			return TokenType.Fox;
		case "wolf":
			return TokenType.Wolf;
		case "rabbits":
		default:
			return TokenType.Rabbit;
	}
};

export const getDisabled = (
	index: number,
	lastIndex: number,
	key: keyof WebApi.Entity.GameState,
	state: WebApi.Entity.GameState,
): WebApi.Specific.DisabledSet => {
	switch (key) {
		case "has_big_dog":
		case "has_small_dog":
			return { disabled: !state[key] };
		default: {
			const value = state[key];
			const indexed = value - index;

			return {
				count: indexed < 2 || index < lastIndex ? undefined : indexed,
				disabled: indexed <= 0,
			};
		}
	}
};

export const getLocalizedTokenStringType = (type: TokenType): string => {
	// TODO: Localization
	switch (type) {
		case TokenType.Sheep:
			return "Sheep";
		case TokenType.Pig:
			return "Pig";
		case TokenType.Cow:
			return "Cow";
		case TokenType.Horse:
			return "Horse";
		case TokenType.SmallDog:
			return "Small dog";
		case TokenType.BigDog:
			return "Big dog";
		case TokenType.Fox:
			return "Fox";
		case TokenType.Wolf:
			return "Wolf";
		case TokenType.Rabbit:
		default:
			return "Rabbit";
	}
};
