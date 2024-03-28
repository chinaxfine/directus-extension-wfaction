import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
	id: 'zc_wf_action',
	name: 'wf action',
	icon: 'box',
	description: 'workflow action',
	component: InterfaceComponent,
	hideLabel: true,
	hideLoader: true,
	types: ['alias'],
	localTypes: ['presentation'],
	group: 'presentation',
	options: ({ collection }) => [
		{
			field: 'triggers',
			name: 'Triggers',
			type: 'json',
			meta: {
				interface: 'list',
				options: {
					fields: [
						{
							field: 'label',
							name: 'Label',
							type: 'string',
							meta: {
								width: 'half',
								interface: 'input',
							},
						},
						{
							field: 'size',
							name: 'Size',
							type: 'string',
							schema: {
								default_value: '',
							},
							meta: {
								width: 'half',
								interface: 'select-dropdown',
								options: {
									choices: [
										{ text: 'x-small', value: 'x-small' },
										{ text: 'small', value: 'small' },
										{ text: 'default', value: '' },
										{ text: 'large', value: 'large' },
										{ text: 'x-large', value: 'x-large' },
									],
								},
							},
						},
						{
							field: 'type',
							name: 'Type',
							type: 'string',
							schema: {
								default_value: 'normal',
							},
							meta: {
								width: 'half',
								interface: 'select-dropdown',
								default_value: 'normal',
								options: {
									choices: [
										{ text: 'Primary', value: 'primary' },
										{ text: 'Normal', value: 'normal' },
										{ text: 'Info', value: 'info' },
										{ text: 'Success', value: 'success' },
										{ text: 'Warning', value: 'warning' },
										{ text: 'Danger', value: 'danger' },
									],
								},
							},
						},
						{
							field: 'icon',
							name: 'Icon',
							type: 'string',
							meta: {
								width: 'half',
								interface: 'select-icon',
							},
						},
						{
							field: 'wfstatefield',
							name: 'Workflow State Field',
							type: 'string',
							meta: {
								width: 'full',
								interface: 'input',
							},
						},						
						{
							field: 'wfgroup',
							name: 'Workflow Group',
							type: 'string',
							meta: {
								width: 'full',
								interface: 'input',
							},
						},
						{
							field: 'wfaction',
							name: 'Workflow Action',
							type: 'string',
							meta: {
								width: 'full',
								interface: 'input',
							},
						},
						{
							field: 'hiddenConditions',
							name: 'Hidden Conditions',
							type: 'json',
							meta: {
								interface: 'system-filter',
								options: {
									collectionName: collection,
								},
							},
						},
					],
				},
			},
		},
	],
});
