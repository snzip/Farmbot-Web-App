import { createStore } from "redux";
import { Store } from "./interfaces";
import { rootReducer } from "./root_reducer";
import { registerSubscribers } from "./subscribers";
import { getMiddleware } from "./middlewares";

const ENV = process.env.NODE_ENV || "development";

function dev() {
  store = createStore(rootReducer as any,
    maybeFetchOldState(),
    getMiddleware("development"));
  return store;
}

function prod() {
  return createStore(rootReducer as any, ({} as any), getMiddleware("production"));
}

export function configureStore(options = {}) {
  const store2: Store = (ENV === "production" ? prod() : dev());
  // Make store global in case I need to probe it.
  (window as any)["store"] = store2;
  registerSubscribers(store2);
  return store2;
}

export let store = configureStore();

/** Tries to fetch previous state from `sessionStorage`.
 * Returns {} if nothing is found. Used mostly for hot reloading. */
function maybeFetchOldState() {
  try {
    return JSON.parse(sessionStorage["lastState"] || "{}");
  } catch (e) {
    return {};
  }

}
