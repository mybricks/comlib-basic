export default {
  ':root': [
    {
      title: '添加输入项',
      type: 'Button',
      value: {
        set({ input }: EditorResult<any>) {
          const idx = getIoOrder(input);
          const hostId = `input.inputValue${idx}`;
          const title = `参数${idx}`;
          input.add({
            id: hostId,
            title,
            schema: { type: 'follow' },
            deletable: true,
            editable: true
          });
        }
      }
    }
  ]
}

export function getIoOrder(io) {
  const ports = io.get();
  const { id } = ports.pop();
  return Number(id.replace(/\D+/, "")) + 1;
}
