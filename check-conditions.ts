import { Filter } from '@directus/types';
import { validatePayload } from '@directus/utils';

export function checkConditions(item: Record<string, any>, conditions: Filter) {
    const errors = validatePayload(conditions, item, { requireAll: true });
    return errors.length === 0;
}
