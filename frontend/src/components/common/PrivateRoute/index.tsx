import React from "react";
import { Route, RouteProps, Redirect } from "react-router";

interface OwnProps {
	component: ReactComponent;
	isAuthorized: boolean;
}

type Props = RouteProps & OwnProps;

const PrivateRoute: React.FC<Props> = ({ isAuthorized, component, ...rest }) => {
	const Component: ReactComponent = isAuthorized ? component : () => <Redirect to="/" />;
	return <Route component={Component} {...rest} />;
};

export default PrivateRoute;
