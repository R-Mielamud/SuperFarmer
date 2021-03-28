import React from "react";
import { Route, RouteProps, Redirect } from "react-router";

interface OwnProps {
	component: ReactComponent;
	isAuthorized: boolean;
	restricted?: boolean;
}

type Props = RouteProps & OwnProps;

const PublicRoute: React.FC<Props> = ({ component, isAuthorized, restricted, ...rest }) => {
	const Component: ReactComponent = isAuthorized && restricted ? () => <Redirect to="/" /> : component;
	return <Route component={Component} {...rest} />;
};

export default PublicRoute;
