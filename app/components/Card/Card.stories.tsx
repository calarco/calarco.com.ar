import { ComponentStory, ComponentMeta } from "@storybook/react";

import Card from "./Card";

export default {
	title: "Card",
	component: Card,
} as ComponentMeta<typeof Card>;

const Template: ComponentStory<typeof Card> = (args) => <Card {...args} />;

export const FirstStory = Template.bind({});

FirstStory.args = {
	isActive: false,
	isRemove: false,
	isForm: false,
};
