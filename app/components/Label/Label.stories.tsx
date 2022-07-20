import { ComponentStory, ComponentMeta } from "@storybook/react";

import Label from "./Label";

export default {
	title: "Label",
	component: Label,
} as ComponentMeta<typeof Label>;

const Template: ComponentStory<typeof Label> = (args) => <Label {...args} />;

export const FirstStory = Template.bind({});

FirstStory.args = {
	title: "Label",
	length: 1,
};
