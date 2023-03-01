declare module '*.less' {
  const classes: { [key: string]: string };
  export default classes;
}

interface T_Props {
  outputs: {
    [keyname: string]: (...param: any) => void
  }
  inputs: any,
  data: any,
  env: any,
  slots: any
}

// type T_Props = {env, data, slots, inputs}
