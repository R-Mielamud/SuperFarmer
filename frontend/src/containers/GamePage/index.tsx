import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import Button from "../../components/common/Button";
import ModalLoader from "../../components/common/ModalLoader";
import Dice from "../../components/Dice";
import GameToken, { TokenType } from "../../components/GameToken";
import getNumberSuffix from "../../helpers/number.helper";
import useIO from "../../hooks/useIO";
import { ClientEvents, ServerEvents } from "../../typings/socket";
import { RootState } from "../../typings/state";
import { loadProfileSuccess } from "../LoginPage/login/actions";
import { getDisabled, getStateKey, getTokenTypeByKey, getDiceStringTokenType } from "../../helpers/gameToken.helper";
import classList from "../../helpers/classList.helper";
import styles from "./game.module.scss";
import ExchangeModal from "../../components/ExchangeModal";
import { OnExchangeToProps } from "../../components/Exchanger";
import WinnerModal from "../../components/WinnerModal";

interface GameLayoutItem {
	count: number;
	type: TokenType | TokenType[];
	selected?: number;
	numericCountStart?: number;
	numericCountEnd?: number;
}

const gameLayout: GameLayoutItem[] = [
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
		selected: 2,
		numericCountStart: 2,
		numericCountEnd: 3,
	},
	{
		count: 1,
		type: TokenType.Horse,
	},
];

const etalonLineTokenCount = 5;

const GamePage: React.FC = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { user } = useSelector((state: RootState) => state.auth);
	const [updateVal, update] = useState<number>(0);
	const [room, setRoom] = useState<WebApi.Entity.DetailedRoom | null>(null);
	const [controlsVisible, setControlsVisible] = useState<boolean>(true);
	const [canStart, setCanStart] = useState<boolean>(false);
	const [myTurn, setMyTurn] = useState<boolean>(false);
	const [receivedDiceProcessed, setReceivedDiceProcessed] = useState<boolean>(false);
	const [exchangeModalOpened, setExchangeModalOpen] = useState<boolean>(false);
	const [winner, setWinner] = useState<WebApi.Entity.User | null>(null);

	const [setDiceFirst, setSetDiceFirst] = useState<Setter<TokenType> | null>(null);
	const [setDiceSecond, setSetDiceSecond] = useState<Setter<TokenType> | null>(null);

	const [leaveRoom, setLeaveRoom] = useState<Callback | null>(null);
	const [leavingRoom, setLeavingRoom] = useState<boolean>(false);

	const [startGame, setStartGame] = useState<Callback | null>(null);
	const [startingGame, setStartingGame] = useState<boolean>(false);

	const [cancelGame, setCancelGame] = useState<Callback | null>(null);
	const [cancellingGame, setCancellingGame] = useState<boolean>(false);

	const [processDice, setProcessDice] = useState<Setter<WebApi.Specific.DiceData> | null>(null);
	const [processingDice, setProcessingDice] = useState<WebApi.Specific.DiceData | null>(null);

	const [rollDiceAndEmit, setRollDiceAndEmit] = useState<Callback | null>(null);
	const [rollingDice, setRollingDice] = useState<boolean>(false);

	const [completeTurn, setCompleteTurn] = useState<Callback | null>(null);
	const [completingTurn, setCompletingTurn] = useState<boolean>(false);

	const [exchangeTokens, setExchangeTokens] = useState<Setter<OnExchangeToProps> | null>(null);
	const [exchangingTokens, setExchangingTokens] = useState<OnExchangeToProps | null>(null);

	useIO(
		{
			handleOnce: (io) => {
				io.emit(ClientEvents.GET_CURRENT_ROOM, (room?: WebApi.Entity.DetailedRoom) => {
					if (!room || !user) {
						return history.push("/");
					}

					if (room.connected > 1 && !room.game_started) {
						setControlsVisible(false);
						setCanStart(true);
					}

					if (room.current_turn === user.number_in_room) {
						setMyTurn(true);

						if (room.last_processed_dice !== user.number_in_room && room.game_started) {
							roll();
						}
					}

					if (room.last_processed_dice === user.number_in_room) {
						setReceivedDiceProcessed(true);
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

				const newProcessDice = (value: WebApi.Specific.DiceData) => {
					setReceivedDiceProcessed(false);
					io.emit(ClientEvents.PROCESS_DICE, value);
				};

				const newCompleteTurn = () => {
					io.emit(ClientEvents.COMPLETE_TURN);
				};

				const newExchangeTokens = ({ first, second }: OnExchangeToProps) => {
					io.emit(ClientEvents.EXCHANGE_TOKENS, {
						first: {
							key: getStateKey(first.type),
							count: first.count,
						},
						second: {
							key: getStateKey(second.type),
							count: second.count,
						},
					});
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

				if (processingDice) {
					const swap = { ...processingDice };
					setProcessingDice(null);
					newProcessDice(swap);
				}

				if (completingTurn) {
					setCompletingTurn(false);
					newCompleteTurn();
				}

				if (exchangingTokens) {
					newExchangeTokens(exchangingTokens);
					setExchangingTokens(null);
				}

				setLeaveRoom(() => newLeaveRoom);
				setStartGame(() => newStartGame);
				setCancelGame(() => newCancelGame);
				setProcessDice(() => newProcessDice);
				setCompleteTurn(() => newCompleteTurn);
				setExchangeTokens(() => newExchangeTokens);
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
						dispatch(loadProfileSuccess({ user: { ...user, room: undefined } }));
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
					if (room?.socket_id === socketId) {
						if (user?.is_room_admin) {
							setControlsVisible(false);
						}

						setCanStart(false);
						setRoom({ ...room, game_started: true });

						if (room?.current_turn === user?.number_in_room) {
							setMyTurn(true);
							roll();
						}
					}
				});

				io.on(ServerEvents.GAME_CANCELLED, ({ id: socketId }: { id: string }) => {
					if (room?.socket_id === socketId) {
						history.push("/");
					}
				});

				io.on(
					ServerEvents.DICE_PROCESSED,
					({ data, game_state }: { data: WebApi.Specific.DiceData; game_state: WebApi.Entity.GameState }) => {
						if (!room) {
							return;
						}

						if (setDiceFirst && setDiceSecond) {
							setDiceFirst(getTokenTypeByKey(data.first));
							setDiceSecond(getTokenTypeByKey(data.second));
						}

						const newGameStates = [...room.game_states];
						const index = newGameStates.findIndex((state) => state.id === game_state.id);

						if (index < 0) {
							return;
						}

						newGameStates[index] = { ...game_state };
						setRoom({ ...room, game_states: newGameStates });
						setReceivedDiceProcessed(true);
					},
				);

				io.on(ServerEvents.NEXT_TURN, ({ room: roomId, user: userId }: { room: string; user: number }) => {
					if (roomId !== room?.socket_id || !user) {
						return;
					}

					if (userId === user.id) {
						setMyTurn(true);
						setReceivedDiceProcessed(false);

						return roll();
					}

					if (myTurn) {
						setMyTurn(false);
					}
				});

				io.on(
					ServerEvents.EXCHANGED_TOKENS,
					({
						game_state,
						user: userId,
						room: roomId,
					}: {
						game_state: WebApi.Entity.GameState;
						user: number;
						room: string;
					}) => {
						if (roomId !== room?.socket_id) {
							return;
						}

						const index = room.game_states.findIndex((state) => state.user === userId);

						if (index < 0) {
							return;
						}

						const newStates = [...room.game_states];
						newStates[index] = game_state;
						setRoom({ ...room, game_states: newStates });
					},
				);

				io.on(
					ServerEvents.GAME_FINISHED,
					({ winner, room: roomId }: { winner: WebApi.Entity.User; room: string }) => {
						if (roomId !== room?.socket_id) {
							return;
						}

						setWinner(winner);
					},
				);
			},
		},
		[room, user],
	);

	const bodyHeight = useMemo<number>(() => innerHeight - 110, [innerHeight]);
	const bodyWidth = useMemo<number>(() => innerWidth - 40, [innerWidth]);

	const opponentElementWidth = useMemo<number>(() => (bodyHeight / 100) * (bodyWidth < 860 ? 20 : 30), [
		bodyHeight,
		bodyWidth,
	]);

	const totalWidth = useMemo<number>(() => (bodyWidth < 460 ? bodyWidth : bodyWidth - opponentElementWidth) - 30, [
		bodyWidth,
		opponentElementWidth,
	]);

	const tokenTotalWidth = useMemo<number>(() => (totalWidth / 100) * (100 - (etalonLineTokenCount - 1) * 2), [
		totalWidth,
	]);

	const width = useMemo<number>(() => tokenTotalWidth / etalonLineTokenCount, [tokenTotalWidth]);
	const opponentTotalWidth = useMemo<number>(() => opponentElementWidth - 30, [opponentElementWidth]);
	const opponentTokenWidth = useMemo<number>(() => opponentTotalWidth / etalonLineTokenCount, [opponentTotalWidth]);

	const myStateOnly = useMemo<WebApi.Entity.GameState | null>(() => {
		const gameStates = room?.game_states;

		if (!gameStates) {
			return null;
		}

		return gameStates.find((state) => state.user === user?.id) ?? null;
	}, [room?.game_states]);

	const renderLayout = useCallback(
		(opponent?: number) => {
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

			const currerntWidth = myState ? width : opponentTokenWidth;

			return gameLayout.map((settings, i) => (
				<div className={styles.row} key={i}>
					{new Array(settings.count).fill(null).map((_, j) => {
						const type = Array.isArray(settings.type) ? settings.type[j] : settings.type;
						const stateKey = getStateKey(type);
						const main = j === (settings.selected ?? 1) - 1;
						let disabledIndex = j;
						let lastIndex = settings.count - 1;

						if (
							settings.numericCountStart &&
							settings.numericCountEnd &&
							settings.numericCountStart <= j + 1 &&
							settings.numericCountEnd >= j + 1
						) {
							const start = settings.numericCountStart ?? 1;
							disabledIndex = j - start + 1;
							lastIndex = settings.count - start - 1;
						}

						if (settings.selected) {
							console.log(disabledIndex, lastIndex);
						}

						const disabledSet = myState
							? getDisabled(disabledIndex, lastIndex, stateKey, myState)
							: getDisabled(disabledIndex, lastIndex, stateKey, opponentState);

						return (
							<div className={styles.cell} key={j}>
								<GameToken
									type={type}
									disabled={disabledSet.disabled}
									main={main}
									width={currerntWidth}
									count={disabledSet.count}
									filled={!disabledSet.disabled && main}
								/>
							</div>
						);
					})}
				</div>
			));
		},
		[opponentTokenWidth, width, room, user],
	);

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

	const diceProcess = (value: WebApi.Specific.DiceData) => {
		if (processDice) {
			return processDice(value);
		}

		setProcessingDice(value);
	};

	const roll = () => {
		if (rollDiceAndEmit) {
			return rollDiceAndEmit();
		}

		setRollingDice(true);
	};

	const complete = () => {
		if (completeTurn) {
			return completeTurn();
		}

		setCompletingTurn(true);
	};

	const exhange = (data: OnExchangeToProps) => {
		if (exchangeTokens) {
			return exchangeTokens(data);
		}

		setExchangingTokens(data);
	};

	useEffect(() => {
		window.addEventListener("resize", onResize);
		return () => void window.removeEventListener("resize", onResize);
	}, [onResize]);

	useEffect(() => {
		if (rollingDice && rollDiceAndEmit) {
			rollDiceAndEmit();
		}
	});

	if (!room || !user || !myStateOnly || leavingRoom || startingGame || cancellingGame) {
		return <ModalLoader />;
	}

	if (user.is_room_admin && !canStart && room.connected > 1) {
		setCanStart(true);
	}

	return (
		<div className={styles.container}>
			<ExchangeModal
				gameState={myStateOnly}
				open={exchangeModalOpened}
				onExchange={exhange}
				onClose={() => setExchangeModalOpen(false)}
			/>
			{winner ? <WinnerModal winner={winner} onClose={() => window.location.replace("/")} /> : null}
			<div className={styles.controls}>
				{user.is_room_admin && !room.game_started && controlsVisible ? (
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
						{!room.game_started ? (
							<Button onClick={leave}>Leave room</Button>
						) : (
							<>
								<Button onClick={complete} disabled={!myTurn || !receivedDiceProcessed}>
									Complete turn
								</Button>
								<Button
									onClick={() => setExchangeModalOpen(true)}
									disabled={!myTurn || !receivedDiceProcessed}
								>
									Exchange tokens
								</Button>
							</>
						)}
					</div>
				)}
				<div className={styles.headers}>
					<h3 className={styles.header}>
						You&apos;re the {user.number_in_room}
						{getNumberSuffix(user.number_in_room)} player
					</h3>
					{myTurn && room?.game_started ? (
						<h3 className={classList({}, styles.header, styles.myTurn)}>Your turn!</h3>
					) : null}
				</div>
			</div>
			<div className={styles.mainWrapper}>
				<div className={styles.main}>
					<div className={styles.gameLayout}>
						{renderLayout()}
						<Dice
							initializedRoll={(roll, setFirst, setSecond) => {
								const newRoll = async () => {
									const [first, second] = await roll();

									diceProcess({
										first: getDiceStringTokenType(first),
										second: getDiceStringTokenType(second),
									});
								};

								if (rollingDice) {
									setRollingDice(false);
									newRoll();
								}

								setSetDiceFirst(() => setFirst);
								setSetDiceSecond(() => setSecond);
								setRollDiceAndEmit(() => newRoll);
							}}
							leftProps={{ width, className: styles.firstDicePart }}
							rightProps={{ width, className: styles.secondDicePart }}
						/>
					</div>
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
