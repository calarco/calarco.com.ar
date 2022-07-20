import { ComponentStory, ComponentMeta } from "@storybook/react";

import Currency from "./Currency";

export default {
	title: "Currency",
	component: Currency,
} as ComponentMeta<typeof Currency>;

const Template: ComponentStory<typeof Currency> = (args) => (
	<Currency {...args} />
);

export const FirstStory = Template.bind({});

FirstStory.args = { number: 25.53, loading: false, integer: false };
