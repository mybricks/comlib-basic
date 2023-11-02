import { createContext } from "react";

const RuntimeContext = createContext<RuntimeParams<any>>(
  {} as RuntimeParams<any>
);

export { RuntimeContext };
