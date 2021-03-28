import { library } from "@fortawesome/fontawesome-svg-core";
import * as _ from "@fortawesome/free-solid-svg-icons";

const usedIcons = [_.faEye, _.faEyeSlash, _.faAt, _.faUser];

export default function configureFontawesome() {
	library.add(...usedIcons);
}
