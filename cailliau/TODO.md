# TODO for Cailliau

## First steps

  X global.Roles.Worker (Body: [WORK, CARRY, MOVE], Name: 'wXX')

### Prototypes for spawns

  X Spawn.newCreep(Role)
    X Name: Role[0] + Utils.generateId(3)

### Prototypes for tasks

  X Creep.MoveNear(Creep, RoomPosition)

  X Creep.Harvest(Creep, Source)

  X Creep.Unload(Creep, Structure)

  X Creep.PlainHarvest(Creep, Source, Targets)
    - if Creep is Full and Harvesting > Creep.Unload(Creep, Targets.closest)
      X req: Memory
    - if Creep is Empty and not Harvesting > Creep.Harvest(Creep, Source)
      X req: Memory

## Second steps

  X Main loop?? How will the task list and cpu-heavy ops be scheduled?

  X TaskQueue
    - req: Memory

  X Harvesting enough for a StaticWorker
    X req: Tasks, PlainHarvest, Unload

  - Spawning a StaticWorker
    - req: Tasks StaticWorker

  - Drag StaticWorker with Worker Task
  - Get second creep into StaticHarvesting position

## Third steps

### Prototypes for tasks

  - global.Roles.StaticHarvest

  - Creep.Build(Creep, Source, ConstructionSite)

  - Creep.Drag(Creep, TargetCreep, TargetPos)

  - Creep.StaticHarvest(Creep, Source, DropTarget)
