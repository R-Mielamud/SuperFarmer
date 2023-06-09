import React from "react";
import DefaultPageWrapper from "../../containers/DefaultPageWrapper";
import RoomsPage from "../../containers/RoomsPage";

const Rooms: React.FC = () => {
	return (
		<DefaultPageWrapper>
			<RoomsPage />
		</DefaultPageWrapper>
	);
};

export default Rooms;
