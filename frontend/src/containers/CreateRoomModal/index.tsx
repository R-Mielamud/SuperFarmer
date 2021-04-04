import React from "react";
import Button, { ButtonType } from "../../components/common/Button";
import Form from "../../components/common/Form";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import styles from "./createRoom.module.scss";

const CreateRoomModal: React.FC = () => {
	return (
		<Modal>
			<h2 className={styles.header}>Create room</h2>
			<Form>
				<Input placeholder="Name" fluid />
				<div className={styles.buttons}>
					<Button>Cancel</Button>
					<Button type={ButtonType.Submit} primary>
						Create
					</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default CreateRoomModal;
