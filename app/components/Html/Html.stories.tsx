import { ComponentStory, ComponentMeta } from "@storybook/react";

import Html from "./Html";

export default {
	title: "Html",
	component: Html,
} as ComponentMeta<typeof Html>;

const Template: ComponentStory<typeof Html> = (args) => <Html {...args} />;

export const FirstStory = Template.bind({});

FirstStory.args = {
};
