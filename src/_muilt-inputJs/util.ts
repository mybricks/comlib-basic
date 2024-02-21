import { Data } from "./constants";
import Sandbox from './com-utils/sandbox'
import { transform } from './com-utils'
import { uuid } from "../utils/basic";
export function jsonToSchema(json): any {
  const schema = { type: void 0 };
  proItem({ schema, val: json });
  if (schema.type) {
    return schema;
  } else {
    return;
  }
}

function proItem({ schema, val, key, fromAry }: { schema; val; key?; fromAry?}) {
  if (Array.isArray(val)) {
    const items = {};
    if (key) {
      schema[key] = {
        type: 'array',
        items
      };
    } else {
      schema.type = 'array';
      schema.items = items;
    }

    proAry(items, val);
  } else {
    if (typeof val === 'object' && val) {
      let nSchema;
      if (fromAry) {
        schema.type = 'object';
        nSchema = schema.properties = {};
      }

      const properties = fromAry ? nSchema : {};

      if (!fromAry) {
        if (key) {
          schema[key] = {
            type: 'object',
            properties
          };
        } else {
          schema.type = 'object';
          schema.properties = properties;
        }
      }

      proObj(properties, val);
    } else {
      const type = val === null || val === void 0 ? 'any' : typeof val;
      if (key === void 0) {
        schema.type = type;
      } else {
        schema[key] = { type }
      }
    }
  }
}

function proObj(curSchema, obj) {
  Object.keys(obj).map((key) => {
    return proItem({ schema: curSchema, val: obj[key], key });
  });
}

function proAry(curSchema, ary) {
  let sample;
  if (ary.length > 0) {
    sample = ary[0];
  }

  proItem({ schema: curSchema, val: sample, fromAry: true });
}


export function convertObject2Array(input) {
  let result = [] as any[];
  Object.keys(input).sort((a, b) => {
    let _a = a?.match(/\d+/g)?.[0] || 0;
    let _b = b?.match(/\d+/g)?.[0] || 0;
    return +_a - +_b;
  }).forEach((key) => {
    result.push(input[key]);
  });
  return result;
}

export function updateOutputSchema(output, code) {
  let sourceCode =
    typeof code === "object" && code !== null
      ? code.transformCode
      : transform(code.code || code);
  const outputs = {};
  const inputs = {};
  output.get().forEach(({ id }) => {
    outputs[id] = (v: any) => {
      try {
        const schema = jsonToSchema(v);
        output.get(id).setSchema(schema);
      } catch (error) {
        // output.get(id).setSchema({ type: 'unknown' });
      }
    };
  });

  setTimeout(() => {
    try {
      const sandbox = new Sandbox({ module: true })
      const fn = sandbox.compile(`${decodeURIComponent(sourceCode)}`)
      const params = {
        inputValue: void 0,
        outputs: convertObject2Array(outputs),
        inputs: convertObject2Array(inputs)
      }
      fn.run([params], () => { });
    } catch (error) {
      console.error(error)
    }
  })
}

export const setInputSchema = (pinId: string, schema, data: Data, input) => {
  if (!data.inputSchema) {
    data.inputSchema = {};
  }
  if (schema) {
    const formattedSchema = formatSchema(pinId, schema);
    data.inputSchema[formattedSchema.title] = formattedSchema;
  } else {
    Reflect.deleteProperty(data.inputSchema, pinId.split(".").pop() ?? "");
  }
  const schemaList: Array<Record<string, any>> = [];
  const inputIds = input.get().map(({ id }) => id.split(".").pop());
  for (const id of inputIds) {
    if (data.inputSchema[id]) {
      schemaList.push(data.inputSchema[id]);
    } else {
      schemaList.push({ title: id, type: "null" });
    }
  }
  return schemaList;
};

const formatSchema = (pinId: string, schema: Record<string, any>) => {
  const rootKey = pinId.split(".").pop() ?? "inputValue0";
  schema.title = rootKey;
  return schema;
};

const DefaultLib = `declare interface IO {
  inputs: any,
  outputs: Array<Function>
}`;

const resolverTitle = (schema) => {
  try {
    const title = schema.title.replace(/^\S/, (s: string) => s.toUpperCase());
    schema = JSON.parse(JSON.stringify(schema).replaceAll(/("title":\s*")([^"]+)/g, `$1${uuid()}`))
    schema.title = title
    return schema
  } catch (error) {
    return schema
  }
}

export const genLibTypes = async (schemaList: Array<Record<string, any>>) => {
  const tuple: Array<string> = [];
  const SchemaToTypes = window.jstt;
  if(!SchemaToTypes) return DefaultLib;
  const ret = await Promise.all(
    schemaList.map((schema: Record<string, any>) => {
      schema = resolverTitle(schema)
      tuple.push(schema.title);
      return SchemaToTypes.compile(schema, "", {
        bannerComment: "",
        unknownAny: false,
        format: false,
      }).then((ts) => {
        return ts.replaceAll("export", "declare");
      }).catch((error) => {
        console.warn(error)
        return `declare type ${schema.title} = any;`;
      });
    })
  );
  return `
    ${ret.join("\n")}
    declare interface IO {
      inputs: [${tuple.toString()}],
      outputs: Array<Function>
    }
  `;
};

export function getIoOrder(io) {
  const ports = io.get();
  const { id } = ports.pop();
  return Number(id.replace(/\D+/, "")) + 1;
}
