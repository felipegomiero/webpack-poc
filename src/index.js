import "./styles.css";
import "babel-polyfill";
import _ from "lodash";

function component() {
	const element = document.createElement("div");
	const btn = document.createElement("button");

	element.innerHTML = _.join(["Hello", "webpack"], " ");

	btn.innerHTML = "Click me and check the console!";
	btn.onclick = (e) =>
		import(/* webpackChunkName: "print" */ "./print").then((module) => {
			const print = module.default;

			print();
		});

	element.appendChild(btn);

	return element;
}

let element = component(); // Store the element to re-render on print.js changes
document.body.appendChild(element);

if (module.hot) {
	module.hot.accept("./print.js", function () {
		console.log("Accepting the updated printMe module!");
		document.body.removeChild(element);
		element = component(); // Re-render the "component" to update the click handler
		document.body.appendChild(element);
	});
}

if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register("/service-worker.js")
			.then((registration) => {
				console.log("SW registered: ", registration);
			})
			.catch((registrationError) => {
				console.log("SW registration failed: ", registrationError);
			});
	});
}
