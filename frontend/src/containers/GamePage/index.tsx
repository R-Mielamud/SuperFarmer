import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import Button from "../../components/common/Button";
import ModalLoader from "../../components/common/ModalLoader";
import GameToken, { TokenType } from "../../components/GameToken";
import getNumberSuffix from "../../helpers/number.helper";
import useIO from "../../hooks/useIO";
import { ClientEvents, ServerEvents } from "../../typings/socket";
import { RootState } from "../../typings/state";
import { loadProfileSuccess } from "../LoginPage/login/actions";
import styles from "./game.module.scss";

const gameLayout = [
	{
		count: 5,
		type: TokenType.Rabbit,
	},
	{
		count: 4,
		type: TokenType.Sheep,
	},
	{
		count: 3,
		type: TokenType.Pig,
	},
	{
		count: 4,
		type: [TokenType.SmallDog, TokenType.Cow, TokenType.Cow, TokenType.BigDog],
		selected: 1,
	},
	{
		count: 1,
		type: TokenType.Horse,
	},
];

interface DisabledSet {
	disabled: boolean;
	count?: number;
}

const getStateKey = (type: TokenType): keyof WebApi.Entity.GameState => {
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

const getDisabled = (
	index: number,
	lastIndex: number,
	key: keyof WebApi.Entity.GameState,
	state: WebApi.Entity.GameState,
): DisabledSet => {
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

const GamePage: React.FC = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { user } = useSelector((state: RootState) => state.auth);
	const [updateVal, update] = useState<number>(0);
	const [room, setRoom] = useState<WebApi.Entity.DetailedRoom | null>(null);
	const [controlsVisible, setControlsVisible] = useState<boolean>(true);
	const [canStart, setCanStart] = useState<boolean>(false);

	const [leaveRoom, setLeaveRoom] = useState<Callback | null>(null);
	const [leavingRoom, setLeavingRoom] = useState<boolean>(false);

	const [startGame, setStartGame] = useState<Callback | null>(null);
	const [startingGame, setStartingGame] = useState<boolean>(false);

	const [cancelGame, setCancelGame] = useState<Callback | null>(null);
	const [cancellingGame, setCancellingGame] = useState<boolean>(false);

	useIO(
		{
			handleOnce: (io) => {
				io.emit(ClientEvents.GET_CURRENT_ROOM, (room?: WebApi.Entity.DetailedRoom) => {
					if (!room) {
						return history.push("/");
					}

					if (room.connected > 1 && !controlsVisible) {
						setCanStart(true);
					}

					setRoom(room);
				});

				const newLeaveRoom = () => {
					io.emit(ClientEvents.LEAVE_ROOM);
				};

				const newStartGame = () => {
					io.emit(ClientEvents.START_GAME);
				};

				const newCancelGame = () => {
					io.emit(ClientEvents.CANCEL_GAME);
				};

				if (leavingRoom) {
					setLeavingRoom(false);
					newLeaveRoom();
				}

				if (startingGame) {
					setStartingGame(false);
					newStartGame();
				}

				if (cancellingGame) {
					setCancellingGame(false);
					newCancelGame();
				}

				setLeaveRoom(() => newLeaveRoom);
				setStartGame(() => newStartGame);
				setCancelGame(() => newCancelGame);
			},
			handle: (io) => {
				io.on(
					ServerEvents.JOINED_ROOM,
					({
						id,
						user: userId,
						number_in_room,
						game_state,
					}: {
						id: string;
						user: number;
						number_in_room: number;
						game_state: WebApi.Entity.GameState;
					}) => {
						if (id === room?.socket_id) {
							if (user?.is_room_admin && !canStart) {
								setCanStart(true);
							}

							setRoom({
								...room,
								opponents: [...room.opponents, userId],
								game_states: [...room.game_states, game_state],
							});
						}

						if (userId === user?.id) {
							dispatch(
								loadProfileSuccess({
									user: {
										...user,
										number_in_room,
									},
								}),
							);
						}
					},
				);

				io.on(ServerEvents.LEFT_ROOM, ({ user: userId }: { user: number }) => {
					if (user?.id === userId) {
						return history.push("/");
					}

					if (!room) {
						return;
					}

					const newOpponents = [...room.opponents];
					const index = newOpponents.findIndex((opp) => opp === userId);

					if (index > -1) {
						newOpponents.splice(index, 1);

						if (newOpponents.length < 2) {
							setCanStart(false);
						}

						setRoom({
							...room,
							opponents: [...newOpponents],
						});
					}
				});

				io.on(ServerEvents.GAME_STARTED, ({ id: socketId }: { id: string }) => {
					if (room?.socket_id === socketId && user?.is_room_admin) {
						setControlsVisible(false);
					}
				});

				io.on(ServerEvents.GAME_CANCELLED, ({ id: socketId }: { id: string }) => {
					if (room?.socket_id === socketId) {
						history.push("/");
					}
				});
			},
		},
		[room, user],
	);

	const renderLayout = (opponent?: number) => {
		const gameStates = room?.game_states;

		if (!gameStates) {
			return null;
		}

		const myState: WebApi.Entity.GameState | undefined = opponent
			? undefined
			: gameStates.find((state) => state.user === user?.id);

		const opponentState: WebApi.Entity.GameState = gameStates.find(
			(state) => state.user === opponent,
		) as WebApi.Entity.GameState;

		const bodyHeight = innerHeight - 110;
		const bodyWidth = innerWidth - 40;
		const opponentElementWidth = (bodyHeight / 100) * (bodyWidth < 860 ? 20 : 30);
		const currentElementWidth = bodyWidth < 460 ? bodyWidth : bodyWidth - opponentElementWidth;
		const totalWidth = (opponent ? opponentElementWidth : currentElementWidth) - 30;
		const tokenTotalWidth = (totalWidth / 100) * (100 - (gameLayout[0].count - 1) * 2);
		const width = tokenTotalWidth / gameLayout[0].count;

		return gameLayout.map((settings, i) => (
			<div className={styles.row} key={i}>
				{new Array(settings.count).fill(null).map((_, j) => {
					const type = Array.isArray(settings.type) ? settings.type[j] : settings.type;
					const stateKey: keyof WebApi.Entity.GameState = getStateKey(type);
					const main = j === (settings.selected ?? 0);

					const disabledSet = myState
						? getDisabled(j, settings.count - 1, stateKey, myState)
						: getDisabled(j, settings.count - 1, stateKey, opponentState);

					return (
						<div className={styles.cell} key={j}>
							<GameToken
								type={type}
								disabled={disabledSet.disabled}
								main={main}
								width={width}
								count={disabledSet.count}
								filled={!disabledSet.disabled && main}
							/>
						</div>
					);
				})}
			</div>
		));
	};

	const onResize = useCallback(() => {
		update((updateVal % 2) + 1);
	}, [updateVal]);

	const leave = () => {
		if (leaveRoom) {
			return leaveRoom();
		}

		setLeavingRoom(true);
	};

	const start = () => {
		if (startGame) {
			return startGame();
		}

		setStartingGame(true);
	};

	const cancel = () => {
		if (cancelGame) {
			return cancelGame();
		}

		setCancellingGame(true);
	};

	useEffect(() => {
		window.addEventListener("resize", onResize);
		return () => void window.removeEventListener("resize", onResize);
	}, [onResize]);

	if (!room || !user || leavingRoom || startingGame || cancellingGame) {
		return <ModalLoader />;
	}

	if (user.is_room_admin && !canStart && room.connected > 1) {
		setCanStart(true);
	}

	return (
		<div className={styles.container}>
			<div className={styles.controls}>
				{user.is_room_admin && controlsVisible ? (
					<div className={styles.buttons}>
						{canStart ? (
							<Button primary onClick={start}>
								Start game
							</Button>
						) : null}
						<Button onClick={cancel}>Cancel game</Button>
					</div>
				) : (
					<div className={styles.buttons}>
						<Button onClick={leave}>Leave room</Button>
					</div>
				)}
				<div className={styles.headers}>
					<h3 className={styles.header}>
						You&apos;re the {user.number_in_room}
						{getNumberSuffix(user.number_in_room)} player
					</h3>
				</div>
			</div>
			<div className={styles.mainWrapper}>
				<div className={styles.main}>
					<div className={styles.gameLayout}>{renderLayout()}</div>
				</div>
				<div className={styles.opponents}>
					{room.opponents.map((opponent, i) => (
						<div className={styles.opponent} key={i}>
							<div className={styles.gameLayout}>{renderLayout(opponent)}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default GamePage;
