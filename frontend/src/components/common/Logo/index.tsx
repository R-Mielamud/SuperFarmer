import React from "react";
import logo from "../../../assets/logo.svg";

interface Props {
	className?: string;
}

const Logo: React.FC<Props> = ({ className }) => {
	return <img src={logo} className={className} />;
};

export default Logo;
