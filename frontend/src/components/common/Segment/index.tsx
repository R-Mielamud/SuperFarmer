import React from "react";
import classList from "../../../helpers/classList.helper";
import styles from "./segment.module.scss";

interface OwnProps {
	className?: string;
}

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & OwnProps;

const Segment: React.FC<Props> = ({ children, className, ...rest }) => {
	return (
		<div className={classList({ [className ?? ""]: className }, styles.segment)} {...rest}>
			{children}
		</div>
	);
};

export default Segment;
