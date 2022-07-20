import { ComponentStory, ComponentMeta } from "@storybook/react";

import Day from "./Day";

export default {
	title: "Day",
	component: Day,
} as ComponentMeta<typeof Day>;

const Template: ComponentStory<typeof Day> = (args) => <Day {...args} />;

export const FirstStory = Template.bind({});

FirstStory.args = {
	date: "1994-01-20",
};
