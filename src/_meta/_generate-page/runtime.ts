export default function ({ env, inputs }) {
  const next = true

  inputs['input'](() => {
    if (next) {
      console.log("获取页面数据，结束运行")
      const res = env.command.generatePage()
      console.log('gen', JSON.stringify(res))
    }
  })
}
