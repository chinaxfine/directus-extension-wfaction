<template>
	<div class="trigger-list">
		<v-button
			v-for="(trigger, index) in triggers"
			:key="index"
			class="action"
			:class="[trigger.type]"
			:loading="loadings[index].value"
			:hidden="hidden[index]"
			:secondary="trigger.type !== 'primary'"
			v-bind="{ [trigger.size]: true }"
			@click="onClick(trigger.wfstatefield, groups[index], actions[index], index)"
		>
			<v-icon v-if="trigger.icon" left :name="trigger.icon" />
			<span v-if="trigger.label">{{ trigger.label }}</span>
		</v-button>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, PropType, ref } from 'vue';
import { useApi, useStores, useItems } from '@directus/extensions-sdk';
import { Filter, DeepPartial, Field, FieldRaw, Relation } from '@directus/types';
import { render } from 'micromustache';
import { checkConditions } from './check-conditions';

type Trigger = {
	label: string;
	size: string;
	type: string;
	icon: string;
	wfstatefield: string;
	wfgroup: string;
	wfaction: string;
	hiddenConditions: Filter;
};

export default defineComponent({
	props: {
		collection: {
			type: String,
			default: '',
		},
		primaryKey: {
			type: [String, Number],
			default: '',
		},		
		triggers: {
			type: Array as PropType<Trigger[]>,
			default: null,
		},
		layout: {
			type: String,
			default: 'vertical',
		},
	},
	setup(props) {
		const api = useApi();
		const { useNotificationsStore, useCollectionsStore, useRelationsStore, useFieldsStore} = useStores();

		const notifystore = useNotificationsStore();
		const fieldsStore = useFieldsStore();

		const values = inject('values', ref<Record<string, any>>({}));
		const groups = computed(() => props.triggers.map((trigger) => render(trigger.wfgroup ?? '', values.value)));
		const actions = computed(() => props.triggers.map((trigger) => render(trigger.wfaction ?? '', values.value)));		
		const hidden = computed(() => props.triggers.map((trigger) => (
			trigger.hiddenConditions && checkConditions(values.value, trigger.hiddenConditions)),
		));

		const loadings = props.triggers.map(() => ref(false));

		return { loadings, groups, actions, hidden, onClick };

		async function onClick(statefield: string, group: string, action:string, index: number) {
			const loading = loadings[index];
			if (!loading) return;
			loading.value = true;

			try {
				let wfrecordcollection = "workflow_record"; /* 工作流记录表 */
				let wfdefinecollection = "workflow_define"; /* 工作流定义表 */

				const collectionRef = ref(props.collection);
				const query = {
					fields: ref(['flowstate']),
					limit: ref(null),
					sort: ref(null),
					search: ref(null),
					filter: ref({'id':{'_eq':props.primaryKey}}),
					page: ref(null),					
				}

				const { getItems, items } = useItems(collectionRef, query);			
				await getItems(); // fetch the items			

				let flowstate = items.value[0]['flowstate'];
				if (flowstate == "draft-new") {
					items.value[0]['flowstate'] = 'checking';
					await items.value[0].save();
				}
			} catch (error: any) {
				const message = error.response?.data?.errors?.[0]?.message || error.message || undefined;
				notifystore.add({
					title: 'Error',
					text: message,
					type: 'error',
					dialog: true,
					error,
				});
			} finally {
				loading.value = false;
			}
		}
	},
});
</script>

<style lang="scss" scoped>
.trigger-list {
	display: flex;
	gap: 8px;

	&.vertical {
		flex-direction: column;
	}

	&.horizontal {
		flex-wrap: wrap;
	}
}

.action {
	&.info {
		--v-button-background-color: var(--blue);
		--v-button-background-color-hover: var(--blue-125);
		--v-button-color: var(--blue-alt);
		--v-button-color-hover: var(--blue-alt);
	}

	&.success {
		--v-button-background-color: var(--success);
		--v-button-background-color-hover: var(--success-125);
		--v-button-color: var(--success-alt);
		--v-button-color-hover: var(--success-alt);
	}

	&.warning {
		--v-button-background-color: var(--warning);
		--v-button-background-color-hover: var(--warning-125);
		--v-button-color: var(--warning-alt);
		--v-button-color-hover: var(--warning-alt);
	}

	&.danger {
		--v-button-icon-color: var(--white);
		--v-button-background-color: var(--danger);
		--v-button-background-color-hover: var(--danger-125);
		--v-button-color: var(--danger-alt);
		--v-button-color-hover: var(--danger-alt);
	}
}
</style>