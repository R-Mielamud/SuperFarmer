import React from "react";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classList from "../../../helpers/classList.helper";
import styles from "./icon.module.scss";

export enum IconType {
	Solid = "fas",
	Regular = "far",
	Brand = "fab",
}

export interface IconSettings {
	type?: IconType;
	name: IconName;
}

interface Props {
	name: IconName;
	type?: IconType;
	className?: string;
	onClick?: Callback;
}

const Icon: React.FC<Props> = ({ type = IconType.Solid, name, className, onClick }) => {
	const classes = classList({ [className ?? ""]: className }, styles.icon);
	return (
		<i aria-hidden="true">
			<FontAwesomeIcon icon={[type, name]} className={classes} onClick={onClick} />
		</i>
	);
};

export default Icon;
