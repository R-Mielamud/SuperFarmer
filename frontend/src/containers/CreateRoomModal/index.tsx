import React, { useState } from "react";
import { useHistory } from "react-router";
import Button, { ButtonType } from "../../components/common/Button";
import Form from "../../components/common/Form";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import ModalLoader from "../../components/common/ModalLoader";
import useIO from "../../hooks/useIO";
import { ClientEvents } from "../../typings/socket";
import styles from "./createRoom.module.scss";

interface Props {
	open: boolean;
	onCancel: Callback;
}

const CreateRoomModal: React.FC<Props> = ({ open, onCancel }) => {
	const history = useHistory();
	const [nameValue, setNameValue] = useState<string>("");
	const [creatingName, setCreatingName] = useState<string | null>(null);
	const [createRoom, setCreateRoom] = useState<Setter<string> | null>(null);

	const create = (name: string) => {
		setCreatingName(name);

		if (createRoom) {
			createRoom(name);
		}
	};

	const created = (id: string) => {
		history.push(`/game/${id}`);
	};

	useIO((io) => {
		io.on("connect", () => {
			const newCreateRoom = (name: string) => {
				io.emit(ClientEvents.CREATE_ROOM, name, (socketID: string) => {
					created(socketID);
				});
			};

			if (creatingName) {
				newCreateRoom(creatingName);
				setCreatingName(null);
			}

			setCreateRoom(() => newCreateRoom);
		});
	});

	if (creatingName) {
		return <ModalLoader />;
	}

	return (
		<Modal open={open}>
			<h2 className={styles.header}>Create room</h2>
			<Form>
				<Input placeholder="Name" fluid value={nameValue} onChange={(value) => setNameValue(value)} />
				<div className={styles.buttons}>
					<Button onClick={onCancel}>Cancel</Button>
					<Button type={ButtonType.Submit} primary onClick={() => create(nameValue)}>
						Create
					</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default CreateRoomModal;
