import { ComponentStory, ComponentMeta } from "@storybook/react";

import Table from "./Table";

export default {
	title: "Table",
	component: Table,
} as ComponentMeta<typeof Table>;

const Template: ComponentStory<typeof Table> = (args) => <Table {...args} />;

export const FirstStory = Template.bind({});

FirstStory.args = {
	data: {},
};
