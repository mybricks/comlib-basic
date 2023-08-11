import { Data, Row, Col } from "../../types";
export const getRow = ({ data, focusArea }: EditorResult<Data>) => {
  const { layoutRowKey } = focusArea.dataset;
  const row = data.rows.find((row) => row.key === layoutRowKey) as Row;
  const index = data.rows.findIndex((row) => row.key === layoutRowKey) as number;
  return { row, index };
};

export const getCol = ({ data, focusArea }: EditorResult<Data>) => {
  const { layoutColKey: key } = focusArea.dataset;
  const [rowKey, colKey] = key.split(",");
  const row = data.rows.find((row) => row.key === rowKey) as Row;
  const col = row?.cols.find((col) => col.key === colKey) as Col;
  const index = row?.cols.findIndex((col) => col.key === colKey) as number;
  return { row, col, index };
};

export const setSlotLayout = ({
  slotStyle,
  ...props
}: EditorResult<Data> & {
  slotStyle: React.CSSProperties;
}) => {
  const { col } = getCol(props);
  const slotInstance = props.slot.get(col?.key);
  if (slotStyle.position === "absolute") {
    slotInstance.setLayout(slotStyle.position);
  } else if (slotStyle.display === "flex") {
    if (slotStyle.flexDirection === "row") {
      slotInstance.setLayout("flex-row");
    } else if (slotStyle.flexDirection === "column") {
      slotInstance.setLayout("flex-column");
    }
  }
};

export const getFilterSelector = (id: string) => `:not(#${id} *[data-isslot="1"] *)`;
