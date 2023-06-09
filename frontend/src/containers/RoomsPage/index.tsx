import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import Button from "../../components/common/Button";
import ModalLoader from "../../components/common/ModalLoader";
import useIO from "../../hooks/useIO";
import { ClientEvents, ServerEvents } from "../../typings/socket";
import { RootState } from "../../typings/state";
import CreateRoomModal from "../CreateRoomModal";
import { loadProfileSuccess } from "../LoginPage/login/actions";
import styles from "./rooms.module.scss";

const RoomsPage: React.FC = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { user } = useSelector((state: RootState) => state.auth);
	const [rooms, setRooms] = useState<WebApi.Entity.Room[] | null>(null);
	const [connectingRoom, setConnectingRoom] = useState<string | null>(null);
	const [connectRoom, setConnectRoom] = useState<Setter<string> | null>(null);
	const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

	const connected = () => {
		history.push("/game");
	};

	const connect = (socketID: string) => () => {
		if (connectRoom) {
			return connectRoom(socketID);
		}

		setConnectingRoom(socketID);
	};

	const removeRoom = (socketId: string) => {
		if (!rooms || !rooms.length) {
			return;
		}

		const newRooms = [...rooms];
		const index = newRooms.findIndex((room) => room.socket_id === socketId);

		if (index > -1) {
			newRooms.splice(index, 1);
			setRooms(newRooms);
		}
	};

	useIO(
		{
			handleOnce: (io) => {
				io.emit(ClientEvents.GET_ROOMS, setRooms);

				const newConnectRoom = (socketID: string) => {
					io.emit(ClientEvents.JOIN_ROOM, socketID);
				};

				if (connectingRoom) {
					setConnectingRoom(null);
					newConnectRoom(connectingRoom);
				}

				setConnectRoom(() => newConnectRoom);
			},
			handle: (io) => {
				io.on(
					ServerEvents.JOINED_ROOM,
					({
						id: socketID,
						user: userID,
						number_in_room,
					}: {
						id: string;
						user: number;
						number_in_room: number;
					}) => {
						if (user?.id === userID) {
							dispatch(loadProfileSuccess({ user: { ...user, number_in_room, is_room_admin: false } }));
							return connected();
						}

						if (connectingRoom || !rooms || !user) {
							return;
						}

						const newRooms = [...rooms];
						const index = rooms.findIndex((room) => room.socket_id === socketID);

						if (index < 0) {
							return;
						}

						const newRoom = { ...newRooms[index] };

						if (newRoom.connected === 3) {
							newRooms.splice(index, 1);
						} else {
							newRoom.connected += 1;
							newRooms[index] = newRoom;
						}

						setRooms(newRooms);
					},
				);

				io.on(ServerEvents.LEFT_ROOM, ({ id, connected }: { id: string; user: number; connected: number }) => {
					if (connected === 0 && rooms) {
						const newRooms = [...rooms];
						const index = newRooms.findIndex((room) => room.socket_id === id);

						if (index > -1) {
							newRooms.splice(index, 1);
							setRooms(newRooms);
						}
					}
				});

				io.on(ServerEvents.CREATED_ROOM, (room: WebApi.Entity.Room) => {
					if (connectingRoom || !user) {
						return;
					}

					const newRooms = [...(rooms ?? []), room];
					setRooms(newRooms);

					if (room.admin === user.id) {
						dispatch(loadProfileSuccess({ user: { ...user, number_in_room: 1, is_room_admin: true } }));
						connected();
					}
				});

				io.on(ServerEvents.GAME_STARTED, ({ id: socketId, admin }: { id: string; admin: number }) => {
					if (admin !== user?.id) {
						removeRoom(socketId);
					}
				});

				io.on(ServerEvents.GAME_CANCELLED, ({ id: socketId, admin }: { id: string; admin: number }) => {
					if (admin !== user?.id) {
						removeRoom(socketId);
					}
				});
			},
		},
		[rooms, user],
	);

	if (!user) {
		return null;
	}

	if (user.room) {
		connected();
	}

	if (!rooms) {
		return <ModalLoader />;
	}

	return (
		<div>
			{connectingRoom ? <ModalLoader /> : null}
			<Button primary onClick={() => setCreateModalOpen(true)}>
				Create room
			</Button>
			<CreateRoomModal open={createModalOpen} onCancel={() => setCreateModalOpen(false)} />
			<div className={styles.rooms}>
				{rooms.map((room) => (
					<div className={styles.room} key={room.id}>
						<h3 className={styles.header}>{room.name}</h3>
						<span>({room.connected} of 4 connected)</span>
						<Button onClick={connect(room.socket_id)} className={styles.button}>
							Connect
						</Button>
					</div>
				))}
			</div>
		</div>
	);
};

export default RoomsPage;
