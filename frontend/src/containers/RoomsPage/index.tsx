import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import Button from "../../components/common/Button";
import ModalLoader from "../../components/common/ModalLoader";
import useIO from "../../hooks/useIO";
import { ClientEvents, ServerEvents } from "../../typings/socket";
import { RootState } from "../../typings/state";
// import CreateRoomModal from "../CreateRoomModal";
import styles from "./rooms.module.scss";

const RoomsPage: React.FC = () => {
	const history = useHistory();
	const { user } = useSelector((state: RootState) => state.auth);
	const [rooms, setRooms] = useState<WebApi.Entity.Room[] | null>(null);
	const [connectingRoom, setConnectingRoom] = useState<string | null>(null);
	const [connectRoom, setConnectRoom] = useState<Setter<string> | null>(null);

	const connected = (id: string) => {
		history.push(`/game/${id}`);
	};

	const connect = (socketID: string) => () => {
		if (!connectRoom) {
			setConnectingRoom(socketID);
		} else {
			connectRoom(socketID);
		}
	};

	useIO(
		(io) => {
			io.on("connect", () => {
				io.emit(ClientEvents.GET_ROOMS, setRooms);

				const newConnectRoom = (socketID: string) => {
					io.emit(ClientEvents.JOIN_ROOM, socketID, (socketID: string | void) => {
						if (socketID) {
							connected(socketID);
							setConnectingRoom("");
						}
					});
				};

				if (connectingRoom) {
					newConnectRoom(connectingRoom);
					setConnectingRoom(null);
				}

				setConnectRoom(() => newConnectRoom);
			});

			io.on(ServerEvents.JOINED_ROOM, (socketID) => {
				if (connectingRoom || !rooms) {
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
			});
		},
		[rooms],
	);

	if (!user) {
		return null;
	}

	// if (user.room) {
	// 	connected(user.room);
	// }

	if (!rooms) {
		return <ModalLoader />;
	}

	return (
		<div>
			{connectingRoom ? <ModalLoader /> : null}
			<Button primary>Create room</Button>
			{/* <CreateRoomModal /> */}
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
