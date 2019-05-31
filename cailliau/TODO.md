# TODO for Cailliau

## Implement STORE
  - Interface for StructureSpawn/Creep/Global
  - STORE_LOAD <= STORE_FROM_MEMORY || STORE_UPDATE
  - STORE_UPDATE get value from SUBJECT memory
  - https://docs.screeps.com/global-objects.html#Serialization

## Implement LOOP
  - STORE_LOAD
    - STORE each OUTPOST
    - STORE ROOMS in OUTPOST
    - STORE Controlled Spawns
    - STORE Controlled Creeps
    - STORE StructureSources

  - RUN_OUTPOST for each OUTPOST

## Implement OUTPOST
  - STORE TASK_QUEUE
  - RUN_TASKS in TASK_QUEUE

## Implement TASK_QUEUE
  - Try to insert 1 TASKS per 1/n ticks
  - Stop inserting if TASK_QUEUE is longer than OUTPOST's creeps?
  - END_TASK in TASK_QUEUE if TASK_CONDITION is satisfied

## Implement RUN_TASKS
  -

## Implement TASKS
  * SPWN_CREEP
    - spawn a new creep with CREEP_ROLE and it's PARTS

  * BUILD (generator)
    - WHAT and WHERE

  * BUILD_HARVEST_CONTAINER
    - <= STORE_LOAD StructureSources

  * HARVEST
    -

## Implement CREEP_ROLE
  - => TASK_TYPES the creep may take
  - => PARTS the creep is built from
