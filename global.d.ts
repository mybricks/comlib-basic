declare module '*.less' {
  const classes: { [key: string]: string };
  export default classes;
}

type T_Props = {env, data, slots, inputs}
