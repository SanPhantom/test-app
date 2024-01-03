import { isEmpty } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface ICodeTextProps {
  length?: number;
  value?: string;
  onChange?: (v: string) => void;
}

const CodeText = ({ length = 4, value, onChange }: ICodeTextProps) => {
  const setCodes = () => {
    const codes = new Array(length).fill(undefined).map((_, index) => {
      return value?.split("")[index] ?? undefined;
    });
    return codes;
  };

  const currentRef = useRef<number>(
    setCodes()?.findIndex((x) => isEmpty(x)) === -1
      ? setCodes().length - 1
      : setCodes()?.findIndex((x) => isEmpty(x))
  );

  const [codeArray, setCodeArray] = useState<(string | undefined)[]>(
    setCodes()
  );

  const handleChangeCode = useCallback(
    (value: string | undefined, index: number) => {
      const newArray = codeArray.concat();
      newArray?.splice(index, 1, value);
      setCodeArray(newArray);
    },
    [codeArray]
  );

  useEffect(() => {
    console.log({ codeArray, currentRef: currentRef.current });
  }, [codeArray]);

  return (
    <div className="code-wrapper">
      {codeArray.map((code, index) => {
        return (
          <div key={`code_${code}_${index}`} className="code-box">
            <input
              className="code-input"
              value={code}
              autoFocus={index === currentRef.current}
              aria-selected
              maxLength={1}
              onKeyDown={(e) => {
                console.log({
                  code: e.keyCode,
                  key: e.key,
                  isTrue: /\^\d+$/.test(e.key),
                });
                if (e.key === "Backspace" || e.keyCode === 8) {
                  if (isEmpty(code)) {
                    handleChangeCode("", index - 1);
                    currentRef.current = index - 1;
                  } else {
                    handleChangeCode("", index);
                  }
                } else if (!isNaN(Number(e.key))) {
                  handleChangeCode(e.key, index);
                  currentRef.current = index + 1;
                }
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default CodeText;
