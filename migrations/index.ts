import * as migration_20261112_074234_initial from './20261112_074234_initial';

export const migrations = [
  {
    up: migration_20261112_074234_initial.up,
    down: migration_20261112_074234_initial.down,
    name: '20261112_074234_initial'
  },
];
