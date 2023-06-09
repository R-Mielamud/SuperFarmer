import React from "react";
import DefaultPageWrapper from "../../containers/DefaultPageWrapper";
import GamePage from "../../containers/GamePage";

const Game: React.FC = () => {
	return (
		<DefaultPageWrapper>
			<GamePage />
		</DefaultPageWrapper>
	);
};

export default Game;
