import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";

type ComponentProps = {
    name: string;
    defaultValue?: string;
    disabled?: boolean;
};

const CurrencyInput = ({ name, defaultValue, disabled }: ComponentProps) => {
    const currencyMask = createNumberMask({
        prefix: "",
        suffix: "",
        includeThousandsSeparator: true,
        thousandsSeparatorSymbol: ".",
        allowDecimal: true,
        decimalSymbol: ",",
        decimalLimit: 2,
        integerLimit: 10,
        allowNegative: false,
        allowLeadingZeroes: false,
    });

    return (
        <div className="grid grid-cols-[auto,1fr] items-center gap-3">
            <label>$</label>
            <MaskedInput
                mask={currencyMask}
                type="text"
                inputMode="numeric"
                name={name}
                defaultValue={defaultValue}
                placeholder="0"
                autoComplete="off"
                disabled={disabled}
                className="font-mono"
            />
        </div>
    );
};

export default CurrencyInput;
