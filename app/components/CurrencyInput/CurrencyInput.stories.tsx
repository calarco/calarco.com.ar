import { ComponentStory, ComponentMeta } from "@storybook/react";

import CurrencyInput from "./CurrencyInput";

export default {
	title: "CurrencyInput",
	component: CurrencyInput,
} as ComponentMeta<typeof CurrencyInput>;

const Template: ComponentStory<typeof CurrencyInput> = (args) => (
	<CurrencyInput {...args} />
);

export const FirstStory = Template.bind({});

FirstStory.args = {
	name: "monto",
};
