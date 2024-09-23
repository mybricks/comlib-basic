export default function ({ _env, env, inputs }) {
  const { runtime } = env;

  if (runtime) {
    inputs["destroyAllPopup"](() => {
      _env?.destroyAllPopup?.();
    });
  }
}
