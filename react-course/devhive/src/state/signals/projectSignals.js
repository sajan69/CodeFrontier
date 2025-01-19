import { signal, computed, effect } from '@preact/signals-react';
import { localStore } from '../storage/localStore';

// Core signals
export const activeUsersSignal = signal(new Set());
export const projectUpdatesSignal = signal([]);
export const collaborationStatusSignal = signal({
  isOnline: true,
  lastSynced: new Date().toISOString(),
});

// Computed values
export const onlineCollaboratorsCount = computed(() => 
  activeUsersSignal.value.size
);

export const latestUpdates = computed(() => 
  projectUpdatesSignal.value.slice(0, 5)
);

// Effects for persistence
effect(() => {
  localStore.set('projectUpdates', projectUpdatesSignal.value);
});

// Signal actions
export function addActiveUser(userId) {
  activeUsersSignal.value = new Set([...activeUsersSignal.value, userId]);
}

export function removeActiveUser(userId) {
  const newSet = new Set(activeUsersSignal.value);
  newSet.delete(userId);
  activeUsersSignal.value = newSet;
}

export function addProjectUpdate(update) {
  projectUpdatesSignal.value = [
    { id: Date.now(), timestamp: new Date().toISOString(), ...update },
    ...projectUpdatesSignal.value,
  ];
} 